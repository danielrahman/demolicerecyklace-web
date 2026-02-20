import Link from "next/link";

import { PostalCodeReservation } from "@/components/postal-code-reservation";
import { SERVICE_AREA } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

export default function LokalityPage() {
  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">Obsluhovaná oblast</h1>
        <p className="max-w-4xl text-zinc-300">
          Online objednávka kontejnerů je společně pro {SERVICE_AREA.regionsLabel}. Místo výpisu stovek PSČ můžete
          rovnou zadat PSČ a pokračovat do rezervace s předvyplněným prvním krokem.
        </p>
      </header>

      <section className={cx(ui.card, "p-6")}>
        <h2 className="text-2xl font-bold">Zadejte PSČ a pokračujte</h2>
        <p className="mt-2 text-zinc-300">
          Ověření PSČ proběhne hned a pokud je podporované, pošleme vás do objednávky s předvyplněným PSČ.
        </p>
        <div className="mt-4">
          <PostalCodeReservation />
        </div>
      </section>

      <section className={cx(ui.cardSoft, "overflow-hidden") }>
        <div className="border-b border-zinc-800 p-4">
          <h2 className="text-2xl font-bold">Mapa oblasti - Praha + Středočeský kraj</h2>
          <p className="text-sm text-zinc-400">Mapa je orientační. Rozhodující je validace PSČ ve formuláři.</p>
        </div>
        <iframe
          title="Mapa pokrytí Praha a Středočeský kraj"
          src="https://www.google.com/maps?q=Praha%20St%C5%99edo%C4%8Desk%C3%BD%20kraj&output=embed"
          className="h-[360px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/kontejnery/objednat" className={ui.buttonPrimary}>
          Otevřít objednávku
        </Link>
        <Link href="/kontejnery" className={ui.buttonSecondary}>
          Zpět na Kontejnery
        </Link>
      </div>
    </div>
  );
}
