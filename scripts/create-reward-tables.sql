-- チューター報酬管理テーブル
-- Supabase SQL Editor で実行してください

-- 相談完結記録
CREATE TABLE IF NOT EXISTS consultation_completions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_request_id uuid REFERENCES consultation_requests(id) ON DELETE CASCADE,
  experience_id uuid REFERENCES experiences(id) ON DELETE SET NULL,
  tutor_email text,
  resolved_by text CHECK (resolved_by IN ('student', 'auto')),
  resolved_at timestamptz DEFAULT now(),
  reward_amount integer DEFAULT 300,
  reward_paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 体験記閲覧数記録
CREATE TABLE IF NOT EXISTS experience_view_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id uuid REFERENCES experiences(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now()
);

-- experiences テーブルに view_count カラムを追加
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- consultation_requests テーブルに完結カラムを追加
ALTER TABLE consultation_requests ADD COLUMN IF NOT EXISTS resolved_at timestamptz;
ALTER TABLE consultation_requests ADD COLUMN IF NOT EXISTS resolved_by text;

-- RLS ポリシー
ALTER TABLE consultation_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_view_logs ENABLE ROW LEVEL SECURITY;

-- 管理者のみ参照
CREATE POLICY "admin_read_completions" ON consultation_completions
  FOR SELECT USING (true);

CREATE POLICY "insert_completions" ON consultation_completions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "insert_view_logs" ON experience_view_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_read_view_logs" ON experience_view_logs
  FOR SELECT USING (true);
