import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminOrderLocationEditor } from "@/components/admin-order-location-editor";
import { CopyOrderLink } from "@/components/copy-order-link";
import { AdminSignOutButton } from "@/components/admin-signout-button";
import { requireAdminPageSession } from "@/lib/auth/guards";
import { getContainerOrderWasteTypeById } from "@/lib/container-order-source";
import { formatCzechDayCount } from "@/lib/czech";
import { parseIsoLocalDate } from "@/lib/delivery-date";
import { getOrder } from "@/lib/order-store";
import { TIME_WINDOW_VALUES } from "@/lib/time-windows";
import type { OrderEventType, OrderStatus } from "@/lib/types";
import { cx, ui } from "@/lib/ui";
import { listOrderEvents } from "@/server/db/repositories/order-events";

const statusLabels: Record<OrderStatus, string> = {
  new: "Nová",
  confirmed: "Potvrzená",
  done: "Hotovo",
  cancelled: "Stornováno",
};

const statusBadgeClass: Record<OrderStatus, string> = {
  new: "border-amber-500/60 bg-amber-950/50 text-amber-200",
  confirmed: "border-emerald-500/60 bg-emerald-950/50 text-emerald-200",
  done: "border-zinc-500/60 bg-zinc-900 text-zinc-200",
  cancelled: "border-red-500/60 bg-red-950/50 text-red-200",
};

const eventLabels: Record<OrderEventType, string> = {
  created: "Objednávka vytvořena",
  emailed_customer_received: "Odeslán e-mail zákazníkovi (přijato)",
  emailed_internal_new: "Odeslán interní e-mail (nová objednávka)",
  status_confirmed: "Objednávka potvrzena",
  status_rescheduled: "Objednávka přeplánována",
  status_done: "Objednávka označena jako hotová",
  location_updated: "Lokalita upravena",
  status_cancelled: "Objednávka stornována",
  price_estimate_updated: "Aktualizována orientační cena",
  internal_note_updated: "Aktualizována interní poznámka",
  rate_limited_rejected: "Blokováno rate-limitem",
  honeypot_rejected: "Blokováno honeypot ochranou",
};

const workflowSteps: Array<{ status: OrderStatus; label: string; note: string }> = [
  { status: "new", label: "Přijatá", note: "Objednávka je založená" },
  { status: "confirmed", label: "Potvrzená", note: "Termín je domluvený" },
  { status: "done", label: "Hotovo", note: "Zakázka je dokončená" },
  { status: "cancelled", label: "Stornovaná", note: "Objednávka je ukončená" },
];

type WorkflowState = "active" | "done" | "upcoming";

