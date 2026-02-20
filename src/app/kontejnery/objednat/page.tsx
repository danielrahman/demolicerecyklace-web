import { Suspense } from "react";

import { OrderWizardLazy } from "@/components/order-wizard-lazy";

export default function ObjednatPage() {
  return (
    <div className="space-y-3 pb-5">
      <Suspense
        fallback={
          <div className="min-h-[500px] rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-300 sm:min-h-[620px] sm:p-6">
            Načítám objednávkový formulář...
          </div>
        }
      >
        <OrderWizardLazy />
      </Suspense>
    </div>
  );
}
