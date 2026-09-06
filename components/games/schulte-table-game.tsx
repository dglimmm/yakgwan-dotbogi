"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { supabaseGameRepository } from "@/lib/games/supabase-repository";
import { buildSchulteGrid, isNextInOrder } from "@/lib/games/logic";

const GRID_DIMENSION = 4;
const GRID_SIZE = GRID_DIMENSION * GRID_DIMENSION;

export function SchulteTableGame() {
  // 격자는 Math.random으로 섞이므로 서버 렌더 결과와 달라질 수 있다.
  // 마운트 이후에만 생성해 hydration mismatch를 피한다.
  const [numbers, setNumbers] = useState<number[]>([]);
  const [nextTarget, setNextTarget] = useState(1);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [saved, setSaved] = useState(false);
  const [wrongValue, setWrongValue] = useState<number | null>(null);

  useEffect(() => {
    setNumbers(buildSchulteGrid(GRID_DIMENSION));
  }, []);

  const isComplete = numbers.length > 0 && nextTarget > GRID_SIZE;

  useEffect(() => {
    if (isComplete) return;
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [isComplete, startedAt]);

  useEffect(() => {
    if (!isComplete || saved) return;
    setSaved(true);
    // 기록 저장은 완료 화면 표시에 필요하지 않은 부가 동작이므로 실패해도 UI를 막지 않는다.
    supabaseGameRepository
      .saveAttempt({
        user_id: null,
        game_type: "schulte_table",
        result_value: elapsedSeconds,
      })
      .catch((error) => {
        console.warn("두뇌 게임 기록 저장 실패:", error);
      });
    // elapsedSeconds가 바뀌어도 완료 시점 값 한 번만 저장하면 되므로 의존성에서 제외한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, saved]);

  const handleClick = (value: number) => {
    if (isComplete) return;
    if (isNextInOrder(value, nextTarget)) {
      setNextTarget((prev) => prev + 1);
      setWrongValue(null);
    } else {
      setWrongValue(value);
    }
  };

  const handleRestart = () => {
    setNumbers(buildSchulteGrid(GRID_DIMENSION));
    setNextTarget(1);
    setStartedAt(Date.now());
    setElapsedSeconds(0);
    setSaved(false);
    setWrongValue(null);
  };

  if (numbers.length === 0) {
    return <p className="text-lg font-semibold">게임을 준비하는 중입니다...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-lg font-semibold">
          다음 숫자 {isComplete ? "완료" : nextTarget}
        </p>
        <p className="text-lg font-semibold text-primary">
          경과 시간 {elapsedSeconds}초
        </p>
      </div>

      <div className="grid max-w-md grid-cols-4 gap-3">
        {numbers.map((value) => {
          const isDone = value < nextTarget;
          const isWrong = wrongValue === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleClick(value)}
              disabled={isDone || isComplete}
              aria-label={`숫자 ${value}`}
              className={cn(
                "flex h-16 min-w-11 items-center justify-center rounded-md border-2 text-lg font-semibold transition-colors sm:h-20",
                isDone
                  ? "border-primary bg-primary/10 opacity-50"
                  : "border-border bg-secondary hover:border-primary",
                isWrong && "border-destructive",
              )}
            >
              {value}
            </button>
          );
        })}
      </div>

      {isComplete && (
        <Card className="w-fit">
          <CardHeader className="flex flex-row items-center gap-4">
            <div
              aria-hidden
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground"
            >
              {elapsedSeconds}초
            </div>
            <div>
              <CardTitle className="text-xl">완료했어요!</CardTitle>
              <p className="text-base text-muted-foreground">
                1부터 {GRID_SIZE}까지 순서대로 모두 찾으셨어요.
              </p>
            </div>
          </CardHeader>
        </Card>
      )}

      <div className="flex gap-4">
        <Button size="lg" onClick={handleRestart}>
          다시 하기
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">홈으로</Link>
        </Button>
      </div>
    </div>
  );
}
