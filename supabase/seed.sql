-- ============================================================
-- AIムービーマッチ — シードデータ
-- supabase/seed.sql
-- ============================================================
-- 注意: handle_new_user トリガーが auth.users INSERT 時に
--       profiles レコードを自動作成するため、
--       先にトリガーを無効化 → auth.users + profiles を手動挿入 → 再有効化する。
-- ============================================================

-- トリガーを一時無効化（profiles 自動作成を防ぐ）
alter table auth.users disable trigger on_auth_user_created;

-- ============================================================
-- 1. AUTH USERS (11 users)
-- ============================================================

-- --- Creators (6) ---

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'tanaka@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"role": "creator", "display_name": "田中 蒼"}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now()
);

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'suzuki@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"role": "creator", "display_name": "鈴木 凛"}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now()
);

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'yamamoto@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"role": "creator", "display_name": "山本 剛"}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now()
);

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000000',
  'ito@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"role": "creator", "display_name": "伊藤 美咲"}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now()
);

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000000',
  'nakamura@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"role": "creator", "display_name": "中村 健"}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now()
);

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  '66666666-6666-6666-6666-666666666666',
  '00000000-0000-0000-0000-000000000000',
  'hayashi@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"role": "creator", "display_name": "林 奈津子"}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now()
);

-- --- Clients (4) ---

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '00000000-0000-0000-0000-000000000000',
  'greentech@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"role": "client", "display_name": "株式会社グリーンテック"}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now()
);

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  'aaaa2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '00000000-0000-0000-0000-000000000000',
  'mirai@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"role": "client", "display_name": "ミライ不動産"}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now()
);

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  'aaaa3333-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '00000000-0000-0000-0000-000000000000',
  'sato-dental@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"role": "client", "display_name": "佐藤歯科クリニック"}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now()
);

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  'aaaa4444-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '00000000-0000-0000-0000-000000000000',
  'hanabi@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"role": "client", "display_name": "ハナビ食品株式会社"}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now()
);

-- --- Admin (1) ---

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  'admin111-admin-admin-admin-admin111111',
  '00000000-0000-0000-0000-000000000000',
  'admin@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"role": "admin", "display_name": "管理者"}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now()
);

-- ============================================================
-- 2. PROFILES
-- ============================================================

-- --- Creator Profiles ---

INSERT INTO profiles (id, role, display_name, handle, bio, specialty, tools, tags, badge, turnaround, min_price, max_price, rating, review_count, delivery_count, monthly_revenue, active_projects, color)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'creator',
  '田中 蒼',
  '@aosora_gen',
  '生成AI専門クリエイター。中小企業の採用・PR動画を低コストで高速制作します。',
  ARRAY['採用動画','会社紹介'],
  ARRAY['Runway','Sora','CapCut'],
  ARRAY['採用動画','会社紹介'],
  '認定',
  '5〜7日',
  50000, 150000,
  4.9, 38, 52,
  420000, 3,
  'bg-blue-600'
);

INSERT INTO profiles (id, role, display_name, handle, bio, specialty, tools, tags, badge, turnaround, min_price, max_price, rating, review_count, delivery_count, monthly_revenue, active_projects, color)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'creator',
  '鈴木 凛',
  '@rin_aicinema',
  'SNS向けショート動画が得意。ターゲットに刺さるAI映像を高速納品。',
  ARRAY['SNS広告','商品PR'],
  ARRAY['Kling','HeyGen','Premiere'],
  ARRAY['SNS広告','商品PR'],
  '',
  '3〜5日',
  30000, 100000,
  4.7, 24, 31,
  180000, 2,
  'bg-emerald-600'
);

INSERT INTO profiles (id, role, display_name, handle, bio, specialty, tools, tags, badge, turnaround, min_price, max_price, rating, review_count, delivery_count, monthly_revenue, active_projects, color)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'creator',
  '山本 剛',
  '@gocreate_ai',
  '元映像ディレクター。AIで単価を下げながら品質を維持。採用動画の実績多数。',
  ARRAY['採用動画','研修コンテンツ'],
  ARRAY['Sora','D-ID','After Effects'],
  ARRAY['採用動画','研修・説明'],
  '認定',
  '7〜10日',
  80000, 200000,
  4.8, 41, 67,
  610000, 4,
  'bg-violet-600'
);

