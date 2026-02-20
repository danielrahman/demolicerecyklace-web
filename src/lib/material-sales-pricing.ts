import type { CmsPricingRow } from "@/lib/cms/mappers";

export const MATERIAL_SALES_MARKER_INFO_TEXT = "Tento materiál je nutné předem ověřit telefonicky.";

export const MATERIAL_SALES_NOTES = [
  "Položky označené ikonou info je nutné předem ověřit telefonicky.",
  "Materiály označené A/B/C jsou v cenovém rozpětí dle kvality vstupního materiálu.",
] as const;

export type ParsedPricingItemLabel = {
  label: string;
  hasMarker: boolean;
};

function normalizeForMatch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function parsePricingItemLabel(item: string): ParsedPricingItemLabel {
  const hasMarker = /\*+\s*$/.test(item);
  const label = hasMarker ? item.replace(/\s*\*+\s*$/, "").trim() : item;
  return { label, hasMarker };
}

export function withMaterialSalesMarkers(rows: CmsPricingRow[]) {
  return rows.map((row) => {
    const normalizedItem = normalizeForMatch(row.item);
    const shouldHaveMarker =
      normalizedItem.includes("pisek zasypovy trideny 0/4")
      || normalizedItem.includes("betonovy recyklat 8-32 mm / 32-90 mm");

    if (!shouldHaveMarker) return row;
    if (row.item.trim().endsWith("*")) return row;

    return {
      ...row,
      item: `${row.item} *`,
    };
  });
}
