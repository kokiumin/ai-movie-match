-- ============================================================
-- クリエイタースコアリング & バッジ自動付与
-- Supabase Migration: 006_scoring_and_badges.sql
-- ============================================================

-- ===================
-- ENUMs
-- ===================
do $$ begin
  create type badge_type as enum (
    'verified_creator',
    'top_rated',
    'fast_delivery',
    'kling_master',
    'runway_master',
    'heygen_master',
    'seedance_master',
    'founding_creator',
    'rising_star',
    'launch_period_creator'
  );
exception when duplicate_object then null; end $$;

-- ===================
-- profiles 拡張 (スコア関連カラム)
-- ===================
alter table profiles add column if not exists score integer not null default 0;
alter table profiles add column if not exists avg_rating numeric(3,2) not null default 0;
alter table profiles add column if not exists on_time_delivery_rate numeric(4,3) not null default 0;
alter table profiles add column if not exists repeat_client_rate numeric(4,3) not null default 0;
alter table profiles add column if not exists score_updated_at timestamptz;

create index if not exists idx_profiles_score on profiles(score desc);

-- ===================
-- proposals 拡張 (ツール使用実績トラッキング)
-- ===================
-- 提案採用時にどのツールを使ったかを記録 → tool-master バッジ判定に使用
alter table proposals add column if not exists tools_used text[] default '{}';

-- ===================
-- creator_badges (獲得バッジ)
-- ===================
create table if not exists creator_badges (
  creator_id uuid not null references profiles(id) on delete cascade,
  badge_type badge_type not null,
  awarded_at timestamptz not null default now(),
  expires_at timestamptz,                              -- NULL = 無期限
  reason     jsonb,                                     -- 獲得時のスナップショット (score, avg_rating 等)
  primary key (creator_id, badge_type)
);

create index if not exists idx_creator_badges_creator on creator_badges(creator_id);
create index if not exists idx_creator_badges_expires on creator_badges(expires_at)
  where expires_at is not null;

-- ===================
-- creator_score_history (スコア推移)
-- ===================
create table if not exists creator_score_history (
  id         uuid primary key default gen_random_uuid(),
  creator_id uuid not null references profiles(id) on delete cascade,
  score      integer not null,
  avg_rating numeric(3,2) not null,
  on_time_delivery_rate numeric(4,3) not null,
  repeat_client_rate numeric(4,3) not null,
  completed_orders integer not null,
  calculated_at timestamptz not null default now()
);

create index if not exists idx_score_history_creator_date
  on creator_score_history(creator_id, calculated_at desc);

-- 同日同クリエイターのエントリは1件のみ (冪等性)
-- calculated_at::date は STABLE なのでインデックス式に使えない → 専用カラム
alter table creator_score_history
  add column if not exists calculated_date date not null
  default ((now() at time zone 'asia/tokyo')::date);

create unique index if not exists uniq_score_history_creator_day
  on creator_score_history(creator_id, calculated_date);

-- ===================
-- RLS
-- ===================
alter table creator_badges enable row level security;
alter table creator_score_history enable row level security;

-- バッジは全員閲覧可 (公開情報)
create policy "creator_badges_select_all"
  on creator_badges for select
  using (true);

-- スコア履歴は本人のみ閲覧可 (プロフィールには最新 score のみ公開)
create policy "creator_score_history_select_own"
  on creator_score_history for select
  using (auth.uid() = creator_id);

-- REALTIME (バッジ獲得時の即時UI反映)
do $$ begin
  alter publication supabase_realtime add table creator_badges;
exception when others then null; end $$;
