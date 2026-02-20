import Image from "next/image";
import Link from "next/link";

import { MachineRentalGrid } from "@/components/machine-rental-grid";
import { getMarketingPageContent } from "@/lib/cms/getters";
import { MACHINE_RENTAL_PRICING } from "@/lib/full-pricing";
import { CONTACT, SERVICE_AREA } from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

const capabilities = [
  "Pásová rypadla pro demolice a zemní práce",
  "Čelní nakladače pro manipulaci s materiálem",
  "Mobilní drtiče pro recyklaci přímo na stavbě",
  "Možnost strojů s kladivem a nůžkami",
] as const;

const planningPoints = [
  "Typ práce a předpokládaná délka nasazení",
  "Lokalita a podmínky přístupu na místo",
  "Požadovaná technika a případná obsluha",
] as const;

export default async function TechnikaPage() {
  const marketing = await getMarketingPageContent("technika");

  return (
    <div className="space-y-10 pb-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <article className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            {marketing?.eyebrow || "Technika pro demolice a recyklaci"}
          </p>
          <h1 className="text-4xl font-bold">{marketing?.heroTitle || "Technika"}</h1>
          <p className="max-w-3xl text-zinc-300">
            {marketing?.heroDescription ||
              "Pro demolice, recyklaci i odvoz využíváme vlastní techniku. Přehled níže slouží jako rychlá orientace - konkrétní nasazení vždy navrhujeme podle typu zakázky."}
          </p>
          <p className="max-w-3xl text-zinc-300">
            Primární oblast nasazení je {SERVICE_AREA.regionsLabel}. Vzdálenější lokality řešíme podle rozsahu a
            harmonogramu projektu.
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
            <a href={CONTACT.phoneHref} className={ui.buttonPrimary}>
              Zavolat {CONTACT.phone}
            </a>
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

      <section className="grid gap-5 border-t border-zinc-800 pt-8 lg:grid-cols-[1.2fr_1fr]">
        <article className={cx(ui.cardSoft, "p-6")}>
          <h2 className="text-2xl font-bold">Jak připravit poptávku techniky</h2>
          <ul className="mt-4 space-y-2 text-zinc-300">
            {planningPoints.map((point) => (
              <li key={point}>- {point}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-zinc-400">
            Čím přesnější vstupní informace, tím rychleji potvrdíme vhodný stroj i realistický termín nasazení.
          </p>
        </article>

        <article className={cx(ui.card, "p-6")}>
          <h2 className="text-2xl font-bold">Rychlý kontakt</h2>
          <p className="mt-2 text-zinc-300">
            Potřebujete ověřit dostupnost stroje nebo cenu na konkrétní termín? Nejrychlejší je kontakt přes dispečink.
          </p>
          <a href={CONTACT.phoneHref} className={cx(ui.buttonPrimary, "mt-4")}>
            Zavolat {CONTACT.phone}
          </a>
          <a href={CONTACT.emailHref} className={cx(ui.buttonSecondary, "mt-3")}>
            Napsat dispečinku
          </a>
        </article>
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
