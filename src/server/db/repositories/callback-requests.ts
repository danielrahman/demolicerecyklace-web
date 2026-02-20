import { desc } from "drizzle-orm";

import type { CallbackRequest } from "@/lib/callback-request-store";
import { db } from "@/server/db/client";
import { callbackRequests } from "@/server/db/schema";

type CallbackRequestRow = typeof callbackRequests.$inferSelect;

function asIsoString(value: Date | string | null | undefined) {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function parseWizardSnapshot(value: string | null): Record<string, unknown> | undefined {
  if (!value) return undefined;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object") return undefined;
    return parsed as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

function mapRowToCallbackRequest(row: CallbackRequestRow): CallbackRequest {
  return {
    id: row.id,
    createdAt: asIsoString(row.createdAt),
    phone: row.phone,
    name: row.name ?? undefined,
    email: row.email ?? undefined,
    preferredCallTime: row.preferredCallTime ?? undefined,
    note: row.note ?? undefined,
    wizardSnapshot: parseWizardSnapshot(row.wizardSnapshot),
  };
}

export async function createCallbackRequestInDb(input: CallbackRequest) {
  const [created] = await db
    .insert(callbackRequests)
    .values({
      id: input.id,
      createdAt: new Date(input.createdAt),
      phone: input.phone,
      name: input.name ?? null,
      email: input.email ?? null,
      preferredCallTime: input.preferredCallTime ?? null,
      note: input.note ?? null,
      wizardSnapshot: input.wizardSnapshot ? JSON.stringify(input.wizardSnapshot) : null,
    })
    .returning();

  return mapRowToCallbackRequest(created);
}

export async function listCallbackRequestsFromDb(limit = 50) {
  const safeLimit = Math.max(1, Math.min(200, limit));
  const rows = await db
    .select()
    .from(callbackRequests)
    .orderBy(desc(callbackRequests.createdAt))
    .limit(safeLimit);

  return rows.map(mapRowToCallbackRequest);
}
