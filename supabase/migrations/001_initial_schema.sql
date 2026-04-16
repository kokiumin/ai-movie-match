-- ============================================================
-- AIムービーマッチ — 初期スキーマ
-- Supabase Migration: 001_initial_schema.sql
-- ============================================================

-- ===================
-- ENUMS
-- ===================

create type user_role as enum ('client', 'creator', 'admin');
create type project_status as enum ('募集中', 'マッチング中', '成立済み', '進行中', '完了', 'キャンセル');
create type proposal_status as enum ('pending', 'accepted', 'rejected');
create type notification_type as enum ('proposal', 'message', 'match', 'review', 'system');

-- ===================
-- HELPER FUNCTIONS
-- ===================

-- updated_at を自動更新する汎用トリガー関数
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- auth.users INSERT 時に profiles を自動作成するトリガー関数
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, display_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'client'),
    coalesce(new.raw_user_meta_data ->> 'display_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- ===================
-- TABLES
-- ===================

-- profiles (extends auth.users)
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  role          user_role not null default 'client',
  display_name  text not null default '',
  handle        text unique,
  avatar_url    text,
  company_name  text,
  industry      text,
  bio           text,
  specialty     text[],
  tools         text[],
  tags          text[],
  badge         text default '',
  turnaround    text,
  min_price     integer,
  max_price     integer,
  rating        numeric(2,1) default 0,
  review_count  integer default 0,
  delivery_count integer default 0,
  monthly_revenue integer default 0,
  active_projects integer default 0,
  stripe_account_id text,
  stripe_connected boolean default false,
  color         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index idx_profiles_role on profiles(role);
create index idx_profiles_handle on profiles(handle);
create index idx_profiles_rating on profiles(rating desc);
create index idx_profiles_specialty on profiles using gin(specialty);
create index idx_profiles_tools on profiles using gin(tools);
create index idx_profiles_tags on profiles using gin(tags);

-- projects
create table projects (
  id             uuid primary key default gen_random_uuid(),
  client_id      uuid not null references profiles(id) on delete cascade,
  company_name   text,
  industry       text,
  type           text not null,
  budget         text,
  deadline       text,
  description    text,
  style          text,
  pro_select     boolean default false,
  status         project_status default '募集中',
  view_count     integer default 0,
  proposal_count integer default 0,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create index idx_projects_client on projects(client_id);
create index idx_projects_status on projects(status);
create index idx_projects_created on projects(created_at desc);

-- proposals
create table proposals (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id) on delete cascade,
  creator_id    uuid not null references profiles(id) on delete cascade,
  message       text,
  price         integer,
  delivery_days integer,
  status        proposal_status default 'pending',
  created_at    timestamptz default now(),
  unique (project_id, creator_id)
);

create index idx_proposals_project on proposals(project_id);
create index idx_proposals_creator on proposals(creator_id);
create index idx_proposals_status on proposals(status);

-- message_threads
create table message_threads (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete set null,
  created_at timestamptz default now()
);

create index idx_threads_project on message_threads(project_id);

-- thread_participants
create table thread_participants (
  thread_id    uuid not null references message_threads(id) on delete cascade,
  user_id      uuid not null references profiles(id) on delete cascade,
  last_read_at timestamptz default now(),
  primary key (thread_id, user_id)
);

create index idx_thread_participants_user on thread_participants(user_id);

-- messages
create table messages (
  id         uuid primary key default gen_random_uuid(),
  thread_id  uuid not null references message_threads(id) on delete cascade,
  sender_id  uuid not null references profiles(id) on delete cascade,
  text       text not null,
  created_at timestamptz default now()
);

create index idx_messages_thread on messages(thread_id, created_at);
create index idx_messages_sender on messages(sender_id);

-- portfolio_items
create table portfolio_items (
  id            uuid primary key default gen_random_uuid(),
  creator_id    uuid not null references profiles(id) on delete cascade,
  title         text,
  category      text,
  description   text,
  video_url     text,
  thumbnail_url text,
  view_count    integer default 0,
  display_order integer default 0,
  created_at    timestamptz default now()
);

create index idx_portfolio_creator on portfolio_items(creator_id);
create index idx_portfolio_order on portfolio_items(creator_id, display_order);

-- reviews
create table reviews (
  id          uuid primary key default gen_random_uuid(),
  creator_id  uuid not null references profiles(id) on delete cascade,
  author_id   uuid not null references profiles(id) on delete cascade,
  project_id  uuid references projects(id) on delete set null,
  rating      integer not null check (rating >= 1 and rating <= 5),
  text        text,
  created_at  timestamptz default now()
);

create index idx_reviews_creator on reviews(creator_id);
create index idx_reviews_author on reviews(author_id);

-- notifications
create table notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  type       notification_type not null,
  text       text not null,
  read       boolean default false,
  data       jsonb,
  created_at timestamptz default now()
);

