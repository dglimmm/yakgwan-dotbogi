# AI Agent 개발 규칙 — 손주야놀자

> 이 문서는 AI 코딩 에이전트 전용 운영 규칙이다. 일반적인 Next.js/TypeScript/Tailwind 지식은 다루지 않는다.
> 상세 기능 명세는 `docs/PRD.md`, 상위 개발 계획은 `ROADMAP.md`를 반드시 함께 참조한다.

## 1. 프로젝트 개요

- 서비스명 **손주야놀자**: 비로그인 컨텐츠 허브(두뇌 건강 퀴즈·두뇌 게임·건강 상식·유튜브 랭킹·날씨운세) + AI 말벗 챗봇으로 60대 이상 고령층의 재방문을 유도.
- 기존 "약관 돋보기"(보험약관 요약 서비스) 코드베이스를 재활용해 시작한 프로젝트다. Git 히스토리·Docker 이미지명·k8s 리소스명 등에 그 흔적(`terms-app`)이 남아 있으며, 이는 의도된 잔재이지 버그가 아니다. §6 참조.
- 기능 ID(F001~F015)는 `docs/PRD.md`의 표와 그대로 대응한다. 새 기능을 구현할 때는 대응하는 F-ID를 커밋 메시지나 태스크 설명에 명시한다.
- 현재 단계: 스타터킷 정리 + 인증 화면 재사용 준비만 완료된 상태이며, F001~F015 기능은 전부 미구현이다(`ROADMAP.md` "현재 상태" 절 참조).

## 2. 라우팅 및 인증 미들웨어 — 반드시 세트로 관리

**이 프로젝트는 표준 Next.js 관례인 `middleware.ts`/`middleware()`를 쓰지 않는다.** 파일명과 함수명이 다음과 같이 고정되어 있다.

| 파일 | 역할 |
|---|---|
| `proxy.ts` (루트) | `export async function proxy(request)` — `lib/supabase/proxy.ts`의 `updateSession`을 호출하는 진입점. `config.matcher`로 정적 자산 경로 제외 |
| `lib/supabase/proxy.ts` | 실제 세션 갱신 로직 + `PROTECTED_PATH_PREFIXES` 화이트리스트 |

- **금지**: `middleware.ts` 파일을 새로 만들거나 `proxy.ts`를 `middleware.ts`로 리네이밍하는 것. 일반적인 Next.js 지식을 근거로 되돌리지 않는다.
- 인증이 필요한 라우트는 `lib/supabase/proxy.ts`의 `PROTECTED_PATH_PREFIXES` 배열(현재 `/chat`, `/mypage`, `/subscribe`)로만 결정한다.
  - 로그인 필요한 신규 라우트(예: 챗봇 하위 페이지, 구독 관련 페이지)를 추가하면 **이 배열도 같은 커밋에서 함께 갱신**한다.
  - 이 배열에 없는 모든 경로는 PRD 정책상 비로그인으로 접근 가능해야 한다 — 새 라우트를 이 배열에 무심코 추가해 비로그인 접근 가능 콘텐츠(홈/퀴즈/게임/건강상식/유튜브랭킹)를 막지 않는다.
- 로그인 리디렉션은 `?redirect=` 쿼리로 원래 경로를 보존한다(`app/auth/login`이 이를 읽어 로그인 후 복귀시키는 방식과 짝을 이룬다). 리디렉션 로직을 바꿀 때는 로그인 페이지 쪽 리디렉션 처리 여부도 함께 확인한다.
- `app/auth/*` (로그인/회원가입/비밀번호 찾기·변경/에러) 화면은 기존 Supabase Auth 스캐폴딩을 그대로 재사용한다. **새 인증 시스템·새 로그인 폼을 만들지 않는다.** 수정이 필요하면 기존 파일을 고친다.

## 3. 아키텍처 — 라우트/데이터 레이어 배치 규칙

