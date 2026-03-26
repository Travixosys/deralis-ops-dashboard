# DERALIS_BUILD_DEBRIEF

## 1. PROJECT_META

```yaml
name: Deralis Ops Dashboard
purpose: Operations management dashboard for a security services company
audience: Portfolio reviewers, hiring managers, future developers
problem_solved: Centralized view of jobs, team availability, and KPIs for security operations
url: N/A
stack: [Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui, Radix UI, Recharts, Framer Motion]
repo: travixosys/deralis-ops-dashboard
```

## 2. REQUIREMENTS

- Dashboard page with KPI cards, bar chart (14-day trend), donut chart (job type distribution), and jobs table
- Jobs page with search, status/priority filtering, column sorting, and slide-out detail sheet
- Team page with member grid, availability badges, and per-member job list
- Responsive layout: persistent sidebar on desktop, drawer sheet on mobile
- Demo controls: simulate new job, simulate issue, reset data
- Animation triggers: blue highlight flash on new jobs, red pulse on critical alerts
- All data client-side via mock data and React Context (no backend)
- Dark mode support via CSS variables and OKLCH color system
- Activity timeline per job showing lifecycle events
- [?] Production backend integration (not implemented, implied by domain)

## 3. DECISIONS

| Decision | Chose | Over | Why | Repeat? |
|---|---|---|---|---|
| State management | React Context + useMemo | Redux, Zustand | Minimal overhead for demo-scoped state; no external dependency needed | Yes for demos, No for production |
| UI component library | shadcn/ui (New York) | MUI, Ant Design, Chakra | Copy-paste ownership, Radix primitives for a11y, Tailwind-native | Yes |
| CSS framework | Tailwind CSS v4 | CSS Modules, styled-components | Utility-first, co-located styles, v4 @theme inline syntax | Yes |
| Charts | Recharts | Chart.js, Nivo, Victory | React-native API, composable, lightweight for 2 chart types | Yes |
| Page transitions | Framer Motion | CSS transitions, React Transition Group | Declarative AnimatePresence, layout animations | Yes |
| Icons | Lucide React | Heroicons, FontAwesome | Tree-shakeable, consistent stroke style, shadcn default | Yes |
| Mock data strategy | Seeded deterministic generation | Faker.js, hard-coded JSON | Consistent renders without external dep; reproducible | Yes |
| Color format | OKLCH | HSL, Hex | Perceptually uniform, better for programmatic palette generation | Yes |
| Module resolution | Bundler mode + @/* alias | Relative paths | Clean imports, Next.js convention | Yes |
| App Router | Next.js App Router | Pages Router | RSC support, layouts, modern convention | Yes |

## 4. DEVIATIONS

| What prompt said | What I did | Type | Why |
|---|---|---|---|
| Next.js 15 scaffold (commit msg) | Used Next.js 16.2.1 | IMPROVEMENT | Latest stable available; AGENTS.md warns about breaking changes |

## 5. PRACTICES

| Practice | Where |
|---|---|
| Feature-grouped component folders | components/dashboard/, components/jobs/, components/team/ |
| Shared UI primitives in separate directory | components/ui/ (11 files) |
| Centralized type definitions | lib/types.ts |
| Context provider at root layout | app/layout.tsx |
| useMemo for filter+sort pipelines | components/jobs/jobs-list.tsx |
| Type-safe style record maps for variants | components/status-badge.tsx, components/priority-badge.tsx |
| Compound component pattern (Card, Table) | components/ui/card.tsx, components/ui/table.tsx |
| Responsive nav via shared SidebarContent | components/sidebar.tsx (reused in header.tsx mobile sheet) |
| CSS custom properties for theming | app/globals.css (@theme inline block) |
| forwardRef + ComponentPropsWithoutRef for UI primitives | components/ui/*.tsx |
| Deterministic mock data with seeded random | lib/mock-data.ts:seededRandom() |
| Relative time formatting with locale support | lib/utils.ts:formatRelativeTime() |

## 6. PATTERNS

```yaml
name: Context-based demo state
when_to_use: Client-side apps needing shared mutable state across pages without a backend
snippet: |
  const DemoContext = createContext<DemoState | null>(null);
  export function useDemo() {
    const ctx = useContext(DemoContext);
    if (!ctx) throw new Error("useDemo must be inside DemoProvider");
    return ctx;
  }
```

```yaml
name: Memoized filter-sort pipeline
when_to_use: Tables with search, multi-filter, and sortable columns
snippet: |
  const filtered = useMemo(() => {
    return jobs
      .filter(j => matchesSearch(j) && matchesStatus(j) && matchesPriority(j))
      .sort((a, b) => compareFn(a, b, sortKey, sortDir));
  }, [jobs, search, statusFilter, priorityFilter, sortKey, sortDir]);
```

```yaml
name: Seeded pseudo-random
when_to_use: Generating deterministic mock data that looks varied but is reproducible
snippet: |
  function seededRandom(seed: number): number {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  }
```

```yaml
name: Type-safe style record map
when_to_use: Mapping enum/union values to Tailwind class strings
snippet: |
  const statusStyles: Record<JobStatus, string> = {
    Pending: "bg-amber-100 text-amber-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    "Issue Flagged": "bg-red-100 text-red-800",
  };
```

```yaml
name: Responsive sidebar/drawer
when_to_use: Desktop persistent sidebar + mobile hamburger drawer using same content
snippet: |
  <aside className="hidden lg:flex"><SidebarContent /></aside>
  <Sheet>
    <SheetTrigger asChild><Button className="lg:hidden" /></SheetTrigger>
    <SheetContent side="left"><SidebarContent /></SheetContent>
  </Sheet>
```

```yaml
name: Animation trigger via data attribute
when_to_use: Highlighting newly added items in a list with CSS animation
snippet: |
  <tr data-highlight={job.id === highlightedJobId || undefined}
      className="data-[highlight]:animate-highlight-fade">
```

```yaml
name: Custom enum sort ordering
when_to_use: Sorting table columns where string comparison gives wrong order
snippet: |
  const priorityOrder: Record<Priority, number> =
    { Low: 0, Medium: 1, High: 2, Critical: 3 };
  // sort: priorityOrder[a.priority] - priorityOrder[b.priority]
```

```yaml
name: Smart relative time
when_to_use: Displaying timestamps as human-readable relative strings
snippet: |
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${s} ago`;
  if (isYesterday) return `Yesterday at ${time}`;
  return `${formatShortDate(date)} ${time}`;
```

## 7. DEPENDENCIES

| Package | Does | Chose over | Why |
|---|---|---|---|
| recharts | Bar/Pie charts with React composable API | chart.js, nivo | Native React components, no canvas; declarative |
| framer-motion | Page transitions + layout animations | react-spring, CSS | AnimatePresence for route transitions; declarative exit animations |
| class-variance-authority | Component variant definitions | manual cn() conditionals | Structured variant API, pairs with shadcn/ui |
| tailwind-merge | Resolves conflicting Tailwind classes | manual dedup | Handles specificity conflicts in cn() utility |
| @radix-ui/* (7 packages) | Accessible headless UI primitives | building from scratch | WAI-ARIA compliance out of the box; shadcn foundation |
| tw-animate-css | Pre-built Tailwind animation utilities | custom keyframes only | Faster iteration on entrance/exit animations |

## 8. HARD_PROBLEMS

```yaml
problem: Synchronized state across 3 pages without prop drilling or external library
difficulty: ambiguity
solution: Single DemoContext at root layout with useMemo-wrapped value object; useDemo() hook with error boundary for missing provider
files: [lib/demo-context.tsx, app/layout.tsx]
```

```yaml
problem: Performant filtering + sorting + searching on 24+ item table without jank
difficulty: complexity
solution: Single useMemo combining all filter predicates and sort logic; dependencies array includes all filter/sort state; avoids cascading re-renders
files: [components/jobs/jobs-list.tsx, components/jobs/jobs-filter-bar.tsx]
```

```yaml
problem: Generating realistic activity timelines without hard-coding hundreds of entries
difficulty: constraints
solution: Deterministic algorithm using seededRandom() that generates timeline entries based on job status progression (created→assigned→started→completed) with realistic timestamps via hoursAgo()
files: [lib/mock-data.ts]
```

## 9. TECH_DEBT

1. [INCOMPLETE] No backend API → connect REST/GraphQL endpoints for real data
2. [INCOMPLETE] No authentication → add session management and RBAC
3. [INCOMPLETE] No data persistence → state resets on refresh; needs database
4. [SUBOPTIMAL] No virtualization on jobs table → will lag at 500+ rows; add react-window
5. [INCOMPLETE] No tests → add unit tests for utils, integration tests for pages
6. [SUBOPTIMAL] All components are "use client" → refactor to maximize server components
7. [INCOMPLETE] No error boundaries → add fallback UI for component failures
8. [FRAGILE] Demo controls tightly coupled to mock data shape → abstract simulation logic

## 10. STYLE_RULES

RULE: Group components by feature domain in named subdirectories under components/
RULE: Place all shadcn/ui primitives in components/ui/ without modification
RULE: Define shared TypeScript types in lib/types.ts, not inline
RULE: Use "use client" directive only on components that use hooks or browser APIs
RULE: Use cn() utility (clsx + tailwind-merge) for all conditional className logic
RULE: Use Record<UnionType, string> for mapping enum values to Tailwind classes
RULE: Use useMemo for any filter/sort/search computation over arrays
RULE: Use OKLCH color format in CSS custom properties for theme values
RULE: Use @/* path alias for all imports from project root
RULE: Use PascalCase for component files, camelCase for utility files
RULE: Wrap page content in PageTransition component for route animations
RULE: Keep mock data generation deterministic using seeded random functions

## 11. CONTEXT_FOR_NEW_SESSION

- FACT: This is a Next.js 16 + React 19 ops dashboard for a security company called Deralis, using App Router
- FACT: All data is client-side mock data in lib/mock-data.ts managed by React Context in lib/demo-context.tsx
- FACT: UI built with shadcn/ui (New York style) + Tailwind CSS v4 (@theme inline, OKLCH colors)
- FACT: Three pages exist: /dashboard (KPIs + charts), /jobs (filterable table + detail sheet), /team (member grid)
- FACT: AGENTS.md warns that Next.js 16 has breaking changes; read node_modules/next/dist/docs/ before writing code
- FACT: No backend, no auth, no tests, no persistence — this is a portfolio demo
- FACT: Demo controls (components/demo-controls.tsx) simulate adding jobs, flagging issues, and resetting state
- FACT: Responsive layout uses persistent sidebar on desktop and Sheet drawer on mobile via shared SidebarContent
- FACT: Animations use CSS keyframes triggered by data attributes (highlight-fade) and state counters (pulse-red)
- FACT: Key utilities are cn() for classnames, formatRelativeTime() for timestamps, and seededRandom() for mock data
