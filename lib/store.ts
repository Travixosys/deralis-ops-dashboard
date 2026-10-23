"use client";

import { useSyncExternalStore } from "react";
import type { ActivityEntry, Job, JobStatus, TeamMember } from "./types";
import { STATUS_LABEL, VISITOR } from "./labels";
import {
  INCIDENT_NOTES,
  REQUEST_TEMPLATES,
  createSeed,
  memberName,
  type SeedState,
} from "./seed";

/**
 * The demo's single source of truth. It lives in this browser (localStorage), so the guided journey,
 * the dashboard, the missions list and the team board all read the same state, and a reload keeps it.
 * The server renders nothing from it: every data block waits for the client snapshot.
 */

export interface OpsState extends SeedState {
  version: 1;
  /** Missions whose sheet was opened while they were an open incident (guided step 1). */
  openedIncidents: string[];
  /** Counter for the simulated client requests. */
  requestCount: number;
}

const KEY = "deralis-ops:state:v1";
/** Seeded times are relative to the visit; after this long the planning would read stale, so it reseeds. */
const MAX_AGE_MS = 12 * 3_600_000;

let state: OpsState | null = null;
let openJobId: string | null = null;
const listeners = new Set<() => void>();

function fresh(): OpsState {
  return { ...createSeed(), version: 1, openedIncidents: [], requestCount: 0 };
}

function load(): OpsState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as OpsState;
      const age = Date.now() - new Date(parsed.seededAt).getTime();
      if (parsed.version === 1 && age >= 0 && age < MAX_AGE_MS) return parsed;
    }
  } catch {
    // Private mode or corrupted data: start from the seed.
  }
  return fresh();
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable: the demo still works for this visit.
  }
}

function emit() {
  for (const l of listeners) l();
}

function commit(next: OpsState) {
  state = next;
  persist();
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = load();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): OpsState {
  if (!state) state = load();
  return state;
}

function getServerSnapshot(): OpsState | null {
  return null;
}

/** The demo state, or null during server render and hydration. */
export function useOps(): OpsState | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useOpenJobId(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => openJobId,
    () => null
  );
}

// ── Derived helpers ─────────────────────────────────────

export function isActive(job: Job) {
  return job.status === "in_progress" || job.status === "incident";
}

/** An agent is free when on duty with no mission running or in incident. */
export function isFree(member: TeamMember, jobs: Job[]) {
  return member.availability === "on_duty" && !jobs.some((j) => j.assigneeId === member.id && isActive(j));
}

export function currentJob(memberId: string, jobs: Job[]): Job | undefined {
  return jobs.find((j) => j.assigneeId === memberId && j.status === "incident") ?? jobs.find((j) => j.assigneeId === memberId && j.status === "in_progress");
}

// ── Actions ─────────────────────────────────────────────

let idCounter = 0;
function entryId() {
  idCounter += 1;
  return `act-${Date.now().toString(36)}-${idCounter}`;
}

function log(s: OpsState, entry: Omit<ActivityEntry, "id" | "timestamp" | "actor">): ActivityEntry[] {
  return [...s.activity, { ...entry, id: entryId(), timestamp: new Date().toISOString(), actor: VISITOR, byVisitor: true }];
}

export function openJob(id: string) {
  openJobId = id;
  const s = getSnapshot();
  const job = s.jobs.find((j) => j.id === id);
  if (job?.status === "incident" && !s.openedIncidents.includes(id)) {
    commit({ ...s, openedIncidents: [...s.openedIncidents, id] });
  } else {
    emit();
  }
}

export function closeJob() {
  openJobId = null;
  emit();
}

export function assignJob(jobId: string, memberId: string) {
  const s = getSnapshot();
  const job = s.jobs.find((j) => j.id === jobId);
  if (!job || job.assigneeId === memberId) return;
  const before = job.assigneeId ? memberName(job.assigneeId) : "";
  const description = before
    ? `Relais : ${before} → ${memberName(memberId)}`
    : `Affectée à ${memberName(memberId)}`;
  commit({
    ...s,
    jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, assigneeId: memberId } : j)),
    activity: log(s, { jobId, type: "assignee_changed", description, onIncident: job.status === "incident" }),
  });
}

export function setStatus(jobId: string, to: JobStatus, note?: string) {
  const s = getSnapshot();
  const job = s.jobs.find((j) => j.id === jobId);
  if (!job || job.status === to) return;
  let activity = log(s, {
    jobId,
    type: "status_change",
    description: `${STATUS_LABEL[job.status]} → ${STATUS_LABEL[to]}`,
    onIncident: job.status === "incident",
    from: job.status,
    to,
  });
  if (note) {
    activity = [...activity, { id: entryId(), jobId, timestamp: new Date().toISOString(), type: "note_added", description: note, actor: VISITOR, byVisitor: true }];
  }
  commit({
    ...s,
    jobs: s.jobs.map((j) =>
      j.id === jobId
        ? {
            ...j,
            status: to,
            priority: to === "incident" ? "critical" : j.priority,
            notes: note && to === "incident" ? note : j.notes,
          }
        : j
    ),
    activity,
  });
}

/** A client request arrives unassigned. Returns its id so the caller can open it. */
export function receiveRequest(): string {
  const s = getSnapshot();
  const t = REQUEST_TEMPLATES[s.requestCount % REQUEST_TEMPLATES.length];
  const now = Date.now();
  const id = `job-req-${now.toString(36)}`;
  const quarter = 15 * 60 * 1000;
  const start = Math.ceil((now + t.inHours * 3_600_000) / quarter) * quarter;
  const reference = `SEC-2026-${2001 + s.requestCount}`;
  const job: Job = {
    id,
    reference,
    clientId: t.client,
    type: t.type,
    assigneeId: "",
    status: "pending",
    location: t.location,
    scheduledStart: new Date(start).toISOString(),
    scheduledEnd: new Date(start + t.duration * 3_600_000).toISOString(),
    priority: t.priority,
    notes: t.notes,
    createdAt: new Date(now).toISOString(),
    simulated: true,
  };
  commit({
    ...s,
    requestCount: s.requestCount + 1,
    jobs: [job, ...s.jobs],
    activity: [
      ...s.activity,
      { id: entryId(), jobId: id, timestamp: job.createdAt, type: "created", description: "Demande reçue du client, à affecter", actor: "Client" },
    ],
  });
  return id;
}

/** An agent in the field reports a problem on a running mission. Returns the mission id, or null. */
export function simulateIncident(): string | null {
  const s = getSnapshot();
  const target = s.jobs
    .filter((j) => j.status === "in_progress")
    .sort((a, b) => a.id.localeCompare(b.id))[0];
  if (!target) return null;
  const note = INCIDENT_NOTES[target.type];
  commit({
    ...s,
    jobs: s.jobs.map((j) => (j.id === target.id ? { ...j, status: "incident", priority: "critical", notes: note } : j)),
    activity: [
      ...s.activity,
      { id: entryId(), jobId: target.id, timestamp: new Date().toISOString(), type: "status_change", description: `${STATUS_LABEL.in_progress} → ${STATUS_LABEL.incident}`, actor: memberName(target.assigneeId), from: "in_progress", to: "incident" },
      { id: entryId(), jobId: target.id, timestamp: new Date().toISOString(), type: "note_added", description: note, actor: memberName(target.assigneeId) },
    ],
  });
  return target.id;
}

/** Back to the seed: data and guided progress (progress is derived from the data). */
export function resetDemo() {
  openJobId = null;
  commit(fresh());
}
