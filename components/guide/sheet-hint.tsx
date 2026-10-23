"use client";

import { Check } from "lucide-react";
import { STEPS, progress } from "@/lib/guide";
import type { OpsState } from "@/lib/store";
import type { Job } from "@/lib/types";

/** Inside the mission sheet: the guided step that concerns this mission, updated the moment it is done. */
export function SheetHint({ job, ops }: { job: Job; ops: OpsState }) {
  const { done, count, total, next } = progress(ops);
  const index = next ? STEPS.findIndex((s) => s.id === next.id) + 1 : 0;

  let text: string | null = null;
  if (next?.id === "relay" && job.status === "incident") text = "Dans « Agent affecté », choisissez un agent marqué Libre pour prendre le relais.";
  if (next?.id === "close" && job.status === "incident") text = "Le site est sécurisé : clôturez l'incident.";
  if (next?.id === "open" && job.status === "incident") text = null;
  if (next?.id === "assign" && job.simulated && !job.assigneeId) text = "Choisissez un agent Libre dans « Agent affecté ».";

  const justDone =
    (job.status === "completed" && done.close && job.simulated !== true && ops.activity.some((a) => a.jobId === job.id && a.byVisitor && a.from === "incident")) ||
    (job.simulated && job.assigneeId && done.assign);

  if (!text && !justDone) return null;

  return (
    <div className="rounded-md border border-dashed px-3 py-2.5 text-sm leading-5" data-testid="sheet-hint" role="status">
      {text ? (
        <p>
          <span className="font-semibold">
            Parcours guidé, étape {index}/{total} :
          </span>{" "}
          {text}
        </p>
      ) : (
        <p className="flex items-center gap-2">
          <Check className="h-4 w-4 flex-none" aria-hidden />
          <span>
            <span className="font-semibold">Étape validée.</span> {count}/{total} faites.{next ? ` Suivante : ${next.title.toLowerCase()}.` : " Parcours terminé."}
          </span>
        </p>
      )}
    </div>
  );
}
