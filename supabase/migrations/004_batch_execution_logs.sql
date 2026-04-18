-- ============================================================
-- バッチ実行ログ
-- Supabase Migration: 004_batch_execution_logs.sql
-- ============================================================
-- Vercel Cron / pg_cron / GitHub Actions から呼ばれる
-- バッチジョブの実行履歴を保存する。冪等性チェック・障害追跡用。

do $$ begin
  create type batch_status as enum ('running', 'success', 'failed', 'skipped');
exception when duplicate_object then null; end $$;

create table if not exists batch_execution_logs (
  id             uuid primary key default gen_random_uuid(),
  job_name       text not null,           -- 例: 'rank-update'
  execution_date date not null default (now() at time zone 'asia/tokyo')::date,
  status         batch_status not null default 'running',
  started_at     timestamptz not null default now(),
  finished_at    timestamptz,
  duration_ms    integer,
  processed      integer,                 -- 処理件数
  changed        integer,                 -- 変更件数 (rank-update ならランク変更数)
  error_message  text,
  payload        jsonb,                   -- 実行結果の詳細
  triggered_by   text                     -- 'vercel-cron' / 'manual' / 'pg_cron' / 'github-actions'
);

-- 冪等性チェック: (job_name, execution_date) で同日成功の高速検索
create index if not exists idx_batch_logs_job_date
  on batch_execution_logs(job_name, execution_date, status);
create index if not exists idx_batch_logs_started_at
  on batch_execution_logs(started_at desc);

-- 冪等性制約: 同じ job_name × execution_date で success は1件だけ許可
create unique index if not exists uniq_batch_logs_job_date_success
  on batch_execution_logs(job_name, execution_date)
  where status = 'success';

-- RLS (service_role のみ書き込み、管理者のみ閲覧)
alter table batch_execution_logs enable row level security;

-- 管理者ロール (profiles.role = 'admin') のみ閲覧可
create policy "batch_logs_select_admin"
  on batch_execution_logs for select
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );
