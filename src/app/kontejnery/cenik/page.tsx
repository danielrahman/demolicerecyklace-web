import Link from "next/link";

import { CONTAINER_3M3_PRICING } from "@/lib/full-pricing";
import { CONTAINER_PRODUCT } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

export default function CeníkKontejneruPage() {
  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">Ceník kontejnerů {CONTAINER_PRODUCT.availableNow} v HTML</h1>
        <p className="max-w-4xl text-zinc-300">
          Kompletní ceník pro online objednávku. Uvádíme typ odpadu, kód i cenu za kontejner. Termín po odeslání
          objednávky není automatický a vždy ho potvrzuje operátor.
        </p>
      </header>

      <section className={cx(ui.card, "overflow-hidden") }>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-800 text-zinc-200">
              <tr>
                <th className="px-4 py-3">Materiál</th>
                <th className="px-4 py-3">Kód odpadu</th>
                <th className="px-4 py-3">Cena za kontejner {CONTAINER_PRODUCT.availableNow}</th>
                <th className="px-4 py-3">Podmínka</th>
              </tr>
            </thead>
            <tbody>
              {CONTAINER_3M3_PRICING.map((item) => (
                <tr key={`${item.item}-${item.code}`} className="border-t border-zinc-800">
                  <td className="px-4 py-3">{item.item}</td>
                  <td className="px-4 py-3 font-mono text-xs">{item.code}</td>
                  <td className="px-4 py-3 font-semibold">{item.price}</td>
                  <td className="px-4 py-3 text-zinc-400">Limit cca 4 t, finální kontrola při převzetí</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Mobilní přehled ceníku</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:hidden">
          {CONTAINER_3M3_PRICING.map((item) => (
            <article key={`${item.item}-${item.code}-card`} className={cx(ui.cardSoft, "p-4")}>
              <h3 className="font-bold">{item.item}</h3>
              <p className="mt-1 text-xs text-zinc-400">Kód odpadu: {item.code}</p>
              <p className="mt-3 text-lg font-semibold text-[var(--color-accent)]">{item.price}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={cx(ui.cardSoft, "p-6")}>
        <h2 className="text-2xl font-bold">Co ovlivňuje výslednou cenu</h2>
        <ul className="mt-3 space-y-2 text-zinc-300">
          <li>- Složení odpadu musí odpovídat zvolenému typu.</li>
          <li>- Překročení hmotnosti nebo nepovolené příměsi mohou znamenat doplatek.</li>
          <li>- Umístění na veřejnou komunikaci vyžaduje platné povolení.</li>
          <li>- Expresní přistavení a další doplňky se počítají zvlášť.</li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/kontejnery/objednat" className={ui.buttonPrimary}>
          Objednat kontejner
        </Link>
        <Link href="/cenik" className={ui.buttonSecondary}>
          Kompletní ceník služeb
        </Link>
      </div>
    </div>
  );
}
