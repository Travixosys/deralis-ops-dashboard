import type { OpsState } from "./store";

export type StepId = "open" | "relay" | "close" | "assign";

export interface GuideStep {
  id: StepId;
  title: string;
  action: string;
  result: string;
  href: string;
  linkLabel: string;
}

/** The guided journey: four real actions, each checked against the demo state, never a "mark done" click. */
export const STEPS: GuideStep[] = [
  {
    id: "open",
    title: "Ouvrez l'incident en cours",
    action: "Sur le tableau de bord, ouvrez la mission signalée en rouge : une issue de secours forcée au centre commercial Méridienne.",
    result: "La fiche réunit le lieu, l'agent sur place, les consignes et le fil des événements.",
    href: "/dashboard",
    linkLabel: "Aller au tableau de bord",
  },
  {
    id: "relay",
    title: "Passez le relais à un agent libre",
    action: "Dans la fiche, choisissez un agent en service et sans mission en cours.",
    result: "L'agent prend la mission : sa charge change aussitôt sur la page Équipe.",
    href: "/dashboard",
    linkLabel: "Reprendre la fiche",
  },
  {
    id: "close",
    title: "Clôturez l'incident",
    action: "Une fois le site sécurisé, clôturez l'incident depuis la fiche.",
    result: "Le compteur d'incidents ouverts repasse à zéro et la mission rejoint les missions terminées.",
    href: "/dashboard",
    linkLabel: "Reprendre la fiche",
  },
  {
    id: "assign",
    title: "Affectez une nouvelle demande",
    action: "Recevez une demande client (alarme sur un entrepôt), puis affectez-la à un agent.",
    result: "La demande quitte la file « À affecter » et apparaît dans le planning de l'agent.",
    href: "/jobs",
    linkLabel: "Recevoir la demande",
  },
];

export function stepDone(state: OpsState | null): Record<StepId, boolean> {
  if (!state) return { open: false, relay: false, close: false, assign: false };
  const mine = state.activity.filter((a) => a.byVisitor);
  return {
    open: state.openedIncidents.length > 0,
    relay: mine.some((a) => a.type === "assignee_changed" && a.onIncident),
    close: mine.some((a) => a.type === "status_change" && a.from === "incident" && a.to === "completed"),
    assign: state.jobs.some((j) => j.simulated && j.assigneeId !== ""),
  };
}

export function progress(state: OpsState | null) {
  const done = stepDone(state);
  const count = STEPS.filter((s) => done[s.id]).length;
  const next = STEPS.find((s) => !done[s.id]) ?? null;
  return { done, count, total: STEPS.length, next };
}
