-- ============================================================
-- 本人確認バッジ・信頼指標 (Phase 5)
-- Supabase Migration: 009_verification_badges.sql
-- ============================================================

-- profiles: 4種の認証フラグ
alter table profiles add column if not exists email_verified boolean not null default false;
alter table profiles add column if not exists phone_verified boolean not null default false;
alter table profiles add column if not exists phone_number text;
alter table profiles add column if not exists identity_verified boolean not null default false;
alter table profiles add column if not exists identity_verified_at timestamptz;
alter table profiles add column if not exists bank_account_verified boolean not null default false;

create index if not exists idx_profiles_identity_verified on profiles(identity_verified);

-- 本人確認書類提出履歴 (運営の目視確認用)
create table if not exists identity_verification_requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  document_type text not null,  -- 'driver_license' / 'mynumber' / 'passport'
  document_url  text not null,  -- Supabase Storage 上の署名URL
  status        text not null default 'pending',  -- 'pending' / 'approved' / 'rejected'
  reviewed_by   uuid references profiles(id),
  reviewed_at   timestamptz,
  rejection_reason text,
  created_at    timestamptz default now()
);

create index if not exists idx_id_verification_user on identity_verification_requests(user_id, created_at desc);

-- メッセージ返信率の集計結果 (バッチで日次計算)
create table if not exists message_response_stats (
  user_id              uuid primary key references profiles(id) on delete cascade,
  response_rate_30d    numeric(4,3),     -- 0.0-1.0
  avg_response_time_hours numeric(8,2), -- 平均返信時間
  updated_at           timestamptz default now()
);

-- RLS
alter table identity_verification_requests enable row level security;
alter table message_response_stats enable row level security;

create policy "id_verification_select_own"
  on identity_verification_requests for select
  using (auth.uid() = user_id);

-- 本人確認は本人のみ INSERT 可。運営 (service_role) は RLS バイパス。
create policy "id_verification_insert_own"
  on identity_verification_requests for insert
  with check (auth.uid() = user_id);

create policy "message_stats_select_all"
  on message_response_stats for select
  using (true);  -- 返信率は公開情報
