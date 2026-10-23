"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Users } from "lucide-react";
import { GuidePanel } from "@/components/guide/guide";
import { Mark } from "@/components/ops/mark";
import { useOps } from "@/lib/store";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/jobs", label: "Missions", icon: ClipboardList },
  { href: "/team", label: "Équipe", icon: Users },
];

/** Count shown on the dashboard item: what needs a decision (incidents, requests without an agent). */
function useToTreat() {
  const ops = useOps();
  if (!ops) return { count: 0, incidents: 0 };
  const incidents = ops.jobs.filter((j) => j.status === "incident").length;
  const waiting = ops.jobs.filter((j) => j.status !== "completed" && !j.assigneeId).length;
  return { count: incidents + waiting, incidents };
}

export function SidebarContent({ withGuide = false, onNavigate }: { withGuide?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const toTreat = useToTreat();

  return (
    <div className="flex h-full flex-col">
      <Link href="/" onClick={onNavigate} className="mx-3 mt-4 flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-frame-2/60">
        <Mark size={30} />
        <span className="leading-tight">
          <span className="block text-[15px] font-semibold tracking-[-0.01em]">Deralis Ops</span>
          <span className="block text-[13px] text-muted-ink">Rempart Sécurité</span>
        </span>
      </Link>

      <nav aria-label="Navigation principale" className="mt-5 space-y-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const showCount = item.href === "/dashboard" && toTreat.count > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-2.5 rounded-lg px-2.5 text-[14px] transition-colors md:min-h-9",
                isActive ? "bg-sheet font-medium text-ink border" : "text-muted-ink hover:bg-frame-2/60 hover:text-ink"
              )}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              <span className="flex-1">{item.label}</span>
              {showCount && (
                <span
                  className={cn(
                    "num inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[12px] font-semibold",
                    toTreat.incidents > 0 ? "bg-negative text-white" : "bg-ink text-sheet"
                  )}
                  aria-label={`${toTreat.count} à traiter`}
                >
                  {toTreat.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-3 pb-3">{withGuide && <GuidePanel />}</div>

      <div className="px-5 pb-4 pt-2 text-[12px] text-muted-ink">
        <a href="https://deralis.digital" rel="noopener" className="hover:text-ink">
          Démonstration · Deralis Digital
        </a>
      </div>
    </div>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="hidden w-[248px] flex-none md:flex md:flex-col">
      <SidebarContent withGuide />
    </aside>
  );
}
