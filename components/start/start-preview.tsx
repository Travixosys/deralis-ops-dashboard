"use client";

import { AlertTriangle } from "lucide-react";
import { isFree, useOps } from "@/lib/store";
import { clientById, memberName } from "@/lib/seed";
import { TYPE_LABEL } from "@/lib/labels";
import { formatRelative } from "@/lib/utils";
import { useNow } from "@/lib/use-now";

/** A read-only slice of the live demo state: the incident waiting and who could take it. */
export function StartPreview() {
  const ops = useOps();
  const now = useNow();
  if (!ops) return <div className="h-[320px] rounded-lg border bg-card" aria-hidden />;

  const incident = ops.jobs.find((j) => j.status === "incident");
  const free = ops.team.filter((m) => isFree(m, ops.jobs));
  const running = ops.jobs.filter((j) => j.status === "in_progress").length;
  const reported = incident
    ? ops.activity.filter((a) => a.jobId === incident.id && a.to === "incident").at(-1)?.timestamp
    : undefined;

  return (
    <div data-ui className="rounded-lg border bg-card p-4 text-card-foreground" aria-label="Aperçu du tableau de bord">
      <p className="text-sm font-semibold">À traiter maintenant</p>
      {incident ? (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-red-900">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            Incident · {clientById(incident.clientId).name}
          </p>
          <p className="mt-1 text-sm text-red-900/80">
            {TYPE_LABEL[incident.type]}, {incident.location}
          </p>
          <p className="mt-1 text-sm text-red-900/80">
            {memberName(incident.assigneeId)} sur place{reported && now ? `, signalé ${formatRelative(reported, new Date(now))}` : ""}
          </p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Aucun incident ouvert.</p>
      )}
      <p className="mt-4 text-sm font-semibold">Agents libres pour intervenir</p>
      <ul className="mt-2 space-y-1.5">
        {free.map((m) => (
          <li key={m.id} className="flex items-center justify-between text-sm">
            <span>{m.name}</span>
            <span className="text-muted-foreground">{m.role}</span>
          </li>
        ))}
        {free.length === 0 && <li className="text-sm text-muted-foreground">Aucun agent libre pour le moment.</li>}
      </ul>
      <p className="mt-4 text-sm text-muted-foreground">{running} missions en cours sur les sites clients.</p>
    </div>
  );
}
