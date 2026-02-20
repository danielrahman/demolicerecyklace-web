import Image from "next/image";
import Link from "next/link";

import { FaqSection } from "@/components/faq-section";
import { MachineRentalGrid } from "@/components/machine-rental-grid";
import { DEMOLITION_FAQ } from "@/lib/faq-content";
import { MACHINE_RENTAL_PRICING } from "@/lib/full-pricing";
import { CONTACT, SERVICE_AREA } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

const scopeItems = [
  {
    title: "Rodinné a menší komerční objekty",
    description: "Postupná demolice, třídění materiálu a koordinace odvozu tak, aby nevznikaly zbytečné prostoje.",
  },
  {
    title: "Průmyslové a technologické celky",
    description: "Demontáže, bourací práce a navazující logistika materiálu s důrazem na bezpečný pracovní režim.",
  },
  {
    title: "Návazná recyklace a odvoz",
    description: "Separované frakce předáváme k dalšímu zpracování, aby se minimalizoval netříděný stavební odpad.",
  },
] as const;

const processSteps = [
  {
    title: "Konzultace a vstupní zadání",
    description: "Telefonicky nebo e-mailem si upřesníme rozsah, lokalitu a předpokládaný termín realizace.",
  },
  {
    title: "Obhlídka a návrh postupu",
    description: "Technik na místě posoudí přístup, rizika a navrhne vhodný technologický postup demolice.",
  },
  {
    title: "Demolice a průběžné třídění",
    description: "Práce provádíme po etapách, s průběžným oddělováním frakcí podle dalšího využití materiálu.",
  },
  {
    title: "Odvoz, recyklace a předání",
    description: "Po dokončení zajistíme odvoz materiálu, úklid a předání zakázky s domluvenou dokumentací.",
  },
] as const;

const requirements = [
  "Před zahájením je potřeba mít vyřešené formální povolení demolice podle typu objektu.",
  "U napojení objektu vyžadujeme potvrzení o stavu inženýrských sítí.",
  "V husté zástavbě řešíme individuálně hlukový režim a časové okno prací.",
] as const;

export default function DemolicePage() {
  return (
    <div className="space-y-10 pb-8">
      <section className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            Demolice Praha + Středočeský kraj
          </p>
          <h1 className="text-4xl font-bold">Demolice s jasným postupem a navazující recyklací</h1>
        </header>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <article className="space-y-4">
            <p className="max-w-3xl text-zinc-300">
              Zajišťujeme demoliční práce od menších objektů po technicky náročnější realizace. Zakázku vedeme od
              prvního zadání přes obhlídku až po odvoz a zpracování materiálu.
            </p>
            <p className="max-w-3xl text-zinc-300">
              Primárně obsluhujeme {SERVICE_AREA.regionsLabel}. Vzdálenější lokality řešíme individuálně podle typu
              projektu a logistiky.
            </p>
            <ul className="space-y-2 text-zinc-300">
              <li>- Postupné bourání s oddělováním jednotlivých frakcí materiálu</li>
              <li>- Koordinace odvozu, uložení a recyklace návazně na harmonogram stavby</li>
              <li>- Jedno kontaktní místo pro technické i provozní dotazy</li>
            </ul>
            <div className="flex flex-wrap gap-3 pt-1">
              <a href={CONTACT.phoneHref} className={ui.buttonPrimary}>
                Zavolat {CONTACT.phone}
              </a>
              <Link href="/realizace" className={ui.buttonSecondary}>
                Referenční realizace
              </Link>
              <a href={CONTACT.emailHref} className={ui.buttonSecondary}>
                Poslat detail poptávky
              </a>
            </div>
          </article>
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <Image
              src="/photos/homepage/hero-alt.jpg"
              alt="Demoliční technika - ilustrační náhled"
              width={1125}
              height={1500}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 border-t border-zinc-800 pt-8 md:grid-cols-3">
        {scopeItems.map((item) => (
          <article key={item.title} className={cx(ui.card, "p-5")}>
            <h2 className="text-2xl font-bold">{item.title}</h2>
            <p className="mt-2 text-zinc-300">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 border-t border-zinc-800 pt-8 lg:grid-cols-[1.2fr_1fr]">
        <article>
          <h2 className="text-3xl font-bold">Jak probíhá spolupráce</h2>
          <div className="mt-5 space-y-3">
            {processSteps.map((step, index) => (
              <article key={step.title} className={cx(ui.cardSoft, "p-4")}>
                <p className="font-mono text-sm text-[var(--color-accent)]">Krok {index + 1}</p>
                <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
                <p className="mt-1 text-zinc-300">{step.description}</p>
              </article>
            ))}
          </div>
        </article>

        <aside className="space-y-4">
          <article className={cx(ui.card, "p-6")}>
            <h2 className="text-2xl font-bold">Bezpečnost a podklady</h2>
            <ul className="mt-3 space-y-2 text-zinc-300">
              {requirements.map((requirement) => (
                <li key={requirement}>- {requirement}</li>
              ))}
            </ul>
          </article>

          <article className={cx(ui.cardSoft, "p-6")}>
            <h2 className="text-2xl font-bold">Kdy se ozveme</h2>
            <p className="mt-2 text-zinc-300">
              Na standardní poptávku reagujeme nejpozději do 1 pracovního dne. U urgentních případů je nejrychlejší
              telefonický kontakt přes dispečink.
            </p>
            <a href={CONTACT.phoneHref} className={cx(ui.buttonPrimary, "mt-4")}>
              Zavolat {CONTACT.phone}
            </a>
          </article>
        </aside>
      </section>

      <section className="space-y-4 border-t border-zinc-800 pt-8">
        <FaqSection
          title="FAQ k demolicím"
          description="Krátké odpovědi k reakční době, rozsahu služeb a potřebným podkladům."
          items={DEMOLITION_FAQ.slice(0, 3)}
          columns={2}
        />
        <Link href="/faq#demolice" className={cx(ui.buttonInline, "mt-4")}>
          Zobrazit celé FAQ demolice
        </Link>
      </section>

      <section className="space-y-4 border-t border-zinc-800 pt-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Pronájem strojů</h2>
            <p className="mt-2 max-w-3xl text-sm text-zinc-400">
              Fotky strojů jsou pro náhled kombinované z aktuálního webu a veřejně dostupných ilustračních zdrojů.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/cenik#pronajem-stroju" className={ui.buttonSecondary}>
              Otevřít kompletní ceník
            </Link>
            <a href={CONTACT.phoneHref} className={ui.buttonPrimary}>
              Zavolat {CONTACT.phone}
            </a>
          </div>
        </div>
        <MachineRentalGrid machines={MACHINE_RENTAL_PRICING} />
      </section>
    </div>
  );
}
