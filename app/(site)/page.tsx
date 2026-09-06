import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockContentRepository } from "@/lib/content/mock-repository";

const TODAY = "2026-09-06";

export default async function Home() {
  const [dailyContent, healthTips, youtubeRankings] = await Promise.all([
    mockContentRepository.getDailyContent(TODAY),
    mockContentRepository.getHealthTips(TODAY),
    mockContentRepository.getYoutubeRankings(),
  ]);

  return (
    <main className="flex-1 w-full max-w-5xl flex flex-col gap-12 p-5">
      <section className="grid gap-6 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold sm:text-3xl">
            오늘도 즐겁게, 두뇌 건강 챙기기
          </h1>
          <p className="text-lg text-muted-foreground">
            퀴즈와 게임으로 두뇌를 깨우고, 말벗 챗봇과 편안하게 이야기
            나눠보세요.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/quiz">퀴즈 시작하기</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/games">게임 시작하기</Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div
              aria-hidden
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground"
            >
              날씨
            </div>
            <div>
              <CardTitle className="text-xl">오늘의 날씨와 운세</CardTitle>
              <p className="text-base text-muted-foreground">{TODAY} 기준</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2">
              <div>
                <p className="text-base font-semibold text-muted-foreground">
                  오늘의 날씨
                </p>
                <p className="text-lg">{dailyContent?.weather_summary}</p>
              </div>
              <div className="sm:border-l sm:pl-4">
                <p className="text-base font-semibold text-muted-foreground">
                  오늘의 운세
                </p>
                <p className="text-lg">{dailyContent?.fortune_text}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-label="오늘의 건강 상식" className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">오늘의 건강 상식</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {healthTips.map((tip) => (
            <Card key={tip.id}>
              <CardHeader>
                <p className="text-base font-semibold text-accent">
                  {tip.category}
                </p>
                <CardTitle className="text-lg">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground">
                  {tip.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-base text-muted-foreground">
          ※ 건강 상식은 참고용 정보이며 의학적 진단이나 처방을 대신하지
          않습니다. 증상이 있다면 의료진과 상담하세요.
        </p>
      </section>

      <section
        aria-label="어르신 인기 유튜브 순위"
        className="flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold">어르신 인기 유튜브 순위</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {youtubeRankings.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div
                aria-hidden
                className="flex h-28 items-center justify-center bg-secondary text-lg font-bold text-secondary-foreground"
              >
                {video.rank}위
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{video.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground">
                  조회수 {video.view_count.toLocaleString("ko-KR")}회
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
