import Link from "next/link";

import { MachineRentalGrid } from "@/components/machine-rental-grid";
import {
  CONTAINER_3M3_PRICING,
  INERT_MATERIALS_PRICING,
  MACHINE_RENTAL_PRICING,
  MATERIAL_SALES_PRICING,
  MOBILE_RECYCLING_PRICING,
  type PricingRow,
} from "@/lib/full-pricing";
import { ui } from "@/lib/ui";

function PricingTable(props: { title: string; rows: PricingRow[]; subtitle?: string }) {
  return (
    <section className="space-y-3 border-t border-zinc-800 pt-6">
      <h2 className="text-2xl font-bold">{props.title}</h2>
      {props.subtitle ? <p className="text-sm text-zinc-400">{props.subtitle}</p> : null}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="min-w-full bg-zinc-900 text-left text-sm">
          <thead className="bg-zinc-800 text-zinc-200">
            <tr>
              <th className="px-4 py-3">Položka</th>
              <th className="px-4 py-3">Kód</th>
              <th className="px-4 py-3">Cena</th>
              <th className="px-4 py-3">Poznámka</th>
            </tr>
          </thead>
          <tbody>
            {props.rows.map((row) => (
              <tr key={`${row.item}-${row.code}-${row.price}`} className="border-t border-zinc-800">
                <td className="px-4 py-3">{row.item}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-300">{row.code ?? "-"}</td>
                <td className="px-4 py-3 font-semibold">{row.price}</td>
                <td className="px-4 py-3 text-zinc-400">{row.note ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function KompletníCeníkPage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-zinc-900/50 p-6 sm:p-8">
        <h1 className="text-4xl font-bold">Kompletní ceník služeb</h1>
        <p className="mt-3 max-w-3xl text-zinc-300">
          Přehled je převzatý z aktuálního ceníku 2026 a převedený do HTML kvůli přehlednosti. Ceny jsou bez DPH.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="/documents/cenik-2026.pdf"
            target="_blank"
            rel="noreferrer"
            className={ui.buttonPrimary}
          >
            Otevřít originální PDF ceník
          </a>
          <Link href="/kontejnery/objednat" className={ui.buttonSecondary}>
            Objednat kontejner online
          </Link>
        </div>
      </section>

      <PricingTable
        title="Pronájem kontejneru 3 m3 (max 4 t)"
        rows={CONTAINER_3M3_PRICING}
        subtitle="Termín je vždy potvrzován ručně operátorem."
      />

      <PricingTable
        title="Ukládka inertních materiálů"
        rows={INERT_MATERIALS_PRICING}
        subtitle="U položek je nutné doložit požadované dokumenty dle legislativy."
      />

      <PricingTable title="Prodej materiálu" rows={MATERIAL_SALES_PRICING} />

      <PricingTable title="Recyklace přímo na stavbě" rows={MOBILE_RECYCLING_PRICING} />

      <section id="pronajem-stroju" className="space-y-4 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">Pronájem strojů</h2>
        <p className="text-sm text-zinc-400">
          Fotky strojů jsou pro náhled kombinované z aktuálního webu a veřejně dostupných ilustračních zdrojů.
        </p>
        <MachineRentalGrid machines={MACHINE_RENTAL_PRICING} />
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm text-zinc-300">
        <p>
          Poznámky k ceníku: ceny jsou uvedené bez DPH 21 %, materiály musí být bez příměsí a při ukládce odpadu je
          nutné doložit požadované podklady (ZPO, případně atesty). U nejasností kontaktujte dispečink.
        </p>
      </section>
    </div>
  );
}