- PRD/ROADMAP Phase 1 기준 라우트 스캐폴딩 목표: `/`, `/quiz`, `/quiz/play/[type]`, `/quiz/result`, `/games`, `/games/play/[type]`, `/chat`, `/mypage`, `/subscribe` + 기존 `/auth/*`. 새 페이지를 추가할 때 이 라우트 명명 규칙(복수형 없음: `quiz`/`games` 표기 그대로, 동적 세그먼트는 `[type]`)을 따른다.
- **Supabase 클라이언트를 화면 컴포넌트(`app/**/page.tsx`, `components/*.tsx`)에서 직접 `createClient()` 호출해 쿼리하지 않는다.** 도메인별 데이터 접근 함수를 `lib/` 하위(예: `lib/quiz/`, `lib/chat/`, `lib/subscription/`)에 두고, 컴포넌트는 그 함수만 호출한다. 이는 향후 네이티브 앱에서 동일 레이어 재사용을 위한 PRD 필수 요구사항이다.
  - 예외: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/proxy.ts` 자체는 Supabase SDK 초기화 전용이므로 이 규칙의 대상이 아니다.
- 챗봇 세션 관리, 이용 횟수 카운트(`chat_usage`), 퀴즈/게임 채점 로직은 UI 컴포넌트 안에 인라인으로 작성하지 않고 별도 모듈로 분리한다.
- 접근성 설정값(글자 크기 단계, 고대비 모드)은 `localStorage` 등 클라이언트 로컬 상태가 아니라 `profiles` 테이블(사용자 프로필 데이터)에 저장한다 — 플랫폼 간 동기화 요구사항(PRD Open Question 3) 때문이다.

## 4. UI 컴포넌트 규칙

- shadcn/ui 설정은 `components.json`에 고정되어 있다: `style: new-york`, `baseColor: neutral`, `cssVariables: true`, prefix 없음, alias `@/components`, `@/components/ui`, `@/lib`, `@/hooks`. 새 UI 프리미티브를 추가할 때 이 alias 경로를 따르고 임의의 다른 디렉토리 구조를 만들지 않는다.
- 아이콘 라이브러리는 `lucide-react`로 고정(`components.json`의 `iconLibrary`). 다른 아이콘 패키지를 새로 추가하지 않는다.
- Tailwind는 v3 계열(`tailwindcss ^3.4.1`, `tailwind.config.ts` 기반, `tailwindcss-animate` 플러그인 사용)이다. Tailwind v4 문법(`@theme`, CSS-first config 등)을 임의로 도입하지 않는다.

### 접근성 하한선 (모든 UI 구현에서 타협 불가, `docs/PRD.md` "UI/UX 요구사항" 참조)

새 화면/컴포넌트를 만들거나 기존 화면을 수정할 때마다 아래를 체크한다:

- 본문 텍스트 16pt 이상, 챗봇 메시지·퀴즈/게임 문제·건강 상식 카드 제목 등 핵심 정보는 20pt 이상, `line-height` 1.6배 이상.
- 텍스트/배경, 버튼/배경 색상 대비 **7:1 이상**(WCAG AA의 4.5:1이 아님 — 더 엄격한 기준 적용).
- 버튼 등 터치 영역 최소 44x44px, 버튼 간 여백 확보.
- 아이콘 단독 사용 금지 — 반드시 텍스트 라벨을 병기한다.
- 헤더 메뉴는 4개 이내로 유지, 다차원 표/그리드 레이아웃은 원칙적으로 배제.
  - 예외: 두뇌 게임(카드 매칭, 슐테 표)의 격자형 UI는 게임 특성상 허용하되, 각 셀이 44x44px 이상을 확보하도록 그리드 크기를 제한한다(슐테 표는 4x4 또는 5x5까지만).
- 마이페이지 글자 크기 설정의 "보통" 단계도 위 하한선을 만족해야 한다(더 큰 단계만 하한선을 지키는 것은 불허).

## 5. 콘텐츠/카피 규칙 (법적 리스크 방지)

- 건강 상식 카드, AI 격려 코멘트, 챗봇 응답 등 건강·의료 관련 텍스트에서 **단정적 진단·처방 표현을 금지**한다.
  - 금지 예: "~하면 낫습니다", "~병입니다", "~을 복용하세요" 식의 단정적 지시/진단 문구.
  - 허용 예: "~에 도움이 될 수 있어요", "전문가와 상담해보세요" 같은 참고용 안내 문구를 포함.
- 이 원칙은 프로젝트가 재활용한 이전 "약관 돋보기" 서비스가 보험업법상 단정적 답변 리스크로 폐기된 것과 동일한 기준이므로, 새 카피를 작성할 때마다 재확인한다.

## 6. 인프라/배포 — 레거시 명칭과 플랫폼 고정값

- Docker 이미지명, GitHub Actions 워크플로우(`.github/workflows/deploy.yml`)의 시크릿 참조, k3s `deployment/terms-app`, 루트의 `terms-app-deployment.yaml`/`terms-app-secret.yaml`은 모두 이전 프로젝트명 `terms-app`을 그대로 쓴다.
  - 서비스명이 "손주야놀자"로 바뀌었다는 이유로 이 리소스명들을 임의로 리네이밍하지 않는다. 리네이밍은 Docker Hub 레포·k3s 시크릿·kubectl 배포 대상이 모두 함께 바뀌어야 하는 별도의 인프라 마이그레이션 작업이며, 사용자가 명시적으로 요청했을 때만 진행한다.
- CI(`docker/build-push-action`)는 `platforms: linux/arm64`로 명시 고정되어 있다(오라클 클라우드 k3s 워커가 ARM64이기 때문). 이 플랫폼 지정을 제거하거나 `linux/amd64`로 되돌리지 않는다.
- `next.config.ts`의 `output: "standalone"`은 `Dockerfile`의 `COPY --from=builder /app/.next/standalone` 단계와 직결된다. 이 옵션을 제거하면 Docker 빌드가 깨지므로 유지한다. `cacheComponents: true`도 유지한다.
- `Dockerfile`은 빌드 시점에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`를 `ARG`/`ENV`로 주입받는다. `NEXT_PUBLIC_*` 환경변수를 새로 추가할 경우 `Dockerfile`의 `ARG`/`ENV` 선언과 `.github/workflows/deploy.yml`의 `build-args`에도 동일한 이름으로 추가해야 빌드 결과물에 반영된다.

