---
name: Deralis Ops
description: Operations screen for a private security company, built as the key board of the guard post.
colors:
  frame: "#e9ede8"
  frame-2: "#dfe4de"
  sheet: "#ffffff"
  raised: "#f4f6f3"
  ink: "#131816"
  muted: "#545d58"
  border: "#e1e5e0"
  rule: "#edf0ec"
  control: "#c9cfc8"
  covered: "#0d7a4e"
  covered-tint: "#e2f2ea"
  covered-ink: "#0a5537"
  negative: "#c4242a"
  negative-tint: "#fdecea"
  negative-ink: "#8a1c20"
  waiting-tint: "#fff8e6"
  waiting-line: "#f2d27a"
  waiting-ink: "#7a4508"
  tag-mer: "#f4e19c"
  tag-sol: "#cde1f6"
  tag-cre: "#f6d3bd"
  tag-clp: "#c7ebe5"
  tag-atl: "#f1d2df"
typography:
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "32px"
    letterSpacing: "-0.015em"
  section:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  meta:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  figure:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 600
  stamp:
    fontFamily: "Archivo (font-stretch 78%), ui-sans-serif, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    letterSpacing: "0.04em"
  display:
    fontFamily: "Archivo (font-stretch 78%), ui-sans-serif, sans-serif"
    fontSize: "68px"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.012em"
rounded:
  tag: "4px 6px 6px 4px"
  control: "6px"
  panel: "10px"
  sheet: "14px"
  pill: "9999px"
spacing:
  gutter: "24px"
  panel-x: "16px"
  sheet-x: "28px"
  phone-margin: "16px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.control}"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "40px"
  pill-incident:
    backgroundColor: "{colors.negative-tint}"
    textColor: "{colors.negative-ink}"
    rounded: "{rounded.pill}"
    height: "22px"
  pill-running:
    backgroundColor: "{colors.covered-tint}"
    textColor: "{colors.covered-ink}"
    rounded: "{rounded.pill}"
    height: "22px"
  pill-waiting:
    backgroundColor: "{colors.waiting-tint}"
    textColor: "{colors.waiting-ink}"
    rounded: "{rounded.pill}"
    height: "22px"
  key-tag:
    typography: "{typography.stamp}"
    rounded: "{rounded.tag}"
    height: "22px"
  panel:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.panel}"
---

## Overview

Deralis Ops is the operations screen of a small private security company. Its world is the key board of the
guard post: every agent is a hook, every client site is a key tag with its own tint and a stamped three-letter
code. An agent on a mission carries the site's tag; a free agent's hook is empty and ready. The frame is painted
steel (green-grey), the work sits on a white sheet. The screen leads with the exception (open incidents,
requests without an agent) and the people who can take it, never with charts of past activity.

## Colors

Restrained, and every hue has a job. `covered` (safety green) marks running missions, free agents and finished
guide steps. `negative` marks incidents only, one red mark per object. `waiting` (amber) marks a client request
with no agent. The five `tag-*` tints are client identity, never data, and always carry their stamped code.
Chrome holds no colour: the frame is a tone step, the active nav item is a white pill, the primary action is ink.

## Typography

One family, Archivo, in two widths. Normal width for the whole interface (24/15/14/13px, weights 400 to 600,
tabular figures on every time and count via `.num`). The condensed cut (`.condensed`, font-stretch 78%) is kept
for stamped codes on key tags and for the start page's headline. No monospace.

## Layout

Desktop: a 248px frame column (brand, nav, guided journey) and a white sheet inset 8px from the window with a
1px edge and 14px corners. On the dashboard, a 12-column grid with one 24px gutter: the queue, live missions and
upcoming shifts on 8 columns; the key board as a sticky right rail on 4. Phone: the frame becomes a 56px top bar,
the sheet is the screen, the guide is a bar docked at the bottom, tables become two-line rows.

## Elevation & Depth

Flat. Surfaces separate by a tone step (frame, sheet, raised) and 1px borders. Shadows only on what floats: the
mission sheet, the select menu, the docked guide bar on phones.

## Shapes

Panels 10px, the sheet 14px, controls 6px, pills fully round. The key tag is the one custom shape: a rounded
rectangle with a punched hole at its left end.

## Components

- **Key tag**: site tint, punched hole, stamped code. Appears wherever a mission or site is named. Swings once
  (520ms, ease-out) when it is hung on a different agent; static under reduced motion.
- **Key board**: one row per agent in a fixed order, initials on a pale personal tint, state on the right.
- **Status strip**: four figures in one divided container; the incident cell turns `negative-tint` when non-zero.
- **Mission sheet**: header tinted red for an incident, key-value facts, a "Décision" block (agent select,
  actions), and the "Main courante" log with the visitor's own entries highlighted in `covered-tint`.
- **Guided journey**: four steps with live state, in the frame on desktop and docked at the bottom on phones.

## Do's and Don'ts

- Do put the decision first: the queue and the finding sentence answer "what needs me now".
- Do keep French typography: non-breaking spaces before `:` `?` and inside « ».
- Don't add KPI tiles with icons, sparklines, donut charts or invented trends.
- Don't use red for anything but an incident, or colour for decoration.
- Don't use em dashes in copy.
