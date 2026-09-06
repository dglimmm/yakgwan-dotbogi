import type { QuizSetType } from "@/lib/types/database";

export type QuizType = QuizSetType;

export interface QuizChoice {
  id: string;
  label: string;
}

/**
 * quiz_sets.questions(jsonb) 컬럼에 저장되는 문제 배열의 구조.
 * type에 따라 song(노래 맞추기)/trivia(상식 퀴즈)/memory(기억력 게임) 문항을 담는다.
 */
export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: QuizChoice[];
  answerChoiceId: string;
}

export type QuizQuestions = QuizQuestion[];
