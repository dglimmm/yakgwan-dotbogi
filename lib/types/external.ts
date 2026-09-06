/**
 * 외부 API 응답 중 이 프로젝트가 실제로 소비하는 필드만 최소 정의한다.
 * 전체 API 스펙을 재정의하지 않는다 — 새 필드가 필요해지면 그때 추가한다.
 */

// --- Claude API (Anthropic) ---
// 말벗 챗봇 대화(F009), 퀴즈 격려 코멘트(F003), 배치 콘텐츠 생성(F006/F008)에서 사용.
export interface ClaudeTextResponse {
  text: string;
}

export interface ClaudeStreamDelta {
  textDelta: string;
}

// --- YouTube Data API v3 ---
// 어르신 인기 유튜브 순위(F007) 배치 수집에서 사용. search.list로 목록을 얻고
// videos.list로 통계(조회수)를 보강하는 2단계 호출을 전제로 한다.
export interface YoutubeSearchItem {
  videoId: string;
  title: string;
  thumbnailUrl: string;
}

export interface YoutubeVideoStats {
  videoId: string;
  viewCount: number;
}
