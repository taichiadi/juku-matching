-- student_favorites テーブル
CREATE TABLE IF NOT EXISTS student_favorites (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  experience_id uuid NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  created_at    timestamptz DEFAULT now(),
  UNIQUE(student_id, experience_id)
);

ALTER TABLE student_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "students manage own favorites" ON student_favorites
  FOR ALL USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);