INSERT INTO profiles (id, role, display_name, handle, bio, specialty, tools, tags, badge, turnaround, min_price, max_price, rating, review_count, delivery_count, monthly_revenue, active_projects, color)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'creator',
  '伊藤 美咲',
  '@misaki_aifilm',
  'アート系ビジュアルが強み。ブランドイメージを高める映像表現を得意とする。',
  ARRAY['ブランド動画','会社紹介'],
  ARRAY['Runway','Midjourney','Resolve'],
  ARRAY['ブランド動画','会社紹介'],
  '',
  '5〜8日',
  100000, 250000,
  4.6, 17, 23,
  320000, 2,
  'bg-amber-600'
);

INSERT INTO profiles (id, role, display_name, handle, bio, specialty, tools, tags, badge, turnaround, min_price, max_price, rating, review_count, delivery_count, monthly_revenue, active_projects, color)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  'creator',
  '中村 健',
  '@ken_aigiga',
  '業界最多実績。どんな業種でも対応できる汎用力と圧倒的スピードが強み。',
  ARRAY['採用動画','SNS広告','会社紹介'],
  ARRAY['Kling','Sora','Runway'],
  ARRAY['採用動画','SNS広告','会社紹介'],
  'TOP',
  '4〜6日',
  50000, 180000,
  4.9, 56, 89,
  780000, 5,
  'bg-rose-600'
);

INSERT INTO profiles (id, role, display_name, handle, bio, specialty, tools, tags, badge, turnaround, min_price, max_price, rating, review_count, delivery_count, monthly_revenue, active_projects, color)
VALUES (
  '66666666-6666-6666-6666-666666666666',
  'creator',
  '林 奈津子',
  '@natsu_aiworks',
  '食品・コスメ・アパレルのSNS広告専門。短納期・低価格が強み。',
  ARRAY['商品PR','SNS広告'],
  ARRAY['Kling','CapCut','HeyGen'],
  ARRAY['商品PR','SNS広告'],
  '',
  '2〜4日',
  20000, 80000,
  4.5, 12, 18,
  140000, 1,
  'bg-pink-600'
);

-- --- Client Profiles ---

INSERT INTO profiles (id, role, display_name, company_name, industry)
VALUES (
  'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'client',
  '株式会社グリーンテック',
  '株式会社グリーンテック',
  'IT・Web'
);

INSERT INTO profiles (id, role, display_name, company_name, industry)
VALUES (
  'aaaa2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'client',
  'ミライ不動産',
  'ミライ不動産',
  '不動産'
);

INSERT INTO profiles (id, role, display_name, company_name, industry)
VALUES (
  'aaaa3333-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'client',
  '佐藤歯科クリニック',
  '佐藤歯科クリニック',
  '医療・クリニック'
);

INSERT INTO profiles (id, role, display_name, company_name, industry)
VALUES (
  'aaaa4444-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'client',
  'ハナビ食品株式会社',
  'ハナビ食品株式会社',
  '食品・飲料'
);

-- --- Admin Profile ---

INSERT INTO profiles (id, role, display_name)
VALUES (
  'admin111-admin-admin-admin-admin111111',
  'admin',
  '管理者'
);

-- トリガーを再有効化
alter table auth.users enable trigger on_auth_user_created;

-- ============================================================
-- 3. PROJECTS (4)
-- ============================================================

INSERT INTO projects (id, client_id, company_name, industry, type, budget, deadline, description, status, view_count, proposal_count)
VALUES (
  'pj000001-0000-0000-0000-000000000001',
  'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '株式会社グリーンテック',
  'IT・Web',
  '採用動画',
  '10〜20万円',
  '2週間',
  '新卒採用向けの会社紹介・仕事紹介動画。1〜2分程度。明るく活気のある雰囲気で。',
  'matching',
  12, 3
);

INSERT INTO projects (id, client_id, company_name, industry, type, budget, deadline, description, status, view_count, proposal_count)
VALUES (
  'pj000002-0000-0000-0000-000000000002',
  'aaaa2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'ミライ不動産',
  '不動産',
  '会社紹介動画',
  '5〜10万円',
  '10日',
  '不動産会社の信頼感を伝える会社紹介動画。物件紹介ではなく企業としての魅力を訴求。',
  'recruiting',
  28, 7
);

