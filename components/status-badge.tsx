import type { JobStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/labels";
import { cn } from "@/lib/utils";

// One status mark per row: a pale pill with dark text of the same hue, colour only where it means something.
const statusStyles: Record<JobStatus, string> = {
  incident: "bg-negative-tint text-negative-ink",
  in_progress: "bg-running-tint text-running",
  pending: "bg-raised text-ink border",
  completed: "text-muted-ink",
};

export function StatusBadge({ status, unassigned, className }: { status: JobStatus; unassigned?: boolean; className?: string }) {
  const waiting = unassigned && status !== "completed";
  return (
    <span
      className={cn(
        "inline-flex h-[22px] flex-none items-center gap-1.5 whitespace-nowrap rounded-full text-[12px] font-medium",
        status === "completed" && !waiting ? "px-0" : "px-2.5",
        waiting ? "bg-waiting-tint text-waiting-ink border border-waiting-line" : statusStyles[status],
        className
      )}
    >
      {status === "incident" && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-negative" />}
      {waiting ? "À affecter" : STATUS_LABEL[status]}
    </span>
  );
}
