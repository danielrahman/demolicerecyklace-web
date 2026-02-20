import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/guards";
import { setInternalNote } from "@/lib/order-store";
import { appendOrderEvent } from "@/server/db/repositories/order-events";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;

  const formData = await request.formData();
  const note = String(formData.get("note") ?? "");

  const order = await setInternalNote(id, note);

  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  await appendOrderEvent({
    orderId: order.id,
    eventType: "internal_note_updated",
    payload: {
      by: auth.session.user.email,
      length: note.trim().length,
    },
  });

  return NextResponse.redirect(new URL(`/admin/objednavky/${id}`, request.url));
}
