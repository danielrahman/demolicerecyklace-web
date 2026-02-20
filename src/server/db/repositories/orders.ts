import { desc, eq } from "drizzle-orm";

import type { ContainerOrder, OrderStatus, TimeWindow } from "@/lib/types";
import { db } from "@/server/db/client";
import { containerOrders } from "@/server/db/schema";

type ContainerOrderRow = typeof containerOrders.$inferSelect;
type ContainerOrderInsert = typeof containerOrders.$inferInsert;

const EMPTY_EXTRAS: ContainerOrder["extras"] = {
  nakladkaOdNas: false,
  expresniPristaveni: false,
  opakovanyOdvoz: false,
};

const EMPTY_PRICE_ESTIMATE: ContainerOrder["priceEstimate"] = {
  rentalDays: 1,
  base: 0,
  transport: 0,
  surcharge: 0,
  total: 0,
  currency: "CZK",
};

function asIsoString(value: Date | string | null | undefined) {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return fallback;
    }

    return parsed as T;
  } catch {
    return fallback;
  }
}

function mapRowToOrder(row: ContainerOrderRow): ContainerOrder {
  const extras = parseJson<ContainerOrder["extras"]>(row.extras, EMPTY_EXTRAS);
  const priceEstimate = parseJson<ContainerOrder["priceEstimate"]>(row.priceEstimate, EMPTY_PRICE_ESTIMATE);
  const deliveryFlexibilityDays =
    row.deliveryFlexibilityDays === 1 || row.deliveryFlexibilityDays === 2 || row.deliveryFlexibilityDays === 3
      ? row.deliveryFlexibilityDays
      : undefined;
  const deliveryDateEndRequested = row.deliveryDateEndRequested ?? undefined;
  const timeWindowConfirmed = (row.timeWindowConfirmed ?? undefined) as TimeWindow | undefined;

  return {
    id: row.id,
    createdAt: asIsoString(row.createdAt),
    status: row.status as OrderStatus,
    customerType: row.customerType as ContainerOrder["customerType"],
    name: row.name,
    companyName: row.companyName ?? undefined,
    ico: row.ico ?? undefined,
    dic: row.dic ?? undefined,
    email: row.email,
    phone: row.phone,
    postalCode: row.postalCode,
    city: row.city,
    street: row.street,
    houseNumber: row.houseNumber,
    pinLocation:
      row.pinLat === null || row.pinLng === null
        ? undefined
        : {
            lat: row.pinLat,
            lng: row.pinLng,
          },
    wasteType: row.wasteType,
    containerSizeM3: 3,
    containerCount: row.containerCount,
    rentalDays: row.rentalDays,
    deliveryDateRequested: row.deliveryDateRequested,
    deliveryDateEndRequested,
    deliveryFlexibilityDays,
    timeWindowRequested: row.timeWindowRequested as TimeWindow,
    deliveryDateConfirmed: row.deliveryDateConfirmed ?? undefined,
    timeWindowConfirmed,
    placementType: row.placementType as ContainerOrder["placementType"],
    permitConfirmed: row.permitConfirmed,
    extras,
    priceEstimate,
    note: row.note ?? undefined,
    callbackNote: row.callbackNote ?? undefined,
    internalNote: row.internalNote ?? undefined,
    cancelReason: row.cancelReason ?? undefined,
    cancelledAt: row.cancelledAt ? asIsoString(row.cancelledAt) : undefined,
    gdprConsent: row.gdprConsent,
    marketingConsent: row.marketingConsent,
    source: "web",
  };
}

function mapOrderToInsert(order: ContainerOrder): ContainerOrderInsert {
  return {
    id: order.id,
    createdAt: new Date(order.createdAt),
    status: order.status,
    customerType: order.customerType,
    name: order.name,
    companyName: order.companyName ?? null,
    ico: order.ico ?? null,
    dic: order.dic ?? null,
    email: order.email,
    phone: order.phone,
    postalCode: order.postalCode,
    city: order.city,
    street: order.street,
    houseNumber: order.houseNumber,
    pinLat: order.pinLocation?.lat ?? null,
    pinLng: order.pinLocation?.lng ?? null,
    wasteType: order.wasteType,
    containerSizeM3: order.containerSizeM3,
    containerCount: order.containerCount,
    rentalDays: order.rentalDays,
    deliveryDateRequested: order.deliveryDateRequested,
    deliveryDateEndRequested: order.deliveryDateEndRequested ?? null,
    deliveryFlexibilityDays: order.deliveryFlexibilityDays ?? null,
    timeWindowRequested: order.timeWindowRequested,
    deliveryDateConfirmed: order.deliveryDateConfirmed ?? null,
    timeWindowConfirmed: order.timeWindowConfirmed ?? null,
    placementType: order.placementType,
    permitConfirmed: order.permitConfirmed,
    extras: JSON.stringify(order.extras),
    priceEstimate: JSON.stringify(order.priceEstimate),
    note: order.note ?? null,
    callbackNote: order.callbackNote ?? null,
    internalNote: order.internalNote ?? null,
    cancelReason: order.cancelReason ?? null,
    cancelledAt: order.cancelledAt ? new Date(order.cancelledAt) : null,
    gdprConsent: order.gdprConsent,
    marketingConsent: order.marketingConsent,
    source: order.source,
  };
}

