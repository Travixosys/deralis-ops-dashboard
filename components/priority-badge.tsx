import type { Priority } from "@/lib/types";
import { cn } from "@/lib/utils";

const priorityStyles: Record<Priority, string> = {
  Low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  High: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        priorityStyles[priority]
      )}
    >
      {priority}
    </span>
  );
}
