import type { Metadata } from "next";
import { JobsList } from "@/components/jobs/jobs-list";

export const metadata: Metadata = { title: "Missions · Deralis Ops" };

export default function JobsPage() {
  return <JobsList />;
}
