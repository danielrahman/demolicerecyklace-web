import type { Metadata } from "next";
import Link from "next/link";

import { CONTACT } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

const useCases = [
  "Rekonstrukce bytů a domů s odvozem stavební suti.",
  "Menší i střední demolice objektů s navazující recyklací.",
  "Dovoz/odvoz kontejneru podle dostupnosti lokality a harmonogramu.",
] as const;

export const metadata: Metadata = {
  title: "Demolice a kontejnery Praha | Demolice Recyklace",
  description:
    "Služby pro Prahu: kontejnery na odpad, demolice, odvoz suti a recyklace stavebního materiálu.",
  alternates: {
    canonical: "/lokality/praha",
  },
};

export default function PrahaLocationPage() {
  return (
    <div className="space-y-10 pb-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">Demolice, kontejnery a recyklace pro Prahu</h1>
        <p className="max-w-4xl text-zinc-300">
          Obsluhujeme Prahu pro standardní stavební a demoliční práce. Konkrétní termín vždy potvrzuje operátor podle
          vytížení a charakteru zakázky.
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
        <h2 className="text-2xl font-bold">Potřebujete rychlý kontakt?</h2>
        <p className="mt-2 text-zinc-300">
          Pro rychlé ověření lokality a termínu volejte dispečink.
        </p>
        <a href={CONTACT.phoneHref} className={cx(ui.buttonPrimary, "mt-4")}>
          Zavolat {CONTACT.phone}
        </a>
      </section>
    </div>
  );
}
