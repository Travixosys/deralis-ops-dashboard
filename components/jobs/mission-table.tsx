"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { openJob } from "@/lib/store";
import { clientById, memberName } from "@/lib/seed";
import { PRIORITY_ORDER, STATUS_ORDER, TYPE_LABEL } from "@/lib/labels";
import { cn, formatSlot } from "@/lib/utils";
import type { Job } from "@/lib/types";

type SortKey = "reference" | "client" | "type" | "assignee" | "status" | "priority" | "scheduledStart";
type SortDir = "asc" | "desc";

function value(job: Job, key: SortKey): string | number {
  switch (key) {
    case "client":
      return clientById(job.clientId).name;
    case "type":
      return TYPE_LABEL[job.type];
    case "assignee":
      return job.assigneeId ? memberName(job.assigneeId) : "";
    case "status":
      return STATUS_ORDER[job.status];
    case "priority":
      return PRIORITY_ORDER[job.priority];
    case "scheduledStart":
      return new Date(job.scheduledStart).getTime();
    default:
      return job.reference;
  }
}

const columns: { key: SortKey; label: string }[] = [
  { key: "reference", label: "Référence" },
  { key: "client", label: "Client" },
  { key: "type", label: "Type" },
  { key: "assignee", label: "Agent" },
  { key: "status", label: "Statut" },
  { key: "priority", label: "Priorité" },
  { key: "scheduledStart", label: "Début" },
];

export function MissionTable({ jobs, empty = "Aucune mission ne correspond aux filtres." }: { jobs: Job[]; empty?: string }) {
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

  return (
    <div className="rounded border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className="cursor-pointer select-none hover:bg-muted/50" onClick={() => handleSort(col.key)}>
                <div className="flex items-center gap-1">
                  {col.label}
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                {empty}
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((job) => (
              <TableRow
                key={job.id}
                className={cn("cursor-pointer", job.status === "incident" && "bg-red-50/50")}
                onClick={() => openJob(job.id)}
              >
                <TableCell className="font-mono text-xs">{job.reference}</TableCell>
                <TableCell className="text-sm">{clientById(job.clientId).name}</TableCell>
                <TableCell className="text-sm">{TYPE_LABEL[job.type]}</TableCell>
                <TableCell className="text-sm">{job.assigneeId ? memberName(job.assigneeId) : "À affecter"}</TableCell>
                <TableCell>
                  <StatusBadge status={job.status} unassigned={!job.assigneeId} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={job.priority} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatSlot(job.scheduledStart)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
