"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { KeyTag } from "@/components/ops/key-tag";
import { SheetHint } from "@/components/guide/sheet-hint";
import type { Job } from "@/lib/types";
import { assignJob, closeJob, setStatus, useOpenJobId, useOps, type OpsState } from "@/lib/store";
import { agentState } from "@/lib/agent";
import { clientById, memberName } from "@/lib/seed";
import { TYPE_LABEL } from "@/lib/labels";
import { useNow } from "@/lib/use-now";
import { cn, formatRange, formatSlot } from "@/lib/utils";

export function JobDetailSheet() {
  const ops = useOps();
  const openId = useOpenJobId();
  const job = ops?.jobs.find((j) => j.id === openId) ?? null;

  return (
    <Sheet open={job !== null} onOpenChange={(o) => !o && closeJob()}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-[480px]">
        {job && ops && <SheetBody job={job} ops={ops} />}
      </SheetContent>
    </Sheet>
  );
}

const KIND_ORDER = { free: 0, busy: 1, incident: 2, break: 3, off: 4 };

function SheetBody({ job, ops }: { job: Job; ops: OpsState }) {
  const now = useNow();
  const { team, jobs, activity } = ops;
  const client = clientById(job.clientId);
  const timeline = activity
    .filter((e) => e.jobId === job.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const options = team
    .map((m) => ({ m, s: agentState(m, jobs) }))
    .sort((a, b) => KIND_ORDER[a.s.kind] - KIND_ORDER[b.s.kind]);
  const nowDate = new Date(now || Date.parse(job.createdAt));

  return (
    <div className="pb-8">
      <SheetHeader className={cn("space-y-0 border-b px-5 pb-4 pt-5 text-left", job.status === "incident" && "bg-negative-tint")}>
        <div className="flex items-center gap-2.5 pr-10">
          <KeyTag clientId={job.clientId} />
          <SheetTitle className="num text-[15px] font-semibold">{job.reference}</SheetTitle>
          <StatusBadge status={job.status} unassigned={!job.assigneeId} />
        </div>
        <SheetDescription className="mt-3 text-[18px] font-semibold leading-6 tracking-[-0.01em] text-ink">
          {TYPE_LABEL[job.type]}, {job.location}
        </SheetDescription>
        <p className="mt-1 text-[14px] text-muted-ink">{client.name}</p>
      </SheetHeader>

      <div className="space-y-6 px-5 pt-5">
        <SheetHint job={job} ops={ops} />

        <dl className="grid grid-cols-[110px_1fr] gap-x-4 gap-y-2.5 text-[14px] leading-5">
          <dt className="text-muted-ink">Horaires</dt>
          <dd className="num">{formatRange(job.scheduledStart, job.scheduledEnd, nowDate)}</dd>
          <dt className="text-muted-ink">Priorité</dt>
          <dd>
            <PriorityBadge priority={job.priority} />
          </dd>
          <dt className="text-muted-ink">Client</dt>
          <dd>
            {client.name} <span className="text-muted-ink">· {client.industry}</span>
          </dd>
          <dt className="text-muted-ink">Consignes</dt>
          <dd>{job.notes}</dd>
        </dl>

        <section aria-labelledby="decision-title" className="rounded-[10px] bg-raised p-4">
          <h3 id="decision-title" className="text-[15px] font-semibold">
            Décision
          </h3>
          <label htmlFor="assignee" className="mt-3 block text-[13px] font-medium">
            Agent affecté
          </label>
          <Select value={job.assigneeId || undefined} onValueChange={(v) => assignJob(job.id, v)} disabled={job.status === "completed"}>
            <SelectTrigger id="assignee" className="mt-1.5 h-11 w-full bg-sheet text-[14px] md:h-10" data-testid="assignee-select">
              <SelectValue placeholder="Choisir un agent" />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ m, s }) => (
                <SelectItem key={m.id} value={m.id} disabled={m.availability === "off_duty"} className="min-h-10">
                  <span className="font-medium">{m.name}</span>
                  <span className={cn("ml-2", s.free ? "text-covered-ink" : "text-muted-ink")}>{s.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {job.status !== "completed" && (
            <p className="mt-2 text-[13px] leading-5 text-muted-ink">
              {job.assigneeId
                ? `${memberName(job.assigneeId)} porte la mission. Un agent marqué Libre peut prendre le relais.`
                : "Aucun agent : la demande reste dans « À traiter » jusqu'à son affectation."}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {job.status === "incident" && (
              <button
                type="button"
                onClick={() => setStatus(job.id, "completed", "Incident clôturé : site sécurisé, rapport transmis au client.")}
                className="inline-flex min-h-11 items-center rounded-md bg-ink px-4 text-[14px] font-medium text-sheet hover:bg-ink/85 md:min-h-10"
              >
                Clôturer l&apos;incident
              </button>
            )}
            {job.status === "pending" && (
              <button
                type="button"
                disabled={!job.assigneeId}
                onClick={() => setStatus(job.id, "in_progress")}
                className="inline-flex min-h-11 items-center rounded-md bg-sheet px-4 text-[14px] font-medium border border-control hover:bg-frame disabled:cursor-not-allowed disabled:text-muted-ink md:min-h-10"
              >
                Démarrer la mission
              </button>
            )}
            {job.status === "in_progress" && (
              <>
                <button
                  type="button"
                  onClick={() => setStatus(job.id, "completed")}
                  className="inline-flex min-h-11 items-center rounded-md bg-sheet px-4 text-[14px] font-medium border border-control hover:bg-frame md:min-h-10"
                >
                  Terminer la mission
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(job.id, "incident", "Incident signalé par l'exploitation.")}
                  className="inline-flex min-h-11 items-center rounded-md px-3 text-[14px] font-medium text-negative-ink hover:bg-negative-tint md:min-h-10"
                >
                  Signaler un incident
                </button>
              </>
            )}
            {job.status === "completed" && <p className="text-[14px] text-muted-ink">Mission terminée, rapport déposé.</p>}
          </div>
        </section>

        <section aria-labelledby="log-title">
          <h3 id="log-title" className="text-[15px] font-semibold">
            Main courante
          </h3>
          <ol className="mt-2">
            {timeline.map((entry) => (
              <li key={entry.id} className={cn("grid grid-cols-[92px_1fr] gap-3 border-t py-2.5 text-[14px] leading-5", entry.byVisitor && "bg-covered-tint/50")}>
                <span className="num text-[13px] text-muted-ink">{formatSlot(entry.timestamp, nowDate)}</span>
                <span>
                  {entry.description}
                  <span className="block text-[13px] text-muted-ink">{entry.actor}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
