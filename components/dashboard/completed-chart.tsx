"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Panel } from "@/components/ops/ui";
import type { OpsState } from "@/lib/store";

/**
 * Missions completed per day over the last 14 days. Past days sit in a quiet navy-grey; today is the signal orange
 * and counts the missions the visitor closes during the demo, so the chart answers back.
 */
export function CompletedChart({ ops }: { ops: OpsState }) {
  const closedNow = ops.activity.filter((a) => a.to === "completed" && a.timestamp > ops.seededAt).length;
  const data = ops.daily.map((d, i) => {
    const today = i === ops.daily.length - 1;
    return {
      label: new Date(`${d.date}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }).replace(".", ""),
      completed: d.completed + (today ? closedNow : 0),
      incidents: d.incidents,
      today,
    };
  });
  const total = data.reduce((n, d) => n + d.completed, 0);
  const today = data.at(-1)?.completed ?? 0;

  return (
    <Panel
      title="Missions terminées, 14 derniers jours"
      meta={
        <span className="num">
          {total} au total · <span className="font-medium text-signal">{today} aujourd&apos;hui</span>
        </span>
      }
      testId="completed-chart"
    >
      <div className="h-[220px] w-full px-2 pb-3 pt-1" role="img" aria-label={`Missions terminées par jour sur 14 jours, ${today} aujourd'hui`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barCategoryGap="22%">
            <CartesianGrid vertical={false} stroke="var(--rule)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} interval="preserveStartEnd" tick={{ fontSize: 11, fill: "var(--muted)" }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={40} tick={{ fontSize: 11, fill: "var(--muted)" }} />
            <Tooltip
              cursor={{ fill: "var(--raised)" }}
              formatter={(value) => [`${value} missions`, "Terminées"]}
              labelFormatter={(label, payload) => {
                const p = payload?.[0]?.payload as { incidents?: number; today?: boolean } | undefined;
                return `${p?.today ? "Aujourd'hui" : label}${p?.incidents ? " · 1 incident" : ""}`;
              }}
              contentStyle={{ border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, boxShadow: "0 4px 14px -6px rgba(17,26,43,0.18)" }}
            />
            <Bar dataKey="completed" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              {data.map((d) => (
                <Cell key={d.label} fill={d.today ? "var(--signal)" : "#9fb0c8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
