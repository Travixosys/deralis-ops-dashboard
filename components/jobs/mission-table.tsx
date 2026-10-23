"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { KeyTag } from "@/components/ops/key-tag";
import { openJob } from "@/lib/store";
import { clientById, memberName } from "@/lib/seed";
import { PRIORITY_ORDER, STATUS_ORDER, TYPE_LABEL } from "@/lib/labels";
import { cn, formatRange, formatSlot } from "@/lib/utils";
import type { Job } from "@/lib/types";

type SortKey = "site" | "type" | "assignee" | "scheduledStart" | "status" | "priority";
type SortDir = "asc" | "desc";

function value(job: Job, key: SortKey): string | number {
  switch (key) {
    case "site":
      return clientById(job.clientId).name + job.location;
    case "type":
      return TYPE_LABEL[job.type];
    case "assignee":
      return job.assigneeId ? memberName(job.assigneeId) : "";
    case "status":
      return job.assigneeId || job.status === "completed" ? STATUS_ORDER[job.status] + 0.5 : STATUS_ORDER.incident + 0.25;
    case "priority":
      return -PRIORITY_ORDER[job.priority];
    default:
      return new Date(job.scheduledStart).getTime();
  }
}

const columns: { key: SortKey; label: string; className?: string }[] = [
  { key: "site", label: "Site et mission", className: "w-[36%]" },
  { key: "type", label: "Type" },
  { key: "assignee", label: "Agent" },
  { key: "scheduledStart", label: "Horaires" },
  { key: "status", label: "Statut" },
  { key: "priority", label: "Priorité" },
];

export function MissionTable({ jobs, empty }: { jobs: Job[]; empty: React.ReactNode }) {
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(
    () =>
      [...jobs].sort((a, b) => {
        const va = value(a, sortKey);
        const vb = value(b, sortKey);
        let cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb), "fr");
        if (cmp === 0) cmp = new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime();
        return sortDir === "asc" ? cmp : -cmp;
      }),
    [jobs, sortKey, sortDir]
  );

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  if (sorted.length === 0) {
    return <div className="rounded-[10px] border border-dashed px-4 py-6 text-[14px] text-muted-ink">{empty}</div>;
  }

  return (
    <>
      {/* Desktop and tablet: a real table, rules and alignment, no card around it */}
      <table className="hidden w-full text-[14px] md:table">
        <thead>
          <tr>
            {columns.map((col) => {
              const active = col.key === sortKey;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
                  className={cn("h-10 border-b px-3 text-left align-middle text-[12px] font-normal text-muted-ink first:pl-0", col.className)}
                >
                  <button type="button" onClick={() => handleSort(col.key)} className={cn("inline-flex items-center gap-1 hover:text-ink", active && "text-ink")}>
                    {col.label}
                    {active && (sortDir === "asc" ? <ArrowDown className="h-3 w-3" aria-hidden /> : <ArrowUp className="h-3 w-3" aria-hidden />)}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((job) => (
            <tr
              key={job.id}
              onClick={() => openJob(job.id)}
              className={cn("cursor-pointer border-b border-rule hover:bg-raised", job.status === "incident" && "bg-negative-tint/60 hover:bg-negative-tint")}
            >
              <td className="py-3 pr-3">
                <div className="flex items-start gap-3">
                  <KeyTag clientId={job.clientId} className="mt-px" />
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openJob(job.id);
                      }}
                      className="block max-w-full truncate text-left font-medium leading-5 hover:underline"
                    >
                      {job.location}
                    </button>
                    <span className="block truncate text-[13px] leading-5 text-muted-ink">
                      {clientById(job.clientId).name} · <span className="num">{job.reference}</span>
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 align-top leading-5">{TYPE_LABEL[job.type]}</td>
              <td className="px-3 py-3 align-top leading-5">{job.assigneeId ? memberName(job.assigneeId) : <span className="text-muted-ink">Sans agent</span>}</td>
              <td className="num px-3 py-3 align-top leading-5 whitespace-nowrap">{formatRange(job.scheduledStart, job.scheduledEnd)}</td>
              <td className="px-3 py-3 align-top">
                <StatusBadge status={job.status} unassigned={!job.assigneeId} />
              </td>
              <td className="py-3 pl-3 align-top leading-5">
                <PriorityBadge priority={job.priority} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phone: two-line rows, every field kept */}
      <ul className="md:hidden">
        {sorted.map((job) => (
          <li key={job.id} className={cn("border-b border-rule", job.status === "incident" && "bg-negative-tint/60")}>
            <button type="button" onClick={() => openJob(job.id)} className="flex w-full items-start gap-3 py-3 text-left">
              <KeyTag clientId={job.clientId} className="mt-0.5" />
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="text-[15px] font-medium leading-5">{job.location}</span>
                  <StatusBadge status={job.status} unassigned={!job.assigneeId} />
                </span>
                <span className="mt-1 block text-[13px] leading-5 text-muted-ink">
                  {TYPE_LABEL[job.type]} · {job.assigneeId ? memberName(job.assigneeId) : "Sans agent"} · <span className="num">{formatSlot(job.scheduledStart)}</span>
                </span>
                <span className="block text-[13px] leading-5 text-muted-ink">
                  {clientById(job.clientId).name} · <PriorityBadge priority={job.priority} className="text-[13px]" />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
