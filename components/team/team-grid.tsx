"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Briefcase } from "lucide-react";
import { useOps } from "@/lib/store";
import { MemberJobs } from "./member-jobs";
import { agentState } from "@/components/jobs/job-detail-sheet";
import { cn } from "@/lib/utils";

const avatarColors = ["bg-blue-600", "bg-emerald-600", "bg-violet-600", "bg-rose-600", "bg-amber-600", "bg-cyan-600", "bg-indigo-600", "bg-pink-600"];

export function TeamGrid() {
  const ops = useOps();
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  if (!ops) return null;
  const { team, jobs } = ops;

  const selectedMember = team.find((m) => m.id === selectedMemberId);
  const memberJobs = selectedMemberId
    ? jobs
        .filter((j) => j.assigneeId === selectedMemberId && j.status !== "completed")
        .sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime())
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member, i) => {
          const assignedCount = jobs.filter((j) => j.assigneeId === member.id && j.status !== "completed").length;
          const state = agentState(member, jobs);
          return (
            <Card
              key={member.id}
              className={cn("cursor-pointer transition-shadow hover:shadow-md", selectedMemberId === member.id && "ring-2 ring-primary")}
              onClick={() => setSelectedMemberId(selectedMemberId === member.id ? null : member.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className={cn("text-sm font-semibold text-white", avatarColors[i % avatarColors.length])}>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{member.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                      state.free ? "bg-green-100 text-green-800" : member.availability === "on_duty" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {state.label}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Briefcase className="h-3 w-3" />
                    <span>{assignedCount} à venir ou en cours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedMember && (
        <div>
          <h2 className="mb-3 text-sm font-semibold">Missions de {selectedMember.name}</h2>
          <MemberJobs jobs={memberJobs} memberName={selectedMember.name} />
        </div>
      )}
    </div>
  );
}
