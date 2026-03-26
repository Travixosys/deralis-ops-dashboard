"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Briefcase } from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { MemberJobs } from "./member-jobs";
import { cn } from "@/lib/utils";
import type { AvailabilityStatus } from "@/lib/types";

const avatarColors = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-cyan-600",
  "bg-indigo-600",
  "bg-pink-600",
];

const availabilityStyles: Record<AvailabilityStatus, string> = {
  "On Duty": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Off Duty": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  "On Break": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

export function TeamGrid() {
  const { teamMembers, jobs } = useDemo();
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const selectedMember = teamMembers.find((m) => m.id === selectedMemberId);
  const memberJobs = selectedMemberId
    ? jobs.filter((j) => j.assigneeId === selectedMemberId)
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member, i) => {
          const assignedCount = jobs.filter(
            (j) => j.assigneeId === member.id && j.status !== "Completed"
          ).length;

          return (
            <Card
              key={member.id}
              className={cn(
                "cursor-pointer transition-shadow hover:shadow-md",
                selectedMemberId === member.id && "ring-2 ring-primary"
              )}
              onClick={() =>
                setSelectedMemberId(
                  selectedMemberId === member.id ? null : member.id
                )
              }
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback
                      className={cn(
                        "text-sm font-semibold text-white",
                        avatarColors[i % avatarColors.length]
                      )}
                    >
                      {member.avatarInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {member.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                      availabilityStyles[member.availability]
                    )}
                  >
                    {member.availability}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Briefcase className="h-3 w-3" />
                    <span>{assignedCount} active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedMember && (
        <div>
          <h3 className="mb-3 text-sm font-semibold">
            Jobs assigned to {selectedMember.name}
          </h3>
          <MemberJobs jobs={memberJobs} memberName={selectedMember.name} />
        </div>
      )}
    </div>
  );
}
