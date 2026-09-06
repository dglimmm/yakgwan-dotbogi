import type { ContentRepository } from "./repository";
import type {
  DailyContent,
  HealthTip,
  YoutubeRanking,
} from "@/lib/types/database";

const MOCK_DAILY_CONTENT: DailyContent = {
  id: "mock-daily-content-1",
  date: "2026-09-06",
  weather_summary:
    "오늘은 맑고 선선한 날씨예요. 나들이하기 좋은 하루가 되겠습니다.",
  fortune_text:
    "오늘은 반가운 소식이 들려올 좋은 운세입니다. 마음을 편안히 가져보세요.",
  generated_at: "2026-09-06T00:00:00.000Z",
};

const MOCK_HEALTH_TIPS: HealthTip[] = [
  {
    id: "health-tip-1",
    date: "2026-09-06",
    category: "계절건강",
    title: "환절기 감기 예방하기",
    content:
      "아침저녁으로 일교차가 크니 얇은 겉옷을 챙기고 손을 자주 씻어주세요. 이 정보는 참고용 건강 상식이며 진단이나 처방을 대신하지 않습니다.",
    generated_at: "2026-09-06T00:00:00.000Z",
  },
  {
    id: "health-tip-2",
    date: "2026-09-06",
    category: "스트레칭",
    title: "앉아서 하는 목 스트레칭",
    content:
      "의자에 앉아 고개를 좌우로 천천히 기울이면 목과 어깨의 긴장을 풀어줄 수 있습니다. 통증이 있다면 무리하지 말고 의료진과 상담하세요.",
    generated_at: "2026-09-06T00:00:00.000Z",
  },
  {
    id: "health-tip-3",
    date: "2026-09-06",
    category: "영양",
    title: "수분 충분히 섭취하기",
    content:
      "하루 6~8잔의 물을 나누어 마시면 몸의 순환에 도움이 됩니다. 지병이 있다면 적정 수분 섭취량을 의료진과 상의하세요.",
    generated_at: "2026-09-06T00:00:00.000Z",
  },
];

const MOCK_YOUTUBE_RANKINGS: YoutubeRanking[] = [
  {
    id: "youtube-1",
    category: "trot",
    rank: 1,
    video_id: "mock-video-1",
    title: "어르신이 사랑하는 트로트 메들리 모음",
    thumbnail_url: "",
    view_count: 1_284_000,
    fetched_at: "2026-09-06T00:00:00.000Z",
  },
  {
    id: "youtube-2",
    category: "trot",
    rank: 2,
    video_id: "mock-video-2",
    title: "전국노래자랑 최고의 무대 하이라이트",
    thumbnail_url: "",
    view_count: 942_300,
    fetched_at: "2026-09-06T00:00:00.000Z",
  },
  {
    id: "youtube-3",
    category: "health",
    rank: 3,
    video_id: "mock-video-3",
    title: "매일 10분, 집에서 하는 관절 운동",
    thumbnail_url: "",
    view_count: 611_500,
    fetched_at: "2026-09-06T00:00:00.000Z",
  },
];

export const mockContentRepository: ContentRepository = {
  async getDailyContent() {
    return MOCK_DAILY_CONTENT;
  },
  async getHealthTips() {
    return MOCK_HEALTH_TIPS;
  },
  async getYoutubeRankings() {
    return MOCK_YOUTUBE_RANKINGS;
  },
};
