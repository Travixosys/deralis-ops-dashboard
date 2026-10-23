"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/sidebar";
import { Mark } from "@/components/ops/mark";

const pageTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/jobs": "Missions",
  "/team": "Équipe",
};

/** Phone only: the frame becomes a top bar with the menu, the product and the current screen. */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const title = pageTitles[pathname] ?? "Tableau de bord";

  return (
    <header className="flex h-14 flex-none items-center gap-2 bg-frame px-2 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button type="button" className="flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-frame-2">
            <Menu className="h-5 w-5" aria-hidden />
            <span className="sr-only">Ouvrir le menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] border-r-0 bg-frame p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <Mark size={24} />
      <p className="text-[15px] font-semibold">
        Deralis Ops <span className="font-normal text-muted-ink">· {title}</span>
      </p>
    </header>
  );
}
