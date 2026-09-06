import type {
  DailyContent,
  HealthTip,
  YoutubeRanking,
} from "@/lib/types/database";

/**
 * 공용 배치 콘텐츠(날씨·운세, 건강 상식, 유튜브 랭킹) 조회 인터페이스.
 * 구현은 Phase 4 Task 010/011/012에서 Supabase 클라이언트로 채운다.
 * 화면 컴포넌트는 이 인터페이스를 통해서만 조회하고 Supabase를 직접 호출하지 않는다.
 */
export interface ContentRepository {
  getDailyContent(date: string): Promise<DailyContent | null>;
  getHealthTips(date: string): Promise<HealthTip[]>;
  getYoutubeRankings(category?: string): Promise<YoutubeRanking[]>;
}
