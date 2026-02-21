import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/guards";
import { getOrder, updateOrderLocation } from "@/lib/order-store";
import { isSupportedPostalCode } from "@/lib/service-area";
import { appendOrderEvent } from "@/server/db/repositories/order-events";

const postalCodeRegex = /^\d{5}$/;

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function hasLocationChanged(
  previous: { postalCode: string; city: string; street: string; houseNumber: string; pinLocation?: { lat: number; lng: number } },
  next: { postalCode: string; city: string; street: string; houseNumber: string; pinLocation?: { lat: number; lng: number } },
) {
  const pinChanged =
    (previous.pinLocation?.lat ?? null) !== (next.pinLocation?.lat ?? null)
    || (previous.pinLocation?.lng ?? null) !== (next.pinLocation?.lng ?? null);

  return (
    previous.postalCode !== next.postalCode
    || previous.city !== next.city
    || previous.street !== next.street
    || previous.houseNumber !== next.houseNumber
    || pinChanged
  );
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;
  const existingOrder = await getOrder(id);

  if (!existingOrder) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  if (existingOrder.status !== "new" && existingOrder.status !== "confirmed") {
    return NextResponse.json({ error: "Lokalitu lze upravovat jen u přijaté nebo potvrzené objednávky." }, { status: 409 });
  }

  const formData = await request.formData();

  const postalCode = String(formData.get("postalCode") ?? "").replace(/\D/g, "").slice(0, 5);
  const city = normalizeText(formData.get("city"));
  const street = normalizeText(formData.get("street"));
  const houseNumber = normalizeText(formData.get("houseNumber"));

  if (!postalCodeRegex.test(postalCode) || !isSupportedPostalCode(postalCode)) {
    return NextResponse.json({ error: "Neplatné nebo nepodporované PSČ." }, { status: 400 });
  }

  if (city.length < 2 || street.length < 2 || houseNumber.length < 1) {
    return NextResponse.json({ error: "Doplňte kompletní lokalitu (město, ulice, číslo popisné)." }, { status: 400 });
  }

  const pinLatRaw = normalizeText(formData.get("pinLat"));
  const pinLngRaw = normalizeText(formData.get("pinLng"));

  let pinLocation = existingOrder.pinLocation;
  const hasPinInput = pinLatRaw.length > 0 || pinLngRaw.length > 0;
  if (hasPinInput) {
    if (!pinLatRaw || !pinLngRaw) {
      return NextResponse.json({ error: "Neplatný bod na mapě lokality." }, { status: 400 });
    }

    const pinLat = Number(pinLatRaw);
    const pinLng = Number(pinLngRaw);
    const hasValidRange = Number.isFinite(pinLat) && Number.isFinite(pinLng) && Math.abs(pinLat) <= 90 && Math.abs(pinLng) <= 180;
    if (!hasValidRange) {
      return NextResponse.json({ error: "Neplatný bod na mapě lokality." }, { status: 400 });
    }

    pinLocation = {
      lat: Number(pinLat.toFixed(7)),
      lng: Number(pinLng.toFixed(7)),
    };
  }

  const order = await updateOrderLocation(id, {
    postalCode,
    city,
    street,
    houseNumber,
    pinLocation,
  });

  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  const locationChanged = hasLocationChanged(
    {
      postalCode: existingOrder.postalCode,
      city: existingOrder.city,
      street: existingOrder.street,
      houseNumber: existingOrder.houseNumber,
      pinLocation: existingOrder.pinLocation,
    },
    {
      postalCode: order.postalCode,
      city: order.city,
      street: order.street,
      houseNumber: order.houseNumber,
      pinLocation: order.pinLocation,
    },
  );

  await appendOrderEvent({
    orderId: order.id,
    eventType: "location_updated",
    payload: {
      by: auth.session.user.email,
      source: "manual_edit",
      locationChanged,
      previousLocation: {
        postalCode: existingOrder.postalCode,
        city: existingOrder.city,
        street: existingOrder.street,
        houseNumber: existingOrder.houseNumber,
        pinLocation: existingOrder.pinLocation ?? null,
      },
      nextLocation: {
        postalCode: order.postalCode,
        city: order.city,
        street: order.street,
        houseNumber: order.houseNumber,
        pinLocation: order.pinLocation ?? null,
      },
    },
  });

  return NextResponse.redirect(new URL(`/admin/objednavky/${id}`, request.url));
}
