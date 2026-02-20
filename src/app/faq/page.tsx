import type { Metadata } from "next";
import Link from "next/link";

import { FaqSection } from "@/components/faq-section";
import { getFaqContent } from "@/lib/cms/getters";
import { CONTACT } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

export const metadata: Metadata = {
  title: "FAQ | Demolice Recyklace",
  description:
    "Nejčastější dotazy k objednávce kontejneru, demolici a recyklaci pro Prahu a Středočeský kraj.",
  alternates: {
    canonical: "/faq",
  },
};

export default async function FaqPage() {
  const faqContent = await getFaqContent();
  const faqItems = [...faqContent.containers.items, ...faqContent.demolition.items, ...faqContent.recycling.items];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="space-y-8 pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <h1 className="text-4xl font-bold">FAQ</h1>
      <p className="max-w-4xl text-zinc-300">
        Nejčastější dotazy před objednávkou kontejneru, poptávkou demolice nebo řešením recyklace. Pokud nenajdete
        odpověď, ozvěte se dispečinku.
      </p>

      <section className="border-t border-zinc-800 pt-6">
        <FaqSection
          id="kontejnery"
          title={faqContent.containers.title}
          description={faqContent.containers.description}
          items={faqContent.containers.items}
          columns={1}
        />
      </section>

      <section className="border-t border-zinc-800 pt-6">
        <FaqSection
          id="demolice"
          title={faqContent.demolition.title}
          description={faqContent.demolition.description}
          items={faqContent.demolition.items}
          columns={1}
        />
      </section>

      <section className="border-t border-zinc-800 pt-6">
        <FaqSection
          id="recyklace"
          title={faqContent.recycling.title}
          description={faqContent.recycling.description}
          items={faqContent.recycling.items}
          columns={1}
        />
      </section>

      <section className={cx(ui.cardSoft, "p-6")}>
        <h2 className="text-2xl font-bold">Potřebujete rychlou odpověď?</h2>
        <p className="mt-2 text-zinc-300">
          Nejrychlejší je krátký hovor s dispečinkem. U kontejnerů můžete zároveň rovnou založit objednávku online.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={CONTACT.phoneHref} className={ui.buttonPrimary}>
            Zavolat {CONTACT.phone}
          </a>
          <Link href="/kontejnery/objednat" className={ui.buttonSecondary}>
            Objednat kontejner
          </Link>
          <Link href="/kontakt" className={ui.buttonSecondary}>
            Kontakt
          </Link>
        </div>
      </section>
    </div>
  );
}
