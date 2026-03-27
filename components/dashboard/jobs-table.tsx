"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { useDemo } from "@/lib/demo-context";
import { formatDateTime, cn } from "@/lib/utils";
import type { Job } from "@/lib/types";

type SortKey = "referenceNumber" | "client" | "type" | "assignee" | "status" | "priority" | "scheduledStart";
type SortDir = "asc" | "desc";

const priorityOrder = { Low: 0, Medium: 1, High: 2, Critical: 3 };
const statusOrder = { Pending: 0, "In Progress": 1, Completed: 2, "Issue Flagged": 3 };

function sortJobs(jobs: Job[], key: SortKey, dir: SortDir): Job[] {
  return [...jobs].sort((a, b) => {
    let cmp = 0;
    if (key === "priority") {
      cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (key === "status") {
      cmp = statusOrder[a.status] - statusOrder[b.status];
    } else if (key === "scheduledStart") {
      cmp = new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime();
    } else {
      cmp = a[key].localeCompare(b[key]);
    }
    return dir === "asc" ? cmp : -cmp;
  });
}

export function JobsTable() {
  const { jobs, highlightedJobId } = useDemo();
  const [sortKey, setSortKey] = useState<SortKey>("scheduledStart");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(() => sortJobs(jobs, sortKey, sortDir), [jobs, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: "referenceNumber", label: "Reference" },
    { key: "client", label: "Client" },
    { key: "type", label: "Type" },
    { key: "assignee", label: "Assignee" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
    { key: "scheduledStart", label: "Scheduled" },
  ];

  return (
    <div className="rounded border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className="cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((job) => (
            <TableRow
              key={job.id}
              className={cn(
                job.priority === "Critical" && "border-l-4 border-l-red-500",
                job.status === "Issue Flagged" && "bg-red-50/50 dark:bg-red-950/10",
                job.id === highlightedJobId && "animate-highlight"
              )}
            >
              <TableCell className="font-mono text-xs">{job.referenceNumber}</TableCell>
              <TableCell className="text-sm">{job.client}</TableCell>
              <TableCell className="text-sm">{job.type}</TableCell>
              <TableCell className="text-sm">{job.assignee}</TableCell>
              <TableCell><StatusBadge status={job.status} /></TableCell>
              <TableCell><PriorityBadge priority={job.priority} /></TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateTime(job.scheduledStart)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
