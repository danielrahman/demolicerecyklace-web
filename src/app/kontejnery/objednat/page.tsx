import { OrderWizard } from "@/components/order-wizard";
import { CONTAINER_PRODUCT, SERVICE_AREA } from "@/lib/site-config";

export default async function ObjednatPage({
  searchParams,
}: {
  searchParams?: Promise<{ psc?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const prefilledPostalCode = String(params?.psc ?? "")
    .replace(/\D/g, "")
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-4xl font-bold">Online objednávka kontejneru</h1>
      <p className="max-w-4xl text-zinc-300">
        Formulář je navržený od adresy, aby bylo hned jasné, zda obsluhujeme lokalitu. Online aktuálně objednáte
        kontejner {CONTAINER_PRODUCT.availableNow} pro {SERVICE_AREA.regionsLabel}. Po odeslání vždy obdržíte potvrzení
        o přijetí a termín ručně potvrdí operátor.
      </p>
      <OrderWizard initialPostalCode={prefilledPostalCode} />
    </div>
  );
}
