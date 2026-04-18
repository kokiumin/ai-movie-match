-- 案件ごとに必要最低スコアを設定できるようにする。
-- 「スコア600以上のみに募集する」チェックボックスのバックエンド。
alter table projects add column if not exists min_creator_score integer default 0;
create index if not exists idx_projects_min_score on projects(min_creator_score);
