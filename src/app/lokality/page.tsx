import type { Metadata } from "next";
import Link from "next/link";

import { createPageMetadata } from "@/lib/seo-metadata";
import { CONTACT } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

const locationCards = [
  {
    title: "Praha",
    description: "Kontejnery, demolice i recyklace pro městské zakázky, rekonstrukce a stavební úpravy v Praze.",
    href: "/lokality/praha",
  },
  {
    title: "Středočeský kraj",
    description: "Servis pro obce, firmy i domácnosti ve Středočeském kraji s návazností na ceník a dostupnost techniky.",
    href: "/lokality/stredocesky-kraj",
  },
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "Lokality obsluhy | Demolice Recyklace",
  description:
    "Přehled oblastí obsluhy pro kontejnery, demolice a recyklaci: Praha a Středočeský kraj.",
  canonicalPath: "/lokality",
});

export default function LokalityPage() {
  return (
    <div className="space-y-10 pb-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">Lokality obsluhy</h1>
        <p className="max-w-4xl text-zinc-300">
          V rámci Core rozsahu držíme lehkou lokalitní strukturu: 2 kvalitní stránky s jasným napojením na služby,
          ceník a objednávku.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-2">
        {locationCards.map((location) => (
          <article key={location.href} className={cx(ui.card, "p-6")}>
            <h2 className="text-2xl font-bold">{location.title}</h2>
            <p className="mt-3 text-zinc-300">{location.description}</p>
            <Link href={location.href} className={cx(ui.buttonSecondary, "mt-4")}>
              Otevřít lokalitu
            </Link>
          </article>
        ))}
      </section>

      <section className="grid gap-5 border-t border-zinc-800 pt-8 lg:grid-cols-[1.1fr_1fr]">
        <article className={cx(ui.cardSoft, "p-6")}>
          <h2 className="text-2xl font-bold">Služby v lokalitách</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/kontejnery" className={ui.buttonSecondary}>
              Kontejnery
            </Link>
            <Link href="/demolice" className={ui.buttonSecondary}>
              Demolice
            </Link>
            <Link href="/recyklace" className={ui.buttonSecondary}>
              Recyklace
            </Link>
            <Link href="/cenik" className={ui.buttonSecondary}>
              Ceník služeb
            </Link>
          </div>
        </article>

        <article className={cx(ui.card, "p-6")}>
          <h2 className="text-2xl font-bold">Rychlá poptávka</h2>
          <p className="mt-2 text-zinc-300">
            Nejrychlejší cesta je online objednávka kontejneru nebo telefon na dispečink.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/kontejnery/objednat" className={ui.buttonPrimary}>
              Objednat kontejner
            </Link>
            <a href={CONTACT.phoneHref} className={ui.buttonSecondary}>
              Zavolat {CONTACT.phone}
            </a>
          </div>
        </article>
      </section>
    </div>
  );
}
