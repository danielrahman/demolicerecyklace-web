import type { Metadata } from "next";
import Link from "next/link";

import { createPageMetadata } from "@/lib/seo-metadata";
import { CONTACT } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

const useCases = [
  "Rodinné domy, menší areály a technické objekty mimo centrum Prahy.",
  "Dlouhodobější stavby s opakovaným přistavením kontejnerů.",
  "Návaznost demolice a recyklace na jednom dodavateli.",
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "Demolice a kontejnery Středočeský kraj | Demolice Recyklace",
  description:
    "Služby pro Středočeský kraj: kontejnery na odpad, demolice objektů, odvoz suti a recyklace materiálu.",
  canonicalPath: "/lokality/stredocesky-kraj",
});

export default function StredoceskyKrajLocationPage() {
  return (
    <div className="space-y-10 pb-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">Demolice, kontejnery a recyklace pro Středočeský kraj</h1>
        <p className="max-w-4xl text-zinc-300">
          Zakázky ve Středočeském kraji řešíme podle dostupnosti techniky, vzdálenosti a typu odpadu. Předem vždy
          potvrzujeme logistiku a termín realizace.
        </p>
      </header>

      <section className={cx(ui.card, "p-6")}>
        <h2 className="text-2xl font-bold">Typické situace</h2>
        <ul className="mt-3 space-y-2 text-zinc-300">
          {useCases.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </section>

      <section className="grid gap-5 border-t border-zinc-800 pt-8 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/kontejnery/objednat" className={ui.buttonPrimary}>
          Objednat kontejner
        </Link>
        <Link href="/demolice" className={ui.buttonSecondary}>
          Poptat demolici
        </Link>
        <Link href="/recyklace" className={ui.buttonSecondary}>
          Podmínky recyklace
        </Link>
        <Link href="/cenik" className={ui.buttonSecondary}>
          Otevřít ceník
        </Link>
      </section>

      <section className={cx(ui.cardSoft, "p-6")}>
        <h2 className="text-2xl font-bold">Nejrychlejší ověření termínu</h2>
        <p className="mt-2 text-zinc-300">
          Zavolejte dispečink, upřesníme lokalitu a vhodný postup pro konkrétní zakázku.
        </p>
        <a href={CONTACT.phoneHref} className={cx(ui.buttonPrimary, "mt-4")}>
          Zavolat {CONTACT.phone}
        </a>
      </section>
    </div>
  );
}
