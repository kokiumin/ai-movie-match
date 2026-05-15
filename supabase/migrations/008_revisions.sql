-- ============================================================
-- 修正回数ルール (Phase 4)
-- Supabase Migration: 008_revisions.sql
-- ============================================================
-- 案件ごとに「無料修正の上限」と「現在の修正依頼回数」を保持。
-- クリエイター側は最大対応可能修正回数をプロフィールに設定可能。

-- projects: 修正回数
alter table projects add column if not exists max_revisions integer not null default 2;
alter table projects add column if not exists revision_count integer not null default 0;

create index if not exists idx_projects_revisions on projects(revision_count, max_revisions);

-- profiles: クリエイターが対応可能な修正回数 (null = プロジェクト依存, 0 = 無制限)
alter table profiles add column if not exists max_revisions_offered integer;
