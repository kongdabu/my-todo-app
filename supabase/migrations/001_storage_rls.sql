-- Storage RLS 정책: todo-attachments 버킷
-- 적용 방법: Supabase Dashboard > SQL Editor 에서 실행
-- 적용 전 Storage > Policies 탭에서 중복 정책 없는지 확인

-- 업로드: 자신의 경로에만 허용
create policy "users upload own files"
  on storage.objects for insert
  with check (
    bucket_id = 'todo-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 조회/다운로드: 자신의 파일만
create policy "users select own files"
  on storage.objects for select
  using (
    bucket_id = 'todo-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 삭제: 자신의 파일만
create policy "users delete own files"
  on storage.objects for delete
  using (
    bucket_id = 'todo-attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
