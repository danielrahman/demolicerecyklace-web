import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminOrderLocationEditor } from "@/components/admin-order-location-editor";
import { CopyOrderLink } from "@/components/copy-order-link";
import { AdminSignOutButton } from "@/components/admin-signout-button";
import { requireAdminPageSession } from "@/lib/auth/guards";
import { getContainerOrderWasteTypes } from "@/lib/container-order-source";
import { formatCzechDayCount } from "@/lib/czech";
import { parseIsoLocalDate } from "@/lib/delivery-date";
import { getOrder } from "@/lib/order-store";
import type { OrderEvent, OrderEventType, OrderStatus } from "@/lib/types";
import { cx, ui } from "@/lib/ui";
import { listOrderEvents } from "@/server/db/repositories/order-events";

const statusLabels: Record<OrderStatus, string> = {
  new: "Nová",
  confirmed: "Potvrzená",
  done: "Hotovo",
  cancelled: "Stornováno",
};

const statusBadgeClass: Record<OrderStatus, string> = {
  new: "admin-order-status admin-order-status--new",
  confirmed: "admin-order-status admin-order-status--confirmed",
  done: "admin-order-status admin-order-status--done",
  cancelled: "admin-order-status admin-order-status--cancelled",
};

const eventLabels: Record<OrderEventType, string> = {
  created: "Objednávka vytvořena",
  emailed_customer_received: "E-mail zákazníkovi",
  emailed_internal_new: "Interní e-mail",
  status_confirmed: "Objednávka potvrzena",
  status_rescheduled: "Termín upraven",
  status_done: "Objednávka dokončena",
  location_updated: "Lokalita upravena",
  status_cancelled: "Objednávka stornována",
  price_estimate_updated: "Orientační cena upravena",
  internal_note_updated: "Interní poznámka upravena",
  customer_updated: "Zákazník a kontakt upraven",
  order_params_updated: "Parametry objednávky upraveny",
  rate_limited_rejected: "Blokováno limitem požadavků",
  honeypot_rejected: "Blokováno ochranou proti robotům",
};

const workflowSteps: Array<{ status: OrderStatus; label: string }> = [
  { status: "new", label: "Přijatá" },
  { status: "confirmed", label: "Potvrzená" },
  { status: "done", label: "Hotovo" },
  { status: "cancelled", label: "Stornovaná" },
];

type WorkflowState = "active" | "done" | "upcoming";
type EventTone = "neutral" | "success" | "warning" | "danger";

const eventToneCardClass: Record<EventTone, string> = {
  neutral: "admin-order-event-card admin-order-event-card--neutral",
  success: "admin-order-event-card admin-order-event-card--success",
  warning: "admin-order-event-card admin-order-event-card--warning",
  danger: "admin-order-event-card admin-order-event-card--danger",
};

const eventToneDotClass: Record<EventTone, string> = {
  neutral: "bg-zinc-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

function formatAdminDate(value: string, options?: { includeYear?: boolean }) {
  const parsed = parseIsoLocalDate(value);
  if (!parsed) return value;

  const includeYear = options?.includeYear ?? true;
  const formatOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
  };

  if (includeYear) {
    formatOptions.year = "numeric";
  }

  return new Intl.DateTimeFormat("cs-CZ", {
    ...formatOptions,
  }).format(parsed);
}

function formatAdminDateRange(start: string, end?: string) {
  if (!end) return formatAdminDate(start);
  return `${formatAdminDate(start)} - ${formatAdminDate(end)}`;
}

function formatAdminDateCompact(value: string, fallbackYear?: number | null) {
  const parsed = parseIsoLocalDate(value);
  if (!parsed) return formatAdminDate(value);

  const currentYear = new Date().getFullYear();
  const shouldIncludeYear = parsed.getFullYear() !== currentYear || (typeof fallbackYear === "number" && fallbackYear !== parsed.getFullYear());
  return formatAdminDate(value, { includeYear: shouldIncludeYear });
}

