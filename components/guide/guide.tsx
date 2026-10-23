"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronUp, Info, RotateCcw, Plus, AlertTriangle, ArrowRight } from "lucide-react";
import { STEPS, progress, type GuideStep } from "@/lib/guide";
import { openJob, receiveRequest, resetDemo, simulateIncident, useOps, type OpsState } from "@/lib/store";
import { setGuideOpen, useGuidePref } from "@/lib/guide-ui";
import { cn } from "@/lib/utils";

const OPS_ROUTES = ["/dashboard", "/jobs", "/team"];

/** What the step's button does: go to the right screen and, when useful, open the right mission. */
function useStepAction() {
  const router = useRouter();
  const pathname = usePathname();
  const onOps = OPS_ROUTES.some((r) => pathname.startsWith(r));

  return (step: GuideStep, ops: OpsState | null) => {
    if (!ops) return;
    if (step.id === "open" || step.id === "relay" || step.id === "close") {
      const open = ops.jobs.find((j) => j.status === "incident");
      const id = open?.id ?? simulateIncident();
      if (!onOps) router.push("/dashboard");
      if (id) openJob(id);
      return;
    }
    const waiting = ops.jobs.find((j) => j.simulated && !j.assigneeId);
    const id = waiting?.id ?? receiveRequest();
    if (!pathname.startsWith("/jobs")) router.push("/jobs");
    openJob(id);
  };
}

function stepLabel(step: GuideStep, ops: OpsState | null) {
  if ((step.id === "relay" || step.id === "close") && ops && !ops.jobs.some((j) => j.status === "incident")) {
    return "Déclencher un incident";
  }
  if (step.id === "assign" && ops?.jobs.some((j) => j.simulated && !j.assigneeId)) return "Ouvrir la demande";
  return step.linkLabel;
}

