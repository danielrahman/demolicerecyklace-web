import { Resend } from "resend";

import type { CallbackRequest } from "@/lib/callback-request-store";
import { getContainerOrderWasteTypeById } from "@/lib/container-order-source";
import {
  buildCallbackRequestTemplate,
  buildCustomerCancelledTemplate,
  buildCustomerConfirmedTemplate,
  buildCustomerReceivedTemplate,
  buildInternalNewOrderTemplate,
  buildInternalStatusTemplate,
} from "@/lib/email-templates";
import type { ContainerOrder } from "@/lib/types";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export type EmailDeliveryStatus = {
  attempted: boolean;
  success: boolean;
  reason: "sent" | "skipped_missing_resend_api_key" | "provider_error";
  providerMessageId?: string;
  error?: string;
};

function fromAddress() {
  return process.env.EMAIL_FROM ?? "noreply@example.com";
}

function internalAddress() {
  return process.env.EMAIL_INTERNAL_TO ?? "dispatch@example.com";
}

async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<EmailDeliveryStatus> {
  if (!resend) {
    return {
      attempted: false,
      success: false,
      reason: "skipped_missing_resend_api_key",
    };
  }

  try {
    const result = (await resend.emails.send({
      from: fromAddress(),
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    })) as {
      data?: { id?: string | null } | null;
      error?: { message?: string | null } | null;
    };

    const providerError = result?.error?.message?.trim();
    if (providerError) {
      return {
        attempted: true,
        success: false,
        reason: "provider_error",
        error: providerError,
      };
    }

    return {
      attempted: true,
      success: true,
      reason: "sent",
      providerMessageId: result?.data?.id ?? undefined,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown email provider error";
    return {
      attempted: true,
      success: false,
      reason: "provider_error",
      error: errorMessage,
    };
  }
}

export async function sendCustomerReceivedEmail(order: ContainerOrder): Promise<EmailDeliveryStatus> {
  const template = buildCustomerReceivedTemplate(order);

  return sendEmail({
    to: order.email,
    ...template,
  });
}

export async function sendInternalNewOrderEmail(order: ContainerOrder): Promise<EmailDeliveryStatus> {
  const wasteType = await getContainerOrderWasteTypeById(order.wasteType);
  const template = buildInternalNewOrderTemplate(order, wasteType ? wasteType.label : order.wasteType);

  return sendEmail({
    to: internalAddress(),
    ...template,
  });
}

export async function sendCustomerConfirmedEmail(
  order: ContainerOrder,
  mode: "confirmed" | "rescheduled" = "confirmed",
): Promise<EmailDeliveryStatus> {
  if (!order.deliveryDateConfirmed || !order.timeWindowConfirmed) {
    return {
      attempted: false,
      success: false,
      reason: "provider_error",
      error: "Chybí potvrzený termín nebo časové okno.",
    };
  }
  const template = buildCustomerConfirmedTemplate(order, mode);

  return sendEmail({
    to: order.email,
    ...template,
  });
}

export async function sendCustomerCancelledEmail(order: ContainerOrder): Promise<EmailDeliveryStatus> {
  const template = buildCustomerCancelledTemplate(order);

  return sendEmail({
    to: order.email,
    ...template,
  });
}

export async function sendInternalStatusEmail(
  order: ContainerOrder,
  mode: "confirmed" | "rescheduled" | "cancelled",
): Promise<EmailDeliveryStatus> {
  const template = buildInternalStatusTemplate(order, mode);

  return sendEmail({
    to: internalAddress(),
    ...template,
  });
}

export async function sendCallbackRequestEmail(callbackRequest: CallbackRequest): Promise<EmailDeliveryStatus> {
  const template = buildCallbackRequestTemplate(callbackRequest);

  return sendEmail({
    to: internalAddress(),
    ...template,
  });
}