INSERT INTO projects (id, client_id, company_name, industry, type, budget, deadline, description, status, view_count, proposal_count)
VALUES (
  'pj000003-0000-0000-0000-000000000003',
  'aaaa3333-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '佐藤歯科クリニック',
  '医療・クリニック',
  'SNS広告動画',
  '3〜8万円',
  '1週間',
  'Instagram・TikTok向けの歯科クリニック集客用ショート動画。親しみやすい雰囲気で。',
  'contracted',
  45, 11
);

INSERT INTO projects (id, client_id, company_name, industry, type, budget, deadline, description, status, view_count, proposal_count)
VALUES (
  'pj000004-0000-0000-0000-000000000004',
  'aaaa4444-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'ハナビ食品株式会社',
  '食品・飲料',
  '商品PR動画',
  '8〜15万円',
  '3週間',
  '新商品の夏季限定ドリンクのPR動画。SNSとWebサイト両方で使用。爽やかなイメージで。',
  'recruiting',
  19, 4
);

-- ============================================================
-- 4. PROPOSALS (5)
-- ============================================================

INSERT INTO proposals (id, project_id, creator_id, message, price, delivery_days, status)
VALUES (
  'pr000001-0000-0000-0000-000000000001',
  'pj000001-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'IT企業の採用動画を多数制作してきました。貴社の魅力を最大限に引き出す構成をご提案します。',
  120000, 7, 'accepted'
);

INSERT INTO proposals (id, project_id, creator_id, message, price, delivery_days, status)
VALUES (
  'pr000002-0000-0000-0000-000000000002',
  'pj000001-0000-0000-0000-000000000001',
  '33333333-3333-3333-3333-333333333333',
  '元映像ディレクターの経験を活かし、質の高い採用動画を制作いたします。',
  150000, 10, 'pending'
);

INSERT INTO proposals (id, project_id, creator_id, message, price, delivery_days, status)
VALUES (
  'pr000003-0000-0000-0000-000000000003',
  'pj000001-0000-0000-0000-000000000001',
  '55555555-5555-5555-5555-555555555555',
  '業界最多の実績でスピーディーに対応します。まずはヒアリングさせてください。',
  100000, 5, 'pending'
);

INSERT INTO proposals (id, project_id, creator_id, message, price, delivery_days, status)
VALUES (
  'pr000004-0000-0000-0000-000000000004',
  'pj000003-0000-0000-0000-000000000003',
  '55555555-5555-5555-5555-555555555555',
  'SNS広告動画は得意分野です。クリニック向けの実績もございます。',
  60000, 5, 'accepted'
);

INSERT INTO proposals (id, project_id, creator_id, message, price, delivery_days, status)
VALUES (
  'pr000005-0000-0000-0000-000000000005',
  'pj000004-0000-0000-0000-000000000004',
  '66666666-6666-6666-6666-666666666666',
  '食品系のSNS動画を多数手がけています。低コスト・短納期でお届けします。',
  70000, 10, 'pending'
);

-- ============================================================
-- 5. PORTFOLIO ITEMS (6)
-- ============================================================

INSERT INTO portfolio_items (id, creator_id, title, category, description, thumbnail_url, view_count, display_order)
VALUES (
  'pf000001-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'IT企業 新卒採用動画',
  '採用動画',
  'SaaS企業の新卒採用向け会社紹介動画。社員インタビューとオフィスツアーを生成AIで制作。',
  '/thumbnails/portfolio-1.jpg',
  1200, 1
);

INSERT INTO portfolio_items (id, creator_id, title, category, description, thumbnail_url, view_count, display_order)
VALUES (
  'pf000002-0000-0000-0000-000000000002',
  '22222222-2222-2222-2222-222222222222',
  '飲食チェーン Instagram CM',
  'SNS広告',
  '全国展開する飲食チェーンのInstagram広告用15秒動画。季節メニューの訴求。',
  '/thumbnails/portfolio-2.jpg',
  3400, 1
);

INSERT INTO portfolio_items (id, creator_id, title, category, description, thumbnail_url, view_count, display_order)
VALUES (
  'pf000003-0000-0000-0000-000000000003',
  '33333333-3333-3333-3333-333333333333',
  'SaaS製品 プロモーション',
  '商品PR',
  'BtoB向けSaaS製品のプロモーション動画。機能紹介とユースケースをアニメーションで表現。',
  '/thumbnails/portfolio-3.jpg',
  890, 1
);

