import type { Priority } from "@/lib/types";
import { PRIORITY_LABEL } from "@/lib/labels";
import { cn } from "@/lib/utils";

// Priority is words, not a second set of coloured blocks: only "Critique" carries the signal colour.
const priorityStyles: Record<Priority, string> = {
  low: "text-muted-ink",
  medium: "text-muted-ink",
  high: "text-ink font-semibold",
  critical: "text-negative-ink font-semibold",
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span className={cn("inline-flex flex-none items-center whitespace-nowrap text-[13px]", priorityStyles[priority], className)}>
      {PRIORITY_LABEL[priority]}
    </span>
  );
}
