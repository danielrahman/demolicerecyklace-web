import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/guards";
import { getContainerOrderWasteTypeById } from "@/lib/container-order-source";
import { getOrder, updateOrderParams } from "@/lib/order-store";
import { estimatePrice } from "@/lib/pricing";
import { appendOrderEvent } from "@/server/db/repositories/order-events";

function parseContainerCount(value: FormDataEntryValue | null) {
  const count = Number(String(value ?? ""));
  return Number.isInteger(count) ? count : NaN;
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;
  const existingOrder = await getOrder(id);

  if (!existingOrder) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  if (existingOrder.status !== "new" && existingOrder.status !== "confirmed") {
    return NextResponse.json({ error: "Parametry lze upravovat jen u přijaté nebo potvrzené objednávky." }, { status: 409 });
  }

  const formData = await request.formData();
  const wasteTypeId = String(formData.get("wasteType") ?? "").trim();
  const containerCount = parseContainerCount(formData.get("containerCount"));
  const placementType = String(formData.get("placementType") ?? "").trim();
  const permitConfirmed = formData.get("permitConfirmed") === "on";

  if (!wasteTypeId) {
    return NextResponse.json({ error: "Vyberte typ odpadu." }, { status: 400 });
  }

  if (!Number.isInteger(containerCount) || containerCount < 1 || containerCount > 3) {
    return NextResponse.json({ error: "Počet kontejnerů musí být 1 až 3." }, { status: 400 });
  }

  if (placementType !== "soukromy" && placementType !== "verejny") {
    return NextResponse.json({ error: "Neplatné umístění." }, { status: 400 });
  }

  const wasteType = await getContainerOrderWasteTypeById(wasteTypeId);
  if (!wasteType) {
    return NextResponse.json({ error: "Vybraný typ odpadu není dostupný." }, { status: 400 });
  }

  const extras = {
    nakladkaOdNas: formData.get("nakladkaOdNas") === "on",
    expresniPristaveni: formData.get("expresniPristaveni") === "on",
    opakovanyOdvoz: formData.get("opakovanyOdvoz") === "on",
  };

  const nextPriceEstimate = estimatePrice({
    basePriceCzk: wasteType.basePriceCzk,
    containerCount,
    rentalDays: existingOrder.rentalDays,
    extras,
  });

  const order = await updateOrderParams(id, {
    wasteType: wasteTypeId,
    containerCount,
    placementType,
    permitConfirmed,
    extras,
    priceEstimate: nextPriceEstimate,
  });

  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  const changedFields: string[] = [];
  if (existingOrder.wasteType !== order.wasteType) changedFields.push("typ odpadu");
  if (existingOrder.containerCount !== order.containerCount) changedFields.push("počet kontejnerů");
  if (existingOrder.placementType !== order.placementType) changedFields.push("umístění");
  if (existingOrder.permitConfirmed !== order.permitConfirmed) changedFields.push("povolení");
  if (JSON.stringify(existingOrder.extras) !== JSON.stringify(order.extras)) changedFields.push("doplňkové služby");
  if (existingOrder.priceEstimate.total !== order.priceEstimate.total) changedFields.push("orientační cena");

  await appendOrderEvent({
    orderId: order.id,
    eventType: "order_params_updated",
    payload: {
      by: auth.session.user.email,
      changedFields,
      before: {
        wasteType: existingOrder.wasteType,
        containerCount: existingOrder.containerCount,
        placementType: existingOrder.placementType,
        permitConfirmed: existingOrder.permitConfirmed,
        extras: existingOrder.extras,
        priceEstimate: existingOrder.priceEstimate,
      },
      after: {
        wasteType: order.wasteType,
        containerCount: order.containerCount,
        placementType: order.placementType,
        permitConfirmed: order.permitConfirmed,
        extras: order.extras,
        priceEstimate: order.priceEstimate,
      },
    },
  });

  return NextResponse.redirect(new URL(`/admin/objednavky/${id}`, request.url));
}
