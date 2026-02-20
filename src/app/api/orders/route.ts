import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getContainerOrderWasteTypeById } from "@/lib/container-order-source";
import { createOrder } from "@/lib/order-store";
import { estimatePrice } from "@/lib/pricing";
import { consumeOrderSubmitRateLimit } from "@/lib/security/rate-limit";
import { CONTACT } from "@/lib/site-config";
import {
  sendCustomerReceivedEmail,
  sendInternalNewOrderEmail,
} from "@/lib/email";
import { appendOrderEvent } from "@/server/db/repositories/order-events";
import { createOrderSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const rateLimit = await consumeOrderSubmitRateLimit(request);
    if (!rateLimit.allowed) {
      await appendOrderEvent({
        eventType: "rate_limited_rejected",
        payload: {
          key: rateLimit.key,
          count: rateLimit.count,
          limit: rateLimit.limit,
          resetAt: rateLimit.resetAt,
        },
      });

      return NextResponse.json(
        {
          error: `Dočasně jste překročili limit požadavků. Zkuste to prosím znovu později, nebo volejte ${CONTACT.phone}.`,
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const website = typeof body.website === "string" ? body.website.trim() : "";
    if (website) {
      await appendOrderEvent({
        eventType: "honeypot_rejected",
        payload: {
          key: rateLimit.key,
          website,
        },
      });

      return NextResponse.json(
        {
          error: "Objednávku se nepodařilo uložit. Zkuste to prosím znovu.",
        },
        { status: 400 },
      );
    }

    const parsed = createOrderSchema.parse(body);
    const wasteType = await getContainerOrderWasteTypeById(parsed.wasteType);

    if (!wasteType) {
      return NextResponse.json(
        {
          error: "Vybraný typ odpadu už není aktuální. Obnovte prosím stránku a vyberte položku znovu.",
        },
        { status: 400 },
      );
    }

    const priceEstimate = estimatePrice({
      basePriceCzk: wasteType.basePriceCzk,
      containerCount: parsed.containerCount,
      rentalDays: parsed.rentalDays,
      extras: parsed.extras,
    });

    const order = await createOrder({
      ...parsed,
      priceEstimate,
      source: "web",
    });

    await appendOrderEvent({
      orderId: order.id,
      eventType: "created",
      payload: {
        status: order.status,
        source: order.source,
      },
    });

    const [customerResult, internalResult] = await Promise.all([
      sendCustomerReceivedEmail(order),
      sendInternalNewOrderEmail(order),
    ]);

    await appendOrderEvent({
      orderId: order.id,
      eventType: "emailed_customer_received",
      payload: {
        success: customerResult.success,
        attempted: customerResult.attempted,
        reason: customerResult.reason,
        providerMessageId: customerResult.providerMessageId,
        error: customerResult.error,
      },
    });
    await appendOrderEvent({
      orderId: order.id,
      eventType: "emailed_internal_new",
      payload: {
        success: internalResult.success,
        attempted: internalResult.attempted,
        reason: internalResult.reason,
        providerMessageId: internalResult.providerMessageId,
        error: internalResult.error,
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Zkontrolujte prosím vyplněné údaje ve formuláři." }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: "Objednávku se nepodařilo uložit. Zkuste to prosím znovu.",
      },
      { status: 400 },
    );
  }
}
