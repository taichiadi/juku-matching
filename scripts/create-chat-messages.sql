-- チャットメッセージテーブル
-- Supabase SQL Editor で実行してください

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_request_id uuid NOT NULL REFERENCES consultation_requests(id) ON DELETE CASCADE,
  sender_role text NOT NULL CHECK (sender_role IN ('student', 'tutor')),
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- トークンがわかれば誰でも読める（URLが秘密鍵代わり）
CREATE POLICY "read_chat_messages" ON chat_messages
  FOR SELECT USING (true);

CREATE POLICY "insert_chat_messages" ON chat_messages
  FOR INSERT WITH CHECK (true);

-- Supabase Realtime を有効化
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
