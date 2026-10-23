import type { Job, TeamMember } from "./types";
import { currentJob, isFree } from "./store";
import { clientById } from "./seed";
import { AVAILABILITY_LABEL } from "./labels";

export type AgentKind = "free" | "busy" | "incident" | "break" | "off";

/** How an agent stands right now, in the words the assignment list and the team page use. */
export function agentState(member: TeamMember, jobs: Job[]): { label: string; free: boolean; kind: AgentKind; job?: Job } {
  if (member.availability === "on_break") return { label: AVAILABILITY_LABEL.on_break, free: false, kind: "break", job: currentJob(member.id, jobs) };
  if (member.availability === "off_duty") return { label: AVAILABILITY_LABEL.off_duty, free: false, kind: "off" };
  if (isFree(member, jobs)) return { label: "Libre", free: true, kind: "free" };
  const job = currentJob(member.id, jobs);
  if (job?.status === "incident") return { label: `Sur incident, ${clientById(job.clientId).short}`, free: false, kind: "incident", job };
  return { label: job ? `En mission, ${clientById(job.clientId).short}` : "En mission", free: false, kind: "busy", job };
}
