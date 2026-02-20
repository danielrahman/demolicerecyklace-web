import { NextResponse } from "next/server";

import { rescheduleOrder } from "@/lib/order-store";
import { sendCustomerConfirmedEmail, sendInternalStatusEmail } from "@/lib/email";
import type { TimeWindow } from "@/lib/types";

const validWindows = new Set<TimeWindow>(["rano", "dopoledne", "odpoledne"]);

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const formData = await request.formData();
  const date = String(formData.get("date") ?? "");
  const window = String(formData.get("window") ?? "") as TimeWindow;

  if (!date || !validWindows.has(window)) {
    return NextResponse.json({ error: "Neplatný termín" }, { status: 400 });
  }

  const order = rescheduleOrder(id, date, window);

  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  await Promise.allSettled([
    sendCustomerConfirmedEmail(order, "rescheduled"),
    sendInternalStatusEmail(order, "rescheduled"),
  ]);

  return NextResponse.redirect(new URL(`/admin/objednavky/${id}`, request.url));
}
