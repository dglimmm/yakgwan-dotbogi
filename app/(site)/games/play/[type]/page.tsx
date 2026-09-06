import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CardMatchingGame } from "@/components/games/card-matching-game";
import { SchulteTableGame } from "@/components/games/schulte-table-game";
import type { GameType } from "@/lib/types/database";

const TITLES: Record<GameType, string> = {
  card_matching: "카드 매칭",
  schulte_table: "숫자 순서 맞추기",
};

async function GamePlayBody({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (type !== "card_matching" && type !== "schulte_table") {
    notFound();
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">{TITLES[type]}</h1>
      {type === "card_matching" ? <CardMatchingGame /> : <SchulteTableGame />}
    </>
  );
}

export default function GamePlayPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  return (
    <main className="flex-1 w-full max-w-5xl flex flex-col gap-8 p-5">
      <Suspense
        fallback={
          <h1 className="text-2xl font-semibold">게임을 준비하는 중입니다...</h1>
        }
      >
        <GamePlayBody params={params} />
      </Suspense>
    </main>
  );
}
