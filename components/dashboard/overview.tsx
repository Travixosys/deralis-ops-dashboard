"use client";

import Link from "next/link";
import { KeyTag } from "@/components/ops/key-tag";
import { KeyBoard, boardSummary } from "@/components/ops/key-board";
import { PageTitle, Panel, Skeleton } from "@/components/ops/ui";
import { StatusBadge } from "@/components/status-badge";
import { openJob, useOps, type OpsState } from "@/lib/store";
import { useNow } from "@/lib/use-now";
import { clientById, memberName } from "@/lib/seed";
import { TYPE_LABEL } from "@/lib/labels";
import { cn, formatIn, formatRelative, formatSlot, formatTime } from "@/lib/utils";
import type { Job } from "@/lib/types";

function hoursSince(iso: string, now: number) {
  return Math.max(1, Math.round((now - new Date(iso).getTime()) / 3_600_000));
}

/** The screen's finding, in one sentence: what needs a decision and who can take it. */
function finding(ops: OpsState, now: number): string {
  const incidents = ops.jobs.filter((j) => j.status === "incident");
  const waiting = ops.jobs.filter((j) => j.status !== "completed" && !j.assigneeId);
  const { free } = boardSummary(ops);
  const freeText = free === 0 ? "aucun agent libre" : free === 1 ? "1 agent libre pour intervenir" : `${free} agents libres pour intervenir`;
  if (incidents.length > 0) {
    const first = incidents[0];
    const since = ops.activity.filter((a) => a.jobId === first.id && a.to === "incident").at(-1)?.timestamp;
    const where = first.location.split(",").slice(-1)[0].trim();
    const head = incidents.length === 1 ? `1 incident ouvert chez ${clientById(first.clientId).name} (${where})` : `${incidents.length} incidents ouverts`;
    return `${head}${incidents.length === 1 && since ? `, signalé il y a ${hoursSince(since, now)} h` : ""}. ${freeText[0].toUpperCase()}${freeText.slice(1)}.`;
  }
  if (waiting.length > 0) return `${waiting.length === 1 ? "1 demande client attend" : `${waiting.length} demandes clients attendent`} un agent. ${freeText[0].toUpperCase()}${freeText.slice(1)}.`;
  const next = ops.jobs
    .filter((j) => j.status === "pending")
    .sort((a, b) => +new Date(a.scheduledStart) - +new Date(b.scheduledStart))[0];
  return `Aucun incident ouvert, toutes les demandes ont un agent.${next ? ` Prochaine prise de poste à ${formatTime(next.scheduledStart)}.` : ""}`;
}

