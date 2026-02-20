import { NextResponse } from "next/server";

import { getContainerOrderWasteTypeById } from "@/lib/container-order-source";
import { estimatePrice } from "@/lib/pricing";
import { pricingPreviewSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = pricingPreviewSchema.parse(body);
    const wasteType = await getContainerOrderWasteTypeById(parsed.wasteType);

    if (!wasteType) {
      return NextResponse.json(
        {
          error: "Vybraný typ odpadu už není aktuální. Obnovte prosím stránku.",
        },
        { status: 400 },
      );
    }

    const estimate = estimatePrice({
      basePriceCzk: wasteType.basePriceCzk,
      containerCount: parsed.containerCount,
      rentalDays: parsed.rentalDays,
      extras: parsed.extras,
    });

    return NextResponse.json({ estimate });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Neplatná data",
      },
      { status: 400 },
    );
  }
}
