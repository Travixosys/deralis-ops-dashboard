"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import {
  MapPin,
  Clock,
  User,
  Building2,
  FileText,
  GitCommitHorizontal,
  MessageSquare,
  UserCog,
  AlertCircle,
  Plus,
} from "lucide-react";
import type { Job, ActivityTimelineEntry } from "@/lib/types";
import { getTimelineForJob } from "@/lib/mock-data";
import { formatRelativeTime, formatDateTime } from "@/lib/utils";

interface JobDetailSheetProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const timelineIcons: Record<ActivityTimelineEntry["type"], React.ElementType> = {
  created: Plus,
  status_change: GitCommitHorizontal,
  note_added: MessageSquare,
  assignee_changed: UserCog,
  priority_changed: AlertCircle,
};

export function JobDetailSheet({ job, open, onOpenChange }: JobDetailSheetProps) {
  if (!job) return null;

  const timeline = getTimelineForJob(job.id);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <SheetTitle className="text-lg">{job.referenceNumber}</SheetTitle>
            <StatusBadge status={job.status} />
          </div>
          <SheetDescription>{job.type}</SheetDescription>
        </SheetHeader>

        <div className="space-y-5">
          {/* Job Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Client:</span>
              <span className="font-medium">{job.client}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Assignee:</span>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px]">
                    {job.assignee
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{job.assignee}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Scheduled:</span>
              <span className="font-medium">
                {formatDateTime(job.scheduledStart)} — {formatDateTime(job.scheduledEnd)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Priority:</span>
              <PriorityBadge priority={job.priority} />
            </div>
            {job.notes && (
              <div className="flex items-start gap-2 text-sm">
                <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Notes:</span>
                  <p className="mt-0.5 text-sm">{job.notes}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Activity Timeline */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Activity Timeline</h4>
            <div className="relative space-y-0">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

              {timeline.map((entry, i) => {
                const Icon = timelineIcons[entry.type];
                return (
                  <div key={entry.id} className="relative flex gap-3 pb-4">
                    <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
                      <Icon className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm">{entry.description}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatRelativeTime(entry.timestamp)} · {entry.actor}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
