-- 英検スコアテーブル
create table if not exists eiken_scores (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  level      text not null,       -- '1級', '準1級', '2級', etc.
  exam_date  date not null,
  result     text,                -- '合格', '不合格', '未発表'
  cse_score  integer,
  created_at timestamptz default now()
);

alter table eiken_scores enable row level security;

create policy "users can manage own eiken scores"
  on eiken_scores for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
