import type { SubscriptionRepository } from "./repository";
import type { Subscription } from "@/lib/types/database";

export const mockSubscriptionRepository: SubscriptionRepository = {
  async getStatus(userId) {
    const status: Subscription = {
      id: "mock-subscription-1",
      user_id: userId,
      status: "active",
      started_at: "2026-08-01T00:00:00.000Z",
      expires_at: "2026-10-01T00:00:00.000Z",
    };
    return status;
  },
};
