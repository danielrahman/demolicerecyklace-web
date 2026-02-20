import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/guards";
import { getOrder, setOrderPriceEstimate } from "@/lib/order-store";
import { appendOrderEvent } from "@/server/db/repositories/order-events";

function parsePricePart(raw: FormDataEntryValue | null, label: string, options?: { min?: number }) {
  const value = Number(String(raw ?? "").replace(",", ".").trim());
  if (!Number.isFinite(value)) {
    throw new Error(`Neplatná hodnota pole ${label}.`);
  }

  if (typeof options?.min === "number" && value < options.min) {
    throw new Error(`Pole ${label} musí být alespoň ${options.min}.`);
  }

  return Number(value.toFixed(2));
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

  const formData = await request.formData();
  let total = 0;

  try {
    total = parsePricePart(formData.get("priceTotal"), "celková cena", { min: 0 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Neplatná orientační cena." },
      { status: 400 },
    );
  }

  const nextPriceEstimate = {
    rentalDays: existingOrder.rentalDays,
    base: total,
    transport: 0,
    surcharge: 0,
    total,
    currency: "CZK" as const,
  };

  const order = await setOrderPriceEstimate(id, nextPriceEstimate);
  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  await appendOrderEvent({
    orderId: order.id,
    eventType: "price_estimate_updated",
    payload: {
      before: existingOrder.priceEstimate,
      after: nextPriceEstimate,
      by: auth.session.user.email,
    },
  });

  return NextResponse.redirect(new URL(`/admin/objednavky/${id}`, request.url));
}
