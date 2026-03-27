import type { Priority } from "@/lib/types";
import { cn } from "@/lib/utils";

const priorityStyles: Record<Priority, string> = {
  Low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  High: "bg-[#dc2626] text-white",
  Critical: "bg-[#7f1d1d] text-white",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[3px] px-2 py-0.5 text-xs font-medium",
        priorityStyles[priority]
      )}
    >
      {priority}
    </span>
  );
}
