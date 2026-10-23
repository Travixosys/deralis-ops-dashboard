"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/sidebar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/jobs": "Missions",
  "/team": "Équipe",
};

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const handleNavClick = useCallback(() => setOpen(false), []);
  const title = pageTitles[pathname] ?? "Tableau de bord";

  return (
    <header className="flex h-14 items-center justify-between border-b border-b-[#e2e8f0] bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div onClick={handleNavClick}>
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
        <p className="text-lg font-semibold">{title}</p>
      </div>
    </header>
  );
}
