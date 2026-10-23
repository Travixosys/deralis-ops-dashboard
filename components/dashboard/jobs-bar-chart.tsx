"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOps } from "@/lib/store";
import { formatShortDate } from "@/lib/utils";

export function JobsBarChart() {
  const ops = useOps();
  const chartData = (ops?.daily ?? []).map((d) => ({ label: formatShortDate(d.date), completed: d.completed }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Missions terminées, 14 derniers jours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          {ops && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} className="fill-muted-foreground" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="completed" fill="oklch(0.646 0.222 41.116)" radius={[4, 4, 0, 0]} name="Terminées" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
