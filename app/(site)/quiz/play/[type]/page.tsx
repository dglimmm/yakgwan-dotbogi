import { Suspense } from "react";
import { notFound } from "next/navigation";
import { mockQuizRepository } from "@/lib/quiz/mock-repository";
import { QuizPlayer } from "@/components/quiz-player";
import type { QuizSetType } from "@/lib/types/database";
import type { QuizQuestion } from "@/lib/types/quiz";

const VALID_TYPES: QuizSetType[] = ["song", "trivia", "memory"];
const TODAY = "2026-09-06";

async function QuizPlayBody({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (!VALID_TYPES.includes(type as QuizSetType)) {
    notFound();
  }

  const quizSet = await mockQuizRepository.getTodayQuizSet(
    type as QuizSetType,
    TODAY,
  );

  if (!quizSet) {
    notFound();
  }

  return (
    <QuizPlayer
      quizSetId={quizSet.id}
      questions={quizSet.questions as QuizQuestion[]}
    />
  );
}

export default function QuizPlayPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  return (
    <main className="flex-1 w-full max-w-5xl flex flex-col gap-8 p-5">
      <Suspense
        fallback={<p className="text-lg">문제를 불러오는 중입니다...</p>}
      >
        <QuizPlayBody params={params} />
      </Suspense>
    </main>
  );
}
