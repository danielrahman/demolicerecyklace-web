import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { sanityRevalidateSecret } from "@/sanity/env";

type WebhookPayload = {
  _type?: string;
};

function isValidSecret(candidate: string | null, expectedSecret: string) {
  if (!candidate) {
    return false;
  }

  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expectedSecret);

  if (candidateBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateBuffer, expectedBuffer);
}

export async function POST(req: NextRequest) {
  try {
    if (!sanityRevalidateSecret) {
      return new Response("Missing environment variable SANITY_REVALIDATE_SECRET", { status: 500 });
    }

    let body: WebhookPayload | null = null;
    const querySecret = req.nextUrl.searchParams.get("secret");

    if (isValidSecret(querySecret, sanityRevalidateSecret)) {
      try {
        body = (await req.json()) as WebhookPayload;
      } catch {
        body = null;
      }
    } else {
      const parsed = await parseBody<WebhookPayload>(req, sanityRevalidateSecret);

      if (!parsed.isValidSignature) {
        return new Response(JSON.stringify({ message: "Invalid signature", isValidSignature: parsed.isValidSignature }), {
          status: 401,
        });
      }

      body = parsed.body;
    }

    const tags = new Set<string>(["sanity"]);

    if (body?._type) {
      tags.add(body._type);
    }

    for (const tag of tags) {
      revalidateTag(tag, "max");
    }

    return NextResponse.json({ revalidated: Array.from(tags) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown revalidation error";
    return new Response(message, { status: 500 });
  }
}
