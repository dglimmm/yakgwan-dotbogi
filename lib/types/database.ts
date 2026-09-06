/**
 * PRD "데이터 모델" 절(docs/PRD.md)에 대응하는 테이블 타입 정의.
 * Supabase 마이그레이션(lib 형제 디렉토리 supabase/migrations)의 컬럼과 1:1 대응해야 한다.
 */

export type FontScale = "보통" | "크게" | "아주크게";

export interface Profile {
  id: string; // auth.users.id
  font_scale: FontScale;
  high_contrast: boolean;
  created_at: string;
}

export interface DailyContent {
  id: string;
  date: string;
  weather_summary: string;
  fortune_text: string;
  generated_at: string;
}

export type HealthTipCategory = "계절건강" | "스트레칭" | "영양" | string;

export interface HealthTip {
  id: string;
  date: string;
  category: HealthTipCategory;
  title: string;
  content: string;
  generated_at: string;
}

export interface YoutubeRanking {
  id: string;
  category: string;
  rank: number;
  video_id: string;
  title: string;
  thumbnail_url: string;
  view_count: number;
  fetched_at: string;
}

export interface ChatUsage {
  id: string;
  user_id: string; // -> profiles.id
  usage_date: string;
  free_used_count: number;
  ad_unlock_count: number;
}

export type ChatMessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  user_id: string; // -> profiles.id
  role: ChatMessageRole;
  content: string;
  created_at: string;
}

export type QuizSetType = "song" | "trivia" | "memory";

export interface QuizSet {
  id: string;
  date: string;
  type: QuizSetType;
  questions: unknown; // 상세 구조는 lib/types/quiz.ts의 QuizQuestion[] 참고
}

export interface QuizAttempt {
  id: string;
  user_id: string | null; // 비로그인 응시 허용
  quiz_set_id: string; // -> quiz_sets.id
  score: number;
  completed_at: string;
}

export type GameType = "card_matching" | "schulte_table";

export interface BrainGameAttempt {
  id: string;
  user_id: string | null; // 비로그인 플레이 허용
  game_type: GameType;
  result_value: number; // 소요시간(초) 또는 성공 여부
  completed_at: string;
}

export type SubscriptionStatus = "active" | "canceled" | "expired";

export interface Subscription {
  id: string;
  user_id: string; // -> profiles.id
  status: SubscriptionStatus;
  started_at: string;
  expires_at: string;
}
