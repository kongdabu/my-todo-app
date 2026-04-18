# My Todo App

MS To-Do를 참고한 개인용 할 일 관리 웹앱.

## 기술 스택

| 구분 | 기술 |
|---|---|
| 프레임워크 | React 18 + Vite |
| 스타일링 | Tailwind CSS v4 |
| 상태관리 | Zustand |
| 백엔드/DB | Supabase (JS SDK v2) |
| 라우팅 | React Router v6 |
| 차트 | Recharts |
| 아이콘 | lucide-react |
| 날짜 | date-fns |
| 배포 | GitHub Pages |

## 주요 기능

- 이메일/패스워드 로그인 및 회원가입 (Supabase Auth)
- 할 일 CRUD (제목, 설명, 상태, 우선순위, 납기일, 완료일)
- MS To-Do 스타일 3-컬럼 레이아웃 (사이드바 / 목록 / 상세패널)
- 상태별·우선순위별 필터링, 4가지 정렬, 제목 검색
- 납기 초과 시 자동 '지연' 상태 처리 및 D+n 표시
- 대시보드: 도넛 차트, 오늘 납기 목록, 지연 수, 이번 주 완료 수
- GitHub Actions를 통한 자동 배포 (gh-pages 브랜치)

## 로컬 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env.local
# .env.local에 Supabase URL과 Anon Key 입력

# 3. 개발 서버 시작
npm run dev
```

## Supabase 초기 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 전체 내용 실행
3. 프로젝트 Settings > API에서 URL과 anon key 복사 후 `.env.local`에 입력

## 환경변수

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## GitHub Pages 배포

### GitHub Repository Secrets 등록 필요

| Secret 이름 | 설명 |
|---|---|
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key |

### 자동 배포

`main` 브랜치에 push 시 GitHub Actions가 자동으로 빌드 후 `gh-pages` 브랜치에 배포합니다.

### 수동 배포

```bash
npm run build
npm run deploy
```

### GitHub Pages 설정

GitHub 저장소 Settings > Pages > Source를 `gh-pages` 브랜치로 설정하세요.
배포 URL: `https://<username>.github.io/my-todo-app/`
