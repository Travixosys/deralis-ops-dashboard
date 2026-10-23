import type { Metadata } from "next";
import { TeamGrid } from "@/components/team/team-grid";

export const metadata: Metadata = { title: "Équipe · Deralis Ops" };

export default function TeamPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Équipe</h1>
        <p className="mt-1 text-sm text-muted-foreground">Disponibilité des agents et missions affectées.</p>
      </div>
      <TeamGrid />
    </div>
  );
}
