import type { Metadata } from "next";
import { JobsList } from "@/components/jobs/jobs-list";

export const metadata: Metadata = { title: "Missions · Deralis Ops" };

export default function JobsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Missions</h1>
        <p className="mt-1 text-sm text-muted-foreground">Rondes, postes, escortes et levées de doute de tous les sites clients.</p>
      </div>
      <JobsList />
    </div>
  );
}
