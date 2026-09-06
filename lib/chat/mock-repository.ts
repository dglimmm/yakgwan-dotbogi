import type { ChatRepository } from "./repository";
import type { ChatMessage, ChatUsage } from "@/lib/types/database";

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "chat-msg-1",
    user_id: "mock-user",
    role: "assistant",
    content: "안녕하세요! 오늘 기분은 어떠신가요?",
    created_at: "2026-09-06T00:00:00.000Z",
  },
  {
    id: "chat-msg-2",
    user_id: "mock-user",
    role: "user",
    content: "오늘은 날씨가 좋아서 공원에 산책을 다녀왔어요.",
    created_at: "2026-09-06T00:01:00.000Z",
  },
  {
    id: "chat-msg-3",
    user_id: "mock-user",
    role: "assistant",
    content: "정말 좋으셨겠어요! 산책하시면서 무엇이 가장 기억에 남으셨나요?",
    created_at: "2026-09-06T00:01:30.000Z",
  },
];

function buildMockUsage(userId: string, usageDate: string): ChatUsage {
  return {
    id: `chat-usage-${usageDate}`,
    user_id: userId,
    usage_date: usageDate,
    free_used_count: 1,
    ad_unlock_count: 0,
  };
}

export const mockChatRepository: ChatRepository = {
  async getUsage(userId, usageDate) {
    return buildMockUsage(userId, usageDate);
  },
  async incrementUsage(userId, usageDate, field, by = 1) {
    const usage = buildMockUsage(userId, usageDate);
    usage[field] += by;
    return usage;
  },
  async saveMessage(message) {
    const saved: ChatMessage = {
      ...message,
      id: `chat-msg-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return saved;
  },
  async getMessages() {
    return MOCK_MESSAGES;
  },
};
