import type { Availability, JobStatus, JobType, Priority } from "./types";

export const STATUS_LABEL: Record<JobStatus, string> = {
  pending: "Planifiée",
  in_progress: "En cours",
  completed: "Terminée",
  incident: "Incident",
};

export const TYPE_LABEL: Record<JobType, string> = {
  patrol: "Ronde",
  access: "Contrôle d'accès",
  alarm: "Levée de doute",
  escort: "Escorte",
  post: "Poste fixe",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Basse",
  medium: "Normale",
  high: "Haute",
  critical: "Critique",
};

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  on_duty: "En service",
  on_break: "En pause",
  off_duty: "Repos",
};

export const STATUS_ORDER: Record<JobStatus, number> = {
  incident: 0,
  in_progress: 1,
  pending: 2,
  completed: 3,
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

export const JOB_TYPES: JobType[] = ["patrol", "access", "alarm", "escort", "post"];
export const STATUSES: JobStatus[] = ["incident", "in_progress", "pending", "completed"];
export const PRIORITIES: Priority[] = ["critical", "high", "medium", "low"];

/** The visitor, as the actor written in the activity log. */
export const VISITOR = "Vous (exploitation)";
