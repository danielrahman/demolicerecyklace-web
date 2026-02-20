"use client";

import { type MouseEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { CmsPricingRow } from "@/lib/cms/mappers";
import { parsePricingItemLabel } from "@/lib/material-sales-pricing";

import { PricingMarkerInfo } from "@/components/pricing-marker-info";

const PREVIEW_WIDTH = 320;
const PREVIEW_ASPECT_RATIO = 1.7;
const PREVIEW_IMAGE_HEIGHT = Math.round(PREVIEW_WIDTH / PREVIEW_ASPECT_RATIO);
const PREVIEW_CAPTION_HEIGHT = 56;
const PREVIEW_TOTAL_HEIGHT = PREVIEW_IMAGE_HEIGHT + PREVIEW_CAPTION_HEIGHT;

type CursorPreview = {
  row: CmsPricingRow;
  x: number;
  y: number;
};

type RowAction = {
  href: string;
  label: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function isInsideNoPreviewArea(event: MouseEvent<HTMLElement>) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("[data-no-preview='true']"));
}

function shortenPreviewLabel(label: string) {
  const normalized = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const isYtongMix = normalized.includes("porobeton") && normalized.includes("ytong");
  const isConcreteBrickMix =
    normalized.includes("smesi")
    && normalized.includes("frakce")
    && normalized.includes("betonu")
    && normalized.includes("cihel");

  if (isYtongMix && isConcreteBrickMix) {
    return "Směsi betonu/cihel + Ytong";
  }

  return label;
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
  const hasCodes = rows.some((row) => Boolean(row.code?.trim()));
  const hasNotes = rows.some((row) => Boolean(row.note));
  const hasActions = Boolean(rowActions?.some(Boolean));
  const hasAnyMarkers = rows.some((row) => parsePricingItemLabel(row.item).hasMarker);
  const resolvedMarkerInfoText = markerInfoText?.trim() || "Tuto položku je nutné předem ověřit telefonicky.";
  const previewBaseLabel = preview ? parsePricingItemLabel(preview.row.item).label : "";
  const previewLabel = preview ? shortenPreviewLabel(previewBaseLabel) : "";

  const updateCursor = (row: CmsPricingRow, event: MouseEvent<HTMLElement>) => {
    if (!row.imageUrl) {
      setPreview(null);
      return;
    }

    const x = clamp(event.clientX + 16, 16, window.innerWidth - PREVIEW_WIDTH - 16);
    const y = clamp(event.clientY + 16, 16, window.innerHeight - PREVIEW_TOTAL_HEIGHT - 16);
    setPreview({ row, x, y });
  };

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
              const parsedItem = parsePricingItemLabel(row.item);

              return (
                <article key={rowKey} className="px-3 py-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 text-sm font-semibold leading-5">
                      {parsedItem.label}
                      {hasAnyMarkers && parsedItem.hasMarker ? (
                        <PricingMarkerInfo
                          text={resolvedMarkerInfoText}
                          align="right"
                          className="ml-1 align-middle"
                        />
                      ) : null}
                    </p>
                    <p className="shrink-0 whitespace-nowrap text-sm font-semibold text-[var(--color-accent)]">{row.price}</p>
                  </div>
                  {hasCodes || rowAction ? (
                    <div className="mt-1 flex items-center justify-between gap-3">
                      {hasCodes ? (
                        <p className="truncate font-mono text-[11px] text-zinc-400">{row.code ?? ""}</p>
                      ) : (
                        <span />
                      )}
                      {rowAction ? (
                        <Link
                          href={rowAction.href}
                          className="btn-primary inline-flex items-center whitespace-nowrap rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[11px] font-semibold text-black"
                        >
                          {rowAction.label}
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
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
                {hasCodes ? <th className="px-4 py-3">Kód</th> : null}
                <th className="px-4 py-3">Cena</th>
                {hasNotes ? <th className="px-4 py-3">Poznámka</th> : null}
                {hasActions ? <th className="px-4 py-3 text-right">Akce</th> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const rowAction = rowActions?.[index] ?? null;
                const rowKey = `${row.item}-${row.code ?? "no-code"}-${row.price}-${index}`;
                const parsedItem = parsePricingItemLabel(row.item);

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
                        {hasAnyMarkers && parsedItem.hasMarker ? (
                          <PricingMarkerInfo
                            text={resolvedMarkerInfoText}
                            className="ml-1.5 align-middle"
                          />
                        ) : null}
                      </span>
                    </td>
                    {hasCodes ? <td className="px-4 py-3 font-mono text-xs text-zinc-300">{row.code ?? ""}</td> : null}
                    <td className="px-4 py-3 whitespace-nowrap font-semibold">{row.price}</td>
                    {hasNotes ? <td className="px-4 py-3 text-zinc-400">{row.note ?? "-"}</td> : null}
                    {hasActions ? (
                      <td className="px-4 py-3 text-right" data-no-preview="true">
                        {rowAction ? (
                          <Link
                            href={rowAction.href}
                            data-no-preview="true"
                            className="btn-primary inline-flex items-center whitespace-nowrap rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-[var(--color-accent-hover)]"
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
                alt={preview.row.imageAlt || parsePricingItemLabel(preview.row.item).label}
                width={1280}
                height={720}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          <div className="min-h-14 px-3 py-2">
            <p className="line-clamp-2 text-sm font-semibold leading-5 text-zinc-100" title={previewBaseLabel}>
              {previewLabel}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
