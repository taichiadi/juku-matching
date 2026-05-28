-- ============================================================
-- SENPAI LINK: 受験判断データ強化マイグレーション
-- Supabase ダッシュボード > SQL Editor で実行してください
-- ============================================================

-- ① 分岐点の月（数値）
-- 何月に最大の判断変更をしたか (4〜2月)
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS pivot_month integer;

-- ② 誤算のタイプ（配列・選択式）
-- mistake_type の候補:
--   過去問開始が遅すぎた / 参考書を複数に分散した / 苦手科目を後回しにした
--   模試判定を信じすぎた / 塾・予備校に任せすぎた / 休憩・メンタルを軽視した
--   併願校の選び方を間違えた / 直前期の戦略変更が裏目 / 基礎固めに時間をかけすぎた
--   演習量が足りなかった
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS mistake_type text[];

-- ③ 最も効いた判断（選択式・1択）
-- key_decision の候補:
--   塾を変えた/やめた / 科目の優先順位を変えた / 参考書を絞り込んだ
--   生活リズムを変えた / 過去問に早期着手した / 浪人を決断した
--   志望校を変更した / 独学に切り替えた / 勉強仲間を作った / 苦手科目を切り捨てた
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS key_decision text;

-- ④ 開始偏差値（数値）
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS deviation_start_num integer;

-- ⑤ 過去問開始月（数値: 7〜2）
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS past_exam_start_month integer;

-- ⑥ やめたこと（自由記述）
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS what_stopped text;

-- ⑦ 立て直した月（数値）
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS recovery_month integer;

-- ⑧ 1日の勉強時間（数値・時間）
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS daily_hours_num integer;

-- ============================================================
-- インデックス（将来の集計クエリ用）
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_experiences_pivot_month ON experiences(pivot_month);
CREATE INDEX IF NOT EXISTS idx_experiences_deviation_start ON experiences(deviation_start_num);
CREATE INDEX IF NOT EXISTS idx_experiences_past_exam_start ON experiences(past_exam_start_month);

-- ============================================================
-- 受験校テーブル（CSV文字列からの正規化・将来用）
-- 今は作るだけ。既存の ronin_passed/concurrent_strategy は残す。
-- ============================================================
CREATE TABLE IF NOT EXISTS experience_exam_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid REFERENCES experiences(id) ON DELETE CASCADE,
  university text NOT NULL,
  faculty text,
  result text CHECK (result IN ('合格', '不合格', '補欠', '辞退')),
  exam_method text CHECK (exam_method IN ('一般', '共テ利用', '推薦', 'AO')),
  is_target boolean DEFAULT false,
  is_enrolled boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exam_results_experience ON experience_exam_results(experience_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_university ON experience_exam_results(university, result);
