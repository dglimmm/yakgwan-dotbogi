"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { supabaseGameRepository } from "@/lib/games/supabase-repository";
import { buildCardDeck, isMatch } from "@/lib/games/logic";

const SYMBOLS = ["사과", "바나나", "포도", "딸기", "수박", "복숭아"];

export function CardMatchingGame() {
  // 덱은 Math.random으로 섞이므로 서버 렌더 결과와 달라질 수 있다.
  // 마운트 이후에만 생성해 hydration mismatch를 피한다.
  const [deck, setDeck] = useState<ReturnType<typeof buildCardDeck>>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDeck(buildCardDeck(SYMBOLS));
  }, []);

  const isComplete = deck.length > 0 && matchedIds.length === deck.length;

  useEffect(() => {
    if (isComplete) return;
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [isComplete, startedAt]);

  useEffect(() => {
    if (flippedIds.length !== 2) return;
    const [firstId, secondId] = flippedIds;
    const first = deck.find((card) => card.id === firstId);
    const second = deck.find((card) => card.id === secondId);
    setMoves((prev) => prev + 1);

    const timeout = setTimeout(() => {
      if (first && second && isMatch(first, second)) {
        setMatchedIds((prev) => [...prev, firstId, secondId]);
      }
      setFlippedIds([]);
    }, 600);
    return () => clearTimeout(timeout);
  }, [flippedIds, deck]);

  useEffect(() => {
    if (!isComplete || saved) return;
    setSaved(true);
    // 기록 저장은 완료 화면 표시에 필요하지 않은 부가 동작이므로 실패해도 UI를 막지 않는다.
    supabaseGameRepository
      .saveAttempt({
        user_id: null,
        game_type: "card_matching",
        result_value: elapsedSeconds,
      })
      .catch((error) => {
        console.warn("두뇌 게임 기록 저장 실패:", error);
      });
    // elapsedSeconds가 바뀌어도 완료 시점 값 한 번만 저장하면 되므로 의존성에서 제외한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, saved]);

  const handleFlip = (id: number) => {
    if (flippedIds.length === 2) return;
    if (flippedIds.includes(id) || matchedIds.includes(id)) return;
    setFlippedIds((prev) => [...prev, id]);
  };

  const handleRestart = () => {
    setDeck(buildCardDeck(SYMBOLS));
    setFlippedIds([]);
    setMatchedIds([]);
    setMoves(0);
    setStartedAt(Date.now());
    setElapsedSeconds(0);
    setSaved(false);
  };

  if (deck.length === 0) {
    return <p className="text-lg font-semibold">게임을 준비하는 중입니다...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-lg font-semibold">시도 횟수 {moves}회</p>
        <p className="text-lg font-semibold text-primary">
          경과 시간 {elapsedSeconds}초
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {deck.map((card) => {
          const isFaceUp =
            flippedIds.includes(card.id) || matchedIds.includes(card.id);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleFlip(card.id)}
              disabled={isFaceUp}
              aria-label={isFaceUp ? card.symbol : "카드 뒤집기"}
              className={cn(
                "flex h-20 min-w-11 items-center justify-center rounded-md border-2 text-lg font-semibold transition-colors sm:h-24",
                isFaceUp
                  ? "border-primary bg-primary/10"
                  : "border-border bg-secondary hover:border-primary",
              )}
            >
              {isFaceUp ? card.symbol : "?"}
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
                총 {moves}번 만에 모든 짝을 맞췄어요.
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
