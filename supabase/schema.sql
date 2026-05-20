-- todos 테이블 생성
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default '미접수'
    check (status in ('미접수', '진행', '지연', '완료')),
  priority text not null default '일반'
    check (priority in ('긴급', '중요', '일반', '장기')),
  created_at timestamptz default now(),
  due_date date,
  completed_at timestamptz,
  user_id uuid references auth.users(id) on delete cascade
);

-- RLS 활성화
alter table public.todos enable row level security;

-- 자신의 데이터만 조회
create policy "Users can view own todos"
  on public.todos for select
  using (auth.uid() = user_id);

-- 자신의 데이터만 생성
create policy "Users can insert own todos"
  on public.todos for insert
  with check (auth.uid() = user_id);

-- 자신의 데이터만 수정
create policy "Users can update own todos"
  on public.todos for update
  using (auth.uid() = user_id);

-- 자신의 데이터만 삭제
create policy "Users can delete own todos"
  on public.todos for delete
  using (auth.uid() = user_id);

-- =============================================
-- 파일 첨부 기능
-- =============================================

-- todo_files 테이블
create table if not exists public.todo_files (
  id uuid primary key default gen_random_uuid(),
  todo_id uuid not null references public.todos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  size bigint not null,
  type text not null,
  storage_path text not null,
  created_at timestamptz default now()
);

create index if not exists todo_files_todo_id_idx on public.todo_files (todo_id);
create index if not exists todo_files_user_id_idx on public.todo_files (user_id);

alter table public.todo_files enable row level security;

create policy "users can manage own files"
  on public.todo_files for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================
-- Storage 버킷: todo-attachments (비공개)
-- Supabase 대시보드 > Storage 에서 수동 생성
--   - Bucket name: todo-attachments
--   - Public: OFF
--
-- Storage RLS 정책 (대시보드 > Storage > Policies):
-- =============================================
-- 업로드: 자신의 경로에만 허용
-- create policy "users upload own files"
--   on storage.objects for insert
--   with check (bucket_id = 'todo-attachments' and auth.uid()::text = (storage.foldername(name))[1]);
--
-- 조회/다운로드: 자신의 파일만
-- create policy "users select own files"
--   on storage.objects for select
--   using (bucket_id = 'todo-attachments' and auth.uid()::text = (storage.foldername(name))[1]);
--
-- 삭제: 자신의 파일만
-- create policy "users delete own files"
--   on storage.objects for delete
--   using (bucket_id = 'todo-attachments' and auth.uid()::text = (storage.foldername(name))[1]);
