"use client";

import { AlertTriangle, Inbox } from "lucide-react";
import { openJob, useOps } from "@/lib/store";
import { clientById, memberName } from "@/lib/seed";
import { TYPE_LABEL } from "@/lib/labels";
import { formatSlot } from "@/lib/utils";

/** What needs a decision now: open incidents, then client requests without an agent. */
export function ActionQueue() {
  const ops = useOps();
  if (!ops) return <div className="h-32" />;
  const incidents = ops.jobs.filter((j) => j.status === "incident");
  const requests = ops.jobs.filter((j) => j.status !== "completed" && !j.assigneeId);
  const items = [...incidents, ...requests];

  return (
    <section aria-labelledby="queue-title" className="rounded border bg-card" data-testid="action-queue">
      <h2 id="queue-title" className="border-b px-4 py-3 text-base font-semibold">
        À traiter <span className="font-normal text-muted-foreground">({items.length})</span>
      </h2>
      {items.length === 0 ? (
        <p className="px-4 py-4 text-sm text-muted-foreground">Rien à traiter : aucun incident ouvert, toutes les demandes ont un agent.</p>
      ) : (
        <ul>
          {items.map((job) => {
            const incident = job.status === "incident";
            return (
              <li key={job.id} className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
                {incident ? <AlertTriangle className="h-4 w-4 flex-none text-red-600" aria-hidden /> : <Inbox className="h-4 w-4 flex-none text-muted-foreground" aria-hidden />}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {incident ? "Incident" : "Demande à affecter"} · {clientById(job.clientId).name}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {TYPE_LABEL[job.type]}, {job.location} · {incident ? memberName(job.assigneeId) : `début ${formatSlot(job.scheduledStart)}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openJob(job.id)}
                  className="inline-flex min-h-11 flex-none items-center rounded-md border px-3 text-sm font-medium hover:bg-muted md:min-h-9"
                  data-testid={`queue-open-${job.id}`}
                >
                  {incident ? "Ouvrir l'incident" : "Affecter"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
