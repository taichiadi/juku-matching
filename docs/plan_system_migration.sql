-- ============================================================
-- プランシステム migration
-- Supabase SQL Editor で実行してください
-- ============================================================

-- 1. study_plans テーブル（プロ専用）
create table if not exists study_plans (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references auth.users(id) on delete cascade,
  date         date not null,
  subject      text not null,
  task_details text not null,
  is_completed boolean not null default false,
  created_at   timestamptz default now()
);
alter table study_plans enable row level security;
create policy "students manage own plans" on study_plans
  for all using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

-- 2. student_service_requests に priority_score を追加
alter table student_service_requests
  add column if not exists priority_score integer not null default 0;

-- 3. wallets テーブル（先輩報酬プール）
create table if not exists wallets (
  id         uuid primary key default gen_random_uuid(),
  mentor_id  uuid not null references auth.users(id) on delete cascade unique,
  balance    integer not null default 0,
  updated_at timestamptz default now()
);
alter table wallets enable row level security;
create policy "mentors view own wallet" on wallets
  for select using (auth.uid() = mentor_id);
create policy "service role manages wallets" on wallets
  for all using (true);

-- 4. wallet_transactions テーブル
create table if not exists wallet_transactions (
  id         uuid primary key default gen_random_uuid(),
  mentor_id  uuid not null references auth.users(id) on delete cascade,
  amount     integer not null,
  type       text not null check (type in ('consultation_fee', 'speed_bonus', 'withdrawal')),
  request_id uuid references student_service_requests(id),
  created_at timestamptz default now()
);
alter table wallet_transactions enable row level security;
create policy "mentors view own transactions" on wallet_transactions
  for select using (auth.uid() = mentor_id);
create policy "service role manages transactions" on wallet_transactions
  for all using (true);
