"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { FontScale } from "@/lib/types/database";

const FONT_SCALE_STORAGE_KEY = "a11y-font-scale";
const HIGH_CONTRAST_STORAGE_KEY = "a11y-high-contrast";
const FONT_SCALE_ORDER: FontScale[] = ["보통", "크게", "아주크게"];

interface AccessibilityContextValue {
  fontScale: FontScale;
  highContrast: boolean;
  cycleFontScale: () => void;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(
  null,
);

function applyToDocument(fontScale: FontScale, highContrast: boolean) {
  const root = document.documentElement;
  root.setAttribute("data-font-scale", fontScale);
  if (highContrast) {
    root.setAttribute("data-contrast", "high");
  } else {
    root.removeAttribute("data-contrast");
  }
}

// Phase 6에서 로그인 사용자는 이 파일의 localStorage 읽기/쓰기만
// profiles 테이블 영속화로 교체하면 되고, 훅을 쓰는 화면 쪽은 변경할 필요가 없다.
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontScale, setFontScale] = useState<FontScale>("보통");
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const storedFontScale = window.localStorage.getItem(
      FONT_SCALE_STORAGE_KEY,
    );
    if (
      storedFontScale &&
      FONT_SCALE_ORDER.includes(storedFontScale as FontScale)
    ) {
      setFontScale(storedFontScale as FontScale);
    }

    const storedHighContrast = window.localStorage.getItem(
      HIGH_CONTRAST_STORAGE_KEY,
    );
    if (storedHighContrast !== null) {
      setHighContrast(storedHighContrast === "true");
    }
  }, []);

  useEffect(() => {
    applyToDocument(fontScale, highContrast);
    window.localStorage.setItem(FONT_SCALE_STORAGE_KEY, fontScale);
    window.localStorage.setItem(
      HIGH_CONTRAST_STORAGE_KEY,
      String(highContrast),
    );
  }, [fontScale, highContrast]);

  const cycleFontScale = useCallback(() => {
    setFontScale((prev) => {
      const nextIndex =
        (FONT_SCALE_ORDER.indexOf(prev) + 1) % FONT_SCALE_ORDER.length;
      return FONT_SCALE_ORDER[nextIndex];
    });
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast((prev) => !prev);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{ fontScale, highContrast, cycleFontScale, toggleHighContrast }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility는 AccessibilityProvider 내부에서만 사용할 수 있습니다.",
    );
  }
  return context;
}
