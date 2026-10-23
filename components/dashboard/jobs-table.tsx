"use client";

import { MissionTable } from "@/components/jobs/mission-table";
import { useOps } from "@/lib/store";

export function JobsTable() {
  const ops = useOps();
  if (!ops) return null;
  return <MissionTable jobs={ops.jobs} />;
}
