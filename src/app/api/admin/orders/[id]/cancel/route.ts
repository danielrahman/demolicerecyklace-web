import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/guards";
import { sendCustomerCancelledEmail, sendInternalStatusEmail } from "@/lib/email";
import { cancelOrder } from "@/lib/order-store";
import { appendOrderEvent } from "@/server/db/repositories/order-events";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;
  const formData = await request.formData();
  const reason = String(formData.get("reason") ?? "").trim();

  if (!reason) {
    return NextResponse.json({ error: "Vyplňte důvod storna" }, { status: 400 });
  }

  const order = await cancelOrder(id, reason);

  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  const [customerResult, internalResult] = await Promise.allSettled([
    sendCustomerCancelledEmail(order),
    sendInternalStatusEmail(order, "cancelled"),
  ]);

  await appendOrderEvent({
    orderId: order.id,
    eventType: "status_cancelled",
    payload: {
      reason,
      by: auth.session.user.email,
    },
  });
  await appendOrderEvent({
    orderId: order.id,
    eventType: "emailed_customer_received",
    payload: {
      template: "cancelled",
      success: customerResult.status === "fulfilled",
    },
  });
  await appendOrderEvent({
    orderId: order.id,
    eventType: "emailed_internal_new",
    payload: {
      template: "cancelled",
      success: internalResult.status === "fulfilled",
    },
  });

  return NextResponse.redirect(new URL(`/admin/objednavky/${id}`, request.url));
}
