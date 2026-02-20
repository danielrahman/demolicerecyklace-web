import Image from "next/image";
import Link from "next/link";

import { MachineRentalGrid } from "@/components/machine-rental-grid";
import { MACHINE_RENTAL_PRICING } from "@/lib/full-pricing";
import { ui } from "@/lib/ui";

export default function DemolicePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <h1 className="text-4xl font-bold">Demolice</h1>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <article className="space-y-3">
            <p className="max-w-3xl text-zinc-300">
              Provádíme demolice staveb a technologických celků včetně návazného odvozu a třídění odpadu. Zakázky
              plánujeme tak, aby byl proces bezpečný a plynulý.
            </p>
            <ul className="space-y-2 text-zinc-300">
              <li>- Postupná demolice s důrazem na separaci materiálů</li>
              <li>- Odvoz odpadu a návazná recyklace</li>
              <li>- Možnost zajištění kompletního demoličního servisu</li>
            </ul>
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
            <Link href="/kontakt" className={ui.buttonPrimary}>
              Poptat termín
            </Link>
          </div>
        </div>
        <MachineRentalGrid machines={MACHINE_RENTAL_PRICING} />
      </section>
    </div>
  );
}
