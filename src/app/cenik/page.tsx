import Link from "next/link";

import { MachineRentalGrid } from "@/components/machine-rental-grid";
import { PricingHoverTable } from "@/components/pricing-hover-table";
import { getPricingPageContent } from "@/lib/cms/getters";
import type { CmsPricingRow } from "@/lib/cms/mappers";
import { CONTAINER_PRODUCT } from "@/lib/site-config";
import { ui } from "@/lib/ui";

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

export default async function KompletníCeníkPage() {
  const content = await getPricingPageContent();

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

      <section id="kontejnery" className="space-y-4">
        <PricingHoverTable
          title={content.containerSectionTitle || `Ceník kontejnerů ${CONTAINER_PRODUCT.availableNow}`}
          subtitle={content.containerSectionDescription}
          rows={buildContainerRows(content.containerPricing)}
        />
        <p className="text-xs text-zinc-400">{content.containerLimitNote}</p>
      </section>

      <PricingHoverTable
        title={content.inertMaterialsTitle}
        rows={content.inertMaterialsPricing}
        subtitle={content.inertMaterialsSubtitle}
      />

      <PricingHoverTable title={content.materialSalesTitle} rows={content.materialSalesPricing} />

      <PricingHoverTable title={content.mobileRecyclingTitle} rows={content.mobileRecyclingPricing} />

      <section id="pronajem-stroju" className="space-y-4 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">{content.machineSectionTitle}</h2>
        {content.machineSectionSubtitle ? <p className="text-sm text-zinc-400">{content.machineSectionSubtitle}</p> : null}
        <MachineRentalGrid machines={content.machinePricing} />
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm text-zinc-300">
        <p>{content.footerNote}</p>
      </section>
    </div>
  );
}
