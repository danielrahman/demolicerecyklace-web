import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/section";
import { WASTE_TYPES } from "@/lib/catalog";
import { ui } from "@/lib/ui";

const services = [
  {
    title: "Kontejnery",
    description:
      "Online objednávka kontejneru 3 m3 pro Prahu a Středočeský kraj. Jasná pravidla odpadu a ruční potvrzení termínu.",
    href: "/kontejnery",
    cta: "Spustit objednávku",
    image: "/photos/homepage/service-kontejnery.jpg",
  },
  {
    title: "Demolice",
    description:
      "Demoliční práce od menších objektů po rozsáhlé realizace. Důraz na bezpečnost, postup a odvoz odpadu.",
    href: "/demolice",
    cta: "Poptat demolici",
    image: "/photos/homepage/service-demolice.jpg",
  },
  {
    title: "Recyklace",
    description:
      "Zpracování stavebního odpadu a přehled podmínek příjmu materiálu. Transparentní informace bez PDF bariér.",
    href: "/recyklace",
    cta: "Zobrazit podmínky",
    image: "/photos/homepage/service-recyklace.jpg",
  },
] as const;

const trustItems = [
  "Reálné fotografie techniky a provozu",
  "Jasné podmínky co patří a nepatří do odpadu",
  "Ruční potvrzení termínu operátorem",
  "Lokální pokrytí: Praha + Středočeský kraj",
] as const;

const steps = [
  {
    step: "1",
    title: "Zadáte lokalitu a typ odpadu",
    text: "Objednávka hned validuje podporovaná PSČ.",
  },
  {
    step: "2",
    title: "Vyberete kontejner 3 m3 a termín",
    text: "Všechna pole jsou jednoduchá a mobilně čitelná.",
  },
  {
    step: "3",
    title: "Odešlete objednávku",
    text: "E-mailem dostanete potvrzení o přijetí objednávky.",
  },
  {
    step: "4",
    title: "Operátor ručně potvrdí termín",
    text: "Finální termín obdržíte v potvrzovacím e-mailu.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="space-y-14 pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-7 py-10 sm:px-10">
        <Image
          src="/photos/homepage/hero-kontejner.webp"
          alt="Kontejner na odpad - ilustrační foto"
          width={1032}
          height={687}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/65 to-black/50" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#F2C400]/15 blur-3xl" />
        <p className="relative z-10 text-sm font-semibold uppercase tracking-widest text-[#F2C400]">
          Demolice Recyklace - Praha a Středočeský kraj
        </p>
        <h1 className="relative z-10 mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
          Kontejner 3 m3 objednáte online. Termín vždy potvrzuje operátor.
        </h1>
        <p className="relative z-10 mt-4 max-w-3xl text-lg text-zinc-200">
          Nový web stavíme na jednoduchosti: jasný ceník v HTML, čitelná pravidla odpadu a rychlý objednávkový wizard
          bez volání.
        </p>
        <div className="relative z-10 mt-6 flex flex-wrap gap-3">
          <Link
            href="/kontejnery/objednat"
            className={ui.buttonPrimary}
          >
            Objednat kontejner
          </Link>
          <Link
            href="/kontejnery/cenik"
            className={ui.buttonSecondary}
          >
            Zobrazit ceník
          </Link>
          <Link
            href="/kontejnery/co-patri-nepatri"
            className={ui.buttonSecondary}
          >
            Co patří a nepatří
          </Link>
        </div>
        <p className="relative z-10 mt-3 text-sm text-zinc-200">
          Objednávka je nezávazná do ručního potvrzení termínu operátorem.
        </p>
        <p className="relative z-10 mt-4 text-xs text-zinc-300/90">
          Náhled obsahuje ilustrační fotografie z aktuálního webu a veřejných zdrojů.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Služby</h2>
        <div className="grid gap-7 md:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className="group overflow-hidden rounded-xl bg-zinc-900/35">
            <div className="relative h-44 overflow-hidden">
              <Image
                src={service.image}
                alt={service.title}
                width={1280}
                height={720}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
            <div className="border-l-2 border-[#F2C400]/45 px-5 py-4 transition group-hover:border-[#F2C400]">
            <h2 className="text-2xl font-bold">{service.title}</h2>
            <p className="mt-3 text-zinc-300">{service.description}</p>
            <Link
              href={service.href}
              className="mt-6 inline-block font-semibold text-[var(--color-accent)] underline decoration-zinc-700 underline-offset-4 transition hover:decoration-[var(--color-accent)]"
            >
              {service.cta}
            </Link>
            </div>
          </article>
        ))}
        </div>
      </section>

      <section className="grid gap-10 border-t border-zinc-800 pt-8 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold">Proč to funguje jednoduše</h2>
          <div className="mt-5 divide-y divide-zinc-800">
            {trustItems.map((item) => (
              <p key={item} className="py-3 text-zinc-200">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold">Jak probíhá objednávka kontejneru</h2>
          <div className="relative mt-6 pl-6">
            <div className="absolute left-2 top-0 h-full w-px bg-zinc-800" />
            <div className="space-y-6">
              {steps.map((step) => (
                <article key={step.step} className="relative">
                  <span className="absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full bg-[#F2C400]" />
                  <p className="font-mono text-sm text-[#F2C400]">Krok {step.step}</p>
                  <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-zinc-300">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Orientační ceny pro 3 m3 kontejner</h2>
            <p className="mt-2 text-zinc-300">Ceny jsou orientační a mohou se lišit podle složení odpadu.</p>
          </div>
          <Link href="/kontejnery/cenik" className={ui.buttonSecondary}>
            Kompletní ceník
          </Link>
        </div>
        <div className="mt-5 divide-y divide-zinc-800 rounded-xl bg-zinc-900/40">
          {WASTE_TYPES.slice(0, 4).map((wasteType) => (
            <article
              key={wasteType.id}
              className="grid gap-2 px-4 py-4 sm:grid-cols-[1.2fr_2fr_auto] sm:items-center sm:gap-4"
            >
              <h3 className="text-lg font-bold">{wasteType.label}</h3>
              <p className="text-sm text-zinc-400">{wasteType.shortDescription}</p>
              <p className="font-semibold text-[#F2C400]">od {wasteType.basePriceCzk.toLocaleString("cs-CZ")} Kč</p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Důvěra a podmínky" description="Transparentní informace před odesláním objednávky.">
          <ul className="space-y-2 text-zinc-300">
            <li>- Jasně popsané typy odpadu a možné doplatky</li>
            <li>- Obchodní podmínky a GDPR dostupné přímo ve footeru</li>
            <li>- Potvrzení termínu vždy ručně operátorem</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/obchodni-podminky" className={ui.buttonSecondary}>
              Obchodní podmínky
            </Link>
            <Link href="/gdpr" className={ui.buttonSecondary}>
              GDPR
            </Link>
          </div>
        </Section>
        <Section title="Rychlý start objednávky" description="Objednávka je navržená pro rychlé vyplnění na mobilu.">
          <p className="text-zinc-300">
            Vyberete adresu, typ odpadu a termín. Po odeslání dostanete potvrzení přijetí e-mailem.
          </p>
          <Link
            href="/kontejnery/objednat"
            className={`${ui.buttonPrimary} mt-4`}
          >
            Přejít do objednávky
          </Link>
        </Section>
      </div>
    </div>
  );
}
