import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const time = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" });
const dayMonth = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });

function dayDiff(date: Date, now: Date) {
  const a = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const b = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((a - b) / 86_400_000);
}

export function formatTime(iso: string): string {
  return time.format(new Date(iso));
}

/** "14:00", "demain 07:00", "hier 18:00", or "21 oct. 08:00". */
export function formatSlot(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  const diff = dayDiff(d, now);
  const t = time.format(d);
  if (diff === 0) return t;
  if (diff === 1) return `demain ${t}`;
  if (diff === -1) return `hier ${t}`;
  return `${dayMonth.format(d)} ${t}`;
}

/** Same as formatSlot, with "aujourd'hui" spelled out for sentences. */
export function formatDateTime(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  return dayDiff(d, now) === 0 ? `aujourd'hui ${time.format(d)}` : formatSlot(iso, now);
}

export function formatRange(startIso: string, endIso: string, now: Date = new Date()): string {
  const sameDay = dayDiff(new Date(startIso), new Date(endIso)) === 0;
  return `${formatSlot(startIso, now)} à ${sameDay ? time.format(new Date(endIso)) : formatSlot(endIso, now)}`;
}

export function formatRelative(iso: string, now: Date = new Date()): string {
  const diffMin = Math.round((now.getTime() - new Date(iso).getTime()) / 60_000);
  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const h = Math.floor(diffMin / 60);
  if (h < 24) return `il y a ${h} h`;
  return formatDateTime(iso, now);
}

export function formatShortDate(iso: string): string {
  return dayMonth.format(new Date(iso));
}

/** Time left until a moment: "dans 1 h 15", "dans 40 min". */
export function formatIn(iso: string, now: Date = new Date()): string {
  const min = Math.round((new Date(iso).getTime() - now.getTime()) / 60_000);
  if (min <= 0) return "maintenant";
  if (min < 60) return `dans ${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `dans ${h} h ${String(m).padStart(2, "0")}` : `dans ${h} h`;
}
