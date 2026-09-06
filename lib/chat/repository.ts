import type { ChatMessage, ChatUsage } from "@/lib/types/database";

/**
 * 챗봇 이용 현황(chat_usage)과 대화 로그(chat_messages) 접근 인터페이스.
 * 구현은 Phase 7 Task 019/020에서 Supabase 클라이언트로 채운다.
 * 이용권 소비/부여는 서버 측 구현에서만 결정한다(클라이언트 조작 방지, shrimp-rules.md §7).
 */
export interface ChatRepository {
  getUsage(userId: string, usageDate: string): Promise<ChatUsage | null>;
  incrementUsage(
    userId: string,
    usageDate: string,
    field: "free_used_count" | "ad_unlock_count",
    by?: number,
  ): Promise<ChatUsage>;
  saveMessage(
    message: Omit<ChatMessage, "id" | "created_at">,
  ): Promise<ChatMessage>;
  getMessages(userId: string): Promise<ChatMessage[]>;
}
