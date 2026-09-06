/**
 * 두뇌 게임(카드 매칭, 슐테 표) 로직.
 * React/DOM에 의존하지 않는 순수 함수로만 구성해 UI와 분리하고,
 * 향후 네이티브 앱에서도 동일 로직을 재사용할 수 있게 한다.
 */

export interface GameCard {
  id: number;
  symbol: string;
}

/** Fisher-Yates 셔플. 입력 배열은 변경하지 않고 새 배열을 반환한다. */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** symbols 각각을 두 장씩 섞어 카드 매칭 덱을 만든다. */
export function buildCardDeck(symbols: string[]): GameCard[] {
  const pairs = shuffle([...symbols, ...symbols]);
  return pairs.map((symbol, id) => ({ id, symbol }));
}

/** 두 카드가 같은 심볼인지(짝인지) 판정한다. */
export function isMatch(a: GameCard, b: GameCard): boolean {
  return a.symbol === b.symbol;
}

/**
 * 슐테 표 격자 한 변의 최대 칸 수.
 * 화면 최소 폭(360px 기준) 안에서 셀 44x44px 이상 + 셀 간 간격을 확보할 수 있는 상한이다.
 */
export const SCHULTE_MAX_SIZE = 5;

/** size x size 슐테 표에 쓸 1..size*size 숫자를 섞어 반환한다. size는 1~SCHULTE_MAX_SIZE. */
export function buildSchulteGrid(size: number): number[] {
  if (!Number.isInteger(size) || size < 1 || size > SCHULTE_MAX_SIZE) {
    throw new Error(
      `슐테 표 크기는 1 이상 ${SCHULTE_MAX_SIZE} 이하의 정수여야 합니다: ${size}`,
    );
  }
  const numbers = Array.from({ length: size * size }, (_, i) => i + 1);
  return shuffle(numbers);
}

/** 클릭한 값이 다음에 찾아야 할 목표 숫자와 같은지 판정한다. */
export function isNextInOrder(value: number, nextTarget: number): boolean {
  return value === nextTarget;
}
