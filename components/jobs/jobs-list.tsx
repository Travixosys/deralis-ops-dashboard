"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MissionTable } from "./mission-table";
import { PageTitle, Skeleton } from "@/components/ops/ui";
import { useOps } from "@/lib/store";
import { clientById, memberName } from "@/lib/seed";
import { cn } from "@/lib/utils";
import type { Job } from "@/lib/types";

type Tab = "all" | "incident" | "waiting" | "in_progress" | "pending" | "completed";

const TABS: { id: Tab; label: string; test: (j: Job) => boolean }[] = [
  { id: "all", label: "Toutes", test: () => true },
  { id: "incident", label: "Incidents", test: (j) => j.status === "incident" },
  { id: "waiting", label: "À affecter", test: (j) => j.status !== "completed" && !j.assigneeId },
  { id: "in_progress", label: "En cours", test: (j) => j.status === "in_progress" },
  { id: "pending", label: "Planifiées", test: (j) => j.status === "pending" && !!j.assigneeId },
  { id: "completed", label: "Terminées", test: (j) => j.status === "completed" },
];

const EMPTY: Record<Tab, string> = {
  all: "Aucune mission.",
  incident: "Aucun incident ouvert. Un signalement du terrain apparaît ici et en tête du tableau de bord.",
  waiting: "Toutes les demandes ont un agent. Une demande client reçue sans agent apparaît ici.",
  in_progress: "Aucune mission en cours.",
  pending: "Aucune mission planifiée.",
  completed: "Aucune mission terminée.",
};

export function JobsList() {
  const ops = useOps();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");

  const searched = useMemo(() => {
    const jobs = ops?.jobs ?? [];
    if (!search) return jobs;
    const q = search.toLocaleLowerCase("fr");
    return jobs.filter((j) =>
      [j.reference, clientById(j.clientId).name, clientById(j.clientId).short, j.location, j.assigneeId ? memberName(j.assigneeId) : "sans agent"]
        .join(" ")
        .toLocaleLowerCase("fr")
        .includes(q)
    );
  }, [ops, search]);

  const current = TABS.find((t) => t.id === tab)!;
  const filtered = searched.filter(current.test);

  return (
    <div className="space-y-5">
      <PageTitle
        title="Missions"
        sub="Rondes, postes fixes, escortes et levées de doute sur les sites clients. Ouvrez une mission pour l'affecter, la démarrer ou la clôturer."
      />

      <div className="border-b">
        <div role="tablist" aria-label="Filtrer par état" className="-mb-px flex gap-5 overflow-x-auto">
          {TABS.map((t) => {
            const n = searched.filter(t.test).length;
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex min-h-11 flex-none items-center gap-1.5 border-b-2 text-[14px] transition-colors",
                  active ? "border-ink font-medium text-ink" : "border-transparent text-muted-ink hover:text-ink"
                )}
              >
                {t.label}
                <span className={cn("num text-[13px]", t.id === "incident" && n > 0 ? "font-semibold text-negative-ink" : "text-muted-ink")}>{ops ? n : ""}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-ink" aria-hidden />
          <input
            type="search"
            placeholder="Site, client, agent ou référence"
            aria-label="Rechercher une mission"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-md bg-sheet pl-9 pr-3 text-[16px] border border-control placeholder:text-muted-ink focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--ink)] md:h-9 md:text-[14px]"
          />
        </div>
        <p className="num text-[13px] text-muted-ink">
          {ops ? `${filtered.length} mission${filtered.length > 1 ? "s" : ""}` : ""}
        </p>
      </div>

      {ops ? (
        <MissionTable jobs={filtered} empty={search ? `Aucune mission ne correspond à « ${search} ».` : EMPTY[tab]} />
      ) : (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      )}
    </div>
  );
}
