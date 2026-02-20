import { NextResponse } from "next/server";

import { estimatePrice } from "@/lib/pricing";
import { pricingPreviewSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = pricingPreviewSchema.parse(body);

    const estimate = estimatePrice({
      wasteType: parsed.wasteType,
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
