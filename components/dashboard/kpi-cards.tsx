"use client";

import { Briefcase, CheckCircle, Users, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDemo } from "@/lib/demo-context";
import { cn } from "@/lib/utils";

export function KpiCards() {
  const { jobs, teamMembers, pulseTrigger } = useDemo();

  const activeJobs = jobs.filter(
    (j) => j.status === "Pending" || j.status === "In Progress"
  ).length;
  const completedToday = jobs.filter((j) => {
    if (j.status !== "Completed") return false;
    const today = new Date().toDateString();
    return new Date(j.scheduledEnd).toDateString() === today;
  }).length;
  const teamAvailable = teamMembers.filter(
    (m) => m.availability === "On Duty"
  ).length;
  const issuesFlagged = jobs.filter(
    (j) => j.status === "Issue Flagged"
  ).length;

  const cards = [
    {
      label: "Total Active Jobs",
      value: activeJobs,
      icon: Briefcase,
      trend: "+3 from yesterday",
      trendUp: true,
      iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      pulse: false,
    },
    {
      label: "Completed Today",
      value: completedToday,
      icon: CheckCircle,
      trend: "+2 from yesterday",
      trendUp: true,
      iconBg: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      pulse: false,
    },
    {
      label: "Team Available",
      value: `${teamAvailable}/${teamMembers.length}`,
      icon: Users,
      trend: "1 on break",
      trendUp: null,
      iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      pulse: false,
    },
    {
      label: "Issues Flagged",
      value: issuesFlagged,
      icon: AlertTriangle,
      trend: issuesFlagged > 0 ? "Requires attention" : "All clear",
      trendUp: issuesFlagged > 0 ? false : true,
      iconBg: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      pulse: issuesFlagged > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className={cn(
            "transition-shadow",
            card.pulse && "animate-pulse-red"
          )}
          // Re-trigger animation when pulseTrigger changes
          data-pulse={pulseTrigger}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-2xl font-bold">{card.value}</p>
              </div>
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", card.iconBg)}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <p
              className={cn(
                "mt-2 text-xs",
                card.trendUp === true && "text-green-600 dark:text-green-400",
                card.trendUp === false && "text-red-600 dark:text-red-400",
                card.trendUp === null && "text-muted-foreground"
              )}
            >
              {card.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
