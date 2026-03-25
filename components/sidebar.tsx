"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Users, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/team", label: "Team", icon: Users },
];

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Shield className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground">
            Deralis Digital
          </p>
          <p className="text-xs text-muted-foreground">Ops Dashboard</p>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Footer */}
      <div className="px-4 py-4">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Deralis Digital
        </p>
        <p className="text-xs text-muted-foreground">Portfolio Demo</p>
      </div>
    </div>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r border-sidebar-border bg-sidebar">
      <SidebarContent />
    </aside>
  );
}
