import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const GAME_TYPES = [
  { type: "card_matching", title: "카드 매칭" },
  { type: "schulte_table", title: "숫자 순서 맞추기" },
] as const;

export default function GamesPage() {
  return (
    <main className="flex-1 w-full max-w-5xl flex flex-col gap-8 p-5">
      <h1 className="text-2xl font-semibold">두뇌 게임</h1>
      <p className="text-base">원하는 게임 유형을 선택해주세요.</p>

      <section className="grid gap-6 sm:grid-cols-2">
        {GAME_TYPES.map(({ type, title }) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full">
                <Link href={`/games/play/${type}`}>시작하기</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <Button asChild variant="outline" size="lg" className="w-fit">
        <Link href="/">홈으로</Link>
      </Button>
    </main>
  );
}
