"use client";

import type { Job } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";

interface MemberJobsProps {
  jobs: Job[];
  memberName: string;
}

export function MemberJobs({ jobs, memberName }: MemberJobsProps) {
  if (jobs.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No jobs currently assigned to {memberName}.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="flex items-center justify-between rounded-lg border px-3 py-2"
        >
          <div className="space-y-0.5">
            <p className="text-sm font-medium">
              <span className="font-mono text-xs text-muted-foreground">
                {job.referenceNumber}
              </span>{" "}
              — {job.client}
            </p>
            <p className="text-xs text-muted-foreground">{job.type}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={job.status} />
            <PriorityBadge priority={job.priority} />
          </div>
        </div>
      ))}
    </div>
  );
}
