import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function getEncouragement(score: number, total: number) {
  const ratio = total > 0 ? score / total : 0;
  if (ratio === 1) return "모든 문제를 맞히셨어요! 정말 대단하세요.";
  if (ratio >= 0.6) return "아주 잘하셨어요! 다음에도 좋은 결과가 있을 거예요.";
  return "오늘도 두뇌를 움직여 주셔서 감사해요. 내일 또 도전해보세요.";
}

async function QuizResultBody({
  searchParams,
}: {
  searchParams: Promise<{ score?: string; total?: string }>;
}) {
  const params = await searchParams;
  const score = Number(params.score ?? 0);
  const total = Number(params.total ?? 5);

  return (
    <Card className="w-fit">
      <CardHeader className="flex flex-row items-center gap-4">
        <div
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground"
        >
          {score}/{total}
        </div>
        <div>
          <CardTitle className="text-xl">맞힌 문제 수</CardTitle>
          <p className="text-base text-muted-foreground">
            오늘의 두뇌 건강 퀴즈 결과
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg">{getEncouragement(score, total)}</p>
      </CardContent>
    </Card>
  );
}

export default function QuizResultPage({
  searchParams,
}: {
  searchParams: Promise<{ score?: string; total?: string }>;
}) {
  return (
    <main className="flex-1 w-full max-w-5xl flex flex-col gap-8 p-5">
      <h1 className="text-2xl font-semibold">퀴즈 결과</h1>

      <Suspense
        fallback={<p className="text-lg">결과를 불러오는 중입니다...</p>}
      >
        <QuizResultBody searchParams={searchParams} />
      </Suspense>

      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/quiz">다시 하기</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">홈으로</Link>
        </Button>
      </div>
    </main>
  );
}
