-- 体験記テーブルに滑り止め校カラムを追加
ALTER TABLE experiences
ADD COLUMN IF NOT EXISTS safety_schools text;
