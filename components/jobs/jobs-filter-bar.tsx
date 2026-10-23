"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { JobStatus, Priority } from "@/lib/types";
import { PRIORITIES, PRIORITY_LABEL, STATUSES, STATUS_LABEL } from "@/lib/labels";

interface JobsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: JobStatus | "all";
  onStatusChange: (value: JobStatus | "all") => void;
  priority: Priority | "all";
  onPriorityChange: (value: Priority | "all") => void;
}

export function JobsFilterBar({ search, onSearchChange, status, onStatusChange, priority, onPriorityChange }: JobsFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Référence, client, site ou agent"
          aria-label="Rechercher une mission"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={status} onValueChange={(v) => onStatusChange(v as JobStatus | "all")}>
        <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filtrer par statut">
          <SelectValue placeholder="Tous les statuts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={priority} onValueChange={(v) => onPriorityChange(v as Priority | "all")}>
        <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filtrer par priorité">
          <SelectValue placeholder="Toutes les priorités" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les priorités</SelectItem>
          {PRIORITIES.map((p) => (
            <SelectItem key={p} value={p}>
              {PRIORITY_LABEL[p]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
