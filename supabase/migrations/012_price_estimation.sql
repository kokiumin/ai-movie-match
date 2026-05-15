-- ============================================================
-- 価格レンジ算出マトリクス (Phase 7)
-- Supabase Migration: 012_price_estimation.sql
-- ============================================================
-- 簡易AIヒアリング (use_case × duration × deadline) → 価格レンジ
create table if not exists price_estimation_matrix (
  id              uuid primary key default gen_random_uuid(),
  use_case        text not null,         -- 'product_promo', 'company_intro', 'sns_ad', 'recruit', 'service_explain', 'other'
  duration_range  text not null,         -- 'under_30s', '30s_1m', '1m_2m', '2m_3m', 'over_3m'
  deadline_range  text not null,         -- 'within_1week', 'within_2weeks', 'within_1month', 'no_rush'
  price_min       integer not null,
  price_max       integer not null,
  price_standard  integer not null,
  delivery_days   integer not null,
  updated_at      timestamptz default now(),
  unique(use_case, duration_range, deadline_range)
);

-- 初期データ (こうきの業界知見ベースの目安)
insert into price_estimation_matrix
  (use_case, duration_range, deadline_range, price_min, price_max, price_standard, delivery_days)
values
  -- 商品プロモ
  ('product_promo','under_30s','within_1week',30000,80000,50000,5),
  ('product_promo','30s_1m','within_2weeks',50000,150000,80000,10),
  ('product_promo','1m_2m','within_1month',80000,200000,120000,18),
  -- 会社紹介
  ('company_intro','30s_1m','within_2weeks',80000,180000,120000,12),
  ('company_intro','1m_2m','within_1month',100000,250000,150000,20),
  ('company_intro','2m_3m','no_rush',150000,350000,220000,30),
  -- SNS広告
  ('sns_ad','under_30s','within_1week',20000,60000,30000,5),
  ('sns_ad','30s_1m','within_2weeks',30000,100000,50000,10),
  -- 採用動画
  ('recruit','1m_2m','within_2weeks',80000,200000,120000,14),
  ('recruit','2m_3m','within_1month',150000,300000,200000,25),
  -- サービス説明
  ('service_explain','30s_1m','within_2weeks',60000,150000,100000,12),
  ('service_explain','1m_2m','within_1month',100000,250000,150000,20),
  -- その他
  ('other','30s_1m','within_2weeks',50000,150000,80000,12)
on conflict (use_case, duration_range, deadline_range) do nothing;
