"use client";

import { type MouseEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { CmsPricingRow } from "@/lib/cms/mappers";

const PREVIEW_WIDTH = 320;
const PREVIEW_ASPECT_RATIO = 1.7;
const PREVIEW_HEIGHT = Math.round(PREVIEW_WIDTH / PREVIEW_ASPECT_RATIO);

type CursorPreview = {
  row: CmsPricingRow;
  x: number;
  y: number;
};

type RowAction = {
  href: string;
  label: string;
};

type ParsedItemLabel = {
  label: string;
  hasMarker: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function isInsideNoPreviewArea(event: MouseEvent<HTMLElement>) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("[data-no-preview='true']"));
}

function parseMarkedItemLabel(item: string): ParsedItemLabel {
  const hasMarker = /\*+\s*$/.test(item);
  const label = hasMarker ? item.replace(/\s*\*+\s*$/, "").trim() : item;
  return { label, hasMarker };
}

export function PricingHoverTable({
  title,
  rows,
  subtitle,
  rowActions,
  markerInfoText,
}: {
  title: string;
  rows: CmsPricingRow[];
  subtitle?: string;
  rowActions?: Array<RowAction | null>;
  markerInfoText?: string;
}) {
  const [preview, setPreview] = useState<CursorPreview | null>(null);
  const [openMarkerKey, setOpenMarkerKey] = useState<string | null>(null);
  const hasNotes = rows.some((row) => Boolean(row.note));
  const hasActions = Boolean(rowActions?.some(Boolean));
  const hasAnyMarkers = rows.some((row) => parseMarkedItemLabel(row.item).hasMarker);
  const resolvedMarkerInfoText = markerInfoText?.trim() || "Tuto položku je nutné předem ověřit telefonicky.";

  const updateCursor = (row: CmsPricingRow, event: MouseEvent<HTMLElement>) => {
    if (!row.imageUrl) {
      setPreview(null);
      return;
    }

    const x = clamp(event.clientX + 16, 16, window.innerWidth - PREVIEW_WIDTH - 16);
    const y = clamp(event.clientY + 16, 16, window.innerHeight - PREVIEW_HEIGHT - 16);
    setPreview({ row, x, y });
  };

  const renderMarkerInfo = (rowKey: string, compact = false) => (
    <span className="relative inline-flex items-center" data-no-preview="true">
      <button
        type="button"
        data-no-preview="true"
        aria-expanded={openMarkerKey === rowKey}
        aria-label="Informace k položce"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpenMarkerKey((previous) => (previous === rowKey ? null : rowKey));
        }}
        onMouseEnter={() => {
          setOpenMarkerKey(rowKey);
        }}
        onMouseLeave={() => {
          setOpenMarkerKey((previous) => (previous === rowKey ? null : previous));
        }}
        onBlur={() => {
          setOpenMarkerKey((previous) => (previous === rowKey ? null : previous));
        }}
        className={compact
          ? "ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-600 text-[11px] font-semibold text-zinc-300 transition hover:border-zinc-400 hover:text-zinc-100"
          : "ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-600 text-[11px] font-semibold text-zinc-300 transition hover:border-zinc-400 hover:text-zinc-100"}
      >
        i
      </button>
      {openMarkerKey === rowKey ? (
        <span
          className={compact
            ? "absolute right-0 top-7 z-20 w-56 rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-2 text-[11px] leading-4 text-zinc-200 shadow-lg"
            : "absolute left-0 top-7 z-20 w-64 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs leading-4 text-zinc-200 shadow-lg"}
          role="tooltip"
        >
          {resolvedMarkerInfoText}
        </span>
      ) : null}
    </span>
  );

  return (
    <section className="space-y-3 border-t border-zinc-800 pt-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {subtitle ? <p className="text-sm text-zinc-400">{subtitle}</p> : null}

      <div className="md:hidden">
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="divide-y divide-zinc-800">
            {rows.map((row, index) => {
              const rowAction = rowActions?.[index] ?? null;
              const rowKey = `${row.item}-${row.code ?? "no-code"}-${row.price}-${index}`;
              const parsedItem = parseMarkedItemLabel(row.item);

              return (
                <article key={rowKey} className="px-3 py-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 text-sm font-semibold leading-5">
                      {parsedItem.label}
                      {hasAnyMarkers && parsedItem.hasMarker ? renderMarkerInfo(rowKey, true) : null}
                    </p>
                    <p className="shrink-0 whitespace-nowrap text-sm font-semibold text-[var(--color-accent)]">{row.price}</p>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="truncate font-mono text-[11px] text-zinc-400">{row.code ?? ""}</p>
                    {rowAction ? (
                      <Link
                        href={rowAction.href}
                        className="inline-flex items-center whitespace-nowrap rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[11px] font-semibold text-black"
                      >
                        {rowAction.label}
                      </Link>
                    ) : null}
                  </div>
                  {hasNotes && row.note ? <p className="mt-1.5 text-[11px] leading-4 text-zinc-400">{row.note}</p> : null}
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative hidden md:block">
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="min-w-full bg-zinc-900 text-left text-sm">
            <thead className="bg-zinc-800 text-zinc-200">
              <tr>
                <th className="px-4 py-3">Položka</th>
                <th className="px-4 py-3">Kód</th>
                <th className="px-4 py-3">Cena</th>
                {hasNotes ? <th className="px-4 py-3">Poznámka</th> : null}
                {hasActions ? <th className="px-4 py-3 text-right">Akce</th> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const rowAction = rowActions?.[index] ?? null;
                const rowKey = `${row.item}-${row.code ?? "no-code"}-${row.price}-${index}`;
                const parsedItem = parseMarkedItemLabel(row.item);

                return (
                  <tr
                    key={rowKey}
                    className="border-t border-zinc-800 transition hover:bg-zinc-800"
                    onMouseEnter={(event) => {
                      if (isInsideNoPreviewArea(event)) {
                        setPreview(null);
                        return;
                      }
                      updateCursor(row, event);
                    }}
                    onMouseMove={(event) => {
                      if (isInsideNoPreviewArea(event)) {
                        setPreview(null);
                        return;
                      }
                      if (!row.imageUrl) return;
                      updateCursor(row, event);
                    }}
                    onMouseLeave={() => {
                      setPreview(null);
                    }}
                  >
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center">
                        {parsedItem.label}
                        {hasAnyMarkers && parsedItem.hasMarker ? renderMarkerInfo(rowKey) : null}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-300">{row.code ?? ""}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold">{row.price}</td>
                    {hasNotes ? <td className="px-4 py-3 text-zinc-400">{row.note ?? "-"}</td> : null}
                    {hasActions ? (
                      <td className="px-4 py-3 text-right" data-no-preview="true">
                        {rowAction ? (
                          <Link
                            href={rowAction.href}
                            data-no-preview="true"
                            className="inline-flex items-center whitespace-nowrap rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-[var(--color-accent-hover)]"
                          >
                            {rowAction.label}
                          </Link>
                        ) : (
                          <span className="text-zinc-500">-</span>
                        )}
                      </td>
                    ) : null}
                  </tr>
                );
              })}
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
                alt={preview.row.imageAlt || parseMarkedItemLabel(preview.row.item).label}
                width={1280}
                height={720}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-zinc-100">{parseMarkedItemLabel(preview.row.item).label}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
