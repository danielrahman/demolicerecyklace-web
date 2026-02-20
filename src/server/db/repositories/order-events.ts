import { desc, eq } from "drizzle-orm";

import type { OrderEvent, OrderEventType } from "@/lib/types";
import { db } from "@/server/db/client";
import { orderEvents } from "@/server/db/schema";

type OrderEventRow = typeof orderEvents.$inferSelect;

function generateEventId() {
  return `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function parsePayload(payload: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(payload) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, unknown>;
  } catch {
    return {};
  }
}

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toEvent(row: OrderEventRow): OrderEvent {
  return {
    id: row.id,
    orderId: row.orderId ?? undefined,
    eventType: row.eventType as OrderEventType,
    payload: parsePayload(row.payload),
    createdAt: toIso(row.createdAt),
  };
}

export async function appendOrderEvent(input: {
  eventType: OrderEventType;
  orderId?: string | null;
  payload?: Record<string, unknown>;
}) {
  const [created] = await db
    .insert(orderEvents)
    .values({
      id: generateEventId(),
      orderId: input.orderId ?? null,
      eventType: input.eventType,
      payload: JSON.stringify(input.payload ?? {}),
      createdAt: new Date(),
    })
    .returning();

  return toEvent(created);
}

export async function listOrderEvents(orderId: string) {
  const rows = await db
    .select()
    .from(orderEvents)
    .where(eq(orderEvents.orderId, orderId))
    .orderBy(desc(orderEvents.createdAt));

  return rows.map(toEvent);
}
