-- ============================================================
-- 見積もり相談機能 (Phase 2)
-- Supabase Migration: 010_consultation.sql
-- ============================================================
-- 「契約成立前」にクライアントがクリエイターに気軽に相談できるスレッド。
-- 案件成立後のトークルーム (Phase 3 / project_messages) とは別物。

do $$ begin
  create type consultation_status as enum ('open', 'replied', 'converted', 'closed');
exception when duplicate_object then null; end $$;

create table if not exists consultation_threads (
  id                    uuid primary key default gen_random_uuid(),
  client_id             uuid not null references profiles(id) on delete cascade,
  creator_id            uuid not null references profiles(id) on delete cascade,
  initial_message       text not null,
  budget_range          text,
  deadline_range        text,
  status                consultation_status not null default 'open',
  converted_project_id  uuid references projects(id),
  client_unread_count   integer not null default 0,
  creator_unread_count  integer not null default 1,
  last_message_at       timestamptz default now(),
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create index if not exists idx_consultation_creator on consultation_threads(creator_id, status, last_message_at desc);
create index if not exists idx_consultation_client on consultation_threads(client_id, status, last_message_at desc);

create table if not exists consultation_messages (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references consultation_threads(id) on delete cascade,
  sender_id   uuid not null references profiles(id) on delete cascade,
  message     text not null,
  is_read     boolean default false,
  created_at  timestamptz default now()
);

create index if not exists idx_consultation_messages_thread on consultation_messages(thread_id, created_at);

-- 新規メッセージ着信時に親スレッドの last_message_at と unread_count を更新
create or replace function bump_consultation_thread()
returns trigger as $$
declare
  th consultation_threads%rowtype;
begin
  select * into th from consultation_threads where id = new.thread_id;
  if th.id is not null then
    update consultation_threads set
      last_message_at = now(),
      updated_at = now(),
      status = case when status = 'open' and new.sender_id = th.creator_id then 'replied'::consultation_status else status end,
      client_unread_count = case when new.sender_id <> th.client_id then client_unread_count + 1 else client_unread_count end,
      creator_unread_count = case when new.sender_id <> th.creator_id then creator_unread_count + 1 else creator_unread_count end
    where id = new.thread_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_consultation_message on consultation_messages;
create trigger on_consultation_message
  after insert on consultation_messages
  for each row
  execute function bump_consultation_thread();

-- RLS: 両者のみ閲覧/投稿可
alter table consultation_threads enable row level security;
alter table consultation_messages enable row level security;

create policy "consultation_threads_select"
  on consultation_threads for select
  using (auth.uid() = client_id or auth.uid() = creator_id);

create policy "consultation_threads_insert"
  on consultation_threads for insert
  with check (auth.uid() = client_id);

create policy "consultation_threads_update"
  on consultation_threads for update
  using (auth.uid() = client_id or auth.uid() = creator_id);

create policy "consultation_messages_select"
  on consultation_messages for select
  using (
    exists (
      select 1 from consultation_threads t
      where t.id = consultation_messages.thread_id
        and (auth.uid() = t.client_id or auth.uid() = t.creator_id)
    )
  );

create policy "consultation_messages_insert"
  on consultation_messages for insert
  with check (
    exists (
      select 1 from consultation_threads t
      where t.id = consultation_messages.thread_id
        and (auth.uid() = t.client_id or auth.uid() = t.creator_id)
    )
  );

-- REALTIME
do $$ begin
  alter publication supabase_realtime add table consultation_threads;
  alter publication supabase_realtime add table consultation_messages;
exception when others then null; end $$;
