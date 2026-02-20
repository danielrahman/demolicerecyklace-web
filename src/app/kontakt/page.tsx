import Link from "next/link";

import { CONTACT, SERVICE_AREA, SITE_META } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

const reasons = [
  {
    title: "Kontejnery",
    description: "Online objednávka, ověření PSČ a rychlé potvrzení termínu operátorem.",
    href: "/kontejnery/objednat",
    cta: "Objednat kontejner",
  },
  {
    title: "Demolice a recyklace",
    description: "Poptávka demoličních prací, zpracování materiálu a návazné logistiky.",
    href: "/demolice",
    cta: "Poptat demolici",
  },
  {
    title: "Prodej materiálu",
    description: "Dostupnost frakcí, ceny a termín dodání nebo osobního odběru.",
    href: "/prodej-materialu",
    cta: "Řešit materiál",
  },
] as const;

export default function KontaktPage() {
  return (
    <div className="space-y-10 pb-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">Kontakt</h1>
        <p className="max-w-4xl text-zinc-300">
          Nejrychlejší cesta je dispečink. Pomůžeme s objednávkou kontejneru, poptávkou demolice i recyklací. Pro
          online objednávky kontejneru termín vždy finálně potvrzuje operátor.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={CONTACT.phoneHref} className={ui.buttonPrimary}>
            Zavolat {CONTACT.phone}
          </a>
          <a href={CONTACT.emailHref} className={ui.buttonSecondary}>
            Napsat e-mail
          </a>
          <Link href="/kontejnery/lokality" className={ui.buttonSecondary}>
            Ověřit PSČ a rezervaci
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {reasons.map((reason) => (
          <article key={reason.title} className={cx(ui.card, "p-5")}>
            <h2 className="text-2xl font-bold">{reason.title}</h2>
            <p className="mt-2 text-sm text-zinc-300">{reason.description}</p>
            <Link href={reason.href} className={`${ui.buttonSecondary} mt-4`}>
              {reason.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <article className={cx(ui.card, "p-6")}>
          <h2 className="text-2xl font-bold">Kontaktní údaje</h2>
          <div className="mt-3 space-y-2 text-zinc-300">
            <p>
              <span className="text-zinc-400">Společnost:</span> {SITE_META.companyName}
            </p>
            <p>
              <span className="text-zinc-400">Telefon:</span>{" "}
              <a href={CONTACT.phoneHref} className="text-[var(--color-accent)]">
                {CONTACT.phone}
              </a>
            </p>
            <p>
              <span className="text-zinc-400">E-mail:</span>{" "}
              <a href={CONTACT.emailHref} className="text-[var(--color-accent)]">
                {CONTACT.email}
              </a>
            </p>
            <p>
              <span className="text-zinc-400">Sídlo:</span> {CONTACT.operatorAddressLine}
            </p>
            <p>
              <span className="text-zinc-400">Provozovna:</span> {CONTACT.operationAddressLine}
            </p>
            <p>
              <span className="text-zinc-400">IČZ:</span> {CONTACT.icz}
            </p>
          </div>

          <h3 className="mt-5 text-xl font-bold">Provozní doba</h3>
          <div className="mt-2 space-y-1 text-zinc-300">
            {CONTACT.hours.map((hour) => (
              <p key={hour.label}>
                <span className="text-zinc-400">{hour.label}:</span> {hour.value}
              </p>
            ))}
          </div>
          <p className="mt-2 text-sm text-zinc-400">Mimo provozní dobu můžete poslat e-mail. Ozveme se následující pracovní den.</p>
        </article>

        <article className={cx(ui.card, "overflow-hidden") }>
          <div className="border-b border-zinc-800 p-4">
            <h2 className="text-2xl font-bold">Mapa a navigace</h2>
            <p className="text-sm text-zinc-400">Sídlo společnosti a orientační bod pro komunikaci s dispečinkem.</p>
          </div>
          <iframe
            title="Sídlo Demolice Recyklace"
            src="https://www.google.com/maps?q=Na%20Kodymce%201440/17%2C%20160%2000%20Praha%206-Dejvice&output=embed"
            className="h-[340px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="p-4">
            <a href={CONTACT.mapUrl} target="_blank" rel="noreferrer" className={ui.buttonPrimary}>
              Otevřít v Google Maps
            </a>
          </div>
        </article>
      </section>

      <section className={cx(ui.cardSoft, "p-6")}>
        <h2 className="text-2xl font-bold">Kde obsluhujeme</h2>
        <p className="mt-2 text-zinc-300">
          Primární oblast je {SERVICE_AREA.regionsLabel}. U kontejnerů doporučujeme začít ověřením PSČ a přejít rovnou
          do rezervace.
        </p>
        <div className="mt-4">
          <Link href="/kontejnery/lokality" className={ui.buttonSecondary}>
            Ověřit PSČ a rezervaci
          </Link>
        </div>
      </section>
    </div>
  );
}
