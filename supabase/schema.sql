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
