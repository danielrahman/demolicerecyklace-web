import type { ContainerOrder, OrderStatus, TimeWindow } from "@/lib/types";
import {
  cancelOrderInDb,
  confirmOrderInDb,
  createOrderInDb,
  getOrderFromDb,
  listOrdersFromDb,
  rescheduleOrderInDb,
  setInternalNoteInDb,
  updateOrderStatusInDb,
} from "@/server/db/repositories/orders";

function generateOrderId() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export async function createOrder(order: Omit<ContainerOrder, "id" | "createdAt" | "status">) {
  const next: ContainerOrder = {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    status: "new",
    ...order,
  };

  return createOrderInDb(next);
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

export async function rescheduleOrder(id: string, confirmedDate: string, confirmedWindow: TimeWindow) {
  return rescheduleOrderInDb(id, confirmedDate, confirmedWindow);
}

export async function setInternalNote(id: string, note: string) {
  return setInternalNoteInDb(id, note);
}

export async function cancelOrder(id: string, reason: string) {
  return cancelOrderInDb(id, reason);
}
