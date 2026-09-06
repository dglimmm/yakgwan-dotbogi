import { describe, expect, it } from "vitest";
import {
  buildCardDeck,
  buildSchulteGrid,
  isMatch,
  isNextInOrder,
  SCHULTE_MAX_SIZE,
  shuffle,
} from "./logic";

describe("shuffle", () => {
  it("입력과 동일한 원소 구성을 유지한다", () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffle(original);
    expect(shuffled.slice().sort()).toEqual(original.slice().sort());
  });

  it("입력 배열을 변경하지 않는다", () => {
    const original = [1, 2, 3];
    shuffle(original);
    expect(original).toEqual([1, 2, 3]);
  });
});

describe("buildCardDeck", () => {
  it("각 심볼이 정확히 두 장씩 생성된다", () => {
    const symbols = ["사과", "바나나", "포도"];
    const deck = buildCardDeck(symbols);
    expect(deck).toHaveLength(symbols.length * 2);
    for (const symbol of symbols) {
      expect(deck.filter((card) => card.symbol === symbol)).toHaveLength(2);
    }
  });

  it("카드 id는 중복 없이 0부터 부여된다", () => {
    const deck = buildCardDeck(["사과", "바나나"]);
    const ids = deck.map((card) => card.id).sort((a, b) => a - b);
    expect(ids).toEqual([0, 1, 2, 3]);
  });
});

describe("isMatch", () => {
  it("같은 심볼이면 true를 반환한다", () => {
    expect(isMatch({ id: 0, symbol: "사과" }, { id: 1, symbol: "사과" })).toBe(
      true,
    );
  });

  it("다른 심볼이면 false를 반환한다", () => {
    expect(
      isMatch({ id: 0, symbol: "사과" }, { id: 1, symbol: "바나나" }),
    ).toBe(false);
  });
});

describe("buildSchulteGrid", () => {
  it("size x size 만큼의 1..N 숫자를 생성한다", () => {
    const grid = buildSchulteGrid(4);
    expect(grid).toHaveLength(16);
    expect(grid.slice().sort((a, b) => a - b)).toEqual(
      Array.from({ length: 16 }, (_, i) => i + 1),
    );
  });

  it(`상한(${SCHULTE_MAX_SIZE})을 초과하면 에러를 던진다`, () => {
    expect(() => buildSchulteGrid(SCHULTE_MAX_SIZE + 1)).toThrow();
  });

  it("1 미만이거나 정수가 아니면 에러를 던진다", () => {
    expect(() => buildSchulteGrid(0)).toThrow();
    expect(() => buildSchulteGrid(2.5)).toThrow();
  });
});

describe("isNextInOrder", () => {
  it("클릭값이 다음 목표값과 같으면 true를 반환한다", () => {
    expect(isNextInOrder(3, 3)).toBe(true);
  });

  it("클릭값이 다음 목표값과 다르면 false를 반환한다", () => {
    expect(isNextInOrder(2, 3)).toBe(false);
  });
});
