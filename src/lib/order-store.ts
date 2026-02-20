import type { ContainerOrder, OrderStatus, TimeWindow } from "@/lib/types";

const globalStore = globalThis as unknown as {
  orders?: ContainerOrder[];
};

const orders = globalStore.orders ?? [];
globalStore.orders = orders;

function generateOrderId() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function createOrder(order: Omit<ContainerOrder, "id" | "createdAt" | "status">) {
  const next: ContainerOrder = {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    status: "new",
    ...order,
  };

  orders.unshift(next);
  return next;
}

export function listOrders(status?: OrderStatus) {
  if (!status) return orders;
  return orders.filter((order) => order.status === status);
}

export function getOrder(id: string) {
  return orders.find((order) => order.id === id) ?? null;
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const order = getOrder(id);
  if (!order) return null;
  order.status = status;
  return order;
}

export function confirmOrder(id: string, confirmedDate: string, confirmedWindow: TimeWindow) {
  const order = getOrder(id);
  if (!order) return null;

  order.deliveryDateConfirmed = confirmedDate;
  order.timeWindowConfirmed = confirmedWindow;
  order.status = "confirmed";

  return order;
}

export function rescheduleOrder(id: string, confirmedDate: string, confirmedWindow: TimeWindow) {
  const order = getOrder(id);
  if (!order) return null;

  order.deliveryDateConfirmed = confirmedDate;
  order.timeWindowConfirmed = confirmedWindow;

  if (order.status === "new") {
    order.status = "confirmed";
  }

  return order;
}

export function setInternalNote(id: string, note: string) {
  const order = getOrder(id);
  if (!order) return null;
  order.internalNote = note;
  return order;
}

export function cancelOrder(id: string, reason: string) {
  const order = getOrder(id);
  if (!order) return null;

  order.status = "cancelled";
  order.cancelReason = reason;
  order.cancelledAt = new Date().toISOString();

  if (reason.trim()) {
    const existingNote = order.internalNote?.trim();
    const reasonLine = `Storno důvod: ${reason.trim()}`;
    order.internalNote = existingNote ? `${existingNote}\n${reasonLine}` : reasonLine;
  }

  return order;
}
