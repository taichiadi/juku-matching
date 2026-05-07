-- 生徒ログイン後サービスの受付テーブル
-- Supabase SQL Editorで実行してください。

create table if not exists student_service_requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  student_email text,
  service_type  text not null check (service_type in ('study_room', 'correction')),
  field_values  jsonb not null default '{}'::jsonb,
  message       text not null,
  status        text not null default 'new' check (status in ('new', 'in_progress', 'done', 'cancelled')),
  admin_note    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table student_service_requests enable row level security;

drop policy if exists "students insert own service requests" on student_service_requests;
create policy "students insert own service requests" on student_service_requests
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "students read own service requests" on student_service_requests;
create policy "students read own service requests" on student_service_requests
  for select
  using (auth.uid() = user_id);

create index if not exists student_service_requests_user_created_idx
  on student_service_requests (user_id, created_at desc);

create index if not exists student_service_requests_status_created_idx
  on student_service_requests (status, created_at desc);
