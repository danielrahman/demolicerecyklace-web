import { NextResponse } from "next/server";

import { setInternalNote } from "@/lib/order-store";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const formData = await request.formData();
  const note = String(formData.get("note") ?? "");

  const order = setInternalNote(id, note);

  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  return NextResponse.redirect(new URL(`/admin/objednavky/${id}`, request.url));
}
