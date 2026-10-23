"use client";

import { KeyBoard, boardSummary } from "@/components/ops/key-board";
import { KeyTag } from "@/components/ops/key-tag";
import { Skeleton } from "@/components/ops/ui";
import { StatusBadge } from "@/components/status-badge";
import { useOps } from "@/lib/store";
import { clientById, memberName } from "@/lib/seed";
import { TYPE_LABEL } from "@/lib/labels";
import { formatRelative } from "@/lib/utils";
import { useNow } from "@/lib/use-now";

/** A real slice of the demo, read-only: what waits for a decision, and the key board of agents. */
export function StartPreview() {
  const ops = useOps();
  const now = useNow();
  if (!ops || !now) return <Skeleton className="h-[560px] rounded-[14px] bg-sheet/70" />;

  const incident = ops.jobs.find((j) => j.status === "incident");
  const waiting = ops.jobs.find((j) => j.status !== "completed" && !j.assigneeId);
  const top = incident ?? waiting;
  const reported = incident ? ops.activity.filter((a) => a.jobId === incident.id && a.to === "incident").at(-1)?.timestamp : undefined;
  const { onDuty, free } = boardSummary(ops);

  return (
    <div data-ui className="overflow-hidden rounded-[14px] bg-sheet border" aria-label="Aperçu de la démonstration">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <p className="text-[14px] font-semibold">Rempart Sécurité</p>
        <p className="num text-[13px] text-muted-ink">
          {free} libres · {onDuty} en service
        </p>
      </div>

      {top ? (
        <div className={incident ? "bg-negative-tint px-4 py-3.5" : "bg-waiting-tint px-4 py-3.5"}>
          <div className="flex items-start gap-3">
            <KeyTag clientId={top.clientId} className="mt-0.5" />
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-[14px] font-medium">
                <StatusBadge status={top.status} unassigned={!top.assigneeId} className={incident ? "bg-sheet" : undefined} />
                {clientById(top.clientId).name}
              </p>
              <p className="mt-1 text-[14px] leading-5">
                {TYPE_LABEL[top.type]}, {top.location}
              </p>
              <p className="mt-0.5 text-[13px] leading-5 text-muted-ink">
                {incident ? `${memberName(incident.assigneeId)} sur place${reported ? `, signalé ${formatRelative(reported, new Date(now))}` : ""}` : "En attente d'un agent"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="bg-covered-tint px-4 py-3.5 text-[14px] text-covered-ink">Aucun incident ouvert, chaque demande a son agent.</p>
      )}

      <p className="px-4 pb-1 pt-3 text-[13px] font-medium text-muted-ink">Tableau des agents</p>
      <KeyBoard ops={ops} interactive={false} />
    </div>
  );
}
