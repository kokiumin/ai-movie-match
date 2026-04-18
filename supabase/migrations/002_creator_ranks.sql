-- ============================================================
-- 段階的手数料システム — クリエイターランク + リピート取引
-- Supabase Migration: 002_creator_ranks.sql
-- ============================================================

-- ===================
-- ENUM
-- ===================
create type creator_rank as enum ('starter', 'regular', 'pro', 'elite');

-- ===================
-- profiles 拡張
-- ===================
alter table profiles add column if not exists rank creator_rank not null default 'starter';
alter table profiles add column if not exists total_earnings_30d integer not null default 0;
alter table profiles add column if not exists total_earnings_90d integer not null default 0;
alter table profiles add column if not exists completed_orders integer not null default 0;
alter table profiles add column if not exists rank_updated_at timestamptz;

create index if not exists idx_profiles_rank on profiles(rank);

-- ===================
-- projects 拡張 (完了日時の正確な記録)
-- ===================
alter table projects add column if not exists completed_at timestamptz;
create index if not exists idx_projects_completed_at on projects(completed_at);

-- ===================
-- creator_rank_history
-- ===================
create table if not exists creator_rank_history (
  id            uuid primary key default gen_random_uuid(),
  creator_id    uuid not null references profiles(id) on delete cascade,
  previous_rank creator_rank,
  new_rank      creator_rank not null,
  reason        text,
  earnings_30d  integer,
  earnings_90d  integer,
  completed_orders integer,
  created_at    timestamptz default now()
);

create index if not exists idx_rank_history_creator on creator_rank_history(creator_id, created_at desc);

-- ===================
-- client_creator_relations
-- ===================
create table if not exists client_creator_relations (
  client_id            uuid not null references profiles(id) on delete cascade,
  creator_id           uuid not null references profiles(id) on delete cascade,
  transaction_count    integer not null default 0,
  total_amount         integer not null default 0,
  first_transaction_at timestamptz,
  last_transaction_at  timestamptz,
  primary key (client_id, creator_id)
);

create index if not exists idx_client_creator_rel_creator on client_creator_relations(creator_id);

-- ===================
-- TRIGGER: project completion hook
-- ===================
-- project.status が 'completed' に遷移した瞬間に
--   - projects.completed_at をセット
--   - 採用 proposal の情報から client_creator_relations を更新
--   - profiles.completed_orders をインクリメント
-- ランク再判定は Edge Function バッチで日次実行 (DB負荷を避ける)
create or replace function handle_project_completed()
returns trigger as $$
declare
  accepted proposals%rowtype;
begin
  -- 'completed' への遷移時のみ実行
  if new.status = 'completed' and (old.status is null or old.status <> 'completed') then
    new.completed_at := coalesce(new.completed_at, now());

    -- 採用された proposal を特定
    select * into accepted
    from proposals
    where project_id = new.id and status = 'accepted'
    limit 1;

    if accepted.id is not null then
      -- client_creator_relations を upsert
      insert into client_creator_relations (
        client_id, creator_id, transaction_count, total_amount, first_transaction_at, last_transaction_at
      ) values (
        new.client_id, accepted.creator_id, 1, coalesce(accepted.price, 0), now(), now()
      )
      on conflict (client_id, creator_id) do update set
        transaction_count = client_creator_relations.transaction_count + 1,
        total_amount = client_creator_relations.total_amount + coalesce(accepted.price, 0),
        last_transaction_at = now();

      -- 受注実績をインクリメント
      update profiles
      set completed_orders = completed_orders + 1
      where id = accepted.creator_id;
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_project_completed on projects;
create trigger on_project_completed
  before update on projects
  for each row
  execute function handle_project_completed();

-- ===================
-- RLS
-- ===================
alter table creator_rank_history enable row level security;
alter table client_creator_relations enable row level security;

-- 本人はランク履歴を閲覧可、全員読めても害はないので全公開
create policy "rank_history_select_all"
  on creator_rank_history for select
  using (true);

-- バッチ(service_role)のみ書き込み
-- (service_role は RLS をバイパスするため policy 不要)

-- 関係者(client or creator)だけ自分の取引関係を見る
create policy "client_creator_rel_select_involved"
  on client_creator_relations for select
  using (auth.uid() = client_id or auth.uid() = creator_id);

-- REALTIME (ランクアップ通知のリアルタイム反映用)
alter publication supabase_realtime add table creator_rank_history;
