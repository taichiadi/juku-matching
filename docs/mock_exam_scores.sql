-- 模試成績テーブル
create table mock_exam_scores (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete cascade not null,
  exam_name        text not null,
  exam_date        date not null,
  deviation_value  numeric(4, 1) not null check (deviation_value between 20 and 90),
  created_at       timestamptz default now()
);

alter table mock_exam_scores enable row level security;

-- 生徒は自分のデータのみ参照・挿入・削除可能
create policy "students can select own scores"
  on mock_exam_scores for select
  using (auth.uid() = user_id);

create policy "students can insert own scores"
  on mock_exam_scores for insert
  with check (auth.uid() = user_id);

create policy "students can delete own scores"
  on mock_exam_scores for delete
  using (auth.uid() = user_id);

-- インデックス（ユーザー + 日付順の取得を高速化）
create index mock_exam_scores_user_date_idx
  on mock_exam_scores (user_id, exam_date);
