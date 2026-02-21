import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FaqSection } from "@/components/faq-section";
import { getContainersPageContent, getFaqContent } from "@/lib/cms/getters";
import { CONTAINER_OPTIONS } from "@/lib/catalog";
import { createPageMetadata } from "@/lib/seo-metadata";
import { SERVICE_AREA } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

export function generateMetadata(): Metadata {
  return createPageMetadata({
    title: "Kontejnery na odpad | Demolice Recyklace",
    description:
      "Online objednávka kontejnerů na stavební odpad, suť a další typy odpadu pro Prahu a Středočeský kraj.",
    canonicalPath: "/kontejnery",
  });
}

export default async function KontejneryPage() {
  const [content, faqContent] = await Promise.all([getContainersPageContent(), getFaqContent()]);
  const containerFaq = faqContent.containers;
  const availableContainer = CONTAINER_OPTIONS.find((container) => container.available) ?? CONTAINER_OPTIONS[0];
  const comingSoonSizes = [
    { id: "4m3-6t", label: "4 m³ / 6 tun" },
    { id: "4m3-6t-uzky", label: "4 m³ / 6 tun - úzký" },
    { id: "10m3-12t", label: "10 m³ / 12 tun" },
  ] as const;

  return (
    <div className="space-y-10 pb-8">
      <section className="containers-hero relative overflow-hidden rounded-3xl border border-zinc-800 px-6 py-10 sm:px-10">
        <Image
          src={content.heroImageUrl}
          alt={content.heroImageAlt}
          width={1239}
          height={698}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          priority
        />
        <div className="containers-hero-overlay absolute inset-0" />
        <div className="relative z-10 max-w-4xl space-y-4 text-white">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            Kontejnery - objednávka přes web
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{content.heroTitle}</h1>
          <p className="text-lg text-white/85">{content.heroDescription}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/kontejnery/objednat" className={ui.buttonPrimary}>
              Objednat kontejner
            </Link>
            <Link
              href="/cenik#kontejnery"
              className={cx(ui.buttonSecondary, "!border-white/45 !text-white hover:!border-white/60 hover:!bg-white/12")}
            >
              Zobrazit ceník kontejnerů
            </Link>
            <Link
              href="/kontejnery/faq"
              className={cx(ui.buttonSecondary, "!border-white/45 !text-white hover:!border-white/60 hover:!bg-white/12")}
            >
              Časté dotazy (FAQ)
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 border-t border-zinc-800 pt-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="text-3xl font-bold">Jak probíhá objednávka</h2>
          <div className="mt-5 space-y-3">
            {content.howItWorks.map((step, index) => (
              <article key={step.title} className={cx(ui.cardSoft, "p-4")}>
                <p className="font-mono text-sm text-[var(--color-accent)]">Krok {index + 1}</p>
                <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
                <p className="mt-1 text-zinc-300">{step.description}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <article className={cx(ui.card, "overflow-hidden p-5")}>
            <div className="grid gap-4 sm:grid-cols-[1fr_168px] sm:items-center">
              <div>
                <p className="inline-flex rounded-full border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                  Dostupné přes web
                </p>
                <h2 className="mt-3 text-2xl font-bold">{availableContainer.label}</h2>
                <p className="mt-2 text-sm text-zinc-200">
                  Aktuálně dostupné v objednávce přes web s potvrzením termínu operátorem.
                </p>
                <Link href="/kontejnery/objednat" className={cx(ui.buttonPrimary, "mt-4")}>
                  Objednat kontejner
                </Link>
              </div>
              <div className="relative h-32 w-full overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 sm:h-28">
                <Image
                  src="/photos/kontejnery/kontejner-zluty-01.png"
                  alt="Žlutý kontejner 3 m3"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </article>

          <article className={cx(ui.cardSoft, "p-4")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-300">Další velikosti</h3>
              <span className="inline-flex rounded-full border border-[var(--color-accent)]/55 bg-[var(--color-accent)]/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                Brzy
              </span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {comingSoonSizes.map((size) => (
                <div
                  key={size.id}
                  className="rounded-xl border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/10 px-3 py-3 text-center"
                >
                  <p className="text-sm font-semibold text-zinc-100">{size.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-zinc-300">Do té doby nám zavolejte a domluvíme vhodnou variantu i termín.</p>
          </article>

          <article className={cx(ui.card, "h-fit p-6")}>
            <h2 className="text-2xl font-bold">Servisní oblast</h2>
            <p className="mt-2 text-zinc-300">
              Obsluhujeme {SERVICE_AREA.regionsLabel}. Podporované PSČ ověříme hned v prvním kroku formuláře.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-300">
              <span className="rounded-full border border-zinc-700 px-3 py-1">Praha</span>
              <span className="rounded-full border border-zinc-700 px-3 py-1">Středočeský kraj</span>
            </div>
          </article>
        </aside>
      </section>

      <section className="grid gap-6 border-t border-zinc-800 pt-8 lg:grid-cols-2">
        <article className={cx(ui.card, "p-6")}>
          <h2 className="text-2xl font-bold">Důvěra a podmínky</h2>
          <ul className="mt-4 space-y-2 text-zinc-300">
            {content.trustPoints.map((point) => (
              <li key={point}>- {point}</li>
            ))}
          </ul>
        </article>

        <article className={cx(ui.card, "p-6")}>
          <h2 className="text-2xl font-bold">Důležitá upozornění</h2>
          <ul className="mt-4 space-y-2 text-zinc-300">
            {content.ruleWarnings.map((warning) => (
              <li key={warning}>- {warning}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="space-y-4 border-t border-zinc-800 pt-8">
        <FaqSection
          title="Nejčastější dotazy ke kontejnerům"
          description="Rychlé odpovědi na nejčastější otázky před odesláním objednávky."
          items={containerFaq.items.slice(0, 4)}
          columns={2}
        />
        <Link href="/kontejnery/faq" className={cx(ui.buttonInline, "mt-4")}>
          Zobrazit celé FAQ
        </Link>
      </section>

      <section className="space-y-4 border-t border-zinc-800 pt-8">
        <h2 className="text-3xl font-bold">Související služby a ceník</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/cenik#kontejnery" className={ui.buttonSecondary}>
            Ceník kontejnerů
          </Link>
          <Link href="/demolice" className={ui.buttonSecondary}>
            Demolice
          </Link>
          <Link href="/recyklace" className={ui.buttonSecondary}>
            Recyklace
          </Link>
        </div>
      </section>
    </div>
  );
}
