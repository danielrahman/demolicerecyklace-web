import Image from "next/image";

import type { MachineRentalRow } from "@/lib/full-pricing";

function getPricingLabel(price: string) {
  return price.includes("/t") ? "Cena za tunu" : "Denní pronájem";
}

export function MachineRentalGrid(props: { machines: MachineRentalRow[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {props.machines.map((machine) => (
        <article
          key={machine.machine}
          className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 transition hover:border-zinc-700"
        >
          <div className="relative flex h-48 items-center justify-center bg-white p-4">
            <Image
              src={machine.image}
              alt={machine.machine}
              width={1280}
              height={800}
              className="h-full w-full object-contain object-center"
            />
            <p className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#F2C400]">
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
