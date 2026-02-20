"use client";

import { useState } from "react";

type PricingMarkerInfoProps = {
  text: string;
  align?: "left" | "right";
  className?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function PricingMarkerInfo({
  text,
  align = "left",
  className,
}: PricingMarkerInfoProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className={cx("relative inline-flex items-center", className)} data-no-preview="true">
      <button
        type="button"
        data-no-preview="true"
        aria-expanded={open}
        aria-label="Informace k položce"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((previous) => !previous);
        }}
        onMouseEnter={() => {
          setOpen(true);
        }}
        onMouseLeave={() => {
          setOpen(false);
        }}
        onBlur={() => {
          setOpen(false);
        }}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-zinc-600 text-[9px] font-semibold leading-none text-zinc-300 transition hover:border-zinc-400 hover:text-zinc-100"
      >
        i
      </button>
      {open ? (
        <span
          className={cx(
            "absolute top-6 z-20 w-56 rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-2 text-[11px] leading-4 text-zinc-200 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
          role="tooltip"
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}
