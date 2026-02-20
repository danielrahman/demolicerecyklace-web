import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/guards";
import { getOrder } from "@/lib/order-store";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;
  const order = await getOrder(id);

  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
