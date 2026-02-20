import type { Metadata } from "next";
import Link from "next/link";

import { MachineRentalGrid } from "@/components/machine-rental-grid";
import { PricingHoverTable } from "@/components/pricing-hover-table";
import { buildContainerOrderWasteTypes } from "@/lib/container-order-catalog";
import { getPricingPageContent } from "@/lib/cms/getters";
import type { CmsPricingRow } from "@/lib/cms/mappers";
import { createPageMetadata } from "@/lib/seo-metadata";
import { CONTAINER_PRODUCT } from "@/lib/site-config";
import { ui } from "@/lib/ui";

const inertSectionNotes = [
  "Dle vyhlášky č. 273/2021 Sb. je u položek 1-14 povinné doložit atesty o nezávadnosti materiálu, případně základní popis odpadu (ZPO).",
  "V případě různých druhů odpadů v jedné dodávce se účtuje cena dražšího odpadu.",
  "U ukládky většího množství inertního odpadu je nutné doložit atesty o nezávadnosti materiálu (výluhový test, tab. 10.1 a 10.2).",
];

const materialSectionNotes = [
  "Položky označené ikonou info je nutné předem ověřit telefonicky.",
  "Materiály označené A/B/C jsou v cenovém rozpětí dle kvality vstupního materiálu.",
];

const mobileRecyclingNotes = [
  "Množství do 1 tuny nákupu materiálu nebo uložení stavebního odpadu je účtováno poplatkem 100 Kč bez DPH.",
];

const operatingNotes = [
  "Veškerý materiál je vážen na cejchované váze Tamtron.",
  "Materiály mohou být pouze bez příměsí a v jedné dodávce vždy jen jeden druh dle katalogu odpadů.",
  "Platba je prováděna v hotovosti přímo na váze, pokud není předem zajištěný jiný způsob.",
];

export const metadata: Metadata = createPageMetadata({
  title: "Ceník služeb | Demolice Recyklace",
  description:
    "Kompletní ceník kontejnerů, recyklace, materiálů a pronájmu strojů pro Prahu a Středočeský kraj.",
  canonicalPath: "/cenik",
});

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

function containerVisualFor(item: string) {
  const matchedRule = containerVisualRules.find((rule) => rule.pattern.test(item));
  if (matchedRule) return matchedRule;

  return {
    image: "/photos/competitor/competitor-04.jpg",
    alt: "Kontejnery připravené k přistavení",
    tag: "Stavební odpad",
  };
}

function buildContainerRows(rows: CmsPricingRow[]) {
  return rows.map((row) => {
    const visual = containerVisualFor(row.item);

    return {
      ...row,
      imageUrl: row.imageUrl || visual.image,
      imageAlt: row.imageAlt || visual.alt,
      tag: row.tag?.trim() || visual.tag,
    };
  });
}

function normalizeForMatch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function withPdfStarMarkers(rows: CmsPricingRow[]) {
  return rows.map((row) => {
    const normalizedItem = normalizeForMatch(row.item);
    const shouldHaveStar =
      normalizedItem.includes("pisek zasypovy trideny 0/4")
      || normalizedItem.includes("betonovy recyklat 8-32 mm / 32-90 mm");

    if (!shouldHaveStar) return row;
    if (row.item.trim().endsWith("*")) return row;

    return {
      ...row,
      item: `${row.item} *`,
    };
  });
}

function pricingRowKey(item: string, code: string | undefined, price: string) {
  const normalizedCode = (code ?? "-").trim() || "-";
  return `${item.trim()}::${normalizedCode}::${price.trim()}`;
}

