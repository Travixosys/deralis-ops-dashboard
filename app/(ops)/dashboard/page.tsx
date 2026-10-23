import type { Metadata } from "next";
import { Overview } from "@/components/dashboard/overview";

export const metadata: Metadata = { title: "Tableau de bord · Deralis Ops" };

export default function DashboardPage() {
  return <Overview />;
}
