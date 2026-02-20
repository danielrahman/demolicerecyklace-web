import Link from "next/link";

import { CONTAINER_FAQ } from "@/lib/container-content";
import { CONTACT } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

export default function KontejneryFaqPage() {
  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">FAQ - Kontejnery</h1>
        <p className="max-w-4xl text-zinc-300">
          Nejčastější dotazy k online objednávce, pravidlům odpadu a potvrzení termínu. Pokud tu nenajdete odpověď,
          zavolejte nám.
        </p>
      </header>

      <section className="space-y-3">
        {CONTAINER_FAQ.map((faq) => (
          <article key={faq.question} className={cx(ui.card, "p-5")}>
            <h2 className="text-xl font-bold">{faq.question}</h2>
            <p className="mt-2 text-zinc-300">{faq.answer}</p>
          </article>
        ))}
      </section>

      <section className={cx(ui.cardSoft, "p-6")}>
        <h2 className="text-2xl font-bold">Potřebujete rychle poradit?</h2>
        <p className="mt-2 text-zinc-300">
          Dispečink: <a href={CONTACT.phoneHref} className="text-[var(--color-accent)]">{CONTACT.phone}</a>
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={CONTACT.phoneHref} className={ui.buttonPrimary}>
            Zavolat dispečink
          </a>
          <Link href="/kontejnery/objednat" className={ui.buttonSecondary}>
            Přejít do objednávky
          </Link>
        </div>
      </section>
    </div>
  );
}
