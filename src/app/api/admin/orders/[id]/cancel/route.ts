import { NextResponse } from "next/server";

import { sendCustomerCancelledEmail, sendInternalStatusEmail } from "@/lib/email";
import { cancelOrder } from "@/lib/order-store";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const formData = await request.formData();
  const reason = String(formData.get("reason") ?? "").trim();

  if (!reason) {
    return NextResponse.json({ error: "Vyplňte důvod storna" }, { status: 400 });
  }

  const order = cancelOrder(id, reason);

  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  await Promise.allSettled([sendCustomerCancelledEmail(order), sendInternalStatusEmail(order, "cancelled")]);

  return NextResponse.redirect(new URL(`/admin/objednavky/${id}`, request.url));
}
