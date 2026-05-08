-- 返信通知カラム追加マイグレーション
-- Supabase SQL Editorで実行してください

alter table student_service_requests
  add column if not exists reply_read_at timestamptz;