INSERT INTO portfolio_items (id, creator_id, title, category, description, thumbnail_url, view_count, display_order)
VALUES (
  'pf000004-0000-0000-0000-000000000004',
  '44444444-4444-4444-4444-444444444444',
  '建設会社 会社紹介ムービー',
  '会社紹介',
  '創業50年の建設会社の会社紹介動画。歴史と実績をシネマティックに表現。',
  '/thumbnails/portfolio-4.jpg',
  2100, 1
);

INSERT INTO portfolio_items (id, creator_id, title, category, description, thumbnail_url, view_count, display_order)
VALUES (
  'pf000005-0000-0000-0000-000000000005',
  '55555555-5555-5555-5555-555555555555',
  'クリニック SNS広告',
  'SNS広告',
  '美容クリニックのSNS広告動画。施術のビフォーアフターをAI映像で表現。',
  '/thumbnails/portfolio-5.jpg',
  5600, 1
);

INSERT INTO portfolio_items (id, creator_id, title, category, description, thumbnail_url, view_count, display_order)
VALUES (
  'pf000006-0000-0000-0000-000000000006',
  '66666666-6666-6666-6666-666666666666',
  'アパレルブランド PV',
  'ブランド動画',
  'D2Cアパレルブランドのプロモーションビデオ。ブランドの世界観を映像で表現。',
  '/thumbnails/portfolio-6.jpg',
  4200, 1
);

-- ============================================================
-- 6. REVIEWS (4, all for tanaka)
-- ============================================================

INSERT INTO reviews (id, creator_id, author_id, project_id, rating, text)
VALUES (
  'rv000001-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'pj000001-0000-0000-0000-000000000001',
  5,
  '採用動画を依頼しました。こちらの要望を丁寧にヒアリングしてくださり、期待以上の仕上がりでした。納期も予定より早く助かりました。'
);

INSERT INTO reviews (id, creator_id, author_id, project_id, rating, text)
VALUES (
  'rv000002-0000-0000-0000-000000000002',
  '11111111-1111-1111-1111-111111111111',
  'aaaa2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NULL,
  4,
  '会社紹介動画の制作をお願いしました。AIを活用した映像表現が斬新で、社内でも好評です。修正対応も迅速でした。'
);

INSERT INTO reviews (id, creator_id, author_id, project_id, rating, text)
VALUES (
  'rv000003-0000-0000-0000-000000000003',
  '11111111-1111-1111-1111-111111111111',
  'aaaa3333-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NULL,
  5,
  'Instagram広告動画を作っていただきました。ターゲットに刺さるクリエイティブで、問い合わせが1.5倍に増えました。'
);

INSERT INTO reviews (id, creator_id, author_id, project_id, rating, text)
VALUES (
  'rv000004-0000-0000-0000-000000000004',
  '11111111-1111-1111-1111-111111111111',
  'aaaa4444-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NULL,
  5,
  '新卒採用動画を依頼。若手社員の魅力を引き出す構成が素晴らしかったです。応募者数が前年比120%に。'
);

-- ============================================================
-- 7. MESSAGE THREADS (3)
-- ============================================================

-- Thread 1: greentech <-> tanaka (linked to project 1)
INSERT INTO message_threads (id, project_id)
VALUES ('th000001-0000-0000-0000-000000000001', 'pj000001-0000-0000-0000-000000000001');

