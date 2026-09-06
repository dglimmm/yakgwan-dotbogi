import { mockChatRepository } from "@/lib/chat/mock-repository";
import { ChatWindow } from "@/components/chat-window";

const MOCK_USER_ID = "mock-user";
const TODAY = "2026-09-06";

export default async function ChatPage() {
  const [messages, usage] = await Promise.all([
    mockChatRepository.getMessages(MOCK_USER_ID),
    mockChatRepository.getUsage(MOCK_USER_ID, TODAY),
  ]);

  return (
    <main className="flex-1 w-full max-w-5xl flex flex-col gap-8 p-5">
      <h1 className="text-2xl font-semibold">말벗 챗봇</h1>
      <ChatWindow
        initialMessages={messages}
        initialFreeUsedCount={usage?.free_used_count ?? 0}
      />
    </main>
  );
}
