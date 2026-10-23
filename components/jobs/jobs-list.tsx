"use client";

import { useMemo, useState } from "react";
import { JobsFilterBar } from "./jobs-filter-bar";
import { MissionTable } from "./mission-table";
import { useOps } from "@/lib/store";
import { clientById, memberName } from "@/lib/seed";
import type { JobStatus, Priority } from "@/lib/types";

export function JobsList() {
  const ops = useOps();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");

  const filtered = useMemo(() => {
    let result = ops?.jobs ?? [];
    if (search) {
      const q = search.toLocaleLowerCase("fr");
      result = result.filter((j) =>
        [j.reference, clientById(j.clientId).name, j.location, j.assigneeId ? memberName(j.assigneeId) : "à affecter"]
          .join(" ")
          .toLocaleLowerCase("fr")
          .includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter((j) => j.status === statusFilter);
    if (priorityFilter !== "all") result = result.filter((j) => j.priority === priorityFilter);
    return result;
  }, [ops, search, statusFilter, priorityFilter]);

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
      {ops && <MissionTable jobs={filtered} />}
    </div>
  );
}
