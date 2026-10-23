"use client";

import type { Job } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { openJob } from "@/lib/store";
import { clientById } from "@/lib/seed";
import { TYPE_LABEL } from "@/lib/labels";
import { formatSlot } from "@/lib/utils";

export function MemberJobs({ jobs, memberName }: { jobs: Job[]; memberName: string }) {
  if (jobs.length === 0) {
    return <p className="py-4 text-center text-sm text-muted-foreground">Aucune mission en cours ou planifiée pour {memberName}.</p>;
  }

  return (
    <div className="space-y-2">
      {jobs.map((job) => (
        <button
          key={job.id}
          type="button"
          onClick={() => openJob(job.id)}
          className="flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left hover:bg-muted/50"
        >
          <div className="min-w-0 space-y-0.5">
            <p className="truncate text-sm font-medium">
              <span className="font-mono text-xs text-muted-foreground">{job.reference}</span> {clientById(job.clientId).name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {TYPE_LABEL[job.type]} · {formatSlot(job.scheduledStart)} · {job.location}
            </p>
          </div>
          <div className="flex flex-none items-center gap-2">
            <StatusBadge status={job.status} />
            <PriorityBadge priority={job.priority} />
          </div>
        </button>
      ))}
    </div>
  );
}
