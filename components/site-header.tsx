import Link from "next/link";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import { AccessibilityToggle } from "@/components/accessibility-toggle";

export function SiteHeader() {
  return (
    <header className="w-full flex justify-center border-b border-b-foreground/10">
      <nav className="w-full max-w-5xl flex justify-between items-center p-3 px-5">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-lg">
            손주야놀자
          </Link>
          <Link href="/chat" className="text-base">
            말벗 챗봇
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <AccessibilityToggle />
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
