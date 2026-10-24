"use client";

import { useState } from "react";
import { KeyTag } from "./key-tag";
import { Initials } from "./ui";
import { currentJob, isFree, openJob, type OpsState } from "@/lib/store";
import { AVAILABILITY_LABEL } from "@/lib/labels";
import { cn, formatTime } from "@/lib/utils";
import type { Job, TeamMember } from "@/lib/types";

/** The tag on one hook. Swings once when a different mission is hung on it, never on first render. */
function HookTag({ job }: { job: Job }) {
  const [prev, setPrev] = useState(job.id);
  const [swing, setSwing] = useState(false);
  if (prev !== job.id) {
    setPrev(job.id);
    setSwing(true);
  }
  return <KeyTag key={swing ? `${job.id}-swing` : job.id} clientId={job.clientId} swing={swing} />;
}

function HookRow({ member, index, jobs, interactive }: { member: TeamMember; index: number; jobs: Job[]; interactive: boolean }) {
  const job = currentJob(member.id, jobs);
  const free = isFree(member, jobs);
  const off = member.availability !== "on_duty";

  const right = job ? (
    <span className="flex items-center gap-2">
      <span className={cn("num text-[13px]", job.status === "incident" ? "font-medium text-negative-ink" : "text-muted-ink")}>
        {job.status === "incident" ? "Sur incident" : `fin ${formatTime(job.scheduledEnd)}`}
      </span>
      <HookTag job={job} />
    </span>
  ) : free ? (
    <span className="inline-flex h-[22px] items-center gap-1.5 rounded-full bg-covered-tint px-2.5 text-[12px] font-medium text-covered-ink">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-covered" />
      Libre
    </span>
  ) : (
    <span className="text-[13px] text-muted-ink">{AVAILABILITY_LABEL[member.availability]}</span>
  );

  const content = (
    <>
      <span
        aria-hidden
        className={cn(
          "h-2 w-2 flex-none rounded-full border",
          job ? (job.status === "incident" ? "border-negative bg-negative" : "border-running bg-running") : off ? "border-control bg-sheet" : "border-covered bg-covered"
        )}
      />
      <Initials initials={member.initials} index={index} className={cn(off && "opacity-60")} />
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-[14px] font-medium leading-5", off && "text-muted-ink")}>{member.name}</span>
        <span className="block truncate text-[12px] leading-4 text-muted-ink">{member.role}</span>
      </span>
      {right}
    </>
  );

  if (job && interactive) {
    return (
      <li>
        <button
          type="button"
          onClick={() => openJob(job.id)}
          className="flex min-h-[52px] w-full items-center gap-3 rounded-md px-2 text-left hover:bg-raised"
          aria-label={`${member.name}, ${job.status === "incident" ? "incident en cours" : "en mission"} : ouvrir la mission`}
        >
          {content}
        </button>
      </li>
    );
  }
  return <li className="flex min-h-[52px] items-center gap-3 px-2">{content}</li>;
}

/**
 * The key board of the guard post: one hook per agent, in a fixed order like the real board.
 * An agent on a mission carries the site's tag; a free agent's hook is empty and ready for one.
 */
export function KeyBoard({ ops, interactive = true }: { ops: OpsState; interactive?: boolean }) {
  return (
    <ul className="px-2 pb-2" data-testid="key-board">
      {ops.team.map((m, i) => (
        <HookRow key={m.id} member={m} index={i} jobs={ops.jobs} interactive={interactive} />
      ))}
    </ul>
  );
}

export function boardSummary(ops: OpsState) {
  const onDuty = ops.team.filter((m) => m.availability === "on_duty").length;
  const free = ops.team.filter((m) => isFree(m, ops.jobs)).length;
  return { onDuty, free };
}
