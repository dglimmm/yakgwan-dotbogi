"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuizSetType } from "@/lib/types/database";

const QUIZ_TYPES: {
  type: QuizSetType;
  title: string;
  description: string;
}[] = [
  {
    type: "song",
    title: "노래 맞추기",
    description: "귀에 익은 옛 노래의 가사를 맞혀보세요.",
  },
  {
    type: "trivia",
    title: "상식 퀴즈",
    description: "생활 속 상식 문제를 풀어보세요.",
  },
  {
    type: "memory",
    title: "기억력 게임",
    description: "짧게 보여드린 단어를 기억해보세요.",
  },
];

export function QuizTypeSelector() {
  const [selectedType, setSelectedType] = useState<QuizSetType>("trivia");
  const current = QUIZ_TYPES.find((quizType) => quizType.type === selectedType)!;

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="퀴즈 유형 선택" className="flex gap-6 border-b">
        {QUIZ_TYPES.map((quizType) => {
          const isActive = quizType.type === selectedType;
          return (
            <button
              key={quizType.type}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedType(quizType.type)}
              className={cn(
                "min-h-11 border-b-2 px-1 text-lg font-semibold transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {quizType.title}
            </button>
          );
        })}
      </div>

      <p className="text-lg">{current.description}</p>

      <Button asChild size="lg" className="w-fit">
        <Link href={`/quiz/play/${current.type}`}>{current.title} 시작하기</Link>
      </Button>
    </div>
  );
}
