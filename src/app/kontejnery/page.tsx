import Image from "next/image";
import Link from "next/link";

import {
  CONTAINER_FAQ,
  CONTAINER_HOW_IT_WORKS,
  CONTAINER_RULE_WARNINGS,
  CONTAINER_TRUST_POINTS,
} from "@/lib/container-content";
import { CONTAINER_OPTIONS, WASTE_TYPES } from "@/lib/catalog";
import { CONTAINER_PRODUCT, SERVICE_AREA } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

export default function KontejneryPage() {
  return (
    <div className="space-y-10 pb-8">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 px-6 py-10 sm:px-10">
        <Image
          src="/legacy/current-web/cache_template_bg-image__1239x698_fit_to_width_1521724840_img-2627.jpg"
          alt="Kontejnerový vůz v provozu"
          width={1239}
          height={698}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/65 to-black/40" />
        <div className="relative z-10 max-w-4xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            Kontejnery - online objednávka
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Objednejte kontejner jednoduše online</h1>
          <p className="text-lg text-zinc-200">
            Začněte adresou, vyberte typ odpadu a odešlete objednávku. Aktuálně objednáte kontejner
            {" "}
            {CONTAINER_PRODUCT.availableNow}. Termín vždy potvrzuje operátor ručně.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/kontejnery/objednat" className={ui.buttonPrimary}>
              Objednat kontejner
            </Link>
            <Link href="/kontejnery/cenik" className={ui.buttonSecondary}>
              Zobrazit ceník v HTML
            </Link>
            <Link href="/kontejnery/co-patri-nepatri" className={ui.buttonSecondary}>
              Co patří a nepatří
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {CONTAINER_OPTIONS.map((container) => (
          <article key={container.sizeM3} className={cx(ui.card, "p-5")}>
            <h2 className="text-xl font-bold">{container.label}</h2>
            <p className="mt-2 text-sm text-zinc-300">
              {container.available
                ? "Aktuálně dostupné pro online objednávku"
                : "Připravujeme. Zatím můžete poptat individuálně telefonicky."}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 border-t border-zinc-800 pt-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="text-3xl font-bold">Jak probíhá objednávka</h2>
          <div className="mt-5 space-y-3">
            {CONTAINER_HOW_IT_WORKS.map((step, index) => (
              <article key={step.title} className={cx(ui.cardSoft, "p-4")}>
                <p className="font-mono text-sm text-[var(--color-accent)]">Krok {index + 1}</p>
                <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
                <p className="mt-1 text-zinc-300">{step.description}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className={cx(ui.card, "h-fit p-6")}>
          <h2 className="text-2xl font-bold">Servisní oblast</h2>
          <p className="mt-2 text-zinc-300">Obsluhujeme {SERVICE_AREA.regionsLabel}. Podporované PSČ ověříme hned v prvním kroku formuláře.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-300">
            <span className="rounded-full border border-zinc-700 px-3 py-1">Praha</span>
            <span className="rounded-full border border-zinc-700 px-3 py-1">Středočeský kraj</span>
          </div>
          <Link href="/kontejnery/lokality" className={cx(ui.buttonSecondary, "mt-4")}>
            Zobrazit seznam PSČ
          </Link>
        </aside>
      </section>

      <section className="space-y-5 border-t border-zinc-800 pt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold">Typy odpadu</h2>
            <p className="mt-2 text-zinc-300">Před objednávkou doporučujeme zkontrolovat pravidla, aby nevznikl doplatek.</p>
          </div>
          <Link href="/kontejnery/co-patri-nepatri" className={ui.buttonSecondary}>
            Detail pravidel
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {WASTE_TYPES.map((wasteType) => (
            <article key={wasteType.id} className={cx(ui.cardSoft, "p-4") }>
              <h3 className="text-xl font-bold">{wasteType.label}</h3>
              <p className="mt-2 text-sm text-zinc-300">{wasteType.shortDescription}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Příklad co patří</p>
              <p className="mt-1 text-sm text-zinc-300">{wasteType.allowed.slice(0, 3).join(", ")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 border-t border-zinc-800 pt-8 lg:grid-cols-2">
        <article className={cx(ui.card, "p-6")}>
          <h2 className="text-2xl font-bold">Důvěra a podmínky</h2>
          <ul className="mt-4 space-y-2 text-zinc-300">
            {CONTAINER_TRUST_POINTS.map((point) => (
              <li key={point}>- {point}</li>
            ))}
          </ul>
        </article>

        <article className={cx(ui.card, "p-6")}>
          <h2 className="text-2xl font-bold">Důležitá upozornění</h2>
          <ul className="mt-4 space-y-2 text-zinc-300">
            {CONTAINER_RULE_WARNINGS.map((warning) => (
              <li key={warning}>- {warning}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="border-t border-zinc-800 pt-8">
        <h2 className="text-3xl font-bold">Nejčastější dotazy</h2>
        <div className="mt-5 space-y-3">
          {CONTAINER_FAQ.slice(0, 4).map((faq) => (
            <article key={faq.question} className={cx(ui.cardSoft, "p-4")}>
              <h3 className="text-lg font-bold">{faq.question}</h3>
              <p className="mt-2 text-zinc-300">{faq.answer}</p>
            </article>
          ))}
        </div>
        <Link href="/kontejnery/faq" className={cx(ui.buttonInline, "mt-4")}>
          Zobrazit celé FAQ
        </Link>
      </section>
    </div>
  );
}
