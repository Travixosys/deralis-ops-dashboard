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
import { JobsFilterBar } from "./jobs-filter-bar";
import { JobDetailSheet } from "./job-detail-sheet";
import { useDemo } from "@/lib/demo-context";
import { formatDateTime, cn } from "@/lib/utils";
import type { Job, JobStatus, Priority } from "@/lib/types";

type SortKey = "referenceNumber" | "client" | "type" | "assignee" | "status" | "priority" | "scheduledStart";
type SortDir = "asc" | "desc";

const priorityOrder: Record<Priority, number> = { Low: 0, Medium: 1, High: 2, Critical: 3 };
const statusOrder: Record<JobStatus, number> = { Pending: 0, "In Progress": 1, Completed: 2, "Issue Flagged": 3 };

export function JobsList() {
  const { jobs, highlightedJobId } = useDemo();

  // Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");

  // Sort state
  const [sortKey, setSortKey] = useState<SortKey>("scheduledStart");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Detail sheet
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filtered = useMemo(() => {
    let result = jobs;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.referenceNumber.toLowerCase().includes(q) ||
          j.client.toLowerCase().includes(q) ||
          j.assignee.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((j) => j.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      result = result.filter((j) => j.priority === priorityFilter);
    }

    // Sort
    return [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "priority") {
        cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortKey === "status") {
        cmp = statusOrder[a.status] - statusOrder[b.status];
      } else if (sortKey === "scheduledStart") {
        cmp = new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime();
      } else {
        cmp = a[sortKey].localeCompare(b[sortKey]);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [jobs, search, statusFilter, priorityFilter, sortKey, sortDir]);

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
    <div className="space-y-4">
      <JobsFilterBar
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />

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
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No jobs match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((job) => (
                <TableRow
                  key={job.id}
                  className={cn(
                    "cursor-pointer",
                    job.priority === "Critical" && "border-l-4 border-l-red-500",
                    job.status === "Issue Flagged" && "bg-red-50/50 dark:bg-red-950/10",
                    job.id === highlightedJobId && "animate-highlight"
                  )}
                  onClick={() => setSelectedJob(job)}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <JobDetailSheet
        job={selectedJob}
        open={selectedJob !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedJob(null);
        }}
      />
    </div>
  );
}
