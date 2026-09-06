import type { QuizRepository } from "./repository";
import type { QuizSet, QuizSetType, QuizAttempt } from "@/lib/types/database";
import type { QuizQuestion } from "@/lib/types/quiz";

const TRIVIA_QUESTIONS: QuizQuestion[] = [
  {
    id: "trivia-1",
    prompt: "우리나라의 수도는 어디일까요?",
    choices: [
      { id: "a", label: "서울" },
      { id: "b", label: "부산" },
      { id: "c", label: "대구" },
    ],
    answerChoiceId: "a",
  },
  {
    id: "trivia-2",
    prompt: "봄에 피는 꽃이 아닌 것은 무엇일까요?",
    choices: [
      { id: "a", label: "개나리" },
      { id: "b", label: "진달래" },
      { id: "c", label: "국화" },
    ],
    answerChoiceId: "c",
  },
  {
    id: "trivia-3",
    prompt: "하루는 몇 시간일까요?",
    choices: [
      { id: "a", label: "12시간" },
      { id: "b", label: "24시간" },
      { id: "c", label: "36시간" },
    ],
    answerChoiceId: "b",
  },
  {
    id: "trivia-4",
    prompt: "김치의 주재료는 무엇일까요?",
    choices: [
      { id: "a", label: "배추" },
      { id: "b", label: "감자" },
      { id: "c", label: "당근" },
    ],
    answerChoiceId: "a",
  },
  {
    id: "trivia-5",
    prompt: "설날에 먹는 대표 음식은 무엇일까요?",
    choices: [
      { id: "a", label: "송편" },
      { id: "b", label: "떡국" },
      { id: "c", label: "삼계탕" },
    ],
    answerChoiceId: "b",
  },
];

const SONG_QUESTIONS: QuizQuestion[] = [
  {
    id: "song-1",
    prompt: "\"고향의 봄\"에서 '나의 살던 고향은' 다음 가사는 무엇일까요?",
    choices: [
      { id: "a", label: "꽃 피는 산골" },
      { id: "b", label: "푸른 바닷가" },
      { id: "c", label: "높은 산봉우리" },
    ],
    answerChoiceId: "a",
  },
  {
    id: "song-2",
    prompt: "\"학교종\"의 첫 소절은 무엇일까요?",
    choices: [
      { id: "a", label: "학교종이 땡땡땡" },
      { id: "b", label: "산토끼 토끼야" },
      { id: "c", label: "달아 달아 밝은 달아" },
    ],
    answerChoiceId: "a",
  },
  {
    id: "song-3",
    prompt: "\"아리랑\"에서 반복되는 후렴구는 무엇일까요?",
    choices: [
      { id: "a", label: "아리랑 아리랑 아라리요" },
      { id: "b", label: "얼씨구 좋다" },
      { id: "c", label: "둥기둥 두둥실" },
    ],
    answerChoiceId: "a",
  },
  {
    id: "song-4",
    prompt: "\"섬집아기\"는 누구를 위한 노래일까요?",
    choices: [
      { id: "a", label: "군인" },
      { id: "b", label: "아기" },
      { id: "c", label: "농부" },
    ],
    answerChoiceId: "b",
  },
  {
    id: "song-5",
    prompt: "\"오빠 생각\"에서 오빠가 사다 준다고 한 것은 무엇일까요?",
    choices: [
      { id: "a", label: "비단구두" },
      { id: "b", label: "새 신발" },
      { id: "c", label: "예쁜 옷" },
    ],
    answerChoiceId: "a",
  },
];

const MEMORY_QUESTIONS: QuizQuestion[] = [
  {
    id: "memory-1",
    prompt: "방금 보여드린 단어 목록에 '사과'가 있었나요?",
    choices: [
      { id: "a", label: "있었다" },
      { id: "b", label: "없었다" },
    ],
    answerChoiceId: "a",
  },
  {
    id: "memory-2",
    prompt: "방금 보여드린 단어 목록에 '자동차'가 있었나요?",
    choices: [
      { id: "a", label: "있었다" },
      { id: "b", label: "없었다" },
    ],
    answerChoiceId: "b",
  },
  {
    id: "memory-3",
    prompt: "방금 보여드린 단어 목록의 첫 번째 단어는 무엇이었나요?",
    choices: [
      { id: "a", label: "사과" },
      { id: "b", label: "구름" },
      { id: "c", label: "의자" },
    ],
    answerChoiceId: "a",
  },
  {
    id: "memory-4",
    prompt: "방금 보여드린 단어 목록에 몇 개의 단어가 있었나요?",
    choices: [
      { id: "a", label: "3개" },
      { id: "b", label: "5개" },
      { id: "c", label: "7개" },
    ],
    answerChoiceId: "b",
  },
  {
    id: "memory-5",
    prompt: "방금 보여드린 단어 목록의 마지막 단어는 무엇이었나요?",
    choices: [
      { id: "a", label: "구름" },
      { id: "b", label: "의자" },
      { id: "c", label: "나무" },
    ],
    answerChoiceId: "c",
  },
];

const QUIZ_SETS: Record<QuizSetType, QuizSet> = {
  trivia: {
    id: "quiz-set-trivia-1",
    date: "2026-09-06",
    type: "trivia",
    questions: TRIVIA_QUESTIONS,
  },
  song: {
    id: "quiz-set-song-1",
    date: "2026-09-06",
    type: "song",
    questions: SONG_QUESTIONS,
  },
  memory: {
    id: "quiz-set-memory-1",
    date: "2026-09-06",
    type: "memory",
    questions: MEMORY_QUESTIONS,
  },
};

export const mockQuizRepository: QuizRepository = {
  async getTodayQuizSet(type) {
    return QUIZ_SETS[type] ?? null;
  },
  async saveAttempt(attempt) {
    const saved: QuizAttempt = {
      ...attempt,
      id: `quiz-attempt-${Date.now()}`,
      completed_at: new Date().toISOString(),
    };
    return saved;
  },
};