create index idx_notifications_user on notifications(user_id, created_at desc);
create index idx_notifications_unread on notifications(user_id) where read = false;

-- favorites
create table favorites (
  user_id    uuid not null references profiles(id) on delete cascade,
  creator_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, creator_id)
);

create index idx_favorites_creator on favorites(creator_id);

-- ===================
-- TRIGGERS
-- ===================

-- auth.users 新規登録時に profiles 自動作成
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_user();

-- profiles.updated_at 自動更新
create trigger set_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at();

-- projects.updated_at 自動更新
create trigger set_projects_updated_at
  before update on projects
  for each row
  execute function update_updated_at();

-- ===================
-- ROW LEVEL SECURITY
-- ===================

alter table profiles enable row level security;
alter table projects enable row level security;
alter table proposals enable row level security;
alter table message_threads enable row level security;
alter table thread_participants enable row level security;
alter table messages enable row level security;
alter table portfolio_items enable row level security;
alter table reviews enable row level security;
alter table notifications enable row level security;
alter table favorites enable row level security;

-- ---- profiles ----
create policy "profiles_select_all"
  on profiles for select
  using (true);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---- projects ----
create policy "projects_select_all"
  on projects for select
  using (true);

create policy "projects_insert_own"
  on projects for insert
  with check (auth.uid() = client_id);

create policy "projects_update_own"
  on projects for update
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

-- ---- proposals ----
create policy "proposals_select_involved"
  on proposals for select
  using (
    auth.uid() = creator_id
    or auth.uid() in (
      select client_id from projects where projects.id = proposals.project_id
    )
  );

create policy "proposals_insert_creator"
  on proposals for insert
  with check (auth.uid() = creator_id);

-- ---- message_threads ----
create policy "threads_select_participant"
  on message_threads for select
  using (
    exists (
      select 1 from thread_participants
      where thread_participants.thread_id = message_threads.id
        and thread_participants.user_id = auth.uid()
    )
  );

create policy "threads_insert_participant"
  on message_threads for insert
  with check (true);
  -- 挿入後に thread_participants にも自分を追加する前提

-- ---- thread_participants ----
create policy "thread_participants_select_own"
  on thread_participants for select
  using (
    exists (
      select 1 from thread_participants tp
      where tp.thread_id = thread_participants.thread_id
        and tp.user_id = auth.uid()
    )
  );

create policy "thread_participants_insert"
  on thread_participants for insert
  with check (
    user_id = auth.uid()
    or exists (
      select 1 from thread_participants tp
      where tp.thread_id = thread_participants.thread_id
        and tp.user_id = auth.uid()
    )
  );

-- ---- messages ----
create policy "messages_select_participant"
  on messages for select
  using (
    exists (
      select 1 from thread_participants
      where thread_participants.thread_id = messages.thread_id
        and thread_participants.user_id = auth.uid()
    )
  );

create policy "messages_insert_participant"
  on messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from thread_participants
      where thread_participants.thread_id = messages.thread_id
        and thread_participants.user_id = auth.uid()
    )
  );

-- ---- portfolio_items ----
create policy "portfolio_select_all"
  on portfolio_items for select
  using (true);

create policy "portfolio_insert_own"
  on portfolio_items for insert
  with check (auth.uid() = creator_id);

create policy "portfolio_update_own"
  on portfolio_items for update
  using (auth.uid() = creator_id)
  with check (auth.uid() = creator_id);

create policy "portfolio_delete_own"
  on portfolio_items for delete
  using (auth.uid() = creator_id);

-- ---- reviews ----
create policy "reviews_select_all"
  on reviews for select
  using (true);

create policy "reviews_insert_own"
  on reviews for insert
  with check (auth.uid() = author_id);

-- ---- notifications ----
create policy "notifications_select_own"
  on notifications for select
  using (auth.uid() = user_id);

create policy "notifications_update_own"
  on notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---- favorites ----
create policy "favorites_select_own"
  on favorites for select
  using (auth.uid() = user_id);

create policy "favorites_insert_own"
  on favorites for insert
  with check (auth.uid() = user_id);

create policy "favorites_delete_own"
  on favorites for delete
  using (auth.uid() = user_id);

-- ===================
-- REALTIME
-- ===================

alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table notifications;

-- ===================
-- STORAGE BUCKETS
-- ===================

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('portfolio', 'portfolio', true);

-- avatars: 誰でも閲覧可、本人のみアップロード・更新・削除
create policy "avatars_select_public"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_update_own"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- portfolio: 誰でも閲覧可、本人のみアップロード・更新・削除
create policy "portfolio_storage_select_public"
  on storage.objects for select
  using (bucket_id = 'portfolio');

create policy "portfolio_storage_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "portfolio_storage_update_own"
  on storage.objects for update
  using (
    bucket_id = 'portfolio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "portfolio_storage_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'portfolio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
