import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/guards";
import { getContainerOrderWasteTypeById } from "@/lib/container-order-source";
import { formatIsoLocalDate, parseIsoLocalDate, validateDeliveryDateRequested } from "@/lib/delivery-date";
import { sendCustomerConfirmedEmail, sendInternalStatusEmail } from "@/lib/email";
import { getOrder, rescheduleOrder } from "@/lib/order-store";
import { estimatePrice } from "@/lib/pricing";
import type { TimeWindow } from "@/lib/types";
import { appendOrderEvent } from "@/server/db/repositories/order-events";

const rentalDaysMin = 1;
const rentalDaysMax = 10;
const hourlyTimeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

function addDays(value: Date, days: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
}

function calculateDeliveryDateEndRequested(startIso: string, rentalDays: number) {
  const startDate = parseIsoLocalDate(startIso);
  if (!startDate) return "";
  return formatIsoLocalDate(addDays(startDate, rentalDays - 1));
}

function formatHoursMinutes(totalMinutes: number) {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function createQuarterHourWindow(windowStartRaw: string): TimeWindow | null {
  const match = hourlyTimeRegex.exec(windowStartRaw.trim());
  if (!match) return null;

  const startHour = Number(match[1]);
  const startMinute = Number(match[2]);
  const startTotalMinutes = startHour * 60 + startMinute;
  if (startTotalMinutes % 15 !== 0) return null;

  const endTotalMinutes = (startTotalMinutes + 15) % (24 * 60);
  const start = formatHoursMinutes(startTotalMinutes);
  const end = formatHoursMinutes(endTotalMinutes);

  return `${start}-${end}` as TimeWindow;
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;

  const formData = await request.formData();
  const date = String(formData.get("date") ?? "");
  const windowStart = String(formData.get("windowStart") ?? "").trim();
  const window = createQuarterHourWindow(windowStart);
  const rentalDaysRaw = Number(formData.get("rentalDays") ?? "");
  const rentalDays = Number.isInteger(rentalDaysRaw) ? rentalDaysRaw : NaN;
  const notifyCustomer = formData.get("notifyCustomer") === "on";

  const deliveryDateError = validateDeliveryDateRequested(date);
  if (deliveryDateError || !window) {
    return NextResponse.json(
      { error: "Neplatný termín. Začátek okna musí být po 15 minutách (např. 14:30)." },
      { status: 400 },
    );
  }

  if (!Number.isInteger(rentalDays) || rentalDays < rentalDaysMin || rentalDays > rentalDaysMax) {
    return NextResponse.json({ error: `Počet dní pronájmu musí být ${rentalDaysMin} až ${rentalDaysMax}.` }, { status: 400 });
  }

  const existingOrder = await getOrder(id);
  if (!existingOrder) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  if (existingOrder.status === "cancelled") {
    return NextResponse.json({ error: "Stornovanou objednávku nelze přeplánovat." }, { status: 409 });
  }

  const deliveryDateEndRequested = calculateDeliveryDateEndRequested(date, rentalDays);
  if (!deliveryDateEndRequested || validateDeliveryDateRequested(deliveryDateEndRequested)) {
    return NextResponse.json(
      { error: "Vybraný počet dní vychází na neplatné datum odvozu. Zvolte jiné datum nebo kratší pronájem." },
      { status: 400 },
    );
  }

  const wasteType = await getContainerOrderWasteTypeById(existingOrder.wasteType);
  if (!wasteType) {
    return NextResponse.json({ error: "Typ odpadu už není dostupný pro přepočet ceny." }, { status: 400 });
  }

  const recalculatedPriceEstimate = estimatePrice({
    basePriceCzk: wasteType.basePriceCzk,
    containerCount: existingOrder.containerCount,
    rentalDays,
    extras: existingOrder.extras,
  });

  const order = await rescheduleOrder(id, {
    confirmedDate: date,
    confirmedWindow: window,
    deliveryDateRequested: date,
    deliveryDateEndRequested,
    timeWindowRequested: window,
    rentalDays,
    priceEstimate: recalculatedPriceEstimate,
  });

  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  const customerResult = notifyCustomer
    ? (await Promise.allSettled([sendCustomerConfirmedEmail(order, "rescheduled")]))[0]
    : null;
  const internalResult = (await Promise.allSettled([sendInternalStatusEmail(order, "rescheduled")]))[0];

  await appendOrderEvent({
    orderId: order.id,
    eventType: "status_rescheduled",
    payload: {
      date,
      window,
      windowStart,
      deliveryDateEndRequested,
      rentalDays,
      notifyCustomer,
      by: auth.session.user.email,
    },
  });
  await appendOrderEvent({
    orderId: order.id,
    eventType: "emailed_customer_received",
    payload: {
      template: "rescheduled",
      skipped: !notifyCustomer,
      success: customerResult ? customerResult.status === "fulfilled" : null,
    },
  });
  await appendOrderEvent({
    orderId: order.id,
    eventType: "emailed_internal_new",
    payload: {
      template: "rescheduled",
      success: internalResult.status === "fulfilled",
    },
  });

  return NextResponse.redirect(new URL(`/admin/objednavky/${id}`, request.url));
}
