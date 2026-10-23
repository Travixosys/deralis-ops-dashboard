import type { Metadata } from "next";
import { TeamBoard } from "@/components/team/team-board";

export const metadata: Metadata = { title: "Équipe · Deralis Ops" };

export default function TeamPage() {
  return <TeamBoard />;
}
