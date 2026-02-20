export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const ui = {
  buttonPrimary:
    "inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[var(--color-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50",
  buttonSecondary:
    "inline-flex items-center justify-center whitespace-nowrap rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400",
  buttonInline:
    "inline-flex items-center gap-2 font-semibold text-[var(--color-accent)] underline decoration-zinc-700 underline-offset-4 transition hover:decoration-[var(--color-accent)]",
  card: "rounded-2xl border border-zinc-800 bg-zinc-900/70",
  cardSoft: "rounded-2xl border border-zinc-800 bg-zinc-900/40",
  field: "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-zinc-100 placeholder:text-zinc-500",
  stepBadgeActive: "rounded-full bg-[var(--color-accent)] px-3 py-1 text-black",
  stepBadgeIdle: "rounded-full border border-zinc-700 px-3 py-1 text-zinc-300",
} as const;
