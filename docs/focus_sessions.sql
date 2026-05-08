-- オンライン強制自習セッション管理テーブル
-- Supabase SQL Editorで実行してください。

create table if not exists focus_sessions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  subject               text not null,
  goal                  text not null,
  reason                text not null,
  notify_contact_name   text,
  planned_minutes       int not null default 50,
  started_at            timestamptz not null default now(),
  ended_at              timestamptz,
  completed             boolean not null default false,
  checkins_responded    int not null default 0,
  checkins_missed       int not null default 0
);

alter table focus_sessions enable row level security;

drop policy if exists "students insert own focus sessions" on focus_sessions;
create policy "students insert own focus sessions" on focus_sessions
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "students read own focus sessions" on focus_sessions;
create policy "students read own focus sessions" on focus_sessions
  for select
  using (auth.uid() = user_id);

drop policy if exists "students update own focus sessions" on focus_sessions;
create policy "students update own focus sessions" on focus_sessions
  for update
  using (auth.uid() = user_id);

create index if not exists focus_sessions_user_started_idx
  on focus_sessions (user_id, started_at desc);

create index if not exists focus_sessions_user_completed_idx
  on focus_sessions (user_id, completed, started_at desc);
