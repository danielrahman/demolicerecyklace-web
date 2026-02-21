import type { Metadata } from "next";
import { Suspense } from "react";

import { OrderWizardLazy } from "@/components/order-wizard-lazy";
import { getContainerOrderWasteTypes } from "@/lib/container-order-source";
import { createPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Objednat kontejner | Demolice Recyklace",
  description:
    "Objednávkový formulář kontejneru pro Prahu a Středočeský kraj. Termín přistavení potvrzuje operátor.",
  canonicalPath: "/kontejnery/objednat",
  noindex: true,
});

export default async function ObjednatPage() {
  const wasteTypes = await getContainerOrderWasteTypes();

  return (
    <div className="space-y-3 pb-5">
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <h1 className="text-3xl font-bold">Objednávka kontejneru 3 m³</h1>
        <p className="mt-2 text-zinc-300">Vyplňte adresu, vyberte termín a odešlete objednávku. Termín potvrzuje operátor ručně.</p>
      </section>
      <Suspense
        fallback={
          <div className="min-h-[500px] rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-300 sm:min-h-[620px] sm:p-6">
            Načítám objednávkový formulář...
          </div>
        }
      >
        <OrderWizardLazy wasteTypes={wasteTypes} />
      </Suspense>
    </div>
  );
}
