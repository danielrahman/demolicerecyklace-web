import Image from "next/image";
import Link from "next/link";

import { MachineRentalGrid } from "@/components/machine-rental-grid";
import { MACHINE_RENTAL_PRICING } from "@/lib/full-pricing";
import { ui } from "@/lib/ui";

const capabilities = [
  "Pásová rypadla pro demolice a zemní práce",
  "Čelní nakladače pro manipulaci s materiálem",
  "Mobilní drtiče pro recyklaci přímo na stavbě",
  "Možnost strojů s kladivem a nůžkami",
] as const;

export default function TechnikaPage() {
  return (
    <div className="space-y-10 pb-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <article className="space-y-3">
          <h1 className="text-4xl font-bold">Technika</h1>
          <p className="max-w-3xl text-zinc-300">
            Pro demolice, recyklaci i odvoz využíváme vlastní techniku. Přehled níže slouží jako rychlá orientace -
            konkrétní nasazení vždy navrhujeme podle typu zakázky.
          </p>
          <ul className="space-y-2 text-zinc-300">
            {capabilities.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/cenik#pronajem-stroju" className={ui.buttonSecondary}>
              Otevřít ceník techniky
            </Link>
            <Link href="/kontakt" className={ui.buttonPrimary}>
              Poptat termín techniky
            </Link>
          </div>
        </article>

        <div className="overflow-hidden rounded-2xl border border-zinc-800">
          <Image
            src="/legacy/current-web/images_ffgallery_20180320_5ab18a05cb602_pronajem_IMG_2627.jpg"
            alt="Technika v provozu"
            width={640}
            height={480}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="space-y-4 border-t border-zinc-800 pt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold">Stroje k nasazení</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Ceny jsou orientační podle aktuálního ceníku. U delších zakázek připravíme individuální kalkulaci.
            </p>
          </div>
          <Link href="/demolice" className={ui.buttonSecondary}>
            Služba demolice
          </Link>
        </div>

        <MachineRentalGrid machines={MACHINE_RENTAL_PRICING} />
      </section>
    </div>
  );
}
