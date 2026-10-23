import type { Priority } from "@/lib/types";
import { PRIORITY_LABEL } from "@/lib/labels";
import { cn } from "@/lib/utils";

const priorityStyles: Record<Priority, string> = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-[#dc2626] text-white",
  critical: "bg-[#7f1d1d] text-white",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex flex-none items-center whitespace-nowrap rounded-[3px] px-2 py-0.5 text-xs font-medium",
        priorityStyles[priority]
      )}
    >
      {PRIORITY_LABEL[priority]}
    </span>
  );
}
