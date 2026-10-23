/** The product mark: a key tag on its ring, drawn for Deralis Ops. */
export function Mark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden className={className}>
      <rect width="28" height="28" rx="7" fill="var(--ink)" />
      <path d="M8.5 9.5h9.2a2.3 2.3 0 0 1 2.3 2.3v4.4a2.3 2.3 0 0 1-2.3 2.3H8.5l-2-2.2v-4.6z" fill="var(--tag-mer)" transform="rotate(-14 13 14)" />
      <circle cx="9.6" cy="14.6" r="1.4" fill="var(--ink)" transform="rotate(-14 13 14)" />
    </svg>
  );
}
