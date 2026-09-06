import { createClient } from "@/lib/supabase/client";
import type { GameRepository } from "./repository";
import type { BrainGameAttempt } from "@/lib/types/database";

export const supabaseGameRepository: GameRepository = {
  async saveAttempt(attempt) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("brain_game_attempts")
      .insert({
        user_id: attempt.user_id,
        game_type: attempt.game_type,
        result_value: attempt.result_value,
      })
      .select()
      .single();

    if (error) throw error;
    return data as BrainGameAttempt;
  },
};
