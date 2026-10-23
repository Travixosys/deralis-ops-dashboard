"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { setGuideOpen } from "@/lib/guide-ui";
import { cn } from "@/lib/utils";

/** The start page's one action: the dashboard, with the guide expanded. */
export function ExploreButton({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard"
      onClick={() => setGuideOpen(true)}
      className={cn("group inline-flex items-center justify-between gap-6", className)}
      data-testid="explore"
    >
      <span className="flex flex-col leading-tight">
        <span className="text-[17px] font-semibold">Explorer la démonstration</span>
        <span className="mt-0.5 text-sm opacity-80">Parcours guidé, 4 étapes, 3 minutes</span>
      </span>
      <ArrowRight className="h-5 w-5 flex-none transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}
