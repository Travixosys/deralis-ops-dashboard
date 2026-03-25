import type {
  Client,
  TeamMember,
  Job,
  JobStatus,
  JobType,
  Priority,
  DailyActivity,
  ActivityTimelineEntry,
} from "./types";

// ── Helpers ──────────────────────────────────────────────

function daysFromNow(offset: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function hoursAgo(hours: number): string {
  const d = new Date();
  d.setTime(d.getTime() - hours * 60 * 60 * 1000);
  return d.toISOString();
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// ── Clients (5) ──────────────────────────────────────────

export const clients: Client[] = [
  {
    id: "client-001",
    name: "Meridian Property Group",
    industry: "Commercial Real Estate",
    contactEmail: "ops@meridianpg.com",
    activeJobCount: 6,
  },
  {
    id: "client-002",
    name: "Solaris Biotech",
    industry: "Pharmaceutical",
    contactEmail: "security@solarisbio.com",
    activeJobCount: 5,
  },
  {
    id: "client-003",
    name: "Crestline Logistics",
    industry: "Warehousing & Distribution",
    contactEmail: "ops@crestlinelogistics.com",
    activeJobCount: 5,
  },
  {
    id: "client-004",
    name: "Harborview Medical Center",
    industry: "Healthcare",
    contactEmail: "facilities@harborviewmc.com",
    activeJobCount: 5,
  },
  {
    id: "client-005",
    name: "Atlas Financial Partners",
    industry: "Financial Services",
    contactEmail: "admin@atlasfinancial.com",
    activeJobCount: 3,
  },
];

// ── Team Members (8) ─────────────────────────────────────

export const teamMembers: TeamMember[] = [
  {
    id: "tm-001",
    name: "Marcus Chen",
    role: "Senior Patrol Officer",
    avatarInitials: "MC",
    availability: "On Duty",
    assignedJobCount: 4,
    phone: "+27 82 555 0101",
  },
  {
    id: "tm-002",
    name: "Aisha Patel",
    role: "Access Control Specialist",
    avatarInitials: "AP",
    availability: "On Duty",
    assignedJobCount: 3,
    phone: "+27 82 555 0102",
  },
  {
    id: "tm-003",
    name: "James Okafor",
    role: "Alarm Response Lead",
    avatarInitials: "JO",
    availability: "On Duty",
    assignedJobCount: 3,
    phone: "+27 82 555 0103",
  },
  {
    id: "tm-004",
    name: "Sofia Reyes",
    role: "Escort & VIP Services",
    avatarInitials: "SR",
    availability: "On Duty",
    assignedJobCount: 3,
    phone: "+27 82 555 0104",
  },
  {
    id: "tm-005",
    name: "Derek Holloway",
    role: "Post Commander",
    avatarInitials: "DH",
    availability: "On Break",
    assignedJobCount: 3,
    phone: "+27 82 555 0105",
  },
  {
    id: "tm-006",
    name: "Priya Nair",
    role: "Patrol Officer",
    avatarInitials: "PN",
    availability: "On Duty",
    assignedJobCount: 3,
    phone: "+27 82 555 0106",
  },
  {
    id: "tm-007",
    name: "Tyler Brooks",
    role: "Control Room Operator",
    avatarInitials: "TB",
    availability: "Off Duty",
    assignedJobCount: 2,
    phone: "+27 82 555 0107",
  },
  {
    id: "tm-008",
    name: "Elena Vasquez",
    role: "Field Supervisor",
    avatarInitials: "EV",
    availability: "On Duty",
    assignedJobCount: 3,
    phone: "+27 82 555 0108",
  },
];

// ── Jobs (24) ────────────────────────────────────────────
// Status: Pending(6), In Progress(8), Completed(9), Issue Flagged(1)
// Types: Site Patrol(6), Access Control(5), Alarm Response(4), Escort Duty(4), Post Assignment(5)
// Priority: Low(4), Medium(10), High(8), Critical(2)

export const jobs: Job[] = [
  // ── Pending (6) ──
  {
    id: "job-001",
    referenceNumber: "SEC-2026-1001",
    clientId: "client-001",
    client: "Meridian Property Group",
    type: "Site Patrol",
    assigneeId: "tm-001",
    assignee: "Marcus Chen",
    status: "Pending",
    location: "Meridian Tower, Lobby & Parking Level B2",
    scheduledStart: daysFromNow(0, 18, 0),
    scheduledEnd: daysFromNow(0, 22, 0),
    priority: "Medium",
    notes: "Evening patrol covering lobby, parking levels B1-B2, and rooftop access points.",
    createdAt: daysFromNow(-1, 9, 0),
  },
  {
    id: "job-002",
    referenceNumber: "SEC-2026-1002",
    clientId: "client-002",
    client: "Solaris Biotech",
    type: "Access Control",
    assigneeId: "tm-002",
    assignee: "Aisha Patel",
    status: "Pending",
    location: "Solaris Campus, Building C — Lab Wing",
    scheduledStart: daysFromNow(1, 7, 0),
    scheduledEnd: daysFromNow(1, 15, 0),
    priority: "High",
    notes: "Biometric access point verification for new lab wing. Coordinate with IT for badge reader tests.",
    createdAt: daysFromNow(-1, 11, 30),
  },
  {
    id: "job-003",
    referenceNumber: "SEC-2026-1003",
    clientId: "client-003",
    client: "Crestline Logistics",
    type: "Post Assignment",
    assigneeId: "tm-005",
    assignee: "Derek Holloway",
    status: "Pending",
    location: "Crestline Warehouse 7, Main Gate",
    scheduledStart: daysFromNow(1, 6, 0),
    scheduledEnd: daysFromNow(1, 18, 0),
    priority: "Medium",
    notes: "12-hour gate post. Verify all delivery manifests against booking system.",
    createdAt: daysFromNow(-1, 14, 0),
  },
  {
    id: "job-004",
    referenceNumber: "SEC-2026-1004",
    clientId: "client-004",
    client: "Harborview Medical Center",
    type: "Escort Duty",
    assigneeId: "tm-004",
    assignee: "Sofia Reyes",
    status: "Pending",
    location: "Harborview East Wing, Pharmacy Corridor",
    scheduledStart: daysFromNow(0, 20, 0),
    scheduledEnd: daysFromNow(0, 21, 30),
    priority: "High",
    notes: "Escort pharmaceutical delivery from loading dock to secure pharmacy storage. Two-person sign-off required.",
    createdAt: daysFromNow(0, 8, 0),
  },
  {
    id: "job-005",
    referenceNumber: "SEC-2026-1005",
    clientId: "client-005",
    client: "Atlas Financial Partners",
    type: "Site Patrol",
    assigneeId: "tm-006",
    assignee: "Priya Nair",
    status: "Pending",
    location: "Atlas Financial HQ, Executive Floor 12",
    scheduledStart: daysFromNow(1, 19, 0),
    scheduledEnd: daysFromNow(1, 23, 0),
    priority: "Low",
    notes: "After-hours patrol of executive floor. Check server room seals and window locks.",
    createdAt: daysFromNow(0, 10, 0),
  },
  {
    id: "job-006",
    referenceNumber: "SEC-2026-1006",
    clientId: "client-001",
    client: "Meridian Property Group",
    type: "Alarm Response",
    assigneeId: "tm-003",
    assignee: "James Okafor",
    status: "Pending",
    location: "Meridian Retail Centre, Unit 14",
    scheduledStart: daysFromNow(0, 22, 0),
    scheduledEnd: daysFromNow(1, 2, 0),
    priority: "Medium",
    notes: "On-call alarm response standby for retail centre overnight period.",
    createdAt: daysFromNow(0, 12, 0),
  },

  // ── In Progress (8) ──
  {
    id: "job-007",
    referenceNumber: "SEC-2026-1007",
    clientId: "client-002",
    client: "Solaris Biotech",
    type: "Post Assignment",
    assigneeId: "tm-005",
    assignee: "Derek Holloway",
    status: "In Progress",
    location: "Solaris Campus, Main Reception",
    scheduledStart: daysFromNow(0, 6, 0),
    scheduledEnd: daysFromNow(0, 18, 0),
    priority: "Medium",
    notes: "Front desk security post. Visitor badge management and vehicle registration.",
    createdAt: daysFromNow(-2, 16, 0),
  },
  {
    id: "job-008",
    referenceNumber: "SEC-2026-1008",
    clientId: "client-003",
    client: "Crestline Logistics",
    type: "Site Patrol",
    assigneeId: "tm-001",
    assignee: "Marcus Chen",
    status: "In Progress",
    location: "Crestline Warehouse 7, Loading Dock & Perimeter",
    scheduledStart: daysFromNow(0, 8, 0),
    scheduledEnd: daysFromNow(0, 16, 0),
    priority: "High",
    notes: "Full perimeter patrol including CCTV blind spot checks. Report any fence damage.",
    createdAt: daysFromNow(-2, 10, 0),
  },
  {
    id: "job-009",
    referenceNumber: "SEC-2026-1009",
    clientId: "client-004",
    client: "Harborview Medical Center",
    type: "Access Control",
    assigneeId: "tm-002",
    assignee: "Aisha Patel",
    status: "In Progress",
    location: "Harborview North Wing, Staff Entrance",
    scheduledStart: daysFromNow(0, 7, 0),
    scheduledEnd: daysFromNow(0, 19, 0),
    priority: "Medium",
    notes: "Staff ID verification at north entrance. Extra vigilance for unauthorized tailgating.",
    createdAt: daysFromNow(-1, 8, 0),
  },
  {
    id: "job-010",
    referenceNumber: "SEC-2026-1010",
    clientId: "client-001",
    client: "Meridian Property Group",
    type: "Escort Duty",
    assigneeId: "tm-004",
    assignee: "Sofia Reyes",
    status: "In Progress",
    location: "Meridian Tower, Floors 8-12",
    scheduledStart: daysFromNow(0, 9, 0),
    scheduledEnd: daysFromNow(0, 12, 0),
    priority: "Medium",
    notes: "VIP client tour escort through premium office floors. Maintain professional presentation.",
    createdAt: daysFromNow(-1, 15, 0),
  },
  {
    id: "job-011",
    referenceNumber: "SEC-2026-1011",
    clientId: "client-003",
    client: "Crestline Logistics",
    type: "Post Assignment",
    assigneeId: "tm-008",
    assignee: "Elena Vasquez",
    status: "In Progress",
    location: "Crestline Distribution Centre, Control Room",
    scheduledStart: daysFromNow(0, 6, 0),
    scheduledEnd: daysFromNow(0, 14, 0),
    priority: "High",
    notes: "Monitor CCTV feeds and coordinate patrol teams. Log all incidents immediately.",
    createdAt: daysFromNow(-2, 14, 0),
  },
  {
    id: "job-012",
    referenceNumber: "SEC-2026-1012",
    clientId: "client-005",
    client: "Atlas Financial Partners",
    type: "Site Patrol",
    assigneeId: "tm-006",
    assignee: "Priya Nair",
    status: "In Progress",
    location: "Atlas Financial HQ, All Floors",
    scheduledStart: daysFromNow(0, 8, 0),
    scheduledEnd: daysFromNow(0, 17, 0),
    priority: "Medium",
    notes: "Routine daytime patrol. Pay attention to meeting room access and visitor management.",
    createdAt: daysFromNow(-1, 16, 0),
  },
  {
    id: "job-013",
    referenceNumber: "SEC-2026-1013",
    clientId: "client-004",
    client: "Harborview Medical Center",
    type: "Alarm Response",
    assigneeId: "tm-003",
    assignee: "James Okafor",
    status: "In Progress",
    location: "Harborview South Wing, Emergency Department",
    scheduledStart: daysFromNow(0, 10, 0),
    scheduledEnd: daysFromNow(0, 18, 0),
    priority: "High",
    notes: "Active alarm response coverage for emergency department area. Priority response required.",
    createdAt: daysFromNow(-1, 9, 0),
  },
  {
    id: "job-014",
    referenceNumber: "SEC-2026-1014",
    clientId: "client-002",
    client: "Solaris Biotech",
    type: "Access Control",
    assigneeId: "tm-007",
    assignee: "Tyler Brooks",
    status: "In Progress",
    location: "Solaris Campus, Building A — Server Room",
    scheduledStart: daysFromNow(0, 9, 0),
    scheduledEnd: daysFromNow(0, 17, 0),
    priority: "Critical",
    notes: "Critical access control for server room during infrastructure upgrade. Log every entry/exit.",
    createdAt: daysFromNow(-1, 7, 0),
  },

  // ── Completed (9) ──
  {
    id: "job-015",
    referenceNumber: "SEC-2026-1015",
    clientId: "client-001",
    client: "Meridian Property Group",
    type: "Site Patrol",
    assigneeId: "tm-001",
    assignee: "Marcus Chen",
    status: "Completed",
    location: "Meridian Retail Centre, Full Perimeter",
    scheduledStart: daysFromNow(-1, 6, 0),
    scheduledEnd: daysFromNow(-1, 14, 0),
    priority: "Medium",
    notes: "Morning patrol completed. No incidents reported. All access points secure.",
    createdAt: daysFromNow(-3, 10, 0),
  },
  {
    id: "job-016",
    referenceNumber: "SEC-2026-1016",
    clientId: "client-002",
    client: "Solaris Biotech",
    type: "Escort Duty",
    assigneeId: "tm-004",
    assignee: "Sofia Reyes",
    status: "Completed",
    location: "Solaris Campus, Building B — Executive Suite",
    scheduledStart: daysFromNow(-1, 10, 0),
    scheduledEnd: daysFromNow(-1, 12, 0),
    priority: "High",
    notes: "Board member escort from parking to executive suite. Completed without issues.",
    createdAt: daysFromNow(-3, 14, 0),
  },
  {
    id: "job-017",
    referenceNumber: "SEC-2026-1017",
    clientId: "client-003",
    client: "Crestline Logistics",
    type: "Alarm Response",
    assigneeId: "tm-003",
    assignee: "James Okafor",
    status: "Completed",
    location: "Crestline Warehouse 3, Zone B",
    scheduledStart: daysFromNow(-1, 2, 15),
    scheduledEnd: daysFromNow(-1, 3, 45),
    priority: "High",
    notes: "False alarm triggered by sensor malfunction in Zone B. Sensor reset, maintenance notified.",
    createdAt: daysFromNow(-1, 2, 15),
  },
  {
    id: "job-018",
    referenceNumber: "SEC-2026-1018",
    clientId: "client-004",
    client: "Harborview Medical Center",
    type: "Post Assignment",
    assigneeId: "tm-005",
    assignee: "Derek Holloway",
    status: "Completed",
    location: "Harborview Main Entrance",
    scheduledStart: daysFromNow(-1, 6, 0),
    scheduledEnd: daysFromNow(-1, 18, 0),
    priority: "Medium",
    notes: "12-hour entrance post completed. 247 visitors processed, 3 denied entry (no valid ID).",
    createdAt: daysFromNow(-3, 12, 0),
  },
  {
    id: "job-019",
    referenceNumber: "SEC-2026-1019",
    clientId: "client-005",
    client: "Atlas Financial Partners",
    type: "Access Control",
    assigneeId: "tm-002",
    assignee: "Aisha Patel",
    status: "Completed",
    location: "Atlas Financial HQ, Data Centre",
    scheduledStart: daysFromNow(-2, 8, 0),
    scheduledEnd: daysFromNow(-2, 17, 0),
    priority: "High",
    notes: "Data centre access audit completed. 2 expired badges flagged and deactivated.",
    createdAt: daysFromNow(-4, 9, 0),
  },
  {
    id: "job-020",
    referenceNumber: "SEC-2026-1020",
    clientId: "client-001",
    client: "Meridian Property Group",
    type: "Post Assignment",
    assigneeId: "tm-008",
    assignee: "Elena Vasquez",
    status: "Completed",
    location: "Meridian Tower, Parking Level B1",
    scheduledStart: daysFromNow(-2, 18, 0),
    scheduledEnd: daysFromNow(-1, 6, 0),
    priority: "Low",
    notes: "Overnight parking security. No incidents. Vehicle count reconciled at shift end.",
    createdAt: daysFromNow(-4, 15, 0),
  },
  {
    id: "job-021",
    referenceNumber: "SEC-2026-1021",
    clientId: "client-003",
    client: "Crestline Logistics",
    type: "Site Patrol",
    assigneeId: "tm-006",
    assignee: "Priya Nair",
    status: "Completed",
    location: "Crestline Distribution Centre, Full Site",
    scheduledStart: daysFromNow(-2, 20, 0),
    scheduledEnd: daysFromNow(-1, 4, 0),
    priority: "Medium",
    notes: "Night patrol completed. Minor lighting issue reported in Zone D — maintenance ticket raised.",
    createdAt: daysFromNow(-4, 11, 0),
  },
  {
    id: "job-022",
    referenceNumber: "SEC-2026-1022",
    clientId: "client-002",
    client: "Solaris Biotech",
    type: "Alarm Response",
    assigneeId: "tm-003",
    assignee: "James Okafor",
    status: "Completed",
    location: "Solaris Campus, Building A — Research Lab",
    scheduledStart: daysFromNow(-2, 23, 10),
    scheduledEnd: daysFromNow(-1, 0, 30),
    priority: "Critical",
    notes: "Intrusion alarm in research lab. Responded in 4 mins. Cause: researcher forgot to badge out. All clear.",
    createdAt: daysFromNow(-2, 23, 10),
  },
  {
    id: "job-023",
    referenceNumber: "SEC-2026-1023",
    clientId: "client-004",
    client: "Harborview Medical Center",
    type: "Escort Duty",
    assigneeId: "tm-004",
    assignee: "Sofia Reyes",
    status: "Completed",
    location: "Harborview West Wing, Maternity Ward",
    scheduledStart: daysFromNow(-1, 14, 0),
    scheduledEnd: daysFromNow(-1, 15, 30),
    priority: "Low",
    notes: "Patient transfer escort from maternity to discharge area. Completed smoothly.",
    createdAt: daysFromNow(-2, 10, 0),
  },

  // ── Issue Flagged (1) ──
  {
    id: "job-024",
    referenceNumber: "SEC-2026-1024",
    clientId: "client-001",
    client: "Meridian Property Group",
    type: "Site Patrol",
    assigneeId: "tm-001",
    assignee: "Marcus Chen",
    status: "Issue Flagged",
    location: "Meridian Retail Centre, Rear Fire Exit",
    scheduledStart: daysFromNow(0, 6, 0),
    scheduledEnd: daysFromNow(0, 14, 0),
    priority: "Critical",
    notes: "ISSUE: Rear fire exit found forced open at 06:45. Area secured, CCTV footage under review. Police notified.",
    createdAt: daysFromNow(-1, 16, 0),
  },
];

// ── Daily Activity (30 days) ─────────────────────────────

function generateDailyActivity(): DailyActivity[] {
  const data: DailyActivity[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const seed = i;
    const completed = 5 + Math.floor(seededRandom(seed) * 8);
    const pending = 2 + Math.floor(seededRandom(seed + 100) * 5);
    const issues = seededRandom(seed + 200) > 0.7 ? 1 : 0;
    data.push({ date: dateStr, completed, pending, issues });
  }
  return data;
}

export const dailyActivity: DailyActivity[] = generateDailyActivity();

// ── Activity Timeline ────────────────────────────────────

function generateTimeline(): ActivityTimelineEntry[] {
  const entries: ActivityTimelineEntry[] = [];
  let entryId = 1;

  for (const job of jobs) {
    // Every job gets a "created" entry
    entries.push({
      id: `timeline-${entryId++}`,
      jobId: job.id,
      timestamp: job.createdAt,
      type: "created",
      description: `Job ${job.referenceNumber} created — ${job.type} at ${job.location}`,
      actor: "System",
    });

    // Assignee assigned
    entries.push({
      id: `timeline-${entryId++}`,
      jobId: job.id,
      timestamp: hoursAgo(
        Math.max(1, Math.floor((new Date().getTime() - new Date(job.createdAt).getTime()) / 3600000) - 2)
      ),
      type: "assignee_changed",
      description: `Assigned to ${job.assignee}`,
      actor: "Elena Vasquez",
    });

    // Status change based on current status
    if (job.status === "In Progress") {
      entries.push({
        id: `timeline-${entryId++}`,
        jobId: job.id,
        timestamp: hoursAgo(
          Math.max(1, Math.floor((new Date().getTime() - new Date(job.scheduledStart).getTime()) / 3600000))
        ),
        type: "status_change",
        description: "Status changed from Pending to In Progress",
        actor: job.assignee,
      });
    }

    if (job.status === "Completed") {
      entries.push({
        id: `timeline-${entryId++}`,
        jobId: job.id,
        timestamp: hoursAgo(
          Math.max(2, Math.floor((new Date().getTime() - new Date(job.scheduledStart).getTime()) / 3600000))
        ),
        type: "status_change",
        description: "Status changed from Pending to In Progress",
        actor: job.assignee,
      });
      entries.push({
        id: `timeline-${entryId++}`,
        jobId: job.id,
        timestamp: hoursAgo(
          Math.max(1, Math.floor((new Date().getTime() - new Date(job.scheduledEnd).getTime()) / 3600000))
        ),
        type: "status_change",
        description: "Status changed from In Progress to Completed",
        actor: job.assignee,
      });
      // Some completed jobs have a note
      if (entryId % 3 === 0) {
        entries.push({
          id: `timeline-${entryId++}`,
          jobId: job.id,
          timestamp: hoursAgo(
            Math.max(1, Math.floor((new Date().getTime() - new Date(job.scheduledEnd).getTime()) / 3600000) - 1)
          ),
          type: "note_added",
          description: "Shift report uploaded. All checkpoints verified.",
          actor: job.assignee,
        });
      }
    }

    if (job.status === "Issue Flagged") {
      entries.push({
        id: `timeline-${entryId++}`,
        jobId: job.id,
        timestamp: hoursAgo(6),
        type: "status_change",
        description: "Status changed from Pending to In Progress",
        actor: job.assignee,
      });
      entries.push({
        id: `timeline-${entryId++}`,
        jobId: job.id,
        timestamp: hoursAgo(4),
        type: "priority_changed",
        description: "Priority escalated from High to Critical",
        actor: "Elena Vasquez",
      });
      entries.push({
        id: `timeline-${entryId++}`,
        jobId: job.id,
        timestamp: hoursAgo(3),
        type: "status_change",
        description: "Status changed from In Progress to Issue Flagged",
        actor: job.assignee,
      });
      entries.push({
        id: `timeline-${entryId++}`,
        jobId: job.id,
        timestamp: hoursAgo(2),
        type: "note_added",
        description: "Rear fire exit found forced open. Area secured and police notified. CCTV review in progress.",
        actor: job.assignee,
      });
    }
  }

  return entries;
}

export const activityTimeline: ActivityTimelineEntry[] = generateTimeline();

// ── Lookup Helpers ───────────────────────────────────────

export function getJobsByStatus(status: JobStatus): Job[] {
  return jobs.filter((j) => j.status === status);
}

export function getJobsByClient(clientId: string): Job[] {
  return jobs.filter((j) => j.clientId === clientId);
}

export function getJobsByAssignee(assigneeId: string): Job[] {
  return jobs.filter((j) => j.assigneeId === assigneeId);
}

export function getTeamMember(id: string): TeamMember | undefined {
  return teamMembers.find((m) => m.id === id);
}

export function getClient(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

export function getTimelineForJob(jobId: string): ActivityTimelineEntry[] {
  return activityTimeline
    .filter((e) => e.jobId === jobId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
