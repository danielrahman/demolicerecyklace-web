import { Resend } from "resend";

import type { CallbackRequest } from "@/lib/callback-request-store";
import { getContainerOrderWasteTypeById } from "@/lib/container-order-source";
import { formatCzechDayCount } from "@/lib/czech";
import type { ContainerOrder } from "@/lib/types";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function fromAddress() {
  return process.env.EMAIL_FROM ?? "noreply@example.com";
}

function internalAddress() {
  return process.env.EMAIL_INTERNAL_TO ?? "dispatch@example.com";
}

function orderAddressLine(order: ContainerOrder) {
  return `${order.street} ${order.houseNumber}, ${order.city}, ${order.postalCode}`;
}

function confirmedTermLine(order: ContainerOrder) {
  if (!order.deliveryDateConfirmed || !order.timeWindowConfirmed) {
    return "Termín zatím není potvrzen.";
  }

  return `Termín: ${order.deliveryDateConfirmed}, okno ${order.timeWindowConfirmed}`;
}

function formatCurrency(czk: number) {
  return `${new Intl.NumberFormat("cs-CZ").format(czk)} Kč`;
}

function snapshotLine(snapshot?: Record<string, unknown>) {
  if (!snapshot) return "Snapshot: neposkytnut";

  const address = [snapshot.street, snapshot.houseNumber, snapshot.city, snapshot.postalCode]
    .filter((part) => typeof part === "string" && part.length > 0)
    .join(" ");

  const wasteType = typeof snapshot.wasteType === "string" ? snapshot.wasteType : "";
  const containerCount = typeof snapshot.containerCount === "number" ? snapshot.containerCount : null;
  const rentalDays = typeof snapshot.rentalDays === "number" ? snapshot.rentalDays : null;
  const deliveryFlexibilityDays =
    typeof snapshot.deliveryFlexibilityDays === "number" ? snapshot.deliveryFlexibilityDays : null;
  const deliveryDateRequested =
    typeof snapshot.deliveryDateRequested === "string" ? snapshot.deliveryDateRequested : "";
  const timeWindowRequested =
    typeof snapshot.timeWindowRequested === "string" ? snapshot.timeWindowRequested : "";

  return [
    address ? `Adresa: ${address}` : "",
    wasteType ? `Odpad: ${wasteType}` : "",
    containerCount ? `Počet kontejnerů: ${containerCount}` : "",
    rentalDays ? `Doba pronájmu: ${formatCzechDayCount(rentalDays)}` : "",
    deliveryFlexibilityDays ? `Flexibilita termínu: ±${formatCzechDayCount(deliveryFlexibilityDays)}` : "",
    deliveryDateRequested ? `Termín: ${deliveryDateRequested} (${timeWindowRequested || "bez okna"})` : "",
  ]
    .filter(Boolean)
    .join(" | ");
}

export async function sendCustomerReceivedEmail(order: ContainerOrder) {
  if (!resend) return;

  await resend.emails.send({
    from: fromAddress(),
    to: order.email,
    subject: `Objednávku ${order.id} jsme přijali`,
    text:
      `Děkujeme, objednávku ${order.id} jsme přijali.\n` +
      `Termín vám potvrdí operátor ručně.\n` +
      `Adresa přistavení: ${orderAddressLine(order)}\n` +
      `Požadovaný termín: ${order.deliveryDateRequested} (${order.timeWindowRequested})\n` +
      `Doba pronájmu: ${formatCzechDayCount(order.rentalDays)}` +
      (order.deliveryFlexibilityDays ? `\nFlexibilita termínu: ±${formatCzechDayCount(order.deliveryFlexibilityDays)}` : ""),
  });
}

