import { cn } from "@/lib/utils";

/** The screen's title row: a noun at 24px, one sentence about the data, the freshness or actions on the right. */
export function PageTitle({ title, sub, right }: { title: string; sub?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[24px] font-semibold leading-8 tracking-[-0.015em]">{title}</h1>
        {sub && <div className="mt-1 max-w-[72ch] text-[15px] leading-6 text-muted-ink">{sub}</div>}
      </div>
      {right && <div className="flex flex-none items-center gap-3 text-[13px] text-muted-ink">{right}</div>}
    </div>
  );
}

/** A block on the sheet: 1px edge, no shadow, its title and an optional meta line on the right. */
export function Panel({
  title,
  meta,
  children,
  className,
  id,
  testId,
}: {
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  id?: string;
  testId?: string;
}) {
  const headingId = id ?? `panel-${title.toLowerCase().replace(/[^a-zà-ÿ]+/g, "-")}`;
  return (
    <section aria-labelledby={headingId} className={cn("rounded-[10px] bg-sheet border", className)} data-testid={testId}>
      <div className="flex min-h-12 items-center justify-between gap-3 px-4 pt-1">
        <h2 id={headingId} className="text-[15px] font-semibold">
          {title}
        </h2>
        {meta && <div className="text-[13px] text-muted-ink">{meta}</div>}
      </div>
      {children}
    </section>
  );
}

const PERSON_HUES = [18, 200, 95, 330, 45, 160, 260, 120];

/** A person as themselves: initials on a pale tint of their own hue (identity, not data). */
export function Initials({ initials, index, size = 32, className }: { initials: string; index: number; size?: number; className?: string }) {
  const hue = PERSON_HUES[index % PERSON_HUES.length];
  return (
    <span
      aria-hidden
      className={cn("inline-flex flex-none items-center justify-center rounded-full text-[12px] font-semibold text-ink", className)}
      style={{ width: size, height: size, background: `hsl(${hue} 42% 89%)` }}
    >
      {initials}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("rounded-md bg-raised", className)} />;
}
