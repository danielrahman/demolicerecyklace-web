import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FaqSection } from "@/components/faq-section";
import { getMarketingPageContent } from "@/lib/cms/getters";
import { RECYCLING_FAQ } from "@/lib/faq-content";
import { createPageMetadata } from "@/lib/seo-metadata";
import { CONTACT } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

const acceptedMaterials = [
  "Beton, cihla, tašky a další inertní stavební materiály",
  "Směsi vhodné pro třídění a následné drcení",
  "Výkopová zemina dle aktuálních podmínek příjmu",
] as const;

const disallowedMaterials = [
  "Nebezpečné odpady (chemikálie, barvy, azbest apod.)",
  "Materiál s nejasným původem bez potřebných dokladů",
  "Silně kontaminované směsi bez možnosti separace",
] as const;

const intakeSteps = [
  {
    title: "Předběžné ověření",
    description: "Telefonicky upřesníme typ materiálu, množství a požadovaný termín přivezení.",
  },
  {
    title: "Příjezd a evidence",
    description: "Na provozovně provedeme vstupní kontrolu a zaevidujeme materiál podle pravidel příjmu.",
  },
  {
    title: "Zvážení a třídění",
    description: "Materiál vážíme a směrujeme do odpovídajícího procesu třídění nebo dalšího zpracování.",
  },
  {
    title: "Zpracování materiálu",
    description: "Po převzetí materiál zvážíme, zaevidujeme a zařadíme do odpovídajícího způsobu zpracování.",
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const marketing = await getMarketingPageContent("recyklace");
  const title = marketing?.seoTitle || "Recyklace | Demolice Recyklace";
  const description =
    marketing?.seoDescription ||
    "Příjem, třídění a zpracování stavebních materiálů v recyklačním středisku pro Prahu a okolí.";

  return createPageMetadata({
    title,
    description,
    canonicalPath: "/recyklace",
  });
}

export default async function RecyklacePage() {
  const marketing = await getMarketingPageContent("recyklace");

  return (
    <div className="space-y-10 pb-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">{marketing?.heroTitle || "Recyklace stavebních materiálů"}</h1>
        <p className="max-w-4xl text-zinc-300">
          {marketing?.heroDescription ||
            "V recyklačním středisku řešíme příjem, třídění a další zpracování inertních materiálů. Před příjezdem vždy doporučujeme ověřit složení materiálu, aby nedošlo ke zdržení při přejímce."}
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a href={CONTACT.phoneHref} className={ui.buttonPrimary}>
            Zavolat {CONTACT.phone}
          </a>
          <Link href="/cenik" className={ui.buttonSecondary}>
            Kompletní ceník
          </Link>
          <Link href="/prodej-materialu" className={ui.buttonSecondary}>
            Prodej materiálu
          </Link>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <article className="grid gap-4 sm:grid-cols-2">
          <article className={cx(ui.card, "p-5")}>
            <h2 className="text-2xl font-bold">Přijímáme</h2>
            <ul className="mt-3 space-y-2 text-zinc-300">
              {acceptedMaterials.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </article>
          <article className={cx(ui.card, "p-5")}>
            <h2 className="text-2xl font-bold">Nepřijímáme</h2>
            <ul className="mt-3 space-y-2 text-zinc-300">
              {disallowedMaterials.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </article>
        </article>

        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <Image
            src="/photos/homepage/service-recyklace.jpg"
            alt="Recyklační středisko"
            width={1280}
            height={720}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="space-y-4 border-t border-zinc-800 pt-8">
        <h2 className="text-3xl font-bold">Jak probíhá příjem materiálu</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {intakeSteps.map((step, index) => (
            <article key={step.title} className={cx(ui.cardSoft, "p-4")}>
              <p className="font-mono text-sm text-[var(--color-accent)]">Krok {index + 1}</p>
              <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-zinc-300">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 border-t border-zinc-800 pt-8 lg:grid-cols-[1.2fr_1fr]">
        <article className={cx(ui.card, "p-6")}>
          <h2 className="text-2xl font-bold">Provozní informace</h2>
          <ul className="mt-4 space-y-2 text-zinc-300">
            <li>- Cejchovaná váha a evidence materiálu při příjmu</li>
            <li>- Provozní režim: Po-Pá 7:00-17:00, So 8:00-14:00</li>
            <li>- Provozovna: {CONTACT.operationAddressLine}</li>
            <li>- Cena zahrnuje převzetí, zvážení, evidenci a navazující zpracování materiálu</li>
            <li>- U vybraných položek vyžadujeme doložení potřebných podkladů</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/dokumenty" className={ui.buttonSecondary}>
              Dokumenty ke stažení
            </Link>
            <a href={CONTACT.mapUrl} target="_blank" rel="noreferrer" className={ui.buttonSecondary}>
              Otevřít navigaci
            </a>
          </div>
        </article>

        <article className={cx(ui.cardSoft, "p-6")}>
          <h2 className="text-2xl font-bold">Nejste si jistí materiálem?</h2>
          <p className="mt-2 text-zinc-300">
            Pošlete stručný popis a orientační množství, nebo zavolejte dispečink. Pomůžeme určit správný postup ještě
            před příjezdem.
          </p>
          <a href={CONTACT.emailHref} className={cx(ui.buttonPrimary, "mt-4")}>
            Napsat na {CONTACT.email}
          </a>
        </article>
      </section>

      <section className="space-y-4 border-t border-zinc-800 pt-8">
        <h2 className="text-3xl font-bold">Související služby a ceník</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/cenik#inertni-materialy" className={ui.buttonSecondary}>
            Ceník recyklace
          </Link>
          <Link href="/demolice" className={ui.buttonSecondary}>
            Demoliční služby
          </Link>
          <Link href="/kontejnery/objednat" className={ui.buttonSecondary}>
            Objednat kontejner
          </Link>
        </div>
      </section>

      <section className="space-y-4 border-t border-zinc-800 pt-8">
        <FaqSection
          title="FAQ k recyklaci"
          description="Nejčastější dotazy před příjezdem do střediska a při řešení materiálu."
          items={RECYCLING_FAQ.slice(0, 3)}
          columns={2}
        />
        <Link href="/faq#recyklace" className={cx(ui.buttonInline, "mt-4")}>
          Zobrazit celé FAQ recyklace
        </Link>
      </section>
    </div>
  );
}
