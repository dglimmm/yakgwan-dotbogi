# ─────────────────────────────────────────────
# 1단계(builder): Next.js 프로젝트를 "빌드"만 하는 단계
#   - 여기서 만든 결과물 중 필요한 것만 2단계로 복사해감
# ─────────────────────────────────────────────
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# package.json만 먼저 복사해서 의존성 설치 (소스코드 바뀔 때마다 npm install 다시 안 하려는 캐싱 트릭)
COPY package*.json ./
RUN npm ci

# NEXT_PUBLIC_* 값은 빌드 시점에 코드에 박히기 때문에, 빌드 명령 실행 전에 반드시 주입해야 함
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

# 나머지 소스코드 복사 후 빌드
COPY . .
RUN npm run build

# ─────────────────────────────────────────────
# 2단계(runner): 실제로 서버에서 "실행"만 담당하는 단계
#   - builder 단계의 결과물 중 꼭 필요한 파일만 가져옴 (이미지 용량이 훨씬 작아짐)
# ─────────────────────────────────────────────
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# next.config.ts에 output: 'standalone' 설정이 되어있어야 아래 경로들이 생성됩니다.
# (현재 프로젝트에는 public 폴더가 없어서 복사 대상에서 제외함. 나중에 public 폴더가 생기면 아래 줄을 추가할 것)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
