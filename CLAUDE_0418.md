# My Todo App — 작업 내역 (2026-04-18)

## 프로젝트 개요

**프로젝트명:** my-todo-app  
**경로:** `/Users/mac/workspace/my-todo-app`  
**GitHub:** https://github.com/kongdabu/my-todo-app  
**배포 URL:** https://kongdabu.github.io/my-todo-app/

---

## 기술 스택

| 구분 | 기술 |
|---|---|
| 프레임워크 | React 18 + Vite |
| 스타일링 | Tailwind CSS v4 (`@tailwindcss/vite`) |
| 상태관리 | Zustand |
| 백엔드/DB | Supabase (JS SDK v2) |
| 라우팅 | React Router v6 |
| 차트 | Recharts |
| 아이콘 | lucide-react |
| 날짜 처리 | date-fns |
| 배포 | GitHub Pages (`gh-pages` 브랜치) |

---

## 작업 1: 프로젝트 초기화 및 기반 구축

### 수행 내용
- `npm create vite@latest my-todo-app -- --template react` 로 프로젝트 생성
- 전체 의존성 설치 (supabase-js, zustand, react-router-dom, lucide-react, date-fns, recharts, tailwindcss)
- `vite.config.js` — `base: '/my-todo-app/'` 및 Tailwind 플러그인 설정
- `src/index.css` — Tailwind v4 `@import "tailwindcss"` 방식 적용

### 생성 파일
```
src/lib/supabaseClient.js
supabase/schema.sql
src/store/authStore.js
src/store/todoStore.js
src/components/auth/PrivateRoute.jsx
src/components/layout/Header.jsx
src/components/layout/Sidebar.jsx
src/components/todo/TodoCard.jsx
src/components/todo/TodoList.jsx
src/components/todo/DetailPanel.jsx
src/pages/Login.jsx
src/pages/TodoPage.jsx
src/pages/Dashboard.jsx
src/App.jsx
```

### Supabase Schema (`supabase/schema.sql`)
- `todos` 테이블: id(uuid), title, description, status, priority, created_at, due_date, completed_at, user_id
- status 허용값: `미접수`, `진행`, `지연`, `완료`
- priority 허용값: `긴급`, `중요`, `일반`, `장기`
- RLS 활성화 + 사용자별 CRUD 정책 4개 설정

---

## 작업 2: GitHub 배포 설정

### 수행 내용
- `.github/workflows/deploy.yml` 생성 — main 브랜치 push 시 자동 빌드 → gh-pages 배포
- `gh-pages` 패키지 설치 및 `package.json` deploy 스크립트 추가
- `.env.example` 생성
- `README.md` 작성 (프로젝트 개요, 기술 스택, 로컬 실행, Supabase 설정, 배포 방법)
- git 초기화 → 최초 커밋 → `https://github.com/kongdabu/my-todo-app` push

---

## 작업 3: GitHub Pages SPA 라우팅 수정

### 문제
새로고침 또는 직접 URL 접근 시 GitHub Pages가 404 반환

### 해결
- `public/404.html` 추가 — 경로를 쿼리스트링으로 인코딩해 index.html로 리다이렉트
- `index.html` — 쿼리스트링을 원래 경로로 복원하는 스크립트 포함
- **동작 흐름:** 직접 URL → 404.html → 쿼리스트링 인코딩 → index.html → 경로 복원 → React Router 처리

---

## 작업 4: 빈 페이지 원인 파악 및 수정

### 원인
`supabaseClient.js`에서 `createClient(undefined, undefined)` 가 모듈 최상단에서 예외를 던져 React 마운트 전 앱 전체 크래시

GitHub Repository Secrets 미설정 시 빌드 환경변수가 빈 값으로 치환됨

### 해결
- `supabaseClient.js` — 빈 값 시 placeholder로 대체해 모듈 크래시 방지 (에러 로그 출력)
- `deploy.yml` — Secrets 미설정 시 빌드를 명시적으로 실패시키는 검증 단계 추가

### GitHub Secrets 등록 필요
| Secret | 설명 |
|---|---|
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key |

---

## 작업 5: 회원가입 확인 메일 localhost 링크 문제 수정

### 원인
Supabase 대시보드의 **Site URL**이 `http://localhost:3000`으로 설정되어 있어 확인 메일 링크가 localhost로 생성됨

### 해결 (코드)
```js
// Login.jsx — signUp 호출 시 emailRedirectTo 동적 지정
const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`
await supabase.auth.signUp({
  email, password,
  options: { emailRedirectTo: redirectTo }
})
```
- 로컬: `http://localhost:5173/my-todo-app/`
- GitHub Pages: `https://kongdabu.github.io/my-todo-app/`

### 해결 (Supabase 대시보드)
경로: `Authentication → URL Configuration`
- **Site URL:** `https://kongdabu.github.io/my-todo-app`
- **Redirect URLs:** `https://kongdabu.github.io/my-todo-app/*` 추가

---

## 작업 6: 보안 취약점 수정

### 수정 내용 (`src/pages/Login.jsx`)

| 취약점 | 수정 |
|---|---|
| 비밀번호 검증 없음 | 8자 이상 + 영문 + 숫자 조합 클라이언트 검증 (`validatePassword`) |
| 이메일 공백 미처리 | `email.trim()` 적용 |
| Supabase 영문 에러 노출 | `translateError()` 함수로 한국어 메시지 변환 |
| 비밀번호 미초기화 | 로그인/회원가입 모드 전환 시 `password` 상태 초기화 |
| autocomplete 미설정 | `autocomplete="new-password"` / `"current-password"` 추가 |

---

## 작업 7: 반응형 웹 구현

### Header.jsx
- 모바일에서 햄버거 메뉴 버튼 표시 (`md:hidden`)
- `onMenuClick` prop으로 사이드바 토글

### Sidebar.jsx
- 모바일: 기본 숨김 (`-translate-x-full`) → 햄버거 클릭 시 슬라이드인
- 배경 오버레이 클릭으로 닫기
- 필터 항목 선택 시 자동으로 사이드바 닫힘 (`onClose` 콜백)
- 데스크탑(`md:`): 기존 고정 사이드바 유지

### DetailPanel.jsx
- 모바일: 하단 바텀시트로 표시 (드래그 핸들 + 최대 85vh, 배경 오버레이 터치로 닫기)
- 데스크탑: 우측 고정 패널 유지 (변경 없음)

### App.jsx
- `sidebarOpen` 상태 관리 → Header와 Sidebar에 prop으로 전달

---

## 커밋 히스토리

| 커밋 | 내용 |
|---|---|
| `b644a44` | Initial commit: React + Vite To-Do app with Supabase auth and GitHub Pages deploy |
| `a9f4edb` | fix: GitHub Pages SPA routing |
| `ffeb781` | fix: prevent blank page when Supabase env vars missing |
| `9c138be` | fix: set emailRedirectTo dynamically for Supabase signup confirmation |
| `10ec588` | fix: auth security hardening and responsive layout for mobile |

---

## 미완료 / 후속 작업

- [ ] Supabase 대시보드 Site URL 변경 (사용자 직접 수행 필요)
- [ ] GitHub Repository Secrets 등록 확인
- [ ] GitHub Pages 소스 브랜치를 `gh-pages`로 설정 확인
- [ ] 모바일 실기기 UI 검증
