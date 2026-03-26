import { TeamGrid } from "@/components/team/team-grid";

export default function TeamPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Team</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          View team availability and assigned jobs.
        </p>
      </div>
      <TeamGrid />
    </div>
  );
}