export async function createOrderInDb(order: ContainerOrder) {
  const [created] = await db.insert(containerOrders).values(mapOrderToInsert(order)).returning();
  return mapRowToOrder(created);
}

export async function listOrdersFromDb(status?: OrderStatus) {
  const rows = status
    ? await db
        .select()
        .from(containerOrders)
        .where(eq(containerOrders.status, status))
        .orderBy(desc(containerOrders.createdAt))
    : await db
        .select()
        .from(containerOrders)
        .orderBy(desc(containerOrders.createdAt));
  return rows.map(mapRowToOrder);
}

export async function getOrderFromDb(id: string) {
  const [row] = await db.select().from(containerOrders).where(eq(containerOrders.id, id)).limit(1);
  return row ? mapRowToOrder(row) : null;
}

export async function updateOrderStatusInDb(id: string, status: OrderStatus) {
  const [row] = await db
    .update(containerOrders)
    .set({ status })
    .where(eq(containerOrders.id, id))
    .returning();

  return row ? mapRowToOrder(row) : null;
}

export async function confirmOrderInDb(id: string, confirmedDate: string, confirmedWindow: TimeWindow) {
  const [row] = await db
    .update(containerOrders)
    .set({
      deliveryDateConfirmed: confirmedDate,
      timeWindowConfirmed: confirmedWindow,
      status: "confirmed",
      cancelReason: null,
      cancelledAt: null,
    })
    .where(eq(containerOrders.id, id))
    .returning();

  return row ? mapRowToOrder(row) : null;
}

export async function rescheduleOrderInDb(
  id: string,
  changes: {
    confirmedDate: string;
    confirmedWindow: TimeWindow;
    deliveryDateRequested: string;
    deliveryDateEndRequested: string;
    timeWindowRequested: TimeWindow;
    rentalDays: number;
    priceEstimate: ContainerOrder["priceEstimate"];
  },
) {
  const [row] = await db
    .update(containerOrders)
    .set({
      deliveryDateConfirmed: changes.confirmedDate,
      timeWindowConfirmed: changes.confirmedWindow,
      deliveryDateRequested: changes.deliveryDateRequested,
      deliveryDateEndRequested: changes.deliveryDateEndRequested,
      timeWindowRequested: changes.timeWindowRequested,
      rentalDays: changes.rentalDays,
      priceEstimate: JSON.stringify(changes.priceEstimate),
      status: "confirmed",
      cancelReason: null,
      cancelledAt: null,
    })
    .where(eq(containerOrders.id, id))
    .returning();

  return row ? mapRowToOrder(row) : null;
}

export async function setInternalNoteInDb(id: string, note: string) {
  const [row] = await db
    .update(containerOrders)
    .set({
      internalNote: note,
    })
    .where(eq(containerOrders.id, id))
    .returning();

  return row ? mapRowToOrder(row) : null;
}

export async function setOrderPriceEstimateInDb(id: string, priceEstimate: ContainerOrder["priceEstimate"]) {
  const [row] = await db
    .update(containerOrders)
    .set({
      priceEstimate: JSON.stringify(priceEstimate),
    })
    .where(eq(containerOrders.id, id))
    .returning();

  return row ? mapRowToOrder(row) : null;
}

export async function updateOrderLocationInDb(
  id: string,
  location: {
    postalCode: string;
    city: string;
    street: string;
    houseNumber: string;
    pinLocation?: ContainerOrder["pinLocation"];
  },
) {
  const [row] = await db
    .update(containerOrders)
    .set({
      postalCode: location.postalCode,
      city: location.city,
      street: location.street,
      houseNumber: location.houseNumber,
      pinLat: location.pinLocation?.lat ?? null,
      pinLng: location.pinLocation?.lng ?? null,
    })
    .where(eq(containerOrders.id, id))
    .returning();

  return row ? mapRowToOrder(row) : null;
}

export async function cancelOrderInDb(id: string, reason: string) {
  const existing = await getOrderFromDb(id);
  if (!existing) return null;

  const reasonLine = `Storno důvod: ${reason.trim()}`;
  const existingNote = existing.internalNote?.trim();
  const internalNote = reason.trim()
    ? existingNote
      ? `${existingNote}\n${reasonLine}`
      : reasonLine
    : existing.internalNote;

  const [row] = await db
    .update(containerOrders)
    .set({
      status: "cancelled",
      cancelReason: reason,
      cancelledAt: new Date(),
      internalNote: internalNote ?? null,
    })
    .where(eq(containerOrders.id, id))
    .returning();

  return row ? mapRowToOrder(row) : null;
}