INSERT INTO thread_participants (thread_id, user_id)
VALUES
  ('th000001-0000-0000-0000-000000000001', 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('th000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111');

-- Thread 2: mirai <-> suzuki (linked to project 2)
INSERT INTO message_threads (id, project_id)
VALUES ('th000002-0000-0000-0000-000000000002', 'pj000002-0000-0000-0000-000000000002');

INSERT INTO thread_participants (thread_id, user_id)
VALUES
  ('th000002-0000-0000-0000-000000000002', 'aaaa2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('th000002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222');

-- Thread 3: greentech <-> nakamura (linked to project 1)
INSERT INTO message_threads (id, project_id)
VALUES ('th000003-0000-0000-0000-000000000003', 'pj000001-0000-0000-0000-000000000001');

INSERT INTO thread_participants (thread_id, user_id)
VALUES
  ('th000003-0000-0000-0000-000000000003', 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('th000003-0000-0000-0000-000000000003', '55555555-5555-5555-5555-555555555555');

-- ============================================================
-- 8. MESSAGES (7 messages in thread 1)
-- ============================================================

INSERT INTO messages (id, thread_id, sender_id, text, created_at)
VALUES
  ('mg000001-0000-0000-0000-000000000001',
   'th000001-0000-0000-0000-000000000001',
   'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'はじめまして。採用動画の件でご相談させてください。新卒向けの会社紹介動画を検討しています。',
   now() - interval '6 days'),

  ('mg000002-0000-0000-0000-000000000002',
   'th000001-0000-0000-0000-000000000001',
   '11111111-1111-1111-1111-111111111111',
   'お問い合わせありがとうございます！IT企業様の採用動画は多数実績がございます。どのようなイメージをお持ちですか？',
   now() - interval '6 days' + interval '2 hours'),

  ('mg000003-0000-0000-0000-000000000003',
   'th000001-0000-0000-0000-000000000001',
   'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '社員インタビューと職場の雰囲気が伝わる内容を考えています。1〜2分程度で、明るいトーンが希望です。',
   now() - interval '5 days'),

  ('mg000004-0000-0000-0000-000000000004',
   'th000001-0000-0000-0000-000000000001',
   '11111111-1111-1111-1111-111111111111',
   '承知しました。生成AIを活用すれば、コストを抑えつつ高品質な映像が制作可能です。企画案をお送りしますね。',
   now() - interval '5 days' + interval '1 hour'),

  ('mg000005-0000-0000-0000-000000000005',
   'th000001-0000-0000-0000-000000000001',
   '11111111-1111-1111-1111-111111111111',
   '企画案をまとめました。構成は①会社概要（15秒）②社員インタビュー（45秒）③職場環境（30秒）④採用メッセージ（15秒）です。',
   now() - interval '3 days'),

  ('mg000006-0000-0000-0000-000000000006',
   'th000001-0000-0000-0000-000000000001',
   'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'とても良い構成ですね！ぜひこの方向で進めてください。予算は12万円以内でお願いできますか？',
   now() - interval '2 days'),

  ('mg000007-0000-0000-0000-000000000007',
   'th000001-0000-0000-0000-000000000001',
   '11111111-1111-1111-1111-111111111111',
   '12万円で承ります。それでは正式にご依頼いただければ、来週から制作開始いたします。納品は7営業日を予定しています。',
   now() - interval '1 day');

-- ============================================================
-- 9. NOTIFICATIONS (5)
-- ============================================================

INSERT INTO notifications (id, user_id, type, text, read, data, created_at)
VALUES
  ('nt000001-0000-0000-0000-000000000001',
   'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'proposal',
   '田中 蒼さんがあなたの案件に提案しました',
   true,
   '{"project_id": "pj000001-0000-0000-0000-000000000001", "creator_id": "11111111-1111-1111-1111-111111111111"}'::jsonb,
   now() - interval '7 days'),

  ('nt000002-0000-0000-0000-000000000002',
   '11111111-1111-1111-1111-111111111111',
   'match',
   '株式会社グリーンテックの案件にマッチングしました',
   true,
   '{"project_id": "pj000001-0000-0000-0000-000000000001"}'::jsonb,
   now() - interval '5 days'),

  ('nt000003-0000-0000-0000-000000000003',
   '11111111-1111-1111-1111-111111111111',
   'message',
   '株式会社グリーンテックからメッセージが届きました',
   false,
   '{"thread_id": "th000001-0000-0000-0000-000000000001"}'::jsonb,
   now() - interval '2 days'),

  ('nt000004-0000-0000-0000-000000000004',
   '55555555-5555-5555-5555-555555555555',
   'review',
   '佐藤歯科クリニックからレビューが届きました',
   false,
   '{"review_id": "rv000003-0000-0000-0000-000000000003"}'::jsonb,
   now() - interval '1 day'),

  ('nt000005-0000-0000-0000-000000000005',
   'aaaa4444-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'proposal',
   '林 奈津子さんがあなたの案件に提案しました',
   false,
   '{"project_id": "pj000004-0000-0000-0000-000000000004", "creator_id": "66666666-6666-6666-6666-666666666666"}'::jsonb,
   now() - interval '12 hours');

-- ============================================================
-- 10. FAVORITES (sample)
-- ============================================================

INSERT INTO favorites (user_id, creator_id)
VALUES
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555'),
  ('aaaa2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
  ('aaaa4444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666');
