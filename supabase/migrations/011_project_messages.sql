-- ============================================================
-- 案件単位のトークルーム構造化 (Phase 3)
-- Supabase Migration: 011_project_messages.sql
-- ============================================================
-- 「ヒアリング → 初稿 → 修正 → 最終納品 → 検収」のステップ管理 +
-- リッチメッセージ (テキスト/添付/アクション) を案件単位で保持。

do $$ begin
  create type project_step as enum ('hearing', 'first_draft', 'revision', 'final_delivery', 'completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type message_action_type as enum (
    'submit_draft', 'request_revision', 'submit_revision',
    'approve_draft', 'submit_final', 'approve_final'
  );
exception when duplicate_object then null; end $$;

alter table projects add column if not exists current_step project_step not null default 'hearing';

create table if not exists project_messages (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id) on delete cascade,
  sender_id     uuid not null references profiles(id) on delete cascade,
  message_type  text not null default 'text',  -- 'text' / 'action' / 'system'
  content       text,
  action_type   message_action_type,
  metadata      jsonb,
  is_read       boolean default false,
  created_at    timestamptz default now()
);

create index if not exists idx_project_messages_project on project_messages(project_id, created_at);

create table if not exists project_message_attachments (
  id          uuid primary key default gen_random_uuid(),
  message_id  uuid not null references project_messages(id) on delete cascade,
  file_url    text not null,
  file_name   text not null,
  file_size   integer,
  mime_type   text,
  created_at  timestamptz default now()
);

-- ステップ遷移ロジック: アクションメッセージから case で更新
create or replace function handle_project_action()
returns trigger as $$
begin
  if new.message_type = 'action' and new.action_type is not null then
    update projects set
      current_step = case new.action_type
        when 'submit_draft'      then 'first_draft'::project_step
        when 'request_revision'  then 'revision'::project_step
        when 'submit_revision'   then 'revision'::project_step
        when 'approve_draft'     then 'final_delivery'::project_step
        when 'submit_final'      then 'final_delivery'::project_step
        when 'approve_final'     then 'completed'::project_step
        else current_step
      end,
      -- 修正依頼ごとに revision_count をインクリメント
      revision_count = case
        when new.action_type = 'request_revision' then revision_count + 1
        else revision_count
      end
    where id = new.project_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_project_action on project_messages;
create trigger on_project_action
  after insert on project_messages
  for each row
  execute function handle_project_action();

-- RLS: 案件の発注者・採用クリエイターのみ閲覧/投稿可
alter table project_messages enable row level security;
alter table project_message_attachments enable row level security;

create policy "project_messages_select"
  on project_messages for select
  using (
    exists (
      select 1 from projects p
      left join proposals pr on pr.project_id = p.id and pr.status = 'accepted'
      where p.id = project_messages.project_id
        and (auth.uid() = p.client_id or auth.uid() = pr.creator_id)
    )
  );

create policy "project_messages_insert"
  on project_messages for insert
  with check (
    exists (
      select 1 from projects p
      left join proposals pr on pr.project_id = p.id and pr.status = 'accepted'
      where p.id = project_messages.project_id
        and (auth.uid() = p.client_id or auth.uid() = pr.creator_id)
        and auth.uid() = sender_id
    )
  );

create policy "project_attachments_select"
  on project_message_attachments for select
  using (
    exists (
      select 1 from project_messages m
      join projects p on p.id = m.project_id
      left join proposals pr on pr.project_id = p.id and pr.status = 'accepted'
      where m.id = project_message_attachments.message_id
        and (auth.uid() = p.client_id or auth.uid() = pr.creator_id)
    )
  );

-- REALTIME
do $$ begin
  alter publication supabase_realtime add table project_messages;
exception when others then null; end $$;
