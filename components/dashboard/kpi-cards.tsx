"use client";

import { Briefcase, CheckCircle, Users, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useOps } from "@/lib/store";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

export function KpiCards() {
  const ops = useOps();
  const now = useNow();
  if (!ops) return <div className="h-[124px]" />;
  const { jobs, team } = ops;

  const activeJobs = jobs.filter((j) => j.status === "pending" || j.status === "in_progress").length;
  const completed24h = jobs.filter(
    (j) => j.status === "completed" && now - new Date(j.scheduledEnd).getTime() < 24 * 3_600_000
  ).length;
  const onDuty = team.filter((m) => m.availability === "on_duty").length;
  const onBreak = team.filter((m) => m.availability === "on_break").length;
  const incidents = jobs.filter((j) => j.status === "incident").length;

  const cards = [
    { label: "Missions actives", value: activeJobs, icon: Briefcase, trend: "En cours et planifiées", tone: null, iconBg: "bg-blue-100 text-blue-600", pulse: false },
    { label: "Terminées sur 24 h", value: completed24h, icon: CheckCircle, trend: "Rapports déposés", tone: null, iconBg: "bg-green-100 text-green-600", pulse: false },
    { label: "Agents en service", value: `${onDuty}/${team.length}`, icon: Users, trend: `${onBreak} en pause`, tone: null, iconBg: "bg-purple-100 text-purple-600", pulse: false },
    { label: "Incidents ouverts", value: incidents, icon: AlertTriangle, trend: incidents > 0 ? "Action requise" : "Aucun incident", tone: incidents > 0 ? "bad" : "good", iconBg: "bg-red-100 text-red-600", pulse: incidents > 0 },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className={cn("transition-shadow", card.pulse && "animate-pulse-red border-l-[3px] border-l-[#dc2626]")}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-2xl font-bold">{card.value}</p>
              </div>
              <div className={cn("flex h-10 w-10 items-center justify-center rounded", card.iconBg)}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <p className={cn("mt-2 text-xs", card.tone === "good" && "text-green-600", card.tone === "bad" && "text-red-600", card.tone === null && "text-muted-foreground")}>
              {card.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
