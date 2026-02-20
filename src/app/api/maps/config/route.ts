import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim() || "";

  return NextResponse.json(
    {
      apiKey,
      hasKey: Boolean(apiKey),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
