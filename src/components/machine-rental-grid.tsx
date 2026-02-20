import Image from "next/image";

import type { MachineRentalRow } from "@/lib/full-pricing";

function getPricingLabel(price: string) {
  return price.includes("/t") ? "Cena za tunu" : "Denní pronájem";
}

export function MachineRentalGrid(props: { machines: MachineRentalRow[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {props.machines.map((machine) => (
        <article
          key={machine.machine}
          className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 transition hover:border-zinc-700"
        >
          <div className="relative h-48 overflow-hidden">
            <Image
              src={machine.image}
              alt={machine.machine}
              width={1280}
              height={800}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <p className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#F2C400]">
              {getPricingLabel(machine.price)}
            </p>
          </div>
          <div className="space-y-2 p-4">
            <h3 className="text-xl font-bold">{machine.machine}</h3>
            <p className="text-sm text-zinc-300">{machine.specification}</p>
            <p className="font-semibold text-[#F2C400]">{machine.price}</p>
            {machine.note ? <p className="text-xs text-zinc-400">{machine.note}</p> : null}
          </div>
        </article>
      ))}
    </div>
  );
}
