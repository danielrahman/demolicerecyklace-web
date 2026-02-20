import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { addCallbackRequest } from "@/lib/callback-request-store";
import { sendCallbackRequestEmail } from "@/lib/email";
import { consumeCallbackSubmitRateLimit } from "@/lib/security/rate-limit";
import { callbackRequestSchema } from "@/lib/validators";

const CALLBACK_ETA_MINUTES = 15;

export async function POST(request: Request) {
  try {
    const rateLimit = await consumeCallbackSubmitRateLimit(request);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Příliš mnoho požadavků na zpětné zavolání. Zkuste to prosím znovu později.",
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = callbackRequestSchema.parse(body);

    if (parsed.website) {
      return NextResponse.json(
        {
          error: "Požadavek na zpětné zavolání se nepodařilo odeslat. Zkuste to prosím znovu.",
        },
        { status: 400 },
      );
    }

    const callbackRequest = await addCallbackRequest({
      phone: parsed.phone,
      name: parsed.name || undefined,
      email: parsed.email || undefined,
      preferredCallTime: parsed.preferredCallTime || undefined,
      note: parsed.note || undefined,
      wizardSnapshot: parsed.wizardSnapshot,
    });

    const emailResult = await sendCallbackRequestEmail(callbackRequest);
    if (!emailResult.success) {
      console.error("Callback email dispatch failed", {
        callbackRequestId: callbackRequest.id,
        reason: emailResult.reason,
        error: emailResult.error,
      });
    }

    return NextResponse.json({
      ok: true,
      requestId: callbackRequest.id,
      etaMinutes: CALLBACK_ETA_MINUTES,
      emailDispatched: emailResult.success,
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
