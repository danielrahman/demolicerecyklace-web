import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/guards";
import { sendCustomerCancelledEmail, sendInternalStatusEmail } from "@/lib/email";
import { cancelOrder, getOrder } from "@/lib/order-store";
import { appendOrderEvent } from "@/server/db/repositories/order-events";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;
  const formData = await request.formData();
  const reason = String(formData.get("reason") ?? "").trim();
  const notifyCustomer = formData.get("notifyCustomer") === "on";

  if (!reason) {
    return NextResponse.json({ error: "Vyplňte důvod storna" }, { status: 400 });
  }

  const existingOrder = await getOrder(id);
  if (!existingOrder) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  if (existingOrder.status !== "new" && existingOrder.status !== "confirmed") {
    return NextResponse.json({ error: "Stornovat lze jen přijatou nebo potvrzenou objednávku." }, { status: 409 });
  }

  const order = await cancelOrder(id, reason);

  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  const customerResult = notifyCustomer
    ? await sendCustomerCancelledEmail(order)
    : null;
  const internalResult = await sendInternalStatusEmail(order, "cancelled");

  await appendOrderEvent({
    orderId: order.id,
    eventType: "status_cancelled",
    payload: {
      reason,
      notifyCustomer,
      by: auth.session.user.email,
    },
  });
  await appendOrderEvent({
    orderId: order.id,
    eventType: "emailed_customer_received",
    payload: {
      template: "cancelled",
      skipped: !notifyCustomer,
      success: customerResult ? customerResult.success : null,
      attempted: customerResult ? customerResult.attempted : null,
      reason: customerResult?.reason ?? null,
      providerMessageId: customerResult?.providerMessageId ?? null,
      error: customerResult?.error ?? null,
    },
  });
  await appendOrderEvent({
    orderId: order.id,
    eventType: "emailed_internal_new",
    payload: {
      template: "cancelled",
      success: internalResult.success,
      attempted: internalResult.attempted,
      reason: internalResult.reason,
      providerMessageId: internalResult.providerMessageId,
      error: internalResult.error,
    },
  });

  return NextResponse.redirect(new URL(`/admin/objednavky/${id}`, request.url));
}
