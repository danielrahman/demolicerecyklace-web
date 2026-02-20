import Link from "next/link";

import { CONTAINER_RULE_WARNINGS } from "@/lib/container-content";
import { WASTE_TYPES } from "@/lib/catalog";
import { cx, ui } from "@/lib/ui";

export default function WasteRulesPage() {
  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">Co patří a nepatří do kontejneru</h1>
        <p className="max-w-4xl text-zinc-300">
          Pravidla pomáhají předejít doplatkům i komplikacím při převzetí odpadu. Pokud si nejste jistí, napište poznámku
          v objednávce nebo zavolejte dispečink před přistavením.
        </p>
      </header>

      <section className={cx(ui.cardSoft, "p-6") }>
        <h2 className="text-2xl font-bold">Důležité upozornění</h2>
        <ul className="mt-3 space-y-2 text-zinc-300">
          {CONTAINER_RULE_WARNINGS.map((warning) => (
            <li key={warning}>- {warning}</li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {WASTE_TYPES.map((wasteType) => (
          <article key={wasteType.id} className={cx(ui.card, "p-5")}>
            <h2 className="text-xl font-bold">{wasteType.label}</h2>
            <p className="mt-1 text-sm text-zinc-400">{wasteType.shortDescription}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-emerald-300">Patří</p>
                <ul className="mt-2 space-y-1 text-sm text-zinc-300">
                  {wasteType.allowed.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-red-300">Nepatří</p>
                <ul className="mt-2 space-y-1 text-sm text-zinc-300">
                  {wasteType.disallowed.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link href="/kontejnery/objednat" className={ui.buttonPrimary}>
          Pokračovat do objednávky
        </Link>
        <Link href="/kontejnery/cenik" className={ui.buttonSecondary}>
          Zobrazit ceník kontejnerů
        </Link>
      </section>
    </div>
  );
}
