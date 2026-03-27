"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarContent } from "@/components/sidebar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/jobs": "Jobs",
  "/team": "Team",
};

function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

export function Header() {
  const pathname = usePathname();
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());
  const [, setTick] = useState(0);
  const [open, setOpen] = useState(false);

  // Tick every 30 seconds to refresh the "Last updated" display
  useEffect(() => {
    setLastUpdated(new Date());
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      setTick((t) => t + 1);
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile sheet on navigation
  const handleNavClick = useCallback(() => setOpen(false), []);

  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <header className="flex h-14 items-center justify-between border-b border-b-[#e2e8f0] bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div onClick={handleNavClick}>
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      {/* Last updated ticker */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>Updated {formatRelativeTime(lastUpdated)}</span>
      </div>
    </header>
  );
}
