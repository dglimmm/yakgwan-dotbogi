import type { Subscription } from "@/lib/types/database";

/**
 * 구독 상태 조회 인터페이스.
 * 결제/해지 등 쓰기 동작은 PG사(토스페이먼츠) 연동과 함께 Phase 7 Task 022에서 추가한다.
 */
export interface SubscriptionRepository {
  getStatus(userId: string): Promise<Subscription | null>;
}
