---
version: 1
slug: "app-dashboard-page-tsx"
primary_target: "app/dashboard/page.tsx"
related_targets: ["app/page.tsx","app/jobs/page.tsx","app/team/page.tsx"]
---

# Surface brief: operations screens (dashboard, missions, équipe) and start page

Scope: `/dashboard`, `/jobs`, `/team` (Operate) and the start page `/` (Persuade, compact, product-first).
Audience: ops manager of a small private security company; Deralis prospects arriving cold.
Task: spot the incident, hand it to a free agent, close it, assign new requests.
Constraints: French UI, fictional data, nothing sent, no public side, one configuration.
Decision round: unattended run (subagent, user absent); assigned direction built, no decision page served.

## Direction contract

THESIS: The key board of the guard post. Every agent is a hook; a mission is a tag hanging on it. Refuses the KPI-tile row plus big chart plus table template.
OWN-WORLD: Painted-steel light grey shell (#e3e6e1) beside a white working sheet; ink #15191b; safety green for covered missions, signal red for incidents only; pale key-tag tints as client identity; Archivo at normal width for UI, its condensed width for stamped tag codes and figures, tabular.
STORY: The manager sees the open incident first, sees who is free on the board, dispatches, closes, and the board re-hangs.
FIRST VIEWPORT: Sidebar left (name, scope, nav). Title row "Exploitation" with the finding sentence. Left two-thirds: "À traiter" queue (incidents, unassigned requests) then live missions with shift progress. Right third: the key board of agents. Primary action on each queue row.
FORM: candidate 6 of 7 (tableau à clés), seed:f041de62b7f3457f
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
