import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/guards";
import { getOrder, updateOrderStatus } from "@/lib/order-store";
import { appendOrderEvent } from "@/server/db/repositories/order-events";

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

  if (existingOrder.status === "cancelled") {
    return NextResponse.json({ error: "Stornovanou objednávku nelze označit jako hotovou." }, { status: 409 });
  }

  if (existingOrder.status === "done") {
    return NextResponse.redirect(new URL(`/admin/objednavky/${id}`, request.url));
  }

  if (existingOrder.status !== "confirmed") {
    return NextResponse.json({ error: "Jako hotovou lze označit jen potvrzenou objednávku." }, { status: 409 });
  }

  const order = await updateOrderStatus(id, "done");
  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  await appendOrderEvent({
    orderId: order.id,
    eventType: "status_done",
    payload: {
      fromStatus: existingOrder.status,
      by: auth.session.user.email,
    },
  });

  return NextResponse.redirect(new URL(`/admin/objednavky/${id}`, request.url));
}
