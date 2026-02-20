import { NextResponse } from "next/server";

import { CONTAINER_OPTIONS, WASTE_TYPES } from "@/lib/catalog";
import { PRAHA_POSTAL_CODES, STREDOCESKY_POSTAL_CODES } from "@/lib/service-area";

export async function GET() {
  return NextResponse.json({
    containerOptions: CONTAINER_OPTIONS,
    wasteTypes: WASTE_TYPES,
    serviceArea: {
      praha: PRAHA_POSTAL_CODES,
      stredocesky: STREDOCESKY_POSTAL_CODES,
    },
  });
}
