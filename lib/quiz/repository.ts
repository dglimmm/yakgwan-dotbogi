import type { QuizAttempt, QuizSet, QuizSetType } from "@/lib/types/database";

/**
 * 퀴즈 세트 조회 및 응시 기록 저장 인터페이스.
 * 구현은 Phase 5 Task 013/014에서 Supabase 클라이언트로 채운다.
 */
export interface QuizRepository {
  getTodayQuizSet(type: QuizSetType, date: string): Promise<QuizSet | null>;
  saveAttempt(
    attempt: Omit<QuizAttempt, "id" | "completed_at">,
  ): Promise<QuizAttempt>;
}
