import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/guards";
import { confirmOrder, getOrder } from "@/lib/order-store";
import { sendCustomerConfirmedEmail, sendInternalStatusEmail } from "@/lib/email";
import type { TimeWindow } from "@/lib/types";
import { appendOrderEvent } from "@/server/db/repositories/order-events";
import { TIME_WINDOW_VALUES } from "@/lib/time-windows";

const validWindows = new Set<TimeWindow>(TIME_WINDOW_VALUES);

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;

  const formData = await request.formData();
  const date = String(formData.get("date") ?? "");
  const window = String(formData.get("window") ?? "") as TimeWindow;
  const notifyCustomer = formData.get("notifyCustomer") === "on";

  if (!date || !validWindows.has(window)) {
    return NextResponse.json({ error: "Neplatný termín" }, { status: 400 });
  }

  const existingOrder = await getOrder(id);
  if (!existingOrder) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  if (existingOrder.status === "cancelled") {
    return NextResponse.json({ error: "Stornovanou objednávku nelze potvrdit." }, { status: 409 });
  }

  if (existingOrder.status !== "new") {
    return NextResponse.json({ error: "Potvrdit lze jen novou objednávku." }, { status: 409 });
  }

  const order = await confirmOrder(id, date, window);

  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  const customerResult = notifyCustomer
    ? (await Promise.allSettled([sendCustomerConfirmedEmail(order, "confirmed")]))[0]
    : null;
  const internalResult = (await Promise.allSettled([sendInternalStatusEmail(order, "confirmed")]))[0];

  await appendOrderEvent({
    orderId: order.id,
    eventType: "status_confirmed",
    payload: {
      date,
      window,
      notifyCustomer,
      by: auth.session.user.email,
    },
  });
  await appendOrderEvent({
    orderId: order.id,
    eventType: "emailed_customer_received",
    payload: {
      template: "confirmed",
      skipped: !notifyCustomer,
      success: customerResult ? customerResult.status === "fulfilled" : null,
    },
  });
  await appendOrderEvent({
    orderId: order.id,
    eventType: "emailed_internal_new",
    payload: {
      template: "confirmed",
      success: internalResult.status === "fulfilled",
    },
  });

  return NextResponse.redirect(new URL(`/admin/objednavky/${id}`, request.url));
}
