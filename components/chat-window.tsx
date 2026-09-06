"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { mockChatRepository } from "@/lib/chat/mock-repository";
import type { ChatMessage } from "@/lib/types/database";

const MOCK_USER_ID = "mock-user";
const TODAY = "2026-09-06";
const DAILY_FREE_LIMIT = 1;

export function ChatWindow({
  initialMessages,
  initialFreeUsedCount,
}: {
  initialMessages: ChatMessage[];
  initialFreeUsedCount: number;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [freeUsedCount, setFreeUsedCount] = useState(initialFreeUsedCount);
  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const remainingFreeCount = Math.max(0, DAILY_FREE_LIMIT - freeUsedCount);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || isSending) return;

    if (remainingFreeCount <= 0) {
      setIsLimitDialogOpen(true);
      return;
    }

    setIsSending(true);
    setInput("");

    const userMessage = await mockChatRepository.saveMessage({
      user_id: MOCK_USER_ID,
      role: "user",
      content,
    });
    setMessages((prev) => [...prev, userMessage]);

    const usage = await mockChatRepository.incrementUsage(
      MOCK_USER_ID,
      TODAY,
      "free_used_count",
    );
    setFreeUsedCount(usage.free_used_count);

    const assistantMessage = await mockChatRepository.saveMessage({
      user_id: MOCK_USER_ID,
      role: "assistant",
      content:
        "말씀 감사해요. 실제 대화 연동은 준비 중이니 조금만 기다려 주세요.",
    });
    setMessages((prev) => [...prev, assistantMessage]);
    setIsSending(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground"
        >
          {remainingFreeCount}
        </div>
        <p className="text-lg font-semibold">
          오늘 남은 무료 대화 횟수 {remainingFreeCount}회
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[80%] rounded-xl px-4 py-3 text-lg",
                message.role === "assistant"
                  ? "self-start bg-secondary text-secondary-foreground"
                  : "self-end bg-primary text-primary-foreground",
              )}
            >
              {message.content}
            </div>
          ))}
        </CardContent>
      </Card>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSend();
        }}
        className="flex gap-3"
      >
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="말벗 챗봇에게 하고 싶은 말을 적어주세요"
          aria-label="챗봇에게 보낼 메시지"
        />
        <Button type="submit" size="lg" disabled={isSending}>
          보내기
        </Button>
      </form>

      <Dialog open={isLimitDialogOpen} onOpenChange={setIsLimitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>오늘의 무료 대화를 모두 사용하셨어요</DialogTitle>
            <DialogDescription>
              광고를 시청하시면 대화를 더 이어가실 수 있어요. (광고 연동은
              준비 중입니다)
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsLimitDialogOpen(false)}
            >
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
