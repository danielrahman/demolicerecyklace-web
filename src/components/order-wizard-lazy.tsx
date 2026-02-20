"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import type { ContainerOrderWasteType } from "@/lib/container-order-catalog";

const OrderWizard = dynamic(
  () => import("@/components/order-wizard").then((module) => module.OrderWizard),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[500px] rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-300 sm:min-h-[620px] sm:p-6">
        Načítám objednávkový formulář...
      </div>
    ),
  },
);

export function OrderWizardLazy(props: { wasteTypes: ContainerOrderWasteType[] }) {
  const searchParams = useSearchParams();
  const initialPostalCode = String(searchParams.get("psc") ?? "")
    .replace(/\D/g, "")
    .slice(0, 5);

  return <OrderWizard initialPostalCode={initialPostalCode} wasteTypes={props.wasteTypes} />;
}
