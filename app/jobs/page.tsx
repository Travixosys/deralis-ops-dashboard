import { JobsList } from "@/components/jobs/jobs-list";

export default function JobsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Jobs</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Search, filter, and manage all security operations jobs.
        </p>
      </div>
      <JobsList />
    </div>
  );
}
