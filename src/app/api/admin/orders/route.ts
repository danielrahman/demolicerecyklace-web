import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/guards";
import { listOrders } from "@/lib/order-store";
import type { OrderStatus } from "@/lib/types";

const validStatuses = new Set<OrderStatus>(["new", "confirmed", "done", "cancelled"]);

export async function GET(request: Request) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as OrderStatus | null;

  if (status && !validStatuses.has(status)) {
    return NextResponse.json({ error: "Neplatný stav" }, { status: 400 });
  }

  const orders = await listOrders(status ?? undefined);
  return NextResponse.json({ orders });
}
