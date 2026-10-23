"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { MapPin, Clock, User, Building2, FileText, GitCommitHorizontal, MessageSquare, UserCog, AlertCircle, Plus } from "lucide-react";
import type { ActivityEntry, Job, TeamMember } from "@/lib/types";
import { assignJob, closeJob, currentJob, isFree, setStatus, useOpenJobId, useOps, type OpsState } from "@/lib/store";
import { SheetHint } from "@/components/guide/sheet-hint";
import { clientById } from "@/lib/seed";
import { AVAILABILITY_LABEL, TYPE_LABEL } from "@/lib/labels";
import { formatRange, formatRelative } from "@/lib/utils";

const timelineIcons: Record<ActivityEntry["type"], React.ElementType> = {
  created: Plus,
  status_change: GitCommitHorizontal,
  note_added: MessageSquare,
  assignee_changed: UserCog,
  priority_changed: AlertCircle,
};

/** How an agent stands right now, as shown in the assignment list. */
export function agentState(member: TeamMember, jobs: Job[]): { label: string; free: boolean } {
  if (member.availability !== "on_duty") return { label: AVAILABILITY_LABEL[member.availability], free: false };
  if (isFree(member, jobs)) return { label: "Libre", free: true };
  const job = currentJob(member.id, jobs);
  return { label: job ? `En mission, ${clientById(job.clientId).short}` : "En mission", free: false };
}

export function JobDetailSheet() {
  const ops = useOps();
  const openId = useOpenJobId();
  const job = ops?.jobs.find((j) => j.id === openId) ?? null;

  return (
    <Sheet open={job !== null} onOpenChange={(o) => !o && closeJob()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        {job && ops && <SheetBody job={job} ops={ops} />}
      </SheetContent>
    </Sheet>
  );
}

function SheetBody({ job, ops }: { job: Job; ops: OpsState }) {
  const { team, jobs, activity } = ops;
  const client = clientById(job.clientId);
  const timeline = activity
    .filter((e) => e.jobId === job.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const options = [...team].sort((a, b) => Number(agentState(b, jobs).free) - Number(agentState(a, jobs).free));

  return (
    <>
      <SheetHeader className="pb-4">
        <div className="flex items-center gap-3">
          <SheetTitle className="text-lg">{job.reference}</SheetTitle>
          <StatusBadge status={job.status} unassigned={!job.assigneeId} />
        </div>
        <SheetDescription>
          {TYPE_LABEL[job.type]} · {client.name}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-5">
        <SheetHint job={job} ops={ops} />
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Client :</span>
            <span className="font-medium">{client.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Site :</span>
            <span className="font-medium">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Horaires :</span>
            <span className="font-medium">{formatRange(job.scheduledStart, job.scheduledEnd)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Priorité :</span>
            <PriorityBadge priority={job.priority} />
          </div>
          <div className="flex items-start gap-2 text-sm">
            <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-muted-foreground">Consignes et compte rendu :</span>
              <p className="mt-0.5 text-sm">{job.notes}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <label htmlFor="assignee" className="flex items-center gap-2 text-sm font-semibold">
            <User className="h-4 w-4 text-muted-foreground" />
            Agent affecté
          </label>
          <Select value={job.assigneeId || undefined} onValueChange={(v) => assignJob(job.id, v)} disabled={job.status === "completed"}>
            <SelectTrigger id="assignee" className="w-full" data-testid="assignee-select">
              <SelectValue placeholder="Choisir un agent" />
            </SelectTrigger>
            <SelectContent>
              {options.map((m) => {
                const s = agentState(m, jobs);
                return (
                  <SelectItem key={m.id} value={m.id} disabled={m.availability === "off_duty"} data-free={s.free || undefined}>
                    {m.name} · {s.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-2">
            {job.status === "incident" && (
              <Button onClick={() => setStatus(job.id, "completed", "Incident clôturé : site sécurisé, rapport transmis au client.")}>Clôturer l&apos;incident</Button>
            )}
            {job.status === "pending" && (
              <Button variant="outline" disabled={!job.assigneeId} onClick={() => setStatus(job.id, "in_progress")}>
                Démarrer la mission
              </Button>
            )}
            {job.status === "in_progress" && (
              <Button variant="outline" onClick={() => setStatus(job.id, "completed")}>
                Terminer la mission
              </Button>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="mb-3 text-sm font-semibold">Fil des événements</h3>
          <div className="relative space-y-0">
            <div className="absolute bottom-2 left-[11px] top-2 w-px bg-border" />
            {timeline.map((entry) => {
              const Icon = timelineIcons[entry.type];
              return (
                <div key={entry.id} className="relative flex gap-3 pb-4">
                  <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
                    <Icon className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm">{entry.description}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatRelative(entry.timestamp)} · {entry.actor}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
