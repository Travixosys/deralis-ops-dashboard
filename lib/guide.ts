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
    action: "Une issue de secours a été forcée au centre commercial Méridienne. Ouvrez la mission signalée en rouge.",
    result: "La fiche réunit le site, l'agent sur place, les consignes et la main courante.",
    href: "/dashboard",
    linkLabel: "Ouvrir l'incident",
  },
  {
    id: "relay",
    title: "Passez le relais à un agent libre",
    action: "Karim est sur place depuis le début de sa vacation. Dans la fiche, confiez la mission à un agent marqué Libre.",
    result: "Son crochet porte maintenant l'étiquette du site, sur le tableau des agents et la page Équipe.",
    href: "/dashboard",
    linkLabel: "Reprendre la fiche",
  },
  {
    id: "close",
    title: "Clôturez l'incident",
    action: "Le site est sécurisé : clôturez l'incident depuis la fiche.",
    result: "Le compteur d'incidents ouverts repasse à zéro.",
    href: "/dashboard",
    linkLabel: "Reprendre la fiche",
  },
  {
    id: "assign",
    title: "Affectez une nouvelle demande",
    action: "Une alarme sonne dans un entrepôt client. Recevez la demande, puis affectez-la à un agent libre.",
    result: "La demande quitte « À traiter » et entre dans le planning de l'agent.",
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
