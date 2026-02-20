import Image from "next/image";
import Link from "next/link";

import { MachineRentalGrid } from "@/components/machine-rental-grid";
import { getPricingPageContent } from "@/lib/cms/getters";
import type { CmsPricingRow } from "@/lib/cms/mappers";
import { CONTAINER_PRODUCT } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

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

type ContainerCategory = {
  label: string;
  rows: CmsPricingRow[];
};

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

function buildContainerGroups(rows: CmsPricingRow[]) {
  const grouped = new Map<string, ContainerCategory>();

  rows.forEach((row) => {
    const visual = containerVisualFor(row.item);
    const label = row.tag?.trim() || visual.tag;
    const key = normalizeCategoryLabel(label);
    const existing = grouped.get(key);

    if (existing) {
      existing.rows.push(row);
      return;
    }

    grouped.set(key, {
      label,
      rows: [row],
    });
  });

  const ordered = containerCategoryOrder
    .map((label) => grouped.get(label.toLowerCase()))
    .filter((group): group is ContainerCategory => Boolean(group));

  const rest = Array.from(grouped.values()).filter(
    (group) => !containerCategoryOrder.map((label) => label.toLowerCase()).includes(normalizeCategoryLabel(group.label)),
  );

  return [...ordered, ...rest];
}

const containerCategoryTheme: Record<string, { chip: string; accent: string }> = {
  beton: {
    chip: "border-blue-400/40 bg-blue-500/10 text-blue-200",
    accent: "bg-gradient-to-r from-blue-500/18 to-transparent",
  },
  "cihly a keramika": {
    chip: "border-amber-400/40 bg-amber-500/10 text-amber-200",
    accent: "bg-gradient-to-r from-amber-500/18 to-transparent",
  },
  asfalt: {
    chip: "border-violet-400/40 bg-violet-500/10 text-violet-200",
    accent: "bg-gradient-to-r from-violet-500/18 to-transparent",
  },
  "zemina a kámen": {
    chip: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
    accent: "bg-gradient-to-r from-emerald-500/18 to-transparent",
  },
};

function getContainerCategoryTheme(label: string) {
  const key = normalizeCategoryLabel(label);
  return containerCategoryTheme[key] ?? {
    chip: "border-zinc-500/40 bg-zinc-500/10 text-zinc-200",
    accent: "bg-gradient-to-r from-zinc-500/18 to-transparent",
  };
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

        <div className="grid gap-4 lg:grid-cols-2">
          {buildContainerGroups(content.containerPricing).map((group) => (
            <section
              key={group.label}
              className={cx(
                "overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-900/35",
                "shadow-sm transition",
                "hover:shadow-[0_10px_40px_-24px_rgba(0,0,0,0.55)]",
              )}
            >
              <div className={`px-4 py-3.5 ${getContainerCategoryTheme(group.label).accent}`}>
                <p
                  className={cx(
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                    getContainerCategoryTheme(group.label).chip,
                  )}
                >
                  {group.label}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-zinc-300">{group.rows.length} položek</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400">Nejčastější materiály: {group.label}</p>
              </div>

              <div className="divide-y divide-zinc-800/80">
                {group.rows.map((item) => {
                  const rowVisual = containerVisualFor(item.item);

                  return (
                    <article
                      key={`${group.label}-${item.item}-${item.code}`}
                      className="flex items-center gap-3 bg-zinc-900/20 px-3 py-2.5 transition hover:bg-zinc-900/40"
                    >
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-zinc-700/80">
                        <Image
                          src={item.imageUrl || rowVisual.image}
                          alt={item.imageAlt || rowVisual.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-tight">{item.item}</p>
                        <p className="text-xs text-zinc-400">Kód odpadu: {item.code ?? "-"}</p>
                      </div>
                      <p className="ml-auto shrink-0 text-sm font-bold text-[var(--color-accent)]">{item.price}</p>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
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