function buildContainerRowActions(rows: CmsPricingRow[]) {
  const sourceWasteTypes = buildContainerOrderWasteTypes(rows);
  const idsByKey = new Map<string, string[]>();

  sourceWasteTypes.forEach((wasteType) => {
    const key = pricingRowKey(wasteType.label, wasteType.code, wasteType.priceLabel);
    const existing = idsByKey.get(key);

    if (existing) {
      existing.push(wasteType.id);
      return;
    }

    idsByKey.set(key, [wasteType.id]);
  });

  return rows.map((row) => {
    const key = pricingRowKey(row.item, row.code, row.price);
    const matchingIds = idsByKey.get(key);
    const wasteTypeId = matchingIds?.shift();

    if (!wasteTypeId) return null;

    return {
      href: "/kontejnery/objednat",
      label: "Objednat",
    };
  });
}

export default async function KompletníCeníkPage() {
  const content = await getPricingPageContent();
  const containerRows = buildContainerRows(content.containerPricing);
  const containerRowActions = buildContainerRowActions(containerRows);
  const materialSalesRows = withPdfStarMarkers(content.materialSalesPricing);
  const containerLimitNote = "Max 4 t, finální kontrola při převzetí.";
  const inertSubtitle =
    content.inertMaterialsSubtitle
    || "U položek je nutné doložit požadované dokumenty dle legislativy.";

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-zinc-900/50 p-6 sm:p-8">
        <h1 className="text-4xl font-bold">{content.introTitle}</h1>
        <p className="mt-3 max-w-3xl text-zinc-300">{content.introDescription}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={content.sourcePdfUrl} target="_blank" rel="noreferrer" className={ui.buttonPrimary}>
            Otevřít originální PDF ceník
          </a>
          <Link href="/kontejnery/objednat" className={ui.buttonSecondary}>
            Objednat kontejner online
          </Link>
        </div>
      </section>

      <section id="kontejnery" className="scroll-mt-28 space-y-4">
        <PricingHoverTable
          title={content.containerSectionTitle || `Ceník kontejnerů ${CONTAINER_PRODUCT.availableNow}`}
          subtitle={content.containerSectionDescription}
          rows={containerRows}
          rowActions={containerRowActions}
        />
        <p className="text-xs text-zinc-400">{containerLimitNote}</p>
      </section>

      <section id="inertni-materialy" className="scroll-mt-28">
        <PricingHoverTable
          title={content.inertMaterialsTitle}
          rows={content.inertMaterialsPricing}
          subtitle={inertSubtitle}
        />
        <ul className="mt-3 space-y-1 text-xs text-zinc-400">
          {inertSectionNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section id="prodej-materialu" className="scroll-mt-28">
        <PricingHoverTable
          title={content.materialSalesTitle}
          rows={materialSalesRows}
          markerInfoText="Tento materiál je nutné předem ověřit telefonicky."
        />
        <ul className="mt-3 space-y-1 text-xs text-zinc-400">
          {materialSectionNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section id="mobilni-recyklace" className="scroll-mt-28">
        <PricingHoverTable title={content.mobileRecyclingTitle} rows={content.mobileRecyclingPricing} />
        <ul className="mt-3 space-y-1 text-xs text-zinc-400">
          {mobileRecyclingNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section id="pronajem-stroju" className="scroll-mt-28 space-y-4 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">{content.machineSectionTitle}</h2>
        {content.machineSectionSubtitle ? <p className="text-sm text-zinc-400">{content.machineSectionSubtitle}</p> : null}
        <MachineRentalGrid machines={content.machinePricing} />
      </section>

      <section className="space-y-4 border-t border-zinc-800 pt-8">
        <h2 className="text-2xl font-bold">Související služby</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/kontejnery" className={ui.buttonSecondary}>
            Kontejnery
          </Link>
          <Link href="/demolice" className={ui.buttonSecondary}>
            Demolice
          </Link>
          <Link href="/recyklace" className={ui.buttonSecondary}>
            Recyklace
          </Link>
          <Link href="/lokality" className={ui.buttonSecondary}>
            Lokality obsluhy
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm text-zinc-300">
        <p>{content.footerNote}</p>
        <ul className="mt-3 space-y-1 text-xs text-zinc-400">
          {operatingNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
