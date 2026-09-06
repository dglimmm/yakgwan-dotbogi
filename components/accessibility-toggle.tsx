"use client";

import { useAccessibility } from "@/lib/accessibility/context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccessibilityToggle() {
  const { fontScale, highContrast, cycleFontScale, toggleHighContrast } =
    useAccessibility();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="화면 접근성 설정">
          화면 설정
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>화면 접근성 설정</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            cycleFontScale();
          }}
        >
          글자 크기: {fontScale} (누르면 변경)
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            toggleHighContrast();
          }}
        >
          고대비 모드: {highContrast ? "켜짐" : "꺼짐"} (누르면 전환)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
