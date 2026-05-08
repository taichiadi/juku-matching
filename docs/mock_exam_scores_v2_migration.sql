-- 模試成績テーブル v2 マイグレーション
-- Supabase SQL Editorで実行してください

alter table mock_exam_scores
  add column if not exists subject        text,           -- 科目（NULLは総合）
  add column if not exists raw_score      numeric(6, 1),  -- 得点（任意）
  add column if not exists judgment       text,           -- 判定 A/B/C/D/E（任意）
  add column if not exists rank_in_exam   integer;        -- 順位（任意）

-- deviation_value を nullable に変更（得点のみ登録も許可）
alter table mock_exam_scores
  alter column deviation_value drop not null;

-- 既存のcheck制約を修正（nullを許可）
alter table mock_exam_scores
  drop constraint if exists mock_exam_scores_deviation_value_check;

alter table mock_exam_scores
  add constraint mock_exam_scores_deviation_value_check
  check (deviation_value is null or (deviation_value between 20 and 90));
