-- student_service_requests 完全セットアップ
-- ※ 初めて実行する場合はこのファイルだけ実行すればOKです。
-- Supabase SQL Editor に貼り付けて実行してください。

-- 1. テーブル作成
create table if not exists student_service_requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  student_email text,
  service_type  text not null check (service_type in ('study_room', 'correction', 'focus_room')),
  field_values  jsonb not null default '{}'::jsonb,
  message       text not null,
  attachments   jsonb not null default '[]'::jsonb,
  status        text not null default 'new' check (status in ('new', 'in_progress', 'done', 'cancelled')),
  admin_reply   text,
  admin_note    text,
  reply_read_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 2. RLS 有効化
alter table student_service_requests enable row level security;

-- 3. ポリシー（生徒: INSERT / SELECT）
drop policy if exists "students insert own service requests" on student_service_requests;
create policy "students insert own service requests" on student_service_requests
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "students read own service requests" on student_service_requests;
create policy "students read own service requests" on student_service_requests
  for select
  using (auth.uid() = user_id);

-- 4. ポリシー（管理者: UPDATE）
-- NEXT_PUBLIC_ADMIN_PASSWORD で認証する管理画面はブラウザ supabase クライアントを使うため
-- UPDATE には全行アクセス可のポリシーが必要。管理画面の認証はアプリ側で行っています。
drop policy if exists "admin update service requests" on student_service_requests;
create policy "admin update service requests" on student_service_requests
  for update
  using (true)
  with check (true);

-- 5. インデックス
create index if not exists student_service_requests_user_created_idx
  on student_service_requests (user_id, created_at desc);

create index if not exists student_service_requests_status_created_idx
  on student_service_requests (status, created_at desc);

-- 6. Storage bucket（写真・PDF添付用）
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'service-request-attachments',
  'service-request-attachments',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "students upload own service request attachments" on storage.objects;
create policy "students upload own service request attachments" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'service-request-attachments'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "students read own service request attachments" on storage.objects;
create policy "students read own service request attachments" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'service-request-attachments'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "students delete own service request attachments" on storage.objects;
create policy "students delete own service request attachments" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'service-request-attachments'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
