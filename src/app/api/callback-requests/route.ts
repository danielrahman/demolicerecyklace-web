import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { addCallbackRequest } from "@/lib/callback-request-store";
import { sendCallbackRequestEmail } from "@/lib/email";
import { callbackRequestSchema } from "@/lib/validators";

const CALLBACK_ETA_MINUTES = 15;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = callbackRequestSchema.parse(body);

    const callbackRequest = addCallbackRequest({
      phone: parsed.phone,
      name: parsed.name || undefined,
      email: parsed.email || undefined,
      preferredCallTime: parsed.preferredCallTime || undefined,
      note: parsed.note || undefined,
      wizardSnapshot: parsed.wizardSnapshot,
    });

    await Promise.allSettled([sendCallbackRequestEmail(callbackRequest)]);

    return NextResponse.json({
      ok: true,
      requestId: callbackRequest.id,
      etaMinutes: CALLBACK_ETA_MINUTES,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Vyplňte prosím platné telefonní číslo. Ostatní pole jsou volitelná.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Požadavek na zpětné zavolání se nepodařilo odeslat. Zkuste to prosím znovu.",
      },
      { status: 400 },
    );
  }
}