function formatAdminDateRangeCompact(start: string, end?: string) {
  const startParsed = parseIsoLocalDate(start);
  if (!startParsed) return formatAdminDateRange(start, end);

  if (!end) {
    return formatAdminDateCompact(start);
  }

  const endParsed = parseIsoLocalDate(end);
  if (!endParsed) return formatAdminDateRange(start, end);

  return `${formatAdminDateCompact(start, endParsed.getFullYear())} - ${formatAdminDateCompact(end, startParsed.getFullYear())}`;
}

function formatAdminDateTime(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function formatCurrency(czk: number) {
  return `${new Intl.NumberFormat("cs-CZ").format(czk)} Kč`;
}

function getWindowStart(value?: string) {
  const source = String(value ?? "");
  const match = /^([01]\d|2[0-3]):([0-5]\d)/.exec(source);
  if (!match) return "08:00";
  return `${match[1]}:${match[2]}`;
}

function getWorkflowStepState(currentStatus: OrderStatus, stepStatus: OrderStatus): WorkflowState {
  if (currentStatus === "cancelled") {
    if (stepStatus === "cancelled") return "active";
    if (stepStatus === "new") return "done";
    return "upcoming";
  }

  if (stepStatus === "cancelled") return "upcoming";

  const ordered = ["new", "confirmed", "done"] as const;
  const currentIndex = ordered.indexOf(currentStatus as (typeof ordered)[number]);
  const stepIndex = ordered.indexOf(stepStatus as (typeof ordered)[number]);

  if (stepIndex === currentIndex) return "active";
  if (stepIndex < currentIndex) return "done";
  return "upcoming";
}

function workflowStepPillClass(state: WorkflowState) {
  if (state === "active") {
    return "admin-workflow-pill--active";
  }

  if (state === "done") {
    return "admin-workflow-pill--done";
  }

  return "admin-workflow-pill--upcoming";
}

function formatPlacementType(value: "soukromy" | "verejny") {
  return value === "verejny" ? "Veřejný pozemek" : "Soukromý pozemek";
}

function toRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function toStringValue(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return null;
}

function toNumberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function toBooleanValue(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function formatLocationPreview(value: unknown) {
  const location = toRecord(value);
  if (!location) return null;

  const street = toStringValue(location.street);
  const houseNumber = toStringValue(location.houseNumber);
  const city = toStringValue(location.city);
  const postalCode = toStringValue(location.postalCode);

  if (!street || !city) return null;

  const streetPart = houseNumber ? `${street} ${houseNumber}` : street;
  const cityPart = postalCode ? `${city}, ${postalCode}` : city;
  return `${streetPart}, ${cityPart}`;
}

function getEventTone(event: OrderEvent): EventTone {
  if (event.eventType === "status_cancelled") return "danger";
  if (event.eventType === "rate_limited_rejected" || event.eventType === "honeypot_rejected") return "warning";

  if (event.eventType === "emailed_customer_received" || event.eventType === "emailed_internal_new") {
    const skipped = toBooleanValue(event.payload.skipped);
    const success = toBooleanValue(event.payload.success);

    if (skipped) return "warning";
    if (success === false) return "danger";
    if (success === true) return "success";
    return "neutral";
  }

  if (event.eventType === "status_confirmed" || event.eventType === "status_rescheduled" || event.eventType === "status_done") {
    return "success";
  }

  return "neutral";
}

function getEventSummary(event: OrderEvent) {
  const payload = event.payload;

  if (event.eventType === "created") {
    const source = toStringValue(payload.source);
    return source ? `Zdroj objednávky: ${source}.` : "Objednávka byla úspěšně přijata.";
  }

  if (event.eventType === "status_confirmed") {
    const date = toStringValue(payload.date);
    const window = toStringValue(payload.window);
    if (date && window) return `Potvrzený termín: ${formatAdminDate(date)} (${window}).`;
    return "Termín byl potvrzen beze změny.";
  }

  if (event.eventType === "status_rescheduled") {
    const date = toStringValue(payload.date);
    const window = toStringValue(payload.window);
    const rentalDays = toNumberValue(payload.rentalDays);

    if (date && window && typeof rentalDays === "number") {
      return `Nový termín: ${formatAdminDate(date)} (${window}), pronájem ${formatCzechDayCount(rentalDays)}.`;
    }

    if (date && window) {
      return `Nový termín: ${formatAdminDate(date)} (${window}).`;
    }

    return "Termín objednávky byl upraven.";
  }

  if (event.eventType === "status_done") {
    return "Zakázka byla označena jako dokončená.";
  }

  if (event.eventType === "location_updated") {
    const locationLabel = formatLocationPreview(payload.nextLocation);
    return locationLabel ? `Nová lokalita: ${locationLabel}.` : "Byla upravena adresa nebo bod na mapě přistavení.";
  }

  if (event.eventType === "status_cancelled") {
    const reason = toStringValue(payload.reason);
    return reason ? `Důvod storna: ${reason}` : "Objednávka byla stornována.";
  }

  if (event.eventType === "price_estimate_updated") {
    const before = toRecord(payload.before);
    const after = toRecord(payload.after);
    const beforeTotal = toNumberValue(before?.total);
    const afterTotal = toNumberValue(after?.total);

    if (typeof beforeTotal === "number" && typeof afterTotal === "number") {
      return `Cena změněna z ${formatCurrency(beforeTotal)} na ${formatCurrency(afterTotal)}.`;
    }

    return "Orientační cena byla upravena.";
  }

  if (event.eventType === "internal_note_updated") {
    const length = toNumberValue(payload.length);
    if (typeof length === "number") {
      return `Poznámka byla aktualizována (${length} znaků).`;
    }

    return "Interní poznámka byla upravena.";
  }

  if (event.eventType === "customer_updated" || event.eventType === "order_params_updated") {
    const changedFields = toStringArray(payload.changedFields);
    if (changedFields.length > 0) {
      return `Změněno: ${changedFields.join(", ")}.`;
    }

    return "Údaje byly aktualizovány.";
  }

  if (event.eventType === "emailed_customer_received" || event.eventType === "emailed_internal_new") {
    const skipped = toBooleanValue(payload.skipped);
    const success = toBooleanValue(payload.success);
    const reason = toStringValue(payload.reason);

    if (skipped) {
      return "Odeslání e-mailu bylo přeskočeno.";
    }

    if (success === true) {
      return "E-mail byl úspěšně odeslán.";
    }

    if (success === false) {
      return reason ? `Odeslání se nezdařilo: ${reason}.` : "Odeslání e-mailu se nezdařilo.";
    }

    return "Stav odeslání e-mailu není znám.";
  }

  if (event.eventType === "rate_limited_rejected") {
    return "Požadavek byl zamítnut kvůli překročení limitu.";
  }

  if (event.eventType === "honeypot_rejected") {
    return "Požadavek byl označen jako podezřelý a zablokován.";
  }

  return null;
}

function PencilIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.86 3.22a1.9 1.9 0 0 1 2.69 0l1.23 1.23a1.9 1.9 0 0 1 0 2.69l-8.83 8.83-3.78.88.88-3.78 8.81-8.85Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m11.63 4.45 3.92 3.92" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPageSession();
  const { id } = await params;
  const order = await getOrder(id);
  const wasteTypes = order ? await getContainerOrderWasteTypes() : [];
  const wasteType = order ? wasteTypes.find((item) => item.id === order.wasteType) ?? null : null;
  const events = order ? await listOrderEvents(order.id) : [];

  if (!order) {
    notFound();
  }

  const isCancelled = order.status === "cancelled";
  const isDone = order.status === "done";
  const canConfirm = order.status === "new";
  const canMarkDone = order.status === "confirmed";
  const canEditOperational = order.status === "new" || order.status === "confirmed";
  const canEditCustomerAndParams = canEditOperational;
  const canReschedule = canEditOperational;
  const canCancelOrder = canEditOperational;
  const requestedTerm = `${formatAdminDateRangeCompact(order.deliveryDateRequested, order.deliveryDateEndRequested)} (${order.timeWindowRequested})`;
  const confirmedTerm =
    order.deliveryDateConfirmed && order.timeWindowConfirmed
      ? `${formatAdminDateCompact(order.deliveryDateConfirmed)} (${order.timeWindowConfirmed})`
      : "zatím nepotvrzen";

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/objednavky" className="text-sm text-zinc-400 underline">
          Zpět na seznam
        </Link>
        <AdminSignOutButton className="text-sm" />
      </div>

      <section className={cx(ui.card, "admin-order-summary p-3 sm:p-6")}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.16em] text-zinc-500">Detail objednávky</p>
            <h1 className="text-2xl font-bold text-zinc-100 sm:text-3xl">{order.id}</h1>
            <p className="text-sm text-zinc-400">Vytvořeno {formatAdminDateTime(order.createdAt)}</p>
          </div>
          <span className={cx("rounded-full border px-3 py-1 text-sm font-semibold", statusBadgeClass[order.status])}>
            {statusLabels[order.status]}
          </span>
        </div>

        {isCancelled ? (
          <div className="mt-4 rounded-xl border border-red-200/70 bg-red-50 p-3 text-sm text-red-900 dark:border-red-700/50 dark:bg-red-950/30 dark:text-red-100">
            <p className="font-semibold">Objednávka je stornovaná.</p>
            <p className="mt-1">U stornované objednávky lze jen založit novou kopii.</p>
            <p className="mt-2 text-sm text-red-700 dark:text-red-200/90">Důvod: {order.cancelReason ?? "storno"}</p>
          </div>
        ) : null}

        <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
          <div className="admin-order-detail-panel rounded-xl border p-2.5 sm:p-3">
            <p className="text-sm uppercase tracking-wide text-zinc-500">Požadovaný termín</p>
            <p className="mt-1 text-sm font-semibold text-zinc-100">{requestedTerm}</p>
          </div>
          <div className="admin-order-detail-panel rounded-xl border p-2.5 sm:p-3">
            <p className="text-sm uppercase tracking-wide text-zinc-500">Potvrzený termín</p>
            <p className="mt-1 text-sm font-semibold text-zinc-100">{confirmedTerm}</p>
          </div>
          <div className="admin-order-detail-panel rounded-xl border p-2.5 sm:p-3">
            <p className="text-sm uppercase tracking-wide text-zinc-500">Pronájem a množství</p>
            <p className="mt-1 text-sm font-semibold text-zinc-100">
              {formatCzechDayCount(order.rentalDays)} · {order.containerCount}x kontejner
            </p>
          </div>
          <div className="admin-order-detail-panel rounded-xl border p-2.5 sm:p-3">
            <p className="text-sm uppercase tracking-wide text-zinc-500">Orientační cena</p>
            <p className="mt-1 text-sm font-semibold text-zinc-100">{formatCurrency(order.priceEstimate.total)}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
          {workflowSteps.map((step) => {
            const stepState = getWorkflowStepState(order.status, step.status);
            return (
              <span key={step.status} className={cx("admin-workflow-pill rounded-full border px-2.5 py-1 text-sm font-semibold", workflowStepPillClass(stepState))}>
                {step.label}
              </span>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <div className="order-2 space-y-3 sm:space-y-4 xl:order-1">
          <section className={cx(ui.card, "p-3 sm:p-5")}>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">Zákazník a kontakt</h2>
              {canEditCustomerAndParams ? (
                <label
                  htmlFor={`admin-customer-edit-${order.id}`}
                  className="admin-operator-disclosure-icons cursor-pointer"
                >
                  <span className="admin-operator-disclosure-edit-label">Upravit</span>
                  <span className="admin-operator-disclosure-pencil">
                    <PencilIcon className="h-4 w-4" />
                  </span>
                </label>
              ) : null}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="admin-order-detail-panel rounded-xl border p-3">
                <p className="text-sm uppercase tracking-wide text-zinc-500">Firma / zákazník</p>
                <p className="mt-1 text-sm font-semibold text-zinc-100">{order.companyName || "Fyzická osoba"}</p>
                <p className="mt-1 text-sm text-zinc-400">{order.name}</p>
                {order.ico ? <p className="mt-2 text-sm text-zinc-400">IČO: {order.ico}</p> : null}
                {order.dic ? <p className="text-sm text-zinc-400">DIČ: {order.dic}</p> : null}
              </div>
              <div className="admin-order-detail-panel rounded-xl border p-3">
                <p className="text-sm uppercase tracking-wide text-zinc-500">Kontakt</p>
                <p className="mt-1 text-sm font-semibold text-zinc-100">{order.phone}</p>
                <p className="mt-1 text-sm text-zinc-300">{order.email}</p>
              </div>
            </div>

            {canEditCustomerAndParams ? (
              <>
                <input id={`admin-customer-edit-${order.id}`} type="checkbox" className="peer sr-only" />
                <form
                  action={`/api/admin/orders/${order.id}/customer`}
                  method="post"
                  className="admin-order-edit-card mt-3 hidden rounded-xl border peer-checked:block"
                >
                  <div className="admin-operator-disclosure-body border-t border-zinc-700/60 px-3 pb-3 pt-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
                        Jméno kontaktu
                        <input name="name" defaultValue={order.name} className={ui.field} required />
                      </label>
                      <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
                        Firma
                        <input name="companyName" defaultValue={order.companyName ?? ""} className={ui.field} />
                      </label>
                      <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
                        IČO
                        <input name="ico" defaultValue={order.ico ?? ""} className={ui.field} />
                      </label>
                      <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
                        DIČ
                        <input name="dic" defaultValue={order.dic ?? ""} className={ui.field} />
                      </label>
                      <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
                        Telefon
                        <input name="phone" defaultValue={order.phone} className={ui.field} required />
                      </label>
                      <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
                        E-mail
                        <input name="email" type="email" defaultValue={order.email} className={ui.field} required />
                      </label>
                    </div>
                    <button className={cx(ui.buttonSecondary, "mt-4 w-full sm:w-auto")} type="submit">
                      Uložit zákazníka
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <p className="mt-3 text-sm text-zinc-500">
                {isCancelled
                  ? "U stornované objednávky lze jen založit novou kopii."
                  : "Ve stavu Hotovo lze upravit jen cenu a interní poznámku."}
              </p>
            )}
          </section>

          <section className={cx(ui.card, "p-3 sm:p-5")}>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">Parametry objednávky</h2>
              {canEditCustomerAndParams ? (
                <label
                  htmlFor={`admin-params-edit-${order.id}`}
                  className="admin-operator-disclosure-icons cursor-pointer"
                >
                  <span className="admin-operator-disclosure-edit-label">Upravit</span>
                  <span className="admin-operator-disclosure-pencil">
                    <PencilIcon className="h-4 w-4" />
                  </span>
                </label>
              ) : null}
            </div>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-zinc-500">Typ odpadu</dt>
                <dd className="mt-1 text-zinc-100">{wasteType?.label ?? order.wasteType}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Počet kontejnerů</dt>
                <dd className="mt-1 text-zinc-100">{order.containerCount}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Požadovaný termín</dt>
                <dd className="mt-1 font-semibold text-zinc-100">{requestedTerm}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Potvrzený termín</dt>
                <dd className="mt-1 text-zinc-100">{confirmedTerm}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Doba pronájmu</dt>
                <dd className="mt-1 font-semibold text-zinc-100">{formatCzechDayCount(order.rentalDays)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Umístění</dt>
                <dd className="mt-1 text-zinc-100">{formatPlacementType(order.placementType)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Povolení</dt>
                <dd className="mt-1 text-zinc-100">{order.permitConfirmed ? "Potvrzeno" : "Nepotvrzeno"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Orientační cena</dt>
                <dd className="mt-1 text-zinc-100">{formatCurrency(order.priceEstimate.total)}</dd>
              </div>
            </dl>

            {order.note ? (
              <div className="admin-order-detail-panel mt-4 rounded-xl border p-3">
                <p className="text-sm uppercase tracking-wide text-zinc-500">Poznámka od zákazníka</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">{order.note}</p>
              </div>
            ) : null}

            {canEditCustomerAndParams ? (
              <>
                <input id={`admin-params-edit-${order.id}`} type="checkbox" className="peer sr-only" />
                <form
                  action={`/api/admin/orders/${order.id}/params`}
                  method="post"
                  className="admin-order-edit-card mt-3 hidden rounded-xl border peer-checked:block"
                >
                  <div className="admin-operator-disclosure-body border-t border-zinc-700/60 px-3 pb-3 pt-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
                        Typ odpadu
                        <select name="wasteType" defaultValue={order.wasteType} className={cx(ui.field, "appearance-none")} required>
                          {wasteTypes.length > 0 ? (
                            wasteTypes.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))
                          ) : (
                            <option value={order.wasteType}>{wasteType?.label ?? order.wasteType}</option>
                          )}
                        </select>
                      </label>
                      <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
                        Počet kontejnerů
                        <input name="containerCount" type="number" min={1} max={3} defaultValue={order.containerCount} className={ui.field} required />
                      </label>
                      <label className="flex flex-col gap-1.5 text-sm text-zinc-300">
                        Umístění
                        <select name="placementType" defaultValue={order.placementType} className={cx(ui.field, "appearance-none")} required>
                          <option value="soukromy">Soukromý pozemek</option>
                          <option value="verejny">Veřejný pozemek</option>
                        </select>
                      </label>
                      <label className="flex items-start gap-2 self-end text-sm text-zinc-300">
                        <input type="checkbox" name="permitConfirmed" defaultChecked={order.permitConfirmed} className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-900" />
                        Povolení k záboru potvrzeno
                      </label>
                    </div>
                    <button className={cx(ui.buttonSecondary, "mt-4 w-full sm:w-auto")} type="submit">
                      Uložit parametry
                    </button>
                  </div>
                </form>
              </>
            ) : null}
          </section>

          <AdminOrderLocationEditor
            orderId={order.id}
            orderStatus={order.status}
            initialLocation={{
              postalCode: order.postalCode,
              city: order.city,
              street: order.street,
              houseNumber: order.houseNumber,
            }}
            initialPin={order.pinLocation ?? null}
          />

          <section className={cx(ui.card, "p-3 sm:p-5")}>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">Historie objednávky</h2>
              <span className="text-sm text-zinc-500">{events.length} událostí</span>
            </div>

            {events.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-400">Zatím bez událostí.</p>
            ) : (
              <ul className="admin-order-timeline mt-3">
                {events.map((event) => {
                  const tone = getEventTone(event);
                  const summary = getEventSummary(event);
                  const hasPayload = Object.keys(event.payload).length > 0;

                  return (
                    <li key={event.id} className="admin-order-timeline-item">
                      <span className={cx("admin-order-timeline-dot", eventToneDotClass[tone])} />
                      <article className={cx("admin-order-timeline-card rounded-xl border p-3", eventToneCardClass[tone])}>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                          <p className="text-sm font-semibold text-zinc-100">{eventLabels[event.eventType] ?? event.eventType}</p>
                          <time className="shrink-0 text-sm text-zinc-500">{formatAdminDateTime(event.createdAt)}</time>
                        </div>

                        {summary ? <p className="mt-1.5 text-sm text-zinc-300">{summary}</p> : null}

                        {hasPayload ? (
                          <details className="admin-inline-disclosure mt-2">
                            <summary className="admin-inline-disclosure-summary inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-zinc-400">
                              Technický detail (JSON)
                              <ChevronDownIcon className="admin-inline-disclosure-chevron h-3.5 w-3.5" />
                            </summary>
                            <pre className="admin-order-event-json mt-2 overflow-auto whitespace-pre-wrap rounded-lg border p-2 text-[11px]">
                              {JSON.stringify(event.payload, null, 2)}
                            </pre>
                          </details>
                        ) : null}
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <aside className="order-1 space-y-3 sm:space-y-4 xl:order-2">
          <section className={cx(ui.card, "admin-operator-panel p-3 sm:p-5")}>
            <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">Akce operátora</h2>

            {isCancelled ? (
              <div className="mt-4 space-y-3">
                <div className="admin-operator-card admin-operator-card--danger rounded-xl border p-3.5 text-sm">
                  <p>Tato objednávka je stornovaná, proto lze založit jen novou kopii.</p>
                </div>
                <CopyOrderLink
                  href={`/kontejnery/objednat?copyOrder=${encodeURIComponent(order.id)}`}
                  className={cx(ui.buttonSecondary, "inline-flex w-full justify-center")}
                  order={order}
                >
                  Objednat další kontejner
                </CopyOrderLink>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {isDone ? (
                  <div className="admin-operator-card rounded-xl border p-3 text-sm">
                    <p className="font-semibold text-zinc-100">Objednávka je hotová.</p>
                    <p className="admin-operator-hint mt-1.5 text-sm">U hotové objednávky lze upravit jen orientační cenu a interní poznámku.</p>
                  </div>
                ) : null}

                {canMarkDone ? (
                  <form
                    action={`/api/admin/orders/${order.id}/done`}
                    method="post"
                    className="admin-operator-card admin-operator-card--success rounded-xl border p-3.5"
                  >
                    <h3 className="text-sm font-semibold">Označit jako hotové</h3>
                    <p className="admin-operator-hint mt-2 text-sm">Po dokončení realizace nastavte stav objednávky na hotovo.</p>
                    <button className="mt-4 w-full rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500" type="submit">
                      Označit jako hotové
                    </button>
                  </form>
                ) : null}

                {(canConfirm || canReschedule) ? (
                  <div className="admin-operator-card rounded-xl border p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-100">
                          {canConfirm ? "Potvrdit" : "Přeplánování termínu"}
                        </h3>
                        <p className="admin-operator-hint mt-1.5 text-sm">
                          {canConfirm
                            ? (
                              <>
                                <span className="block font-semibold">
                                  {requestedTerm}.
                                </span>
                                <span>
                                  Délka pronájmu: <span className="font-semibold">{formatCzechDayCount(order.rentalDays)}</span>.
                                </span>
                              </>
                            )
                            : "Upravte datum, časové okno nebo počet dní."}
                        </p>
                      </div>
                      {canConfirm || canReschedule ? (
                        <label
                          htmlFor={`admin-order-term-edit-${order.id}`}
                          className="admin-operator-disclosure-icons cursor-pointer"
                        >
                          <span className="admin-operator-disclosure-edit-label">Upravit</span>
                          <span className="admin-operator-disclosure-pencil">
                            <PencilIcon className="h-4 w-4" />
                          </span>
                        </label>
                      ) : null}
                    </div>

                    {canConfirm || canReschedule ? <input id={`admin-order-term-edit-${order.id}`} type="checkbox" className="peer sr-only" /> : null}

                    {canConfirm ? (
                      <form
                        action={`/api/admin/orders/${order.id}/confirm`}
                        method="post"
                        className={canReschedule ? "mt-3 peer-checked:hidden" : "mt-3"}
                      >
                        <label className="mt-3 flex items-start gap-2 text-sm text-zinc-300">
                          <input
                            type="checkbox"
                            name="notifyCustomer"
                            defaultChecked
                            className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-900"
                          />
                          Poslat zákazníkovi potvrzení termínu
                        </label>
                        <button className={cx(ui.buttonPrimary, "mt-4 w-full")} type="submit">
                          Potvrdit termín
                        </button>
                      </form>
                    ) : null}

                    {canReschedule ? (
                      <>
                        <form
                          action={`/api/admin/orders/${order.id}/reschedule`}
                          method="post"
                          className={canConfirm ? "mt-3 hidden peer-checked:block" : "mt-3 hidden peer-checked:block"}
                        >
                          <label className="mt-1 flex flex-col gap-2 text-sm text-zinc-300">
                            Nový termín přistavení
                            <input
                              name="date"
                              type="date"
                              defaultValue={order.deliveryDateConfirmed ?? order.deliveryDateRequested}
                              className={ui.field}
                              required
                            />
                          </label>
                          <label className="mt-3 flex flex-col gap-2 text-sm text-zinc-300">
                            Nový začátek okna (po 15 minutách)
                            <input
                              name="windowStart"
                              type="time"
                              step={900}
                              defaultValue={getWindowStart(order.timeWindowConfirmed ?? order.timeWindowRequested)}
                              className={ui.field}
                              required
                            />
                          </label>
                          <label className="mt-3 flex flex-col gap-2 text-sm text-zinc-300">
                            Nová doba pronájmu (dny)
                            <input
                              name="rentalDays"
                              type="number"
                              min={1}
                              max={10}
                              defaultValue={order.rentalDays}
                              className={ui.field}
                              required
                            />
                          </label>
                          <label className="mt-3 flex items-start gap-2 text-sm text-zinc-300">
                            <input
                              type="checkbox"
                              name="notifyCustomer"
                              defaultChecked
                              className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-900"
                            />
                            {canConfirm ? "Poslat zákazníkovi potvrzení termínu" : "Poslat zákazníkovi e-mail o přeplánování"}
                          </label>
                          <button className={cx(canConfirm ? ui.buttonPrimary : ui.buttonSecondary, "mt-4 w-full")} type="submit">
                            {canConfirm ? "Uložit a potvrdit" : "Uložit změny"}
                          </button>
                        </form>
                      </>
                    ) : null}
                  </div>
                ) : null}

                <form
                  action={`/api/admin/orders/${order.id}/price`}
                  method="post"
                  className="admin-operator-card rounded-xl border"
                >
                  <details className="admin-operator-disclosure group">
                    <summary className="admin-operator-disclosure-summary p-3.5">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-100">Orientační cena</h3>
                        <p className="admin-operator-hint mt-1.5 text-sm">Aktuálně: {formatCurrency(order.priceEstimate.total)}</p>
                      </div>
                      <span className="admin-operator-disclosure-icons">
                        <span className="admin-operator-disclosure-edit-label">Upravit</span>
                        <span className="admin-operator-disclosure-pencil">
                          <PencilIcon className="h-4 w-4" />
                        </span>
                      </span>
                    </summary>
                    <div className="admin-operator-disclosure-body border-t border-zinc-700/60 px-3.5 pb-3.5 pt-3">
                      <label className="mt-1 flex flex-col gap-2 text-sm text-zinc-300">
                        Celková orientační cena
                        <input name="priceTotal" type="number" step="0.01" min={0} defaultValue={order.priceEstimate.total} className={ui.field} required />
                      </label>
                      <button className={cx(ui.buttonSecondary, "mt-4 w-full")} type="submit">
                        Uložit cenu
                      </button>
                    </div>
                  </details>
                </form>

                {canCancelOrder ? (
                  <form
                    action={`/api/admin/orders/${order.id}/cancel`}
                    method="post"
                    className="admin-operator-card rounded-xl border p-3.5"
                  >
                    <h3 className="text-sm font-semibold">Stornovat objednávku</h3>
                    <label className="mt-3 flex flex-col gap-2 text-sm">
                      Důvod storna
                      <input name="reason" defaultValue={order.cancelReason ?? ""} className={ui.field} required />
                    </label>
                    <label className="mt-3 flex items-start gap-2 text-sm">
                      <input type="checkbox" name="notifyCustomer" defaultChecked className="mt-1 h-4 w-4 rounded border-red-700/80 bg-red-950" />
                      Poslat zákazníkovi e-mail o storno
                    </label>
                    <button className="mt-4 w-full rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500" type="submit">
                      Stornovat
                    </button>
                  </form>
                ) : null}

                <CopyOrderLink
                  href={`/kontejnery/objednat?copyOrder=${encodeURIComponent(order.id)}`}
                  className={cx(ui.buttonSecondary, "inline-flex w-full justify-center")}
                  order={order}
                >
                  Objednat další kontejner
                </CopyOrderLink>
              </div>
            )}
          </section>

          {!isCancelled ? (
            <form
              action={`/api/admin/orders/${order.id}/internal-note`}
              method="post"
              className={cx(ui.card, "admin-operator-panel p-3 sm:p-5")}
            >
              <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">Interní poznámka</h2>
              <textarea
                name="note"
                defaultValue={order.internalNote ?? ""}
                className={cx(ui.field, "mt-3 min-h-28 resize-y sm:min-h-36")}
                rows={6}
              />
              <button className={cx(ui.buttonSecondary, "mt-3")} type="submit">
                Uložit poznámku
              </button>
            </form>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