function StatusStrip({ ops }: { ops: OpsState }) {
  const incidents = ops.jobs.filter((j) => j.status === "incident").length;
  const waiting = ops.jobs.filter((j) => j.status !== "completed" && !j.assigneeId).length;
  const running = ops.jobs.filter((j) => j.status === "in_progress").length;
  const { onDuty, free } = boardSummary(ops);
  const cells = [
    { label: "Incidents ouverts", value: String(incidents), unit: "", alert: incidents > 0, testId: "kpi-incidents" },
    { label: "Demandes à affecter", value: String(waiting), unit: "", alert: false, testId: "kpi-waiting" },
    { label: "Missions en cours", value: String(running), unit: "", alert: false, testId: "kpi-running" },
    { label: "Agents libres", value: String(free), unit: ` / ${onDuty} en service`, alert: false, testId: "kpi-free" },
  ];
  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-[10px] border lg:grid-cols-4">
      {cells.map((c, i) => (
        <div
          key={c.label}
          className={cn(
            "px-4 py-3.5",
            i % 2 === 1 && "border-l",
            i >= 2 && "border-t lg:border-t-0",
            i === 2 && "lg:border-l",
            c.alert && "bg-negative-tint"
          )}
          data-testid={c.testId}
        >
          <dt className={cn("text-[13px]", c.alert ? "text-negative-ink" : "text-muted-ink")}>{c.label}</dt>
          <dd className="mt-1 flex items-baseline">
            <span className={cn("num text-[28px] font-semibold leading-8 tracking-[-0.02em]", c.alert && "text-negative-ink")}>{c.value}</span>
            {c.unit && <span className="num ml-1 text-[13px] text-muted-ink">{c.unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function QueueRow({ job, ops, now }: { job: Job; ops: OpsState; now: number }) {
  const incident = job.status === "incident";
  const since = incident ? ops.activity.filter((a) => a.jobId === job.id && a.to === "incident").at(-1)?.timestamp : job.createdAt;
  return (
    <li className="flex flex-col gap-3 border-t px-4 py-3.5 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <KeyTag clientId={job.clientId} className="mt-0.5" />
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] font-medium leading-5">
            <StatusBadge status={job.status} unassigned={!job.assigneeId} />
            <span>{clientById(job.clientId).name}</span>
          </p>
          <p className="mt-1 text-[14px] leading-5">
            {TYPE_LABEL[job.type]}, {job.location}
          </p>
          <p className="mt-0.5 text-[13px] leading-5 text-muted-ink">
            {incident
              ? `${memberName(job.assigneeId)} sur place${since ? `, signalé ${formatRelative(since, new Date(now))}` : ""}`
              : `Début ${formatSlot(job.scheduledStart, new Date(now))} (${formatIn(job.scheduledStart, new Date(now))}), reçue ${since ? formatRelative(since, new Date(now)) : ""}`}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => openJob(job.id)}
        className={cn(
          "inline-flex min-h-11 flex-none items-center justify-center rounded-md px-3.5 text-[14px] font-medium transition-colors sm:min-h-9",
          incident ? "bg-ink text-sheet hover:bg-ink/85" : "bg-sheet border border-control hover:bg-raised"
        )}
        data-testid={`queue-open-${job.id}`}
      >
        {incident ? "Traiter l'incident" : "Affecter un agent"}
      </button>
    </li>
  );
}

function ActionQueue({ ops, now }: { ops: OpsState; now: number }) {
  const items = [...ops.jobs.filter((j) => j.status === "incident"), ...ops.jobs.filter((j) => j.status !== "completed" && j.status !== "incident" && !j.assigneeId)];
  return (
    <Panel title="À traiter" meta={<span className="num">{items.length === 0 ? "rien en attente" : `${items.length} en attente`}</span>} testId="action-queue">
      {items.length === 0 ? (
        <p className="border-t px-4 py-4 text-[14px] text-muted-ink">
          Rien à traiter : aucun incident ouvert et chaque demande a son agent. Les nouveaux signalements du terrain apparaissent ici en premier.
        </p>
      ) : (
        <ul>
          {items.map((job) => (
            <QueueRow key={job.id} job={job} ops={ops} now={now} />
          ))}
        </ul>
      )}
    </Panel>
  );
}

function ShiftBar({ job, now }: { job: Job; now: number }) {
  const start = new Date(job.scheduledStart).getTime();
  const end = new Date(job.scheduledEnd).getTime();
  const ratio = Math.min(1, Math.max(0, (now - start) / (end - start)));
  return (
    <div className="w-full">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-raised border border-rule" aria-hidden>
        <div className={cn("h-full rounded-full", job.status === "incident" ? "bg-negative" : "bg-covered")} style={{ width: `${ratio * 100}%` }} />
      </div>
      <div className="num mt-1 flex justify-between text-[12px] text-muted-ink">
        <span>{formatTime(job.scheduledStart)}</span>
        <span>fin {formatTime(job.scheduledEnd)}</span>
      </div>
    </div>
  );
}

function LiveMissions({ ops, now }: { ops: OpsState; now: number }) {
  const live = ops.jobs
    .filter((j) => j.status === "in_progress" || j.status === "incident")
    .sort((a, b) => +new Date(a.scheduledEnd) - +new Date(b.scheduledEnd));
  return (
    <Panel title="Missions en cours" meta={<span className="num">{live.length} sur site</span>}>
      {live.length === 0 ? (
        <p className="border-t px-4 py-4 text-[14px] text-muted-ink">Aucune mission en cours.</p>
      ) : (
        <ul>
          {live.map((job) => (
            <li key={job.id} className="border-t">
              <button
                type="button"
                onClick={() => openJob(job.id)}
                className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-4 py-3 text-left hover:bg-raised sm:grid-cols-[auto_minmax(0,1fr)_150px_180px]"
              >
                <KeyTag clientId={job.clientId} />
                <span className="min-w-0">
                  <span className="block text-[14px] font-medium leading-5">{job.location}</span>
                  <span className="block text-[13px] leading-5 text-muted-ink">
                    {TYPE_LABEL[job.type]} · {clientById(job.clientId).name}
                  </span>
                </span>
                <span className="col-start-2 truncate text-[13px] sm:col-start-auto">
                  {job.status === "incident" ? <span className="font-medium text-negative-ink">Incident · </span> : null}
                  {memberName(job.assigneeId)}
                </span>
                <span className="col-start-2 sm:col-start-auto">
                  <ShiftBar job={job} now={now} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function Upcoming({ ops, now }: { ops: OpsState; now: number }) {
  const horizon = now + 24 * 3_600_000;
  const all = ops.jobs
    .filter((j) => j.status === "pending" && new Date(j.scheduledStart).getTime() <= horizon)
    .sort((a, b) => +new Date(a.scheduledStart) - +new Date(b.scheduledStart));
  const rows = all.slice(0, 6);
  return (
    <Panel
      title="Prises de poste, 24 prochaines heures"
      meta={
        <Link href="/jobs" className="inline-flex min-h-11 items-center font-medium text-ink underline decoration-control underline-offset-4 hover:decoration-ink md:min-h-0">
          Toutes les missions
        </Link>
      }
    >
      {rows.length === 0 ? (
        <p className="border-t px-4 py-4 text-[14px] text-muted-ink">Aucune prise de poste dans les 24 prochaines heures.</p>
      ) : (
        <ul>
          {rows.map((job) => (
            <li key={job.id} className="border-t">
              <button type="button" onClick={() => openJob(job.id)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-raised">
                <span className="w-[86px] flex-none">
                  <span className="num block text-[15px] font-semibold leading-5">{formatSlot(job.scheduledStart, new Date(now))}</span>
                  <span className="num block text-[12px] leading-4 text-muted-ink">{formatIn(job.scheduledStart, new Date(now))}</span>
                </span>
                <KeyTag clientId={job.clientId} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] leading-5">
                    {TYPE_LABEL[job.type]}, {job.location}
                  </span>
                  <span className="block truncate text-[13px] leading-5 text-muted-ink">{job.assigneeId ? memberName(job.assigneeId) : "Sans agent"}</span>
                </span>
                {!job.assigneeId && <StatusBadge status={job.status} unassigned />}
              </button>
            </li>
          ))}
        </ul>
      )}
      {all.length > rows.length && <p className="num border-t px-4 py-2.5 text-[13px] text-muted-ink">+ {all.length - rows.length} autres dans les 24 h</p>}
    </Panel>
  );
}

export function Overview() {
  const ops = useOps();
  const now = useNow();

  if (!ops || !now) {
    return (
      <div className="space-y-6" aria-busy="true">
        <PageTitle title="Tableau de bord" sub="Chargement de la situation…" />
        <Skeleton className="h-[86px]" />
        <div className="grid gap-6 lg:grid-cols-12">
          <Skeleton className="h-64 lg:col-span-8" />
          <Skeleton className="h-64 lg:col-span-4" />
        </div>
      </div>
    );
  }

  const { onDuty, free } = boardSummary(ops);

  return (
    <div className="space-y-6">
      <PageTitle
        title="Tableau de bord"
        sub={<span data-testid="finding">{finding(ops, now)}</span>}
        right={<span className="num">Situation à {formatTime(new Date(now).toISOString())}</span>}
      />
      <StatusStrip ops={ops} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ActionQueue ops={ops} now={now} />
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:row-span-3 lg:row-start-1">
          <Panel title="Tableau des agents" meta={<span className="num">{free} libres · {onDuty} en service</span>} className="lg:sticky lg:top-0">
            <KeyBoard ops={ops} />
          </Panel>
        </div>
        <div className="lg:col-span-8">
          <LiveMissions ops={ops} now={now} />
        </div>
        <div className="lg:col-span-8">
          <Upcoming ops={ops} now={now} />
        </div>
      </div>
    </div>
  );
}
