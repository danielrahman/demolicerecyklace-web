import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/guards";
import { confirmOrder } from "@/lib/order-store";
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

  if (!date || !validWindows.has(window)) {
    return NextResponse.json({ error: "Neplatný termín" }, { status: 400 });
  }

  const order = await confirmOrder(id, date, window);

  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  const [customerResult, internalResult] = await Promise.allSettled([
    sendCustomerConfirmedEmail(order, "confirmed"),
    sendInternalStatusEmail(order, "confirmed"),
  ]);

  await appendOrderEvent({
    orderId: order.id,
    eventType: "status_confirmed",
    payload: {
      date,
      window,
      by: auth.session.user.email,
    },
  });
  await appendOrderEvent({
    orderId: order.id,
    eventType: "emailed_customer_received",
    payload: {
      template: "confirmed",
      success: customerResult.status === "fulfilled",
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
