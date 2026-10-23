import type { JobStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/labels";
import { cn } from "@/lib/utils";

const statusStyles: Record<JobStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  incident: "bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]",
};

export function StatusBadge({ status, unassigned }: { status: JobStatus; unassigned?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex flex-none items-center whitespace-nowrap rounded-[3px] px-2 py-0.5 text-xs font-medium",
        unassigned ? "border border-dashed border-gray-400 bg-white text-gray-700" : statusStyles[status]
      )}
    >
      {unassigned ? "À affecter" : STATUS_LABEL[status]}
    </span>
  );
}
