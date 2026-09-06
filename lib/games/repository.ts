import type { BrainGameAttempt } from "@/lib/types/database";

/** 두뇌 게임 플레이 기록 저장 인터페이스. 구현체: lib/games/supabase-repository.ts */
export interface GameRepository {
  saveAttempt(
    attempt: Omit<BrainGameAttempt, "id" | "completed_at">,
  ): Promise<BrainGameAttempt>;
}
