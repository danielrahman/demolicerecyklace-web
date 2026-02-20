import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/guards";
import { getOrder } from "@/lib/order-store";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  return NextResponse.json({
    prefill: {
      customerType: order.customerType,
      name: order.name,
      companyName: order.companyName ?? "",
      ico: order.ico ?? "",
      dic: order.dic ?? "",
      email: order.email,
      phone: order.phone,
      postalCode: order.postalCode,
      city: order.city,
      street: order.street,
      houseNumber: order.houseNumber,
      wasteType: order.wasteType,
      containerCount: order.containerCount,
      rentalDays: order.rentalDays,
      deliveryDateRequested: order.deliveryDateRequested,
      deliveryDateEndRequested: order.deliveryDateEndRequested ?? "",
      timeWindowRequested: order.timeWindowRequested,
      placementType: order.placementType,
      permitConfirmed: order.permitConfirmed,
      note: order.note ?? "",
      callbackNote: order.callbackNote ?? "",
      marketingConsent: order.marketingConsent,
      pinLocation: order.pinLocation ?? null,
      addressInput: `${order.street} ${order.houseNumber}, ${order.city}, ${order.postalCode}`,
    },
  });
}
