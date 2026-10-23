import { clientById } from "@/lib/seed";
import { cn } from "@/lib/utils";

const TAG_TINT: Record<string, string> = {
  MER: "var(--tag-mer)",
  SOL: "var(--tag-sol)",
  CRE: "var(--tag-cre)",
  CLP: "var(--tag-clp)",
  ATL: "var(--tag-atl)",
};

/**
 * A client site as the key tag of the guard post's key board: the site's tint, a punched hole,
 * and its three-letter code stamped in the condensed cut. The signature element of the product.
 */
export function KeyTag({
  clientId,
  className,
  swing = false,
  title,
}: {
  clientId: string;
  className?: string;
  /** Plays the short swing when the tag has just been hung on a new hook. */
  swing?: boolean;
  title?: string;
}) {
  const client = clientById(clientId);
  return (
    <span
      title={title ?? client.name}
      className={cn(
        "relative inline-flex h-[22px] flex-none items-center rounded-[4px_6px_6px_4px] pl-[17px] pr-2 text-[12px] font-bold leading-none tracking-[0.04em] text-ink condensed",
        "shadow-[inset_0_0_0_1px_rgba(19,24,22,0.14)]",
        swing && "tag-swing",
        className
      )}
      style={{ background: TAG_TINT[client.short] }}
    >
      <span aria-hidden className="absolute left-[6px] top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-sheet shadow-[inset_0_0_0_1px_rgba(19,24,22,0.28)]" />
      <span className="sr-only">Site </span>
      {client.short}
    </span>
  );
}
