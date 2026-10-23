"use client";

import { useSyncExternalStore } from "react";

// Whether the guide panel is expanded. A per-visitor convenience, separate from the demo data.

type Pref = "open" | "closed" | null;

const KEY = "deralis-ops:guide-panel";
const listeners = new Set<() => void>();
let pref: Pref | undefined;

function read(): Pref {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "open" || v === "closed" ? v : null;
  } catch {
    return null;
  }
}

export function setGuideOpen(open: boolean) {
  pref = open ? "open" : "closed";
  try {
    window.localStorage.setItem(KEY, pref);
  } catch {
    // Storage unavailable: the choice holds for this page only.
  }
  for (const l of listeners) l();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useGuidePref(): Pref {
  return useSyncExternalStore(
    subscribe,
    () => {
      if (pref === undefined) pref = read();
      return pref;
    },
    () => null
  );
}

function subscribeWide(l: () => void) {
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", l);
  return () => mq.removeEventListener("change", l);
}

/** True on tablet and desktop widths; false during server render. */
export function useIsWide(): boolean {
  return useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia("(min-width: 768px)").matches,
    () => false
  );
}
