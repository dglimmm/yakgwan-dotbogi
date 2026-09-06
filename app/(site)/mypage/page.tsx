import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { mockSubscriptionRepository } from "@/lib/subscription/mock-repository";

const STATUS_LABELS: Record<string, string> = {
  active: "이용 중",
  canceled: "해지 예정",
  expired: "만료됨",
};

async function MyPageBody() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const email = typeof claims?.email === "string" ? claims.email : "회원";
  const userId = typeof claims?.sub === "string" ? claims.sub : "mock-user";

  const subscription = await mockSubscriptionRepository.getStatus(userId);
  const statusLabel = subscription
    ? STATUS_LABELS[subscription.status]
    : "구독 정보 없음";

  return (
    <>
      <p className="text-lg text-muted-foreground">{email}님, 환영합니다.</p>

      <Card className="w-fit">
        <CardHeader className="flex flex-row items-center gap-4">
          <div
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground"
          >
            구독
          </div>
          <div>
            <CardTitle className="text-xl">구독 상태: {statusLabel}</CardTitle>
            <p className="text-base text-muted-foreground">
              {subscription
                ? `${subscription.expires_at.slice(0, 10)}까지 이용 가능`
                : "구독 정보가 없습니다"}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg">
            <Link href="/subscribe">구독 관리하기</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default function MyPage() {
  return (
    <main className="flex-1 w-full max-w-5xl flex flex-col gap-8 p-5">
      <h1 className="text-2xl font-semibold">마이페이지</h1>

      <Suspense
        fallback={<p className="text-lg">불러오는 중입니다...</p>}
      >
        <MyPageBody />
      </Suspense>

      <Button asChild variant="outline" size="lg" className="w-fit">
        <Link href="/">홈으로</Link>
      </Button>
    </main>
  );
}
