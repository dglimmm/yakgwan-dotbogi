"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mockQuizRepository } from "@/lib/quiz/mock-repository";
import type { QuizQuestion } from "@/lib/types/quiz";

export function QuizPlayer({
  quizSetId,
  questions,
}: {
  quizSetId: string;
  questions: QuizQuestion[];
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const hasAnswered = selectedChoiceId !== null;
  const isCorrect = selectedChoiceId === question.answerChoiceId;

  const handleSelect = (choiceId: string) => {
    if (hasAnswered) return;
    setSelectedChoiceId(choiceId);
    if (choiceId === question.answerChoiceId) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = async () => {
    if (!isLast) {
      setIndex((prev) => prev + 1);
      setSelectedChoiceId(null);
      return;
    }

    setIsSaving(true);
    await mockQuizRepository.saveAttempt({
      user_id: null,
      quiz_set_id: quizSetId,
      score,
    });
    router.push(`/quiz/result?score=${score}&total=${questions.length}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          문제 {index + 1} / {questions.length}
        </h1>
        <p className="text-lg font-semibold text-primary">
          맞은 개수 {score}개
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{question.prompt}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {question.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;
            const isAnswerChoice = choice.id === question.answerChoiceId;
            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => handleSelect(choice.id)}
                disabled={hasAnswered}
                className={cn(
                  "min-h-11 rounded-md border-2 px-4 py-3 text-left text-lg transition-colors",
                  !hasAnswered && "border-border hover:border-primary",
                  hasAnswered &&
                    isAnswerChoice &&
                    "border-primary bg-primary/10",
                  hasAnswered &&
                    isSelected &&
                    !isAnswerChoice &&
                    "border-destructive bg-destructive/10",
                  hasAnswered &&
                    !isSelected &&
                    !isAnswerChoice &&
                    "border-border opacity-60",
                )}
              >
                {choice.label}
              </button>
            );
          })}
        </CardContent>
      </Card>

      {hasAnswered && (
        <p className="text-lg font-semibold">
          {isCorrect
            ? "정답입니다!"
            : "아쉬워요, 다음 문제에서 다시 도전해보세요."}
        </p>
      )}

      <Button
        size="lg"
        className="w-fit"
        disabled={!hasAnswered || isSaving}
        onClick={handleNext}
      >
        {isLast ? "결과 보기" : "다음 문제"}
      </Button>
    </div>
  );
}
