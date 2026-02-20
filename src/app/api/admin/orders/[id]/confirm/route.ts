import { NextResponse } from "next/server";

import { confirmOrder } from "@/lib/order-store";
import { sendCustomerConfirmedEmail, sendInternalStatusEmail } from "@/lib/email";
import type { TimeWindow } from "@/lib/types";
import { TIME_WINDOW_VALUES } from "@/lib/time-windows";

const validWindows = new Set<TimeWindow>(TIME_WINDOW_VALUES);

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const formData = await request.formData();
  const date = String(formData.get("date") ?? "");
  const window = String(formData.get("window") ?? "") as TimeWindow;

  if (!date || !validWindows.has(window)) {
    return NextResponse.json({ error: "Neplatný termín" }, { status: 400 });
  }

  const order = confirmOrder(id, date, window);

  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  await Promise.allSettled([sendCustomerConfirmedEmail(order, "confirmed"), sendInternalStatusEmail(order, "confirmed")]);

  return NextResponse.redirect(new URL(`/admin/objednavky/${id}`, request.url));
}