## 7. 정책 미확정 항목 (PRD "Open Questions" / ROADMAP "Phase 0")

다음 항목은 `docs/PRD.md`와 `ROADMAP.md` Phase 0 표에 "확정 필요"로 명시되어 있고, 아직 값이 정해지지 않았다:

- 챗봇 광고 1회 시청당 부여 이용권 횟수, 2회차 이후 매번 광고 필요 여부
- "하루" 기준(캘린더 데이 자정 vs 마지막 접속 후 24시간)
- 리워드 영상광고 SDK/네트워크, 구독 결제 PG사
- 건강 상식 카드 생성 방식(Claude 완전 자동 생성 vs 사전 큐레이션 풀) 및 문구 검수 프로세스
- 유튜브 큐레이션 기준 카테고리/키워드, YouTube Data API 배치 주기·캐싱 유효기간
- F001~F008(홈 콘텐츠 허브)을 계속 무료로 유지할지 여부

**AI는 이 값들을 임의로 확정하거나 하드코딩하지 않는다.** 위 항목과 직결된 작업(챗봇 이용 제한 로직, 광고/구독 연동, 건강 상식·유튜브 배치 파이프라인)을 요청받으면, 먼저 해당 정책이 확정되었는지 사용자에게 확인한다. 확정되지 않았다면 정책값을 상수/설정으로 분리해 나중에 값만 바꿔 끼울 수 있는 구조로 최소 스캐폴딩만 진행하거나, 확정을 먼저 요청한다.

## 8. 작업 관리 — shrimp-task-manager / ROADMAP.md 역할 분리

- `ROADMAP.md`는 Phase 단위 상위 계획 문서다. Phase/Task 구조를 직접 대규모로 재작성하지 않는다 — 완료 표시(✅)나 소규모 갱신은 `docs:update-roadmap` 스킬 관례를 따른다.
- 실제 세부 작업 분해·진행 상태 추적은 shrimp-task-manager(`plan_task`/`split_tasks`/`execute_task`/`verify_task`)로 수행한다.
- `shrimp_data/`는 shrimp-task-manager의 `DATA_DIR`(`.mcp.json`에 설정됨)이다. 이 디렉토리의 파일을 손으로 직접 편집하지 않는다 — 반드시 shrimp-task-manager 툴을 통해서만 갱신한다.
- API 연동·비즈니스 로직(챗봇, 결제, 채점 등) 작업의 완료 기준에는 Playwright MCP 기반 E2E 테스트 수행을 포함한다(`ROADMAP.md` "개발 워크플로우" 절 참조).

## 9. 금지 사항 요약

- `middleware.ts`/`middleware()` 신규 생성 또는 `proxy.ts`/`proxy()` 리네이밍.
- `app/auth/*` 대체용 신규 인증 화면 생성.
- 화면 컴포넌트에서 Supabase 클라이언트 직접 호출(데이터 레이어 우회).
- `terms-app` 인프라 리소스명 임의 리네이밍.
- CI의 `linux/arm64` 플랫폼 고정, `next.config.ts`의 `output: "standalone"` 제거.
- 접근성 하한선(16pt/20pt, 대비 7:1, 터치 44x44px, 아이콘 단독 사용) 미달 UI 작성.
- 건강/의료 관련 콘텐츠에 단정적 진단·처방 표현 사용.
- PRD Open Questions 항목의 정책값(광고 횟수, 구독가, PG사, 배치 주기 등) 임의 확정.
- `shrimp_data/` 디렉토리 파일 직접 수동 편집.
