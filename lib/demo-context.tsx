"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Job, TeamMember } from "./types";
import {
  jobs as initialJobs,
  teamMembers as initialTeamMembers,
  clients,
} from "./mock-data";
import type { JobType, Priority } from "./types";

interface DemoState {
  jobs: Job[];
  teamMembers: TeamMember[];
  highlightedJobId: string | null;
  pulseTrigger: number;
  simulateNewJob: () => void;
  simulateIssue: () => void;
  resetData: () => void;
}

const DemoContext = createContext<DemoState | null>(null);

const jobTypes: JobType[] = [
  "Site Patrol",
  "Access Control",
  "Alarm Response",
  "Escort Duty",
  "Post Assignment",
];

const locations = [
  "Meridian Tower, Ground Floor",
  "Solaris Campus, Building D — Reception",
  "Crestline Warehouse 5, East Gate",
  "Harborview Medical Center, ER Entrance",
  "Atlas Financial HQ, Basement Parking",
];

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(() => [...initialJobs]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    () => [...initialTeamMembers]
  );
  const [highlightedJobId, setHighlightedJobId] = useState<string | null>(null);
  const [pulseTrigger, setPulseTrigger] = useState(0);

  const simulateNewJob = useCallback(() => {
    const id = `job-sim-${Date.now()}`;
    const refNum = `SEC-2026-${2000 + Math.floor(Math.random() * 1000)}`;
    const client = clients[Math.floor(Math.random() * clients.length)];
    const member =
      initialTeamMembers[Math.floor(Math.random() * initialTeamMembers.length)];
    const type = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const priorities: Priority[] = ["Low", "Medium", "High"];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];

    const now = new Date();
    const start = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);

    const newJob: Job = {
      id,
      referenceNumber: refNum,
      clientId: client.id,
      client: client.name,
      type,
      assigneeId: member.id,
      assignee: member.name,
      status: "Pending",
      location,
      scheduledStart: start.toISOString(),
      scheduledEnd: end.toISOString(),
      priority,
      notes: "Simulated job created during demo.",
      createdAt: now.toISOString(),
    };

    setJobs((prev) => [newJob, ...prev]);
    setHighlightedJobId(id);
    setTimeout(() => setHighlightedJobId(null), 1500);
  }, []);

  const simulateIssue = useCallback(() => {
    setJobs((prev) => {
      const inProgress = prev.filter((j) => j.status === "In Progress");
      if (inProgress.length === 0) return prev;
      const target =
        inProgress[Math.floor(Math.random() * inProgress.length)];
      return prev.map((j) =>
        j.id === target.id
          ? { ...j, status: "Issue Flagged" as const, priority: "Critical" as const }
          : j
      );
    });
    setPulseTrigger((p) => p + 1);
  }, []);

  const resetData = useCallback(() => {
    setJobs([...initialJobs]);
    setTeamMembers([...initialTeamMembers]);
    setHighlightedJobId(null);
    setPulseTrigger(0);
  }, []);

  const value = useMemo(
    () => ({
      jobs,
      teamMembers,
      highlightedJobId,
      pulseTrigger,
      simulateNewJob,
      simulateIssue,
      resetData,
    }),
    [jobs, teamMembers, highlightedJobId, pulseTrigger, simulateNewJob, simulateIssue, resetData]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoState {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
