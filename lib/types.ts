// Internal codes stay in English; every label shown to the visitor comes from lib/labels.ts.

export type JobStatus = "pending" | "in_progress" | "completed" | "incident";

export type JobType = "patrol" | "access" | "alarm" | "escort" | "post";

export type Priority = "low" | "medium" | "high" | "critical";

export type Availability = "on_duty" | "on_break" | "off_duty";

export interface Client {
  id: string;
  name: string;
  /** Three-letter site code, stamped on the key tag. */
  short: string;
  industry: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  availability: Availability;
  phone: string;
}

export interface Job {
  id: string;
  reference: string;
  clientId: string;
  type: JobType;
  /** Empty string while a client request has not been assigned yet. */
  assigneeId: string;
  status: JobStatus;
  location: string;
  scheduledStart: string;
  scheduledEnd: string;
  priority: Priority;
  notes: string;
  createdAt: string;
  /** Requests created from the demo actions, not part of the seed. */
  simulated?: boolean;
}

export type ActivityType =
  | "created"
  | "status_change"
  | "note_added"
  | "assignee_changed"
  | "priority_changed";

export interface ActivityEntry {
  id: string;
  jobId: string;
  timestamp: string;
  type: ActivityType;
  description: string;
  actor: string;
  /** Set on entries written by the visitor, used to track the guided journey. */
  byVisitor?: boolean;
  /** For assignments and status changes: was the mission an open incident at that moment? */
  onIncident?: boolean;
  from?: JobStatus;
  to?: JobStatus;
}

export interface DailyActivity {
  date: string;
  completed: number;
  incidents: number;
}
