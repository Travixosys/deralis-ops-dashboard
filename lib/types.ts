// ── Union literal types ──────────────────────────────────

export type JobStatus = "Pending" | "In Progress" | "Completed" | "Issue Flagged";

export type JobType =
  | "Site Patrol"
  | "Access Control"
  | "Alarm Response"
  | "Escort Duty"
  | "Post Assignment";

export type Priority = "Low" | "Medium" | "High" | "Critical";

export type AvailabilityStatus = "On Duty" | "Off Duty" | "On Break";

// ── Interfaces ───────────────────────────────────────────

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactEmail: string;
  activeJobCount: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  availability: AvailabilityStatus;
  assignedJobCount: number;
  phone: string;
}

export interface Job {
  id: string;
  referenceNumber: string;
  clientId: string;
  client: string;
  type: JobType;
  assigneeId: string;
  assignee: string;
  status: JobStatus;
  location: string;
  scheduledStart: string;
  scheduledEnd: string;
  priority: Priority;
  notes: string;
  createdAt: string;
}

export interface DailyActivity {
  date: string;
  completed: number;
  pending: number;
  issues: number;
}

export interface ActivityTimelineEntry {
  id: string;
  jobId: string;
  timestamp: string;
  type:
    | "status_change"
    | "note_added"
    | "assignee_changed"
    | "priority_changed"
    | "created";
  description: string;
  actor: string;
}
