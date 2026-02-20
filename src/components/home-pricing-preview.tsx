import Image from "next/image";
import Link from "next/link";

import { getPricingPageContent } from "@/lib/cms/getters";
import { getContainerOrderWasteTypes } from "@/lib/container-order-source";
import { CONTAINER_PRODUCT } from "@/lib/site-config";

export async function HomePricingPreview() {
  const [wasteTypes, pricing] = await Promise.all([
    getContainerOrderWasteTypes(),
    getPricingPageContent(),
  ]);
  const containerPreview = wasteTypes.slice(0, 4);
  const machinePreview = pricing.machinePricing.slice(0, containerPreview.length);
  const extraContainersCount = Math.max(0, wasteTypes.length - containerPreview.length);
  const extraMachinesCount = Math.max(0, pricing.machinePricing.length - machinePreview.length);
  const pricingSectionLinks = [
    { title: pricing.inertMaterialsTitle, href: "/cenik#inertni-materialy", count: pricing.inertMaterialsPricing.length },
    { title: pricing.materialSalesTitle, href: "/cenik#prodej-materialu", count: pricing.materialSalesPricing.length },
    { title: pricing.mobileRecyclingTitle, href: "/cenik#mobilni-recyklace", count: pricing.mobileRecyclingPricing.length },
  ];

  return (
    <section className="border-t border-zinc-800 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Ukázka ceníku služeb</h2>
          <p className="mt-2 text-zinc-300">
            Rychlý náhled hlavních položek z ceníku. Vedle kontejnerů řešíme i pronájem strojů pro demolice a zemní práce.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <article className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
            <h3 className="text-lg font-bold">Kontejnery {CONTAINER_PRODUCT.availableNow}</h3>
            <Link href="/cenik#kontejnery" className="text-right text-sm font-semibold text-[#F2C400] hover:underline">
              Více
              {extraContainersCount > 0 ? <span className="ml-1 text-[11px] text-zinc-400">+{extraContainersCount}</span> : null}
            </Link>
          </div>
          <div className="divide-y divide-zinc-800">
            {containerPreview.map((wasteType) => (
              <Link
                key={wasteType.id}
                href="/cenik#kontejnery"
                className="pricing-preview-row grid gap-2 px-4 py-3 sm:grid-cols-[auto_1.2fr_auto] sm:items-center sm:gap-4"
              >
                <div className="relative hidden h-12 w-16 overflow-hidden rounded-md border border-zinc-700 bg-zinc-950/70 sm:block">
                  <Image src={wasteType.imageUrl} alt={wasteType.imageAlt} width={320} height={240} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="text-base font-semibold">{wasteType.label}</h4>
                  <p className="text-xs text-zinc-400">{wasteType.tag}</p>
                </div>
                <p className="font-semibold text-[#F2C400]">{wasteType.priceLabel}</p>
              </Link>
            ))}
          </div>
        </article>

        <article className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
            <h3 className="text-lg font-bold">{pricing.machineSectionTitle}</h3>
            <Link href="/cenik#pronajem-stroju" className="text-right text-sm font-semibold text-[#F2C400] hover:underline">
              Více
              {extraMachinesCount > 0 ? <span className="ml-1 text-[11px] text-zinc-400">+{extraMachinesCount}</span> : null}
            </Link>
          </div>
          <div className="divide-y divide-zinc-800">
            {machinePreview.map((machine) => (
              <Link
                key={machine.machine}
                href="/cenik#pronajem-stroju"
                className="pricing-preview-row grid gap-2 px-4 py-3 sm:grid-cols-[auto_1.2fr_auto] sm:items-center sm:gap-4"
              >
                <div className="relative hidden h-12 w-16 overflow-hidden rounded-md border border-zinc-700 bg-white p-1 sm:block">
                  <Image src={machine.image} alt={machine.machine} width={320} height={220} className="h-full w-full object-contain object-center" />
                </div>
                <div>
                  <p className="text-base font-semibold">{machine.machine}</p>
                  <p className="line-clamp-1 text-xs text-zinc-400">{machine.specification}</p>
                </div>
                <p className="font-semibold text-[#F2C400]">{machine.price}</p>
              </Link>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {pricingSectionLinks.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="pricing-preview-chip flex items-center justify-between rounded-full border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm"
          >
            <span className="truncate">{section.title}</span>
            <span className="ml-2 shrink-0 text-xs uppercase tracking-[0.14em] text-zinc-400">
              Více
              {section.count > 0 ? <span className="ml-1 text-[11px] normal-case tracking-normal">+{section.count}</span> : null}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HomePricingPreviewFallback() {
  return (
    <section className="border-t border-zinc-800 pt-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Ukázka ceníku služeb</h2>
        <p className="text-zinc-300">Načítám přehled položek ceníku...</p>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/40" />
        <div className="h-64 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/40" />
      </div>
    </section>
  );
}