/** The four steps with their live state. Used in the sidebar, the phone bar and the start page. */
export function GuideSteps({ variant = "panel", onAction }: { variant?: "panel" | "start"; onAction?: () => void }) {
  const ops = useOps();
  const act = useStepAction();
  const { done, next } = progress(ops);

  return (
    <ol className="space-y-1" data-testid="guide-steps">
      {STEPS.map((step, i) => {
        const isDone = done[step.id];
        const isNext = next?.id === step.id;
        return (
          <li key={step.id} data-step={step.id} data-done={isDone ? "true" : "false"} className={cn("rounded-md", isNext && variant === "panel" ? "bg-raised p-3 border" : "px-3 py-1.5")}>
            <div className="flex items-start gap-2.5">
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums",
                  isDone ? "border-transparent bg-covered text-white" : isNext ? "border-ink text-ink" : "border-control text-muted-ink"
                )}
              >
                {isDone ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm leading-5", isDone && "text-muted-ink line-through decoration-1", isNext && "font-semibold")}>
                  {step.title}
                  <span className="sr-only">{isDone ? " (fait)" : " (à faire)"}</span>
                </p>
                {isNext && variant === "panel" && (
                  <>
                    <p className="mt-1 text-sm leading-5 text-muted-ink">{step.action}</p>
                    <p className="mt-1.5 text-sm leading-5">
                      <span className="font-medium">Résultat attendu : </span>
                      {step.result}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        act(step, ops);
                        onAction?.();
                      }}
                      className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-md bg-ink px-3 text-[14px] font-medium text-sheet hover:bg-ink/85 md:min-h-9"
                    >
                      {stepLabel(step, ops)}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function ResetButton() {
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();
  if (!confirm) {
    return (
      <button type="button" onClick={() => setConfirm(true)} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-ink hover:text-foreground md:min-h-8">
        <RotateCcw className="h-3.5 w-3.5" aria-hidden />
        Réinitialiser la démo
      </button>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span>Données et parcours remis à zéro ?</span>
      <button
        type="button"
        onClick={() => {
          resetDemo();
          setConfirm(false);
          router.push("/dashboard");
        }}
        className="inline-flex min-h-11 items-center rounded-md border border-foreground px-2.5 font-medium md:min-h-8"
      >
        Réinitialiser
      </button>
      <button type="button" onClick={() => setConfirm(false)} className="inline-flex min-h-11 items-center px-1 text-muted-ink md:min-h-8">
        Annuler
      </button>
    </div>
  );
}

function DemoActions() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex flex-col items-start gap-0.5">
      <button
        type="button"
        onClick={() => {
          const id = receiveRequest();
          if (!pathname.startsWith("/jobs")) router.push("/jobs");
          openJob(id);
        }}
        className="inline-flex min-h-11 items-center gap-1.5 text-left text-sm font-medium hover:underline md:min-h-8"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        Recevoir une demande
      </button>
      <button
        type="button"
        onClick={() => {
          const id = simulateIncident();
          if (id) {
            if (!OPS_ROUTES.some((r) => pathname.startsWith(r))) router.push("/dashboard");
          }
        }}
        className="inline-flex min-h-11 items-center gap-1.5 text-left text-sm font-medium hover:underline md:min-h-8"
      >
        <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
        Simuler un incident
      </button>
    </div>
  );
}

export function AboutDemo() {
  return (
    <details className="group text-sm">
      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 font-medium text-muted-ink hover:text-foreground md:min-h-8">
        <Info className="h-3.5 w-3.5" aria-hidden />
        À propos de cette démo
      </summary>
      <div className="mt-1 space-y-1.5 leading-5 text-muted-ink">
        <p>Rempart Sécurité, ses clients, ses agents et ses sites sont fictifs. Les horaires sont calculés à partir de l&apos;heure de votre visite.</p>
        <p>Les données restent dans ce navigateur. Aucun appel, SMS ou message n&apos;est envoyé aux agents ni aux clients.</p>
        <p>Les étapes se valident d&apos;elles-mêmes quand l&apos;action est faite. « Réinitialiser la démo » remet les données et le parcours à zéro.</p>
      </div>
    </details>
  );
}

function Progress({ count, total }: { count: number; total: number }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-frame-2" aria-hidden>
      <div className="h-full rounded-full bg-covered transition-[width] duration-300 ease-out" style={{ width: `${(count / total) * 100}%` }} />
    </div>
  );
}

function Finished() {
  return (
    <p className="rounded-md bg-covered-tint p-3 text-sm leading-5 text-covered-ink">
      <span className="font-semibold">Parcours terminé.</span>{" "}L&apos;incident est clôturé et la nouvelle demande a son agent. Continuez librement ou réinitialisez pour recommencer.
    </p>
  );
}

/** Desktop: the guide lives in the sidebar, under the navigation. */
export function GuidePanel() {
  const ops = useOps();
  const pref = useGuidePref();
  const expanded = pref !== "closed";
  const { count, total, next } = progress(ops);

  return (
    <section aria-labelledby="guide-title" className="rounded-[10px] bg-sheet px-2 py-3 border" data-testid="guide-panel">
      <div className="flex items-center justify-between gap-2 px-1">
        <h2 id="guide-title" className="text-sm font-semibold">
          Parcours guidé
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs tabular-nums text-muted-ink" data-testid="guide-count">
            {ops ? count : 0}/{total}
          </span>
          <button
            type="button"
            onClick={() => setGuideOpen(!expanded)}
            aria-expanded={expanded}
            className="rounded p-1 text-muted-ink hover:text-foreground"
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            <span className="sr-only">{expanded ? "Masquer le parcours" : "Afficher le parcours"}</span>
          </button>
        </div>
      </div>
      <div className="mt-2 px-1">
        <Progress count={count} total={total} />
      </div>
      {expanded && (
        <div className="mt-3 space-y-3">
          {!next && ops && <Finished />}
          <GuideSteps />
          <div className="mx-1 border-t px-2 pt-2">
            <DemoActions />
            <ResetButton />
            <AboutDemo />
          </div>
        </div>
      )}
    </section>
  );
}

/** Phone: a bar docked at the bottom, expanding into a panel over the page. */
export function GuideBar() {
  const ops = useOps();
  const pref = useGuidePref();
  const expanded = pref === "open";
  const { count, total, next } = progress(ops);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-sheet shadow-[0_-6px_20px_rgba(19,24,22,0.08)] md:hidden" data-testid="guide-bar">
      <button
        type="button"
        onClick={() => setGuideOpen(!expanded)}
        aria-expanded={expanded}
        className="flex min-h-14 w-full items-center gap-3 px-4 text-left"
      >
        <span className="text-sm font-semibold">Parcours guidé</span>
        <span className="text-sm tabular-nums text-muted-ink">
          {ops ? count : 0}/{total}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm text-muted-ink">{next ? next.title : "Terminé"}</span>
        {expanded ? <ChevronDown className="h-5 w-5 flex-none" /> : <ChevronUp className="h-5 w-5 flex-none" />}
        <span className="sr-only">{expanded ? "Masquer le parcours" : "Afficher le parcours"}</span>
      </button>
      <div className="px-4">
        <Progress count={count} total={total} />
      </div>
      {expanded && (
        <div className="max-h-[65svh] space-y-3 overflow-y-auto px-2 pb-4 pt-3">
          {!next && ops && <Finished />}
          <GuideSteps onAction={() => setGuideOpen(false)} />
          <div className="border-t px-2 pt-2">
            <DemoActions />
            <ResetButton />
            <AboutDemo />
          </div>
        </div>
      )}
    </div>
  );
}

/** Start page: reset appears once the visitor has made progress, next to the about panel. */
export function StartGuideFooter() {
  const ops = useOps();
  const { count } = progress(ops);
  return (
    <div className="mt-2 flex flex-col items-start gap-0.5 px-3">
      {count > 0 && <ResetButton />}
      <AboutDemo />
    </div>
  );
}
