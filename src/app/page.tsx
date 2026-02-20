import Image from "next/image";
import Link from "next/link";

import { getHomePageContent } from "@/lib/cms/getters";
import { WASTE_TYPES } from "@/lib/catalog";
import { CONTACT, CONTAINER_PRODUCT } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

export default async function HomePage() {
  const content = await getHomePageContent();

  return (
    <div className="space-y-14 pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-7 py-10 sm:px-10">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/55 to-black/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#F2C400]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#F2C400]/10 blur-3xl" />

        <p className="relative z-10 text-sm font-semibold uppercase tracking-widest text-[#F2C400]">{content.heroEyebrow}</p>
        <h1 className="relative z-10 mt-3 max-w-5xl text-4xl font-bold leading-tight sm:text-5xl">{content.heroTitle}</h1>
        <p className="relative z-10 mt-4 max-w-3xl text-lg text-zinc-200">{content.heroDescription}</p>

        <div className="relative z-10 mt-6 flex flex-wrap gap-3">
          <Link href="/kontejnery/objednat" className={ui.buttonPrimary}>
            Objednat kontejner
          </Link>
          <a href={CONTACT.phoneHref} className={ui.buttonSecondary}>
            Zavolat {CONTACT.phone}
          </a>
          <Link href="/cenik" className={ui.buttonSecondary}>
            Otevřít ceník
          </Link>
        </div>

        <div className="relative z-10 mt-5 flex flex-wrap gap-2 text-xs text-zinc-200">
          {content.quickFacts.map((fact) => (
            <span key={fact} className="rounded-full border border-zinc-700 bg-black/25 px-3 py-1">
              {fact}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold">Vyberte službu</h2>
            <p className="mt-2 max-w-3xl text-zinc-300">
              Každá služba má vlastní stránku s postupem, ceníkem a přímým kontaktem.
            </p>
          </div>
        </div>
        <div className="grid gap-7 md:grid-cols-3">
          {content.serviceCards.map((service) => (
            <article key={`${service.title}-${service.href}`} className={cx(ui.card, "group overflow-hidden")}>
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={service.imageUrl}
                  alt={service.imageAlt}
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <div className="space-y-3 border-l-2 border-[#F2C400]/45 px-5 py-5 transition group-hover:border-[#F2C400]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#F2C400]">{service.subtitle}</p>
                <h3 className="text-2xl font-bold">{service.title}</h3>
                <p className="text-zinc-300">{service.description}</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  {service.points.map((point) => (
                    <li key={point}>- {point}</li>
                  ))}
                </ul>
                <Link href={service.href} className={ui.buttonInline}>
                  {service.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-10 border-t border-zinc-800 pt-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="text-3xl font-bold">Jak probíhá spolupráce</h2>
          <div className="mt-5 space-y-3">
            {content.processSteps.map((step, index) => (
              <article key={step.title} className={cx(ui.cardSoft, "p-4")}>
                <p className="font-mono text-sm text-[var(--color-accent)]">Krok {index + 1}</p>
                <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-zinc-300">{step.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold">Proč si nás firmy i domácnosti vybírají</h2>
          <div className="mt-5 divide-y divide-zinc-800 rounded-2xl border border-zinc-800 bg-zinc-900/40">
            {content.trustSignals.map((signal) => (
              <p key={signal} className="px-5 py-4 text-zinc-200">
                {signal}
              </p>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/obchodni-podminky" className={ui.buttonSecondary}>
              Obchodní podmínky
            </Link>
            <Link href="/gdpr" className={ui.buttonSecondary}>
              GDPR
            </Link>
            <Link href="/dokumenty/icp" className={ui.buttonSecondary}>
              iČP
            </Link>
            <Link href="/dokumenty/zpo" className={ui.buttonSecondary}>
              ZPO
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Orientační ceny pro kontejner {CONTAINER_PRODUCT.availableNow}</h2>
            <p className="mt-2 text-zinc-300">
              Ceny jsou orientační podle typu odpadu. Finální termín i podmínky vždy potvrzuje operátor.
            </p>
          </div>
          <Link href="/cenik#kontejnery" className={ui.buttonSecondary}>
            Kompletní ceník kontejnerů
          </Link>
        </div>
        <div className="mt-5 divide-y divide-zinc-800 rounded-xl bg-zinc-900/40">
          {WASTE_TYPES.slice(0, 4).map((wasteType) => (
            <article
              key={wasteType.id}
              className="grid gap-2 px-4 py-4 sm:grid-cols-[1.1fr_2fr_auto] sm:items-center sm:gap-4"
            >
              <h3 className="text-lg font-bold">{wasteType.label}</h3>
              <p className="text-sm text-zinc-400">{wasteType.shortDescription}</p>
              <p className="font-semibold text-[#F2C400]">od {wasteType.basePriceCzk.toLocaleString("cs-CZ")} Kč</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-2xl font-bold">Začít online, nebo rovnou zavolat?</h2>
        <p className="mt-2 max-w-3xl text-zinc-300">
          Pro kontejner je nejrychlejší online objednávka. Pokud řešíte demolici, recyklaci nebo nestandardní situaci,
          zavolejte a navrhneme konkrétní postup.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/kontejnery/objednat" className={ui.buttonPrimary}>
            Objednat kontejner
          </Link>
          <a href={CONTACT.phoneHref} className={ui.buttonSecondary}>
            Zavolat {CONTACT.phone}
          </a>
          <Link href="/kontakt" className={ui.buttonSecondary}>
            Všechny kontakty
          </Link>
        </div>
      </section>
    </div>
  );
}
