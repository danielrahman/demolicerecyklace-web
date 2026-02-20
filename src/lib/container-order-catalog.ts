import type { CmsPricingRow } from "@/lib/cms/mappers";
import { CONTAINER_3M3_PRICING } from "@/lib/full-pricing";

export type ContainerOrderWasteType = {
  id: string;
  label: string;
  shortDescription: string;
  code: string;
  basePriceCzk: number;
  priceLabel: string;
  tag: string;
  imageUrl: string;
  imageAlt: string;
};

const fallbackTag = "Stavební odpad";
const fallbackImage = "/photos/competitor/competitor-04.jpg";
const fallbackAlt = "Kontejnery připravené k přistavení";

const containerVisualRules = [
  {
    pattern: /(asfalt|živic)/i,
    image: "/photos/competitor/competitor-07.webp",
    alt: "Nakládka asfaltové a stavební suti",
    tag: "Asfalt",
  },
  {
    pattern: /(beton|železobeton)/i,
    image: "/photos/competitor/competitor-06.jpg",
    alt: "Demolice a zpracování betonové suti",
    tag: "Beton",
  },
  {
    pattern: /(cihl|taš|keram|pórobeton|ytong)/i,
    image: "/legacy/current-web/images_ffgallery_20180320_5ab179c8d5689_recyklace_IMG_2094.jpg",
    alt: "Třídění stavební suti v recyklačním areálu",
    tag: "Cihly a keramika",
  },
  {
    pattern: /(zemina|kamen|štěrk)/i,
    image: "/legacy/current-web/images_ffgallery_20180320_5ab179c8d5689_recyklace_IMG_2105.jpg",
    alt: "Výkopová zemina a kamenité frakce",
    tag: "Zemina a kámen",
  },
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeCode(value?: string) {
  return (value ?? "bez-kodu").replace(/\s+/g, "").toLowerCase();
}

function parseCzkPrice(value: string) {
  const digitsOnly = value.replace(/[^\d]/g, "");
  if (!digitsOnly) return null;
  const parsed = Number.parseInt(digitsOnly, 10);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

function toWasteTypeId(row: CmsPricingRow, suffix: number) {
  const base = `${normalizeCode(row.code)}-${slugify(row.item) || "material"}`;
  return suffix === 0 ? base : `${base}-${suffix + 1}`;
}

function buildShortDescription(row: CmsPricingRow, tag: string) {
  const codePart = row.code ? `Kód odpadu ${row.code}` : "Kód odpadu není uveden";
  return `${tag} • ${codePart}`;
}

function visualForContainerItem(item: string) {
  const match = containerVisualRules.find((rule) => rule.pattern.test(item));
  if (match) return match;

  return {
    image: fallbackImage,
    alt: fallbackAlt,
    tag: fallbackTag,
  };
}

export function buildContainerOrderWasteTypes(rows: CmsPricingRow[]) {
  const next: ContainerOrderWasteType[] = [];
  const idCollisionCount = new Map<string, number>();

  rows.forEach((row) => {
    const label = row.item.trim();
    if (!label) return;

    const parsedPrice = parseCzkPrice(row.price);
    if (parsedPrice === null) return;

    const visual = visualForContainerItem(label);
    const tag = row.tag?.trim() || visual.tag;
    const firstId = toWasteTypeId(row, 0);
    const suffix = idCollisionCount.get(firstId) ?? 0;
    idCollisionCount.set(firstId, suffix + 1);
    const id = toWasteTypeId(row, suffix);

    next.push({
      id,
      label,
      shortDescription: buildShortDescription(row, tag),
      code: row.code?.trim() || "-",
      basePriceCzk: parsedPrice,
      priceLabel: row.price,
      tag,
      imageUrl: row.imageUrl || visual.image,
      imageAlt: row.imageAlt || visual.alt,
    });
  });

  return next;
}

export const FALLBACK_CONTAINER_ORDER_WASTE_TYPES = buildContainerOrderWasteTypes(CONTAINER_3M3_PRICING);