function formatAdminDate(value: string) {
  const parsed = parseIsoLocalDate(value);
  if (!parsed) return value;

  return new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function formatAdminDateRange(start: string, end?: string) {
  if (!end) return formatAdminDate(start);
  return `${formatAdminDate(start)} - ${formatAdminDate(end)}`;
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

function workflowStepClass(state: WorkflowState) {
  if (state === "active") {
    return "border-[var(--color-accent)]/60 bg-[var(--color-accent)]/15 text-zinc-100";
  }

  if (state === "done") {
    return "border-emerald-500/50 bg-emerald-950/30 text-emerald-100";
  }

  return "border-zinc-700 bg-zinc-950/60 text-zinc-400";
}

function formatPlacementType(value: "soukromy" | "verejny") {
  return value === "verejny" ? "Veřejný pozemek" : "Soukromý pozemek";
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPageSession();
  const { id } = await params;
  const order = await getOrder(id);
  const wasteType = order ? await getContainerOrderWasteTypeById(order.wasteType) : null;
  const events = order ? await listOrderEvents(order.id) : [];

  if (!order) {
    notFound();
  }

  const isCancelled = order.status === "cancelled";
  const canConfirm = order.status === "new";
  const canMarkDone = order.status === "confirmed";
  const rescheduleFormId = `reschedule-form-${order.id}`;
  const requestedTerm = `${formatAdminDateRange(order.deliveryDateRequested, order.deliveryDateEndRequested)} (${order.timeWindowRequested})`;
  const confirmedTerm =
    order.deliveryDateConfirmed && order.timeWindowConfirmed
      ? `${formatAdminDate(order.deliveryDateConfirmed)} (${order.timeWindowConfirmed})`
      : "zatím nepotvrzen";

  const activeExtras = [
    ["Nakládka od nás", order.extras.nakladkaOdNas],
    ["Expresní přistavení", order.extras.expresniPristaveni],
    ["Opakovaný odvoz", order.extras.opakovanyOdvoz],
  ].filter((item): item is [string, true] => Boolean(item[1]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/objednavky" className="text-sm text-zinc-400 underline">
          Zpět na seznam
        </Link>
        <AdminSignOutButton className="text-sm" />
      </div>

      <section className={cx(ui.card, "p-5 sm:p-6")}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Detail objednávky</p>
            <h1 className="text-3xl font-bold text-zinc-100">{order.id}</h1>
            <p className="text-sm text-zinc-400">Vytvořeno {formatAdminDateTime(order.createdAt)}</p>
          </div>
          <span className={cx("rounded-full border px-3 py-1 text-xs font-semibold", statusBadgeClass[order.status])}>
            {statusLabels[order.status]}
          </span>
        </div>

        {isCancelled ? (
          <div className="mt-4 rounded-xl border border-red-700/50 bg-red-950/30 p-3 text-sm text-red-100">
            <p className="font-semibold">Objednávka je stornovaná.</p>
            <p className="mt-1">U stornované objednávky lze jen založit novou kopii.</p>
            {order.cancelReason ? <p className="mt-2 text-xs text-red-200/90">Důvod: {order.cancelReason}</p> : null}
          </div>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Požadovaný termín</p>
            <p className="mt-1 text-sm font-semibold text-zinc-100">{requestedTerm}</p>
          </div>
          <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Potvrzený termín</p>
            <p className="mt-1 text-sm font-semibold text-zinc-100">{confirmedTerm}</p>
          </div>
          <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Pronájem a množství</p>
            <p className="mt-1 text-sm font-semibold text-zinc-100">
              {formatCzechDayCount(order.rentalDays)} · {order.containerCount}x kontejner
            </p>
          </div>
          <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Orientační cena</p>
            <p className="mt-1 text-sm font-semibold text-zinc-100">{formatCurrency(order.priceEstimate.total)}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {workflowSteps.map((step) => {
            const stepState = getWorkflowStepState(order.status, step.status);
            return (
              <div key={step.status} className={cx("rounded-xl border p-3", workflowStepClass(stepState))}>
                <p className="text-sm font-semibold">{step.label}</p>
                <p className="mt-1 text-xs opacity-80">{step.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <div className="space-y-4">
          <AdminOrderLocationEditor
            orderId={order.id}
            isCancelled={isCancelled}
            initialLocation={{
              postalCode: order.postalCode,
              city: order.city,
              street: order.street,
              houseNumber: order.houseNumber,
            }}
            initialPin={order.pinLocation ?? null}
          />

          <section className={cx(ui.card, "p-4 sm:p-5")}>
            <h2 className="text-xl font-semibold text-zinc-100">Zákazník a kontakt</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-3">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Firma / zákazník</p>
                <p className="mt-1 text-sm font-semibold text-zinc-100">{order.companyName || "Fyzická osoba"}</p>
                <p className="mt-1 text-xs text-zinc-400">{order.name}</p>
                {order.ico ? <p className="mt-2 text-xs text-zinc-400">IČO: {order.ico}</p> : null}
                {order.dic ? <p className="text-xs text-zinc-400">DIČ: {order.dic}</p> : null}
              </div>
              <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-3">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Kontakt</p>
                <p className="mt-1 text-sm font-semibold text-zinc-100">{order.phone}</p>
                <p className="mt-1 text-sm text-zinc-300">{order.email}</p>
                {order.callbackNote ? <p className="mt-2 text-xs text-amber-300">Callback: {order.callbackNote}</p> : null}
              </div>
            </div>
          </section>

          <section className={cx(ui.card, "p-4 sm:p-5")}>
            <h2 className="text-xl font-semibold text-zinc-100">Parametry objednávky</h2>
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
                <dd className="mt-1 text-zinc-100">{requestedTerm}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Potvrzený termín</dt>
                <dd className="mt-1 text-zinc-100">{confirmedTerm}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Doba pronájmu</dt>
                <dd className="mt-1 text-zinc-100">{formatCzechDayCount(order.rentalDays)}</dd>
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

            <div className="mt-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Doplňkové služby</p>
              {activeExtras.length > 0 ? (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {activeExtras.map(([label]) => (
                    <li key={label} className="rounded-full border border-zinc-600 bg-zinc-800/60 px-3 py-1 text-xs text-zinc-200">
                      {label}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-zinc-400">Bez doplňkových služeb.</p>
              )}
            </div>

            {order.note ? (
              <div className="mt-4 rounded-xl border border-zinc-700 bg-zinc-950/60 p-3">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Poznámka od zákazníka</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">{order.note}</p>
              </div>
            ) : null}
          </section>

          <section className={cx(ui.card, "p-4 sm:p-5")}>
            <h2 className="text-xl font-semibold text-zinc-100">Historie objednávky</h2>
            {events.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-400">Zatím bez událostí.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {events.map((event) => (
                  <li key={event.id} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 text-sm">
                    <p className="font-semibold text-zinc-100">{eventLabels[event.eventType] ?? event.eventType}</p>
                    <p className="text-xs text-zinc-400">{new Date(event.createdAt).toLocaleString("cs-CZ")}</p>
                    {Object.keys(event.payload).length > 0 ? (
                      <pre className="mt-2 overflow-auto whitespace-pre-wrap text-xs text-zinc-300">
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <section className={cx(ui.card, "p-4 sm:p-5")}>
            <h2 className="text-xl font-semibold text-zinc-100">Akce operátora</h2>

            {isCancelled ? (
              <div className="mt-4 rounded-xl border border-red-700/50 bg-red-950/30 p-3 text-sm text-red-100">
                <p>Tato objednávka je stornovaná, proto ji už nelze potvrdit ani přeplánovat.</p>
                <CopyOrderLink
                  href={`/kontejnery/objednat?copyOrder=${encodeURIComponent(order.id)}`}
                  className={cx(ui.buttonSecondary, "mt-3 inline-flex")}
                  order={order}
                >
                  Objednat další kontejner
                </CopyOrderLink>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {canMarkDone ? (
                  <form
                    action={`/api/admin/orders/${order.id}/done`}
                    method="post"
                    className="rounded-xl border border-emerald-700/60 bg-emerald-950/20 p-3"
                  >
                    <h3 className="text-base font-semibold text-emerald-100">Označit jako hotové</h3>
                    <p className="mt-2 text-xs text-emerald-100/90">Po dokončení realizace nastavte stav objednávky na hotovo.</p>
                    <button className="mt-4 w-full rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500" type="submit">
                      Označit jako hotové
                    </button>
                  </form>
                ) : null}

                {canConfirm ? (
                  <form
                    action={`/api/admin/orders/${order.id}/confirm`}
                    method="post"
                    className="rounded-xl border border-zinc-700 bg-zinc-950/50 p-3"
                  >
                    <h3 className="text-base font-semibold text-zinc-100">Potvrdit termín</h3>
                    <label className="mt-3 flex flex-col gap-2 text-sm text-zinc-300">
                      Datum
                      <input name="date" type="date" defaultValue={order.deliveryDateRequested} className={ui.field} required />
                    </label>
                    <label className="mt-3 flex flex-col gap-2 text-sm text-zinc-300">
                      Okno
                      <select name="window" defaultValue={order.timeWindowRequested} className={cx(ui.field, "appearance-none")} required>
                        {TIME_WINDOW_VALUES.map((windowValue) => (
                          <option value={windowValue} key={windowValue}>
                            {windowValue}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="mt-3 flex items-start gap-2 text-sm text-zinc-300">
                      <input type="checkbox" name="notifyCustomer" defaultChecked className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-900" />
                      Poslat zákazníkovi potvrzení termínu
                    </label>
                    <button className={cx(ui.buttonPrimary, "mt-4 w-full")} type="submit">
                      Potvrdit
                    </button>
                  </form>
                ) : null}

                <form
                  id={rescheduleFormId}
                  action={`/api/admin/orders/${order.id}/reschedule`}
                  method="post"
                  className="rounded-xl border border-zinc-700 bg-zinc-950/50 p-3"
                >
                  <h3 className="text-base font-semibold text-zinc-100">Přeplánovat a upravit</h3>
                  <label className="mt-3 flex flex-col gap-2 text-sm text-zinc-300">
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
                    <input name="rentalDays" type="number" min={1} max={10} defaultValue={order.rentalDays} className={ui.field} required />
                  </label>
                  <label className="mt-3 flex items-start gap-2 text-sm text-zinc-300">
                    <input type="checkbox" name="notifyCustomer" defaultChecked className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-900" />
                    Poslat zákazníkovi e-mail o přeplánování
                  </label>
                  <button className={cx(ui.buttonSecondary, "mt-4 w-full")} type="submit">
                    Uložit změny
                  </button>
                </form>

                <form
                  action={`/api/admin/orders/${order.id}/price`}
                  method="post"
                  className="rounded-xl border border-zinc-700 bg-zinc-950/50 p-3"
                >
                  <h3 className="text-base font-semibold text-zinc-100">Upravit orientační cenu</h3>
                  <div className="mt-2 text-xs text-zinc-400">Aktuálně: {formatCurrency(order.priceEstimate.total)}</div>
                  <label className="mt-3 flex flex-col gap-2 text-sm text-zinc-300">
                    Celková orientační cena
                    <input name="priceTotal" type="number" step="0.01" min={0} defaultValue={order.priceEstimate.total} className={ui.field} required />
                  </label>
                  <button className={cx(ui.buttonSecondary, "mt-4 w-full")} type="submit">
                    Uložit cenu
                  </button>
                </form>

                <form
                  action={`/api/admin/orders/${order.id}/cancel`}
                  method="post"
                  className="rounded-xl border border-red-800/60 bg-red-950/20 p-3"
                >
                  <h3 className="text-base font-semibold text-red-100">Stornovat objednávku</h3>
                  <label className="mt-3 flex flex-col gap-2 text-sm text-red-100/90">
                    Důvod storna
                    <input name="reason" defaultValue={order.cancelReason ?? ""} className={ui.field} required />
                  </label>
                  <label className="mt-3 flex items-start gap-2 text-sm text-red-100/90">
                    <input type="checkbox" name="notifyCustomer" defaultChecked className="mt-1 h-4 w-4 rounded border-red-700/80 bg-red-950" />
                    Poslat zákazníkovi e-mail o storno
                  </label>
                  <button className="mt-4 w-full rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500" type="submit">
                    Stornovat
                  </button>
                </form>

                <CopyOrderLink
                  href={`/kontejnery/objednat?copyOrder=${encodeURIComponent(order.id)}`}
                  className={cx(ui.buttonSecondary, "inline-flex")}
                  order={order}
                >
                  Objednat další kontejner
                </CopyOrderLink>
              </div>
            )}
          </section>

          <form
            action={`/api/admin/orders/${order.id}/internal-note`}
            method="post"
            className={cx(ui.card, "p-4 sm:p-5")}
          >
            <h2 className="text-xl font-semibold text-zinc-100">Interní poznámka</h2>
            <textarea
              name="note"
              defaultValue={order.internalNote ?? ""}
              className={cx(ui.field, "mt-3 min-h-36 resize-y")}
              rows={7}
            />
            <button className={cx(ui.buttonSecondary, "mt-3")} type="submit">
              Uložit poznámku
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
