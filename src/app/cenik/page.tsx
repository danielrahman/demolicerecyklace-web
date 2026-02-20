import Image from "next/image";
import Link from "next/link";

import { MachineRentalGrid } from "@/components/machine-rental-grid";
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

const containerCategoryOrder = ["Beton", "Cihly a keramika", "Asfalt", "Zemina a kámen", "Stavební odpad", "Ostatní materiály"] as const;

function containerVisualFor(item: string) {
  const matchedRule = containerVisualRules.find((rule) => rule.pattern.test(item));
  if (matchedRule) return matchedRule;

  return {
    image: "/photos/competitor/competitor-04.jpg",
    alt: "Kontejnery připravené k přistavení",
    tag: "Stavební odpad",
  };
}

function normalizeCategoryLabel(label: string) {
  return label.trim().toLowerCase();
}

function containerCategoryIndex(label: string) {
  const key = normalizeCategoryLabel(label);
  const index = containerCategoryOrder.findIndex((ordered) => normalizeCategoryLabel(ordered) === key);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function buildContainerCards(rows: CmsPricingRow[]) {
  return rows
    .map((row) => {
      const visual = containerVisualFor(row.item);
      const category = row.tag?.trim() || visual.tag;

      return {
        ...row,
        category,
        imageUrl: row.imageUrl || visual.image,
        imageAlt: row.imageAlt || visual.alt,
      };
    })
    .sort((a, b) => {
      const categoryDiff = containerCategoryIndex(a.category) - containerCategoryIndex(b.category);
      if (categoryDiff !== 0) return categoryDiff;
      return a.item.localeCompare(b.item, "cs-CZ");
    });
}

function PricingTable(props: { title: string; rows: CmsPricingRow[]; subtitle?: string }) {
  const hasNotes = props.rows.some((row) => Boolean(row.note));

  return (
    <section className="space-y-3 border-t border-zinc-800 pt-6">
      <h2 className="text-2xl font-bold">{props.title}</h2>
      {props.subtitle ? <p className="text-sm text-zinc-400">{props.subtitle}</p> : null}
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
            {props.rows.map((row) => (
              <tr key={`${row.item}-${row.code}-${row.price}`} className="border-t border-zinc-800">
                <td className="px-4 py-3">{row.item}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-300">{row.code ?? "-"}</td>
                <td className="px-4 py-3 font-semibold">{row.price}</td>
                {hasNotes ? <td className="px-4 py-3 text-zinc-400">{row.note ?? "-"}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
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

      <section id="kontejnery" className="space-y-4 border-t border-zinc-800 pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{content.containerSectionTitle || `Ceník kontejnerů ${CONTAINER_PRODUCT.availableNow}`}</h2>
            <p className="mt-2 text-sm text-zinc-400">{content.containerSectionDescription}</p>
          </div>
          <div className="relative hidden h-20 w-40 overflow-hidden rounded-xl border border-zinc-800 md:block">
            <Image
              src="/photos/competitor/competitor-04.jpg"
              alt="Žluté kontejnery připravené k přistavení"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {buildContainerCards(content.containerPricing).map((item) => (
            <article
              key={`${item.category}-${item.item}-${item.code}`}
              className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 transition hover:border-zinc-700"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  width={1280}
                  height={800}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <p className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#F2C400]">
                  {item.category}
                </p>
              </div>
              <div className="space-y-2 p-4">
                <h3 className="text-xl font-bold leading-snug">{item.item}</h3>
                <p className="text-sm text-zinc-300">Kód odpadu: {item.code ?? "-"}</p>
                <p className="font-semibold text-[#F2C400]">{item.price}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="text-xs text-zinc-400">{content.containerLimitNote}</p>
      </section>

      <PricingTable
        title={content.inertMaterialsTitle}
        rows={content.inertMaterialsPricing}
        subtitle={content.inertMaterialsSubtitle}
      />

      <PricingTable title={content.materialSalesTitle} rows={content.materialSalesPricing} />

      <PricingTable title={content.mobileRecyclingTitle} rows={content.mobileRecyclingPricing} />

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
