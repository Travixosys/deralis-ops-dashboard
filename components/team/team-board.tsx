"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { KeyTag } from "@/components/ops/key-tag";
import { Initials, PageTitle, Panel, Skeleton } from "@/components/ops/ui";
import { StatusBadge } from "@/components/status-badge";
import { openJob, useOps, type OpsState } from "@/lib/store";
import { agentState, type AgentKind } from "@/lib/agent";
import { boardSummary } from "@/components/ops/key-board";
import { TYPE_LABEL } from "@/lib/labels";
import { useNow } from "@/lib/use-now";
import { cn, formatRange, formatSlot, formatTime } from "@/lib/utils";

function StatePill({ kind, label }: { kind: AgentKind; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] flex-none items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[12px] font-medium",
        kind === "free" && "bg-covered-tint text-covered-ink",
        kind === "incident" && "bg-negative-tint text-negative-ink",
        kind === "busy" && "bg-raised text-ink border",
        (kind === "break" || kind === "off") && "text-muted-ink"
      )}
    >
      {(kind === "free" || kind === "incident") && <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", kind === "free" ? "bg-covered" : "bg-negative")} />}
      {label}
    </span>
  );
}

function AgentDetail({ ops, memberId, now }: { ops: OpsState; memberId: string; now: number }) {
  const index = ops.team.findIndex((m) => m.id === memberId);
  const member = ops.team[index];
  const state = agentState(member, ops.jobs);
  const planning = ops.jobs
    .filter((j) => j.assigneeId === member.id && j.status !== "completed")
    .sort((a, b) => +new Date(a.scheduledStart) - +new Date(b.scheduledStart));
  const done = ops.jobs
    .filter((j) => j.assigneeId === member.id && j.status === "completed")
    .sort((a, b) => +new Date(b.scheduledEnd) - +new Date(a.scheduledEnd))
    .slice(0, 2);
  const nowDate = new Date(now);

  return (
    <Panel title={`Planning de ${member.name}`} meta={<StatePill kind={state.kind} label={state.label} />} testId="agent-detail">
      <div className="flex items-center gap-3 border-t px-4 py-3">
        <Initials initials={member.initials} index={index} size={40} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-medium">{member.role}</p>
          <p className="num flex items-center gap-1.5 text-[13px] text-muted-ink">
            <Phone className="h-3.5 w-3.5" aria-hidden />
            {member.phone}
          </p>
        </div>
      </div>
      {planning.length === 0 ? (
        <p className="border-t px-4 py-4 text-[14px] text-muted-ink">Aucune mission en cours ou planifiée.</p>
      ) : (
        <ul>
          {planning.map((job) => (
            <li key={job.id} className="border-t">
              <button type="button" onClick={() => openJob(job.id)} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-raised">
                <KeyTag clientId={job.clientId} className="mt-0.5" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium leading-5">{job.location}</span>
                  <span className="num block text-[13px] leading-5 text-muted-ink">
                    {TYPE_LABEL[job.type]} · {formatRange(job.scheduledStart, job.scheduledEnd, nowDate)}
                  </span>
                </span>
                <StatusBadge status={job.status} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {done.length > 0 && (
        <div className="border-t px-4 py-3">
          <p className="text-[13px] font-medium text-muted-ink">Terminées récemment</p>
          <ul className="mt-1.5 space-y-1">
            {done.map((job) => (
              <li key={job.id} className="flex items-center gap-2 text-[13px] text-muted-ink">
                <KeyTag clientId={job.clientId} />
                <span className="min-w-0 flex-1 truncate">{job.location}</span>
                <span className="num flex-none">{formatSlot(job.scheduledEnd, nowDate)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}

export function TeamBoard() {
  const ops = useOps();
  const now = useNow();
  const [selected, setSelected] = useState("tm-001");

  if (!ops || !now) {
    return (
      <div className="space-y-6" aria-busy="true">
        <PageTitle title="Équipe" sub="Chargement de l'équipe…" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const { onDuty, free } = boardSummary(ops);

  return (
    <div className="space-y-6">
      <PageTitle
        title="Équipe"
        sub={`${onDuty} agents en service sur ${ops.team.length}, dont ${free} libre${free > 1 ? "s" : ""} pour intervenir. Choisissez un agent pour voir son planning.`}
      />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <Panel title="Agents" meta={<span className="num">{ops.team.length} agents</span>} className="lg:col-span-7" testId="team-list">
          <ul>
            {ops.team.map((m, i) => {
              const s = agentState(m, ops.jobs);
              const next = ops.jobs
                .filter((j) => j.assigneeId === m.id && j.status === "pending")
                .sort((a, b) => +new Date(a.scheduledStart) - +new Date(b.scheduledStart))[0];
              const active = selected === m.id;
              return (
                <li key={m.id} className="border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(m.id);
                      if (window.innerWidth < 1024) {
                        requestAnimationFrame(() => document.getElementById("agent-detail")?.scrollIntoView({ behavior: "smooth", block: "start" }));
                      }
                    }}
                    aria-pressed={active}
                    className={cn("flex min-h-[60px] w-full items-center gap-3 px-4 py-2.5 text-left", active ? "bg-frame" : "hover:bg-raised")}
                    data-testid={`agent-${m.id}`}
                  >
                    <Initials initials={m.initials} index={i} className={cn((s.kind === "off" || s.kind === "break") && "opacity-60")} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium leading-5">{m.name}</span>
                      <span className="block text-[13px] leading-5 text-muted-ink">
                        {s.job ? `${s.job.location}, jusqu'à ${formatTime(s.job.scheduledEnd)}` : next ? `Prochaine mission ${formatSlot(next.scheduledStart, new Date(now))}` : m.role}
                      </span>
                    </span>
                    {s.job && <KeyTag clientId={s.job.clientId} className="hidden sm:inline-flex" />}
                    <StatePill kind={s.kind} label={s.kind === "busy" || s.kind === "incident" ? (s.kind === "busy" ? "En mission" : "Sur incident") : s.label} />
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>
        <div id="agent-detail" className="scroll-mt-4 lg:col-span-5">
          <AgentDetail ops={ops} memberId={selected} now={now} />
        </div>
      </div>
    </div>
  );
}