export async function sendInternalNewOrderEmail(order: ContainerOrder) {
  if (!resend) return;
  const wasteType = await getContainerOrderWasteTypeById(order.wasteType);
  const wasteTypeLine = wasteType ? wasteType.label : order.wasteType;

  await resend.emails.send({
    from: fromAddress(),
    to: internalAddress(),
    subject: `Nová objednávka ${order.id}`,
    text:
      `Nová objednávka ${order.id}\n` +
      `Zákazník: ${order.name}\n` +
      `Kontakt: ${order.phone}, ${order.email}\n` +
      `Adresa: ${orderAddressLine(order)}\n` +
      (order.pinLocation ? `Pin: ${order.pinLocation.lat.toFixed(6)}, ${order.pinLocation.lng.toFixed(6)}\n` : "") +
      `Typ odpadu: ${wasteTypeLine}\n` +
      `Kontejner: ${order.containerSizeM3}m³, počet ${order.containerCount}\n` +
      `Doba pronájmu: ${formatCzechDayCount(order.rentalDays)}\n` +
      (order.deliveryFlexibilityDays ? `Flexibilita termínu: ±${formatCzechDayCount(order.deliveryFlexibilityDays)}\n` : "") +
      `Požadovaný termín: ${order.deliveryDateRequested} (${order.timeWindowRequested})\n` +
      `Orientační cena: ${formatCurrency(order.priceEstimate.total)}\n` +
      (order.callbackNote ? `Callback poznámka: ${order.callbackNote}\n` : ""),
  });
}

export async function sendCustomerConfirmedEmail(order: ContainerOrder, mode: "confirmed" | "rescheduled" = "confirmed") {
  if (!resend || !order.deliveryDateConfirmed || !order.timeWindowConfirmed) return;

  await resend.emails.send({
    from: fromAddress(),
    to: order.email,
    subject:
      mode === "confirmed"
        ? `Potvrzení termínu objednávky ${order.id}`
        : `Upravený termín objednávky ${order.id}`,
    text:
      (mode === "confirmed"
        ? "Termín objednávky byl potvrzen."
        : "Termín objednávky byl upraven.") +
      `\n${confirmedTermLine(order)}\n` +
      `Adresa přistavení: ${orderAddressLine(order)}`,
  });
}

export async function sendCustomerCancelledEmail(order: ContainerOrder) {
  if (!resend) return;

  await resend.emails.send({
    from: fromAddress(),
    to: order.email,
    subject: `Objednávka ${order.id} byla stornována`,
    text:
      `Objednávka ${order.id} byla stornována.\n` +
      `Důvod: ${order.cancelReason ?? "bez upřesnění"}.\n` +
      `Pokud chcete objednávku obnovit, kontaktujte dispečink.`,
  });
}

export async function sendInternalStatusEmail(
  order: ContainerOrder,
  mode: "confirmed" | "rescheduled" | "cancelled",
) {
  if (!resend) return;

  const subjectByMode = {
    confirmed: `Objednávka ${order.id} potvrzena`,
    rescheduled: `Objednávka ${order.id} přeplánována`,
    cancelled: `Objednávka ${order.id} stornována`,
  } as const;

  const detailByMode = {
    confirmed: confirmedTermLine(order),
    rescheduled: confirmedTermLine(order),
    cancelled: `Důvod storna: ${order.cancelReason ?? "bez upřesnění"}`,
  } as const;

  await resend.emails.send({
    from: fromAddress(),
    to: internalAddress(),
    subject: subjectByMode[mode],
    text:
      `Objednávka: ${order.id}\n` +
      `Stav: ${mode}\n` +
      `${detailByMode[mode]}\n` +
      `Zákazník: ${order.name}, ${order.phone}, ${order.email}\n` +
      `Adresa: ${orderAddressLine(order)}`,
  });
}

export async function sendCallbackRequestEmail(callbackRequest: CallbackRequest) {
  if (!resend) return;

  await resend.emails.send({
    from: fromAddress(),
    to: internalAddress(),
    subject: `Nový callback lead ${callbackRequest.id}`,
    text:
      `Callback lead: ${callbackRequest.id}\n` +
      `Vytvořeno: ${callbackRequest.createdAt}\n` +
      `Telefon: ${callbackRequest.phone}\n` +
      `Jméno: ${callbackRequest.name ?? "neuvedeno"}\n` +
      `E-mail: ${callbackRequest.email ?? "neuvedeno"}\n` +
      `Preferovaný čas hovoru: ${callbackRequest.preferredCallTime ?? "neuvedeno"}\n` +
      `Poznámka: ${callbackRequest.note ?? "bez poznámky"}\n` +
      `${snapshotLine(callbackRequest.wizardSnapshot)}`,
  });
}
