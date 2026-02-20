import Link from "next/link";

import { CONTACT, SERVICE_AREA, SITE_META } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

const values = [
  {
    title: "Jasné podmínky",
    description: "Ceníky, pravidla odpadu i dokumenty držíme veřejně na webu, aby klient věděl podmínky předem.",
  },
  {
    title: "Ruční kontrola termínů",
    description: "Každou online objednávku finálně potvrzuje operátor podle reálné kapacity.",
  },
  {
    title: "Provozní praxe",
    description: "Demolice, recyklace i kontejnerové služby řešíme jako navazující celek.",
  },
  {
    title: "Lokální dostupnost",
    description: `Primárně působíme v oblasti ${SERVICE_AREA.regionsLabel}.`,
  },
] as const;

const services = [
  {
    title: "Kontejnerová doprava",
    description:
      "Online objednávka 3m³ kontejneru s ověřením PSČ, jasnými pravidly odpadu a ručním potvrzením termínu.",
    href: "/kontejnery/objednat",
    cta: "Objednat kontejner",
  },
  {
    title: "Demolice",
    description: "Demolice objektů a technologických celků včetně navazujícího odvozu, třídění a recyklace materiálu.",
    href: "/demolice",
    cta: "Poptat demolici",
  },
  {
    title: "Recyklace a materiál",
    description: "Příjem a zpracování inertních materiálů, prodej recyklátu a další stavební materiály.",
    href: "/recyklace",
    cta: "Zjistit podmínky",
  },
] as const;

const cooperationSteps = [
  "Upřesníme zadání a vhodný postup podle typu zakázky.",
  "Potvrdíme termín podle reálné kapacity dispečinku a techniky.",
  "Realizujeme práce včetně návazné logistiky odpadu nebo materiálu.",
  "Předáme výsledek a navrhneme další postup, pokud je potřeba.",
] as const;

const audiences = ["Soukromé osoby", "Řemeslníci a menší stavební firmy", "Developerské a průmyslové projekty"] as const;

export default function ONasPage() {
  return (
    <div className="space-y-10 pb-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">O nás</h1>
        <p className="max-w-4xl text-zinc-300">
          {SITE_META.brandName} je prakticky zaměřený servis pro demolice, recyklaci, kontejnerovou dopravu a prodej
          materiálu. Stavíme na jednoduché komunikaci, transparentních podmínkách a provozní disciplíně.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-2">
        {values.map((value) => (
          <article key={value.title} className={cx(ui.card, "p-5")}>
            <h2 className="text-2xl font-bold">{value.title}</h2>
            <p className="mt-2 text-zinc-300">{value.description}</p>
          </article>
        ))}
      </section>

      <section className="space-y-4 border-t border-zinc-800 pt-8">
        <h2 className="text-3xl font-bold">Co řešíme nejčastěji</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className={cx(ui.card, "p-5")}>
              <h3 className="text-2xl font-bold">{service.title}</h3>
              <p className="mt-2 text-zinc-300">{service.description}</p>
              <Link href={service.href} className={cx(ui.buttonSecondary, "mt-4")}>
                {service.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 border-t border-zinc-800 pt-8 lg:grid-cols-[1.2fr_1fr]">
        <article className={cx(ui.cardSoft, "p-6")}>
          <h2 className="text-2xl font-bold">Jak spolupracujeme</h2>
          <div className="mt-4 space-y-3">
            {cooperationSteps.map((step, index) => (
              <article key={step} className="rounded-xl border border-zinc-700 bg-zinc-950 p-4">
                <p className="font-mono text-sm text-[var(--color-accent)]">Krok {index + 1}</p>
                <p className="mt-1 text-zinc-300">{step}</p>
              </article>
            ))}
          </div>
        </article>

        <article className={cx(ui.card, "p-6")}>
          <h2 className="text-2xl font-bold">Pro koho pracujeme</h2>
          <ul className="mt-4 space-y-2 text-zinc-300">
            {audiences.map((audience) => (
              <li key={audience}>- {audience}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-zinc-400">
            Typ zakázky i harmonogram řešíme individuálně podle rozsahu, přístupu na místo a požadavků na logistiku.
          </p>
        </article>
      </section>

      <section className={cx(ui.cardSoft, "p-6")}>
        <h2 className="text-2xl font-bold">Dokumenty a důvěryhodnost</h2>
        <ul className="mt-4 space-y-2 text-zinc-300">
          <li>- Provozovatel: {SITE_META.companyName}</li>
          <li>- IČZ: {CONTACT.icz}</li>
          <li>- Ceník a pravidla odpadu dostupné online i v dokumentech ke stažení</li>
          <li>- Ruční potvrzení termínu operátorem u online objednávek</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/dokumenty" className={ui.buttonSecondary}>
            Otevřít dokumenty
          </Link>
          <Link href="/kontejnery/objednat" className={ui.buttonSecondary}>
            Objednat kontejner
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-2xl font-bold">Chcete řešit konkrétní zakázku?</h2>
        <p className="mt-2 max-w-3xl text-zinc-300">
          Nejjistější cesta je krátký hovor s dispečinkem. U kontejnerů můžete objednávku založit online a termín pak
          ručně potvrdíme podle kapacity.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={CONTACT.phoneHref} className={ui.buttonPrimary}>
            Zavolat {CONTACT.phone}
          </a>
          <Link href="/kontejnery/objednat" className={ui.buttonSecondary}>
            Online objednávka kontejneru
          </Link>
        </div>
      </section>
    </div>
  );
}
