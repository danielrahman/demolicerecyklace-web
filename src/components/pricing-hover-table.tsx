"use client";

import { type MouseEvent, useState } from "react";
import Image from "next/image";

import type { CmsPricingRow } from "@/lib/cms/mappers";

const PREVIEW_WIDTH = 320;
const PREVIEW_ASPECT_RATIO = 1.7;
const PREVIEW_HEIGHT = Math.round(PREVIEW_WIDTH / PREVIEW_ASPECT_RATIO);

type CursorPreview = {
  row: CmsPricingRow;
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function PricingHoverTable({
  title,
  rows,
  subtitle,
}: {
  title: string;
  rows: CmsPricingRow[];
  subtitle?: string;
}) {
  const [preview, setPreview] = useState<CursorPreview | null>(null);
  const hasNotes = rows.some((row) => Boolean(row.note));

  const updateCursor = (row: CmsPricingRow, event: MouseEvent<HTMLElement>) => {
    if (!row.imageUrl) {
      setPreview(null);
      return;
    }

    const x = clamp(event.clientX + 16, 16, window.innerWidth - PREVIEW_WIDTH - 16);
    const y = clamp(event.clientY + 16, 16, window.innerHeight - PREVIEW_HEIGHT - 16);
    setPreview({ row, x, y });
  };

  return (
    <section className="space-y-3 border-t border-zinc-800 pt-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {subtitle ? <p className="text-sm text-zinc-400">{subtitle}</p> : null}
      <div className="relative">
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="min-w-full bg-zinc-900 text-left text-sm">
            <thead className="bg-zinc-800 text-zinc-200">
              <tr>
                <th className="px-4 py-3">Položka</th>
                <th className="px-4 py-3">Kód</th>
                <th className="px-4 py-3">Cena</th>
                {hasNotes ? <th className="px-4 py-3">Poznámka</th> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={`${row.item}-${row.code ?? "no-code"}-${row.price}`}
                  className="border-t border-zinc-800 transition hover:bg-zinc-800"
                  onMouseEnter={(event) => {
                    updateCursor(row, event);
                  }}
                  onMouseMove={(event) => {
                    if (row.imageUrl) {
                      updateCursor(row, event);
                    }
                  }}
                  onMouseLeave={() => {
                    setPreview(null);
                  }}
                >
                  <td className="px-4 py-3">{row.item}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-300">{row.code ?? "-"}</td>
                  <td className="px-4 py-3 font-semibold">{row.price}</td>
                  {hasNotes ? <td className="px-4 py-3 text-zinc-400">{row.note ?? "-"}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {preview ? (
        <div
          className="pointer-events-none fixed z-40 hidden overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950 shadow-2xl shadow-black/50 sm:block"
          style={{ left: preview.x, top: preview.y }}
        >
          {preview.row.imageUrl ? (
            <div className="relative h-52 w-80">
              <Image
                src={preview.row.imageUrl}
                alt={preview.row.imageAlt || preview.row.item}
                width={1280}
                height={720}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-zinc-100">{preview.row.item}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
