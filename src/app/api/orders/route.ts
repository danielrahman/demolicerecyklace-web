import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getContainerOrderWasteTypeById } from "@/lib/container-order-source";
import { createOrder } from "@/lib/order-store";
import { estimatePrice } from "@/lib/pricing";
import {
  sendCustomerReceivedEmail,
  sendInternalNewOrderEmail,
} from "@/lib/email";
import { createOrderSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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

    const order = createOrder({
      ...parsed,
      priceEstimate,
      source: "web",
    });

    await Promise.allSettled([
      sendCustomerReceivedEmail(order),
      sendInternalNewOrderEmail(order),
    ]);

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
