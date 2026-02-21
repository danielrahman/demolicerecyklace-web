import type { Metadata } from "next";
import Link from "next/link";

import { FaqSection } from "@/components/faq-section";
import { getFaqContent } from "@/lib/cms/getters";
import { createPageMetadata } from "@/lib/seo-metadata";
import { CONTACT } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

export const metadata: Metadata = createPageMetadata({
  title: "Časté dotazy (FAQ) ke kontejnerům | Demolice Recyklace",
  description:
    "Nejčastější dotazy k objednávce kontejneru přes web, pravidlům odpadu a potvrzení termínu přistavení.",
  canonicalPath: "/kontejnery/faq",
});

export default async function KontejneryFaqPage() {
  const faqContent = await getFaqContent();

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">Časté dotazy - kontejnery</h1>
        <p className="max-w-4xl text-zinc-300">
          Nejčastější dotazy k objednávce přes web, pravidlům odpadu a potvrzení termínu. Pokud tu nenajdete odpověď,
          zavolejte nám.
        </p>
      </header>

      <FaqSection
        title="Kontejnery: nejčastější dotazy"
        description="Vše důležité k objednávce přes web, podmínkám odpadu a potvrzení termínu."
        items={faqContent.containers.items}
        columns={1}
      />

      <section className={cx(ui.cardSoft, "p-6")}>
        <h2 className="text-2xl font-bold">Potřebujete rychle poradit?</h2>
        <p className="mt-2 text-zinc-300">
          Dispečink: <a href={CONTACT.phoneHref} className="text-[var(--color-accent)]">{CONTACT.phone}</a>
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={CONTACT.phoneHref} className={ui.buttonPrimary}>
            Zavolat {CONTACT.phone}
          </a>
          <Link href="/kontejnery/objednat" className={ui.buttonSecondary}>
            Přejít do objednávky
          </Link>
        </div>
      </section>
    </div>
  );
}
