-- ============================================================
-- 成約条件の厳密化 — payout 状態 + 検収管理
-- Supabase Migration: 003_payout_qualification.sql
-- ============================================================
--
-- 「成約」として売上集計に計上する条件:
--   1. project.status = 'completed'
--   2. AND payout_status = 'paid'                     (クリエイター送金完了)
--   3. AND (client_approved_at IS NOT NULL            (検収完了)
--        OR auto_approval_deadline <= now())         (or 72h自動承認)
--
-- 除外:
--   - cancelled / refunded
--   - disputed は解決後の最終ステータス (paid or refunded) で判定
-- ============================================================

-- ===================
-- ENUM: payout_status
-- ===================
do $$ begin
  create type payout_status as enum ('pending', 'paid', 'refunded', 'disputed');
exception when duplicate_object then null; end $$;

-- ===================
-- projects 拡張
-- ===================
alter table projects add column if not exists payout_status payout_status not null default 'pending';
alter table projects add column if not exists payout_paid_at timestamptz;
alter table projects add column if not exists client_approved_at timestamptz;
alter table projects add column if not exists auto_approval_deadline timestamptz;
alter table projects add column if not exists cancelled_at timestamptz;
alter table projects add column if not exists refunded_at timestamptz;
alter table projects add column if not exists disputed_at timestamptz;
alter table projects add column if not exists dispute_resolved_at timestamptz;

create index if not exists idx_projects_payout_status on projects(payout_status);
create index if not exists idx_projects_client_approved_at on projects(client_approved_at);

-- ===================
-- 「成約」判定関数
-- ===================
create or replace function is_project_qualified(p projects)
returns boolean
language sql
immutable
as $$
  select p.status = 'completed'
     and p.payout_status = 'paid'
     and (p.client_approved_at is not null
          or (p.auto_approval_deadline is not null and p.auto_approval_deadline <= now()))
     and p.cancelled_at is null
     and p.refunded_at is null;
$$;

-- ===================
-- TRIGGER 刷新
-- ===================
-- 旧 trigger (002) は status→completed の瞬間に completed_orders と
-- client_creator_relations を更新していたが、成約条件が厳密化されたため
-- これらは「qualified状態」到達時にのみ更新する。
--
-- status→completed 時: completed_at と auto_approval_deadline (+72h) をセット
-- qualified 到達時: client_creator_relations と completed_orders を更新
create or replace function handle_project_completed()
returns trigger as $$
begin
  -- status=completed への遷移時のみ: タイムスタンプ設定
  if new.status = 'completed' and (old.status is null or old.status <> 'completed') then
    new.completed_at := coalesce(new.completed_at, now());
    -- 72時間の自動承認期限を設定 (既に設定されていれば維持)
    new.auto_approval_deadline := coalesce(new.auto_approval_deadline, now() + interval '72 hours');
  end if;

  -- cancelled / refunded はその時刻を記録
  if new.status = 'cancelled' and (old.status is null or old.status <> 'cancelled') then
    new.cancelled_at := coalesce(new.cancelled_at, now());
  end if;
  if new.payout_status = 'refunded' and (old.payout_status is null or old.payout_status <> 'refunded') then
    new.refunded_at := coalesce(new.refunded_at, now());
  end if;
  if new.payout_status = 'disputed' and (old.payout_status is null or old.payout_status <> 'disputed') then
    new.disputed_at := coalesce(new.disputed_at, now());
  end if;
  if new.payout_status = 'paid' and (old.payout_status is null or old.payout_status <> 'paid') then
    new.payout_paid_at := coalesce(new.payout_paid_at, now());
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- AFTER trigger: qualified 状態に到達した瞬間に関係・実績を更新
create or replace function handle_project_qualified()
returns trigger as $$
declare
  accepted proposals%rowtype;
  was_qualified boolean;
  now_qualified boolean;
begin
  was_qualified := (old is not null and is_project_qualified(old));
  now_qualified := is_project_qualified(new);

  -- qualified への遷移時のみ実行
  if now_qualified and not was_qualified then
    select * into accepted
    from proposals
    where project_id = new.id and status = 'accepted'
    limit 1;

    if accepted.id is not null then
      insert into client_creator_relations (
        client_id, creator_id, transaction_count, total_amount,
        first_transaction_at, last_transaction_at
      ) values (
        new.client_id, accepted.creator_id, 1, coalesce(accepted.price, 0), now(), now()
      )
      on conflict (client_id, creator_id) do update set
        transaction_count = client_creator_relations.transaction_count + 1,
        total_amount = client_creator_relations.total_amount + coalesce(accepted.price, 0),
        last_transaction_at = now();

      update profiles
      set completed_orders = completed_orders + 1
      where id = accepted.creator_id;
    end if;
  end if;

  -- qualified から外れた場合 (refund/cancel) は巻き戻し
  if was_qualified and not now_qualified then
    select * into accepted
    from proposals
    where project_id = new.id and status = 'accepted'
    limit 1;

    if accepted.id is not null then
      update client_creator_relations
      set transaction_count = greatest(transaction_count - 1, 0),
          total_amount = greatest(total_amount - coalesce(accepted.price, 0), 0)
      where client_id = new.client_id and creator_id = accepted.creator_id;

      update profiles
      set completed_orders = greatest(completed_orders - 1, 0)
      where id = accepted.creator_id;
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_project_qualified on projects;
create trigger on_project_qualified
  after update on projects
  for each row
  execute function handle_project_qualified();

-- BEFORE trigger は既存を置き換え (002 のものを上書き)
drop trigger if exists on_project_completed on projects;
create trigger on_project_completed
  before update on projects
  for each row
  execute function handle_project_completed();
