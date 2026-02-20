import { randomBytes } from "node:crypto";

import type { ContainerOrder, OrderStatus, TimeWindow } from "@/lib/types";
import {
  cancelOrderInDb,
  confirmOrderInDb,
  createOrderInDb,
  getOrderFromDb,
  listOrdersFromDb,
  rescheduleOrderInDb,
  setInternalNoteInDb,
  setOrderPriceEstimateInDb,
  updateOrderLocationInDb,
  updateOrderStatusInDb,
} from "@/server/db/repositories/orders";

const ORDER_ID_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const ORDER_ID_DIGITS = "0123456789";

function generateOrderId() {
  const letterBytes = randomBytes(2);
  const digitBytes = randomBytes(2);
  const letters = `${ORDER_ID_LETTERS[letterBytes[0] % ORDER_ID_LETTERS.length]}${ORDER_ID_LETTERS[letterBytes[1] % ORDER_ID_LETTERS.length]}`;
  const digits = `${ORDER_ID_DIGITS[digitBytes[0] % ORDER_ID_DIGITS.length]}${ORDER_ID_DIGITS[digitBytes[1] % ORDER_ID_DIGITS.length]}`;
  return `OBJ-${letters}${digits}`;
}

function isUniqueConstraintError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  return "code" in error && (error as { code?: string }).code === "23505";
}

export async function createOrder(order: Omit<ContainerOrder, "id" | "createdAt" | "status">) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const next: ContainerOrder = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      status: "new",
      ...order,
    };

    try {
      return await createOrderInDb(next);
    } catch (error) {
      if (!isUniqueConstraintError(error)) {
        throw error;
      }
    }
  }

  throw new Error("Nepodařilo se vygenerovat unikátní ID objednávky.");
}

export async function listOrders(status?: OrderStatus) {
  return listOrdersFromDb(status);
}

export async function getOrder(id: string) {
  return getOrderFromDb(id);
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return updateOrderStatusInDb(id, status);
}

export async function confirmOrder(id: string, confirmedDate: string, confirmedWindow: TimeWindow) {
  return confirmOrderInDb(id, confirmedDate, confirmedWindow);
}

export async function rescheduleOrder(
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
  return rescheduleOrderInDb(id, changes);
}

export async function setInternalNote(id: string, note: string) {
  return setInternalNoteInDb(id, note);
}

export async function setOrderPriceEstimate(id: string, priceEstimate: ContainerOrder["priceEstimate"]) {
  return setOrderPriceEstimateInDb(id, priceEstimate);
}

export async function updateOrderLocation(
  id: string,
  location: {
    postalCode: string;
    city: string;
    street: string;
    houseNumber: string;
    pinLocation?: ContainerOrder["pinLocation"];
  },
) {
  return updateOrderLocationInDb(id, location);
}

export async function cancelOrder(id: string, reason: string) {
  return cancelOrderInDb(id, reason);
}
