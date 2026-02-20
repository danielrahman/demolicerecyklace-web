import { NextResponse } from "next/server";

import { getByIco, searchByName } from "@/lib/services/company-lookup";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ico = (url.searchParams.get("ico") ?? "").trim();
  const query = (url.searchParams.get("query") ?? "").trim();

  if (!ico && !query) {
    return NextResponse.json(
      { error: "Zadejte parametr ico nebo query." },
      { status: 400 },
    );
  }

  if (ico) {
    const match = await getByIco(ico);
    return NextResponse.json({
      match: match ?? undefined,
      suggestions: [],
    });
  }

  if (query.length < 2) {
    return NextResponse.json({
      suggestions: [],
    });
  }

  const suggestions = await searchByName(query);
  return NextResponse.json({
    suggestions,
  });
}
