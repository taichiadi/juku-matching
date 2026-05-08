-- チューター本人確認と表示名
-- Supabase SQL Editorで実行してください。

alter table experiences
  add column if not exists tutor_display_name text,
  add column if not exists tutor_verification_status text;

create table if not exists tutor_verifications (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references experiences(id) on delete cascade,
  real_name text not null,
  display_name text not null,
  school_email text not null,
  verification_status text not null default 'school_email_verified',
  created_at timestamptz not null default now()
);

alter table tutor_verifications enable row level security;

drop policy if exists "anon can submit tutor verification" on tutor_verifications;
create policy "anon can submit tutor verification"
  on tutor_verifications
  for insert
  to anon, authenticated
  with check (true);

-- 本名・学校メールはアプリ画面から読ませない。
-- 確認はSupabase DashboardのTable Editorで行う。
drop policy if exists "no public read tutor verification" on tutor_verifications;
