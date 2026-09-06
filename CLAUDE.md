# 🤖 Claude Code 개발 지침

**손주야놀자**는 비로그인 컨텐츠 허브(두뇌 건강 퀴즈·두뇌 게임·건강 상식·유튜브 랭킹·날씨운세)와 AI 말벗 챗봇으로 고령층 사용자의 재방문을 유도하는 서비스입니다.

📋 상세 프로젝트 요구사항은 [docs/PRD.md](./docs/PRD.md) 참조

## 🛠️ 핵심 기술 스택

- Next.js (App Router) + TypeScript + React 19
- TailwindCSS + shadcn/ui + Radix UI
- Supabase (Auth, PostgreSQL)
- Claude API(Anthropic) — 말벗 챗봇 및 배치 콘텐츠 생성
- Docker → Docker Hub → 오라클 클라우드 k3s 배포

## 📐 개발 규칙

- 기존 `app/auth/*`의 Supabase Auth 화면(로그인/회원가입/비밀번호 찾기/변경)은 그대로 재사용하고, 신규 인증 시스템을 만들지 않는다.
- 접근성 하한선(본문 16pt 이상, 색상 대비 7:1 이상, 터치 영역 44x44px 이상, 아이콘 단독 사용 금지)은 타협하지 않는다. 자세한 기준은 PRD의 "UI/UX 요구사항" 참조.
- 건강 상식 등 정보성 콘텐츠는 단정적 진단/처방 표현을 금지하고 참고용 안내 문구를 포함한다.
- UI 컴포넌트와 비즈니스 로직(챗봇 세션 관리, 이용 횟수 카운트, 채점 로직 등)을 분리하고, Supabase 클라이언트는 화면 컴포넌트에서 직접 호출하기보다 데이터 레이어로 감싸 향후 네이티브 앱 확장에 대비한다.
