import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuizTypeSelector } from "@/components/quiz-type-selector";

export default function QuizPage() {
  return (
    <main className="flex-1 w-full max-w-5xl flex flex-col gap-8 p-5">
      <h1 className="text-2xl font-semibold">두뇌 건강 퀴즈</h1>
      <p className="text-lg text-muted-foreground">
        원하는 퀴즈 유형을 선택해주세요.
      </p>

      <QuizTypeSelector />

      <Button asChild variant="outline" size="lg" className="w-fit">
        <Link href="/">홈으로</Link>
      </Button>
    </main>
  );
}
