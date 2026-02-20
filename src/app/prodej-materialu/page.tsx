import type { Metadata } from "next";
import Link from "next/link";

import { getMarketingPageContent } from "@/lib/cms/getters";
import { MATERIAL_SALES_PRICING } from "@/lib/full-pricing";
import { createPageMetadata } from "@/lib/seo-metadata";
import { CONTACT } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

type MaterialCategory = {
  title: string;
  keywords: string[];
  description: string;
};

const categories: MaterialCategory[] = [
  {
    title: "Písky a zásypy",
    keywords: ["Písek", "zásyp", "Zásypový", "zemina"],
    description: "Materiály pro zásypy, podsypy a běžné stavební použití.",
  },
  {
    title: "Kamenivo",
    keywords: ["Lomový", "Štěrkodrť", "Kačírek"],
    description: "Frakce kameniva pro komunikace, zpevněné plochy a drenáže.",
  },
  {
    title: "Recykláty",
    keywords: ["recyklát", "Recyklát"],
    description: "Ekonomická varianta pro podkladové vrstvy a terénní úpravy.",
  },
];

function rowsForCategory(category: MaterialCategory) {
  return MATERIAL_SALES_PRICING.filter((row) =>
    category.keywords.some((keyword) => row.item.toLowerCase().includes(keyword.toLowerCase())),
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const marketing = await getMarketingPageContent("prodej-materialu");
  const title = marketing?.seoTitle || "Prodej materiálu | Demolice Recyklace";
  const description =
    marketing?.seoDescription ||
    "Prodej písků, kameniva a recyklátů pro stavební práce v Praze a Středočeském kraji.";

  return createPageMetadata({
    title,
    description,
    canonicalPath: "/prodej-materialu",
  });
}

export default async function ProdejMaterialuPage() {
  const marketing = await getMarketingPageContent("prodej-materialu");

  return (
    <div className="space-y-10 pb-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">{marketing?.heroTitle || "Prodej materiálu"}</h1>
        <p className="max-w-4xl text-zinc-300">
          {marketing?.heroDescription ||
            "Dodáváme písky, kamenivo i recykláty pro stavby a terénní úpravy. Ceník držíme přehledně přímo na webu a dostupnost ověříme při objednávce telefonicky nebo e-mailem."}
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a href={CONTACT.phoneHref} className={ui.buttonPrimary}>
            Zavolat {CONTACT.phone}
          </a>
          <Link href="/cenik" className={ui.buttonSecondary}>
            Kompletní ceník služeb
          </Link>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {categories.map((category) => {
          const rows = rowsForCategory(category).slice(0, 5);

          return (
            <article key={category.title} className={cx(ui.card, "p-5")}>
              <h2 className="text-2xl font-bold">{category.title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{category.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                {rows.map((row) => (
                  <li key={`${category.title}-${row.item}`} className="flex items-start justify-between gap-3">
                    <span>{row.item}</span>
                    <span className="shrink-0 font-semibold text-[var(--color-accent)]">{row.price}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      <section className={cx(ui.card, "overflow-hidden") }>
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="text-2xl font-bold">Přehled položek</h2>
          <p className="text-sm text-zinc-400">Výběr z kompletního ceníku. Pro větší odběry připravíme individuální nabídku.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-800 text-zinc-200">
              <tr>
                <th className="px-4 py-3">Materiál</th>
                <th className="px-4 py-3">Cena</th>
              </tr>
            </thead>
            <tbody>
              {MATERIAL_SALES_PRICING.map((row) => (
                <tr key={`${row.item}-${row.price}`} className="border-t border-zinc-800">
                  <td className="px-4 py-3">{row.item}</td>
                  <td className="px-4 py-3 font-semibold">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={cx(ui.cardSoft, "p-6")}>
        <h2 className="text-2xl font-bold">Jak objednat materiál</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <article className="rounded-xl border border-zinc-700 bg-zinc-950 p-4">
            <p className="font-mono text-sm text-[var(--color-accent)]">1. Krok</p>
            <p className="mt-1 font-semibold">Vyberete materiál</p>
            <p className="mt-1 text-sm text-zinc-400">Pošlete položku a orientační množství.</p>
          </article>
          <article className="rounded-xl border border-zinc-700 bg-zinc-950 p-4">
            <p className="font-mono text-sm text-[var(--color-accent)]">2. Krok</p>
            <p className="mt-1 font-semibold">Potvrdíme dostupnost</p>
            <p className="mt-1 text-sm text-zinc-400">Dispečink ověří termín a logistiku.</p>
          </article>
          <article className="rounded-xl border border-zinc-700 bg-zinc-950 p-4">
            <p className="font-mono text-sm text-[var(--color-accent)]">3. Krok</p>
            <p className="mt-1 font-semibold">Dodání nebo osobní odběr</p>
            <p className="mt-1 text-sm text-zinc-400">Materiál připravíme dle dohody.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
