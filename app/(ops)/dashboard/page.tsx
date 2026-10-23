import type { Metadata } from "next";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { JobsBarChart } from "@/components/dashboard/jobs-bar-chart";
import { JobsDonutChart } from "@/components/dashboard/jobs-donut-chart";
import { JobsTable } from "@/components/dashboard/jobs-table";

export const metadata: Metadata = { title: "Tableau de bord · Deralis Ops" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="sr-only">Tableau de bord</h1>
      <KpiCards />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <JobsBarChart />
        </div>
        <div className="lg:col-span-2">
          <JobsDonutChart />
        </div>
      </div>
      <JobsTable />
    </div>
  );
}
