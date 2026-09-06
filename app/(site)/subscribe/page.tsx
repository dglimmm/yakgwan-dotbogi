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

async function SubscribeBody() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const userId = typeof claims?.sub === "string" ? claims.sub : "mock-user";

  const subscription = await mockSubscriptionRepository.getStatus(userId);
  const isActive = subscription?.status === "active";

  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle className="text-xl">현재 구독 상태</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-lg">
          {isActive ? "구독 중이십니다." : "구독 중이 아닙니다."}
        </p>
        <Button size="lg" disabled className="w-fit">
          결제 기능은 준비 중입니다
        </Button>
      </CardContent>
    </Card>
  );
}

export default function SubscribePage() {
  return (
    <main className="flex-1 w-full max-w-5xl flex flex-col gap-8 p-5">
      <h1 className="text-2xl font-semibold">구독 결제</h1>
      <p className="text-lg text-muted-foreground">
        구독하시면 말벗 챗봇을 이용 횟수 제한 없이 편하게 이용하실 수 있어요.
      </p>

      <Suspense
        fallback={<p className="text-lg">불러오는 중입니다...</p>}
      >
        <SubscribeBody />
      </Suspense>

      <Button asChild variant="outline" size="lg" className="w-fit">
        <Link href="/">홈으로</Link>
      </Button>
    </main>
  );
}
