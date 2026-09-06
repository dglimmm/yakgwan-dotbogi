-- ⚠️ 이 SQL은 아직 Supabase 프로젝트에 적용되지 않았습니다.
-- Supabase CLI(`supabase db push`) 또는 대시보드 SQL Editor에서 프로젝트 소유자가 직접 적용하세요.
-- 이 저장소에는 Supabase 프로젝트 자격 증명이 없어 AI가 원격으로 적용할 수 없습니다.
--
-- docs/PRD.md "데이터 모델" 절 기준 초기 스키마. 컬럼은 lib/types/database.ts와 1:1로 대응한다.

create extension if not exists pgcrypto;

-- ============================================================
-- 1. profiles (사용자 프로필, Supabase Auth 확장)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  font_scale text not null default '보통' check (font_scale in ('보통', '크게', '아주크게')),
  high_contrast boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- auth.users에 가입하면 profiles를 자동 생성하는 트리거.
-- security definer로 실행되어 RLS와 무관하게 삽입할 수 있다.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. daily_contents (공용 배치 생성 콘텐츠: 날씨/운세)
-- ============================================================
create table public.daily_contents (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  weather_summary text not null,
  fortune_text text not null,
  generated_at timestamptz not null default now()
);

create index daily_contents_date_idx on public.daily_contents (date);

alter table public.daily_contents enable row level security;

create policy "daily_contents_select_all"
  on public.daily_contents for select
  using (true);

-- ============================================================
-- 3. health_tips (건강 상식 카드, 하루 1회 배치 생성)
-- ============================================================
create table public.health_tips (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  category text not null,
  title text not null,
  content text not null,
  generated_at timestamptz not null default now()
);

create index health_tips_date_idx on public.health_tips (date);

alter table public.health_tips enable row level security;

create policy "health_tips_select_all"
  on public.health_tips for select
  using (true);

-- ============================================================
-- 4. youtube_rankings (어르신 인기 유튜브 시청 순위 캐시)
-- ============================================================
create table public.youtube_rankings (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  rank integer not null,
  video_id text not null,
  title text not null,
  thumbnail_url text not null,
  view_count bigint not null,
  fetched_at timestamptz not null default now()
);

create index youtube_rankings_fetched_at_idx on public.youtube_rankings (fetched_at);

alter table public.youtube_rankings enable row level security;

create policy "youtube_rankings_select_all"
  on public.youtube_rankings for select
  using (true);

-- ============================================================
-- 5. chat_usage (챗봇 이용 현황, 단계형 로직 판단 기준)
-- ============================================================
create table public.chat_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  usage_date date not null,
  free_used_count integer not null default 0,
  ad_unlock_count integer not null default 0,
  unique (user_id, usage_date)
);

alter table public.chat_usage enable row level security;

create policy "chat_usage_all_own"
  on public.chat_usage for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- 6. chat_messages (챗봇 대화 로그)
-- ============================================================
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

create policy "chat_messages_all_own"
  on public.chat_messages for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- 7. quiz_sets (하루 1회 배치 생성된 공용 퀴즈 세트)
-- ============================================================
create table public.quiz_sets (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  type text not null check (type in ('song', 'trivia', 'memory')),
  questions jsonb not null,
  unique (date, type)
);

create index quiz_sets_date_idx on public.quiz_sets (date);

alter table public.quiz_sets enable row level security;

create policy "quiz_sets_select_all"
  on public.quiz_sets for select
  using (true);

-- ============================================================
-- 8. quiz_attempts (퀴즈 응시 기록, 비로그인 허용)
-- ============================================================
create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  quiz_set_id uuid not null references public.quiz_sets (id) on delete cascade,
  score integer not null,
  completed_at timestamptz not null default now()
);

alter table public.quiz_attempts enable row level security;

-- 비로그인(user_id is null) 또는 본인 명의로만 기록을 남길 수 있다.
create policy "quiz_attempts_insert"
  on public.quiz_attempts for insert
  with check (user_id is null or auth.uid() = user_id);

-- 비로그인 사용자는 자기 기록을 조회할 수단이 없으므로, 조회는 로그인한 본인 기록만 허용한다.
create policy "quiz_attempts_select_own"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

-- ============================================================
-- 9. brain_game_attempts (두뇌 게임 플레이 기록, 비로그인 허용)
-- ============================================================
create table public.brain_game_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  game_type text not null check (game_type in ('card_matching', 'schulte_table')),
  result_value integer not null,
  completed_at timestamptz not null default now()
);

alter table public.brain_game_attempts enable row level security;

create policy "brain_game_attempts_insert"
  on public.brain_game_attempts for insert
  with check (user_id is null or auth.uid() = user_id);

create policy "brain_game_attempts_select_own"
  on public.brain_game_attempts for select
  using (auth.uid() = user_id);

-- ============================================================
-- 10. subscriptions (구독 정보)
-- ============================================================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null check (status in ('active', 'canceled', 'expired')),
  started_at timestamptz not null,
  expires_at timestamptz not null
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_all_own"
  on public.subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
