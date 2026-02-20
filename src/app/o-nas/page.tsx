import Link from "next/link";

import { CONTACT, SERVICE_AREA, SITE_META } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

const values = [
  {
    title: "Jasné podmínky",
    description: "Ceníky, pravidla odpadu i dokumenty držíme veřejně na webu, ne jen v PDF.",
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

export default function ONasPage() {
  return (
    <div className="space-y-10 pb-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">O nás</h1>
        <p className="max-w-4xl text-zinc-300">
          {SITE_META.brandName} je prakticky zaměřený servis pro demolice, recyklaci a odvoz odpadu. Stavíme na
          jednoduché komunikaci, transparentních podmínkách a rychlé operativě.
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

      <section className={cx(ui.cardSoft, "p-6")}>
        <h2 className="text-2xl font-bold">Dokumenty a trust signály</h2>
        <ul className="mt-4 space-y-2 text-zinc-300">
          <li>- Provozovatel: {SITE_META.companyName}</li>
          <li>- IČZ: {CONTACT.icz}</li>
          <li>- Ceník a pravidla odpadu v HTML + PDF ke stažení</li>
          <li>- Ruční potvrzení termínu operátorem u online objednávek</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/dokumenty" className={ui.buttonSecondary}>
            Otevřít dokumenty
          </Link>
          <Link href="/kontejnery/lokality" className={ui.buttonSecondary}>
            Obsluhované lokality
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-2xl font-bold">Chcete řešit konkrétní zakázku?</h2>
        <p className="mt-2 max-w-3xl text-zinc-300">
          Nejjistější cesta je krátký hovor s dispečinkem. U kontejnerů můžete objednávku založit online a termín
          následně ručně potvrdíme.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={CONTACT.phoneHref} className={ui.buttonPrimary}>
            Zavolat dispečink
          </a>
          <Link href="/kontejnery/objednat" className={ui.buttonSecondary}>
            Online objednávka kontejneru
          </Link>
        </div>
      </section>
    </div>
  );
}
