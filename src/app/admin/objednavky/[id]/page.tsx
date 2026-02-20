import Link from "next/link";
import { notFound } from "next/navigation";

import { formatCzechDayCount } from "@/lib/czech";
import { getOrder } from "@/lib/order-store";
import type { OrderStatus } from "@/lib/types";
import { TIME_WINDOW_VALUES } from "@/lib/time-windows";
import { cx, ui } from "@/lib/ui";

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

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/objednavky" className="text-sm text-zinc-400 underline">
        Zpět na seznam
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-3xl font-bold">Objednávka {order.id}</h1>
          <span className={cx("rounded-full border px-2 py-1 text-xs font-semibold", statusBadgeClass[order.status])}>
            {statusLabels[order.status]}
          </span>
        </div>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-400">Zákazník</dt>
            <dd>{order.name}</dd>
          </div>
          <div>
            <dt className="text-zinc-400">Kontakt</dt>
            <dd>
              {order.phone}, {order.email}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-zinc-400">Lokalita</dt>
            <dd>
              {order.street} {order.houseNumber}, {order.city}, {order.postalCode}
            </dd>
            {order.pinLocation ? (
              <dd className="mt-1 text-xs text-zinc-400">
                Pin: {order.pinLocation.lat.toFixed(6)}, {order.pinLocation.lng.toFixed(6)} ·{" "}
                <a
                  href={`https://www.google.com/maps?q=${order.pinLocation.lat},${order.pinLocation.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--color-accent)] underline"
                >
                  otevřít v mapě
                </a>
              </dd>
            ) : null}
          </div>
          <div>
            <dt className="text-zinc-400">Požadovaný termín</dt>
            <dd>
              {order.deliveryDateRequested} ({order.timeWindowRequested})
            </dd>
            {order.deliveryFlexibilityDays ? (
              <dd className="mt-1 text-xs text-zinc-400">Flexibilita: ±{formatCzechDayCount(order.deliveryFlexibilityDays)}</dd>
            ) : null}
          </div>
          <div>
            <dt className="text-zinc-400">Doba pronájmu</dt>
            <dd>{formatCzechDayCount(order.rentalDays)}</dd>
          </div>
          <div>
            <dt className="text-zinc-400">Potvrzený termín</dt>
            <dd>
              {order.deliveryDateConfirmed && order.timeWindowConfirmed
                ? `${order.deliveryDateConfirmed} (${order.timeWindowConfirmed})`
                : "zatím nepotvrzen"}
            </dd>
          </div>
          {order.callbackNote ? (
            <div className="sm:col-span-2">
              <dt className="text-zinc-400">Callback poznámka</dt>
              <dd>{order.callbackNote}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Změna stavu (3 tlačítka)</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <form
            action={`/api/admin/orders/${order.id}/confirm`}
            method="post"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <h3 className="text-xl font-bold">1. Potvrdit</h3>
            <label className="mt-3 flex flex-col gap-2 text-sm">
              Datum
              <input
                name="date"
                type="date"
                defaultValue={order.deliveryDateRequested}
                className="rounded-md border border-zinc-700 bg-zinc-950 p-2"
                required
              />
            </label>
            <label className="mt-3 flex flex-col gap-2 text-sm">
              Okno
              <select name="window" defaultValue={order.timeWindowRequested} className="rounded-md border border-zinc-700 bg-zinc-950 p-2" required>
                {TIME_WINDOW_VALUES.map((windowValue) => (
                  <option value={windowValue} key={windowValue}>
                    {windowValue}
                  </option>
                ))}
              </select>
            </label>
            <button className={cx(ui.buttonPrimary, "mt-4 w-full")} type="submit">
              Potvrdit termín
            </button>
          </form>

          <form
            action={`/api/admin/orders/${order.id}/reschedule`}
            method="post"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <h3 className="text-xl font-bold">2. Přeplánovat</h3>
            <label className="mt-3 flex flex-col gap-2 text-sm">
              Nové datum
              <input
                name="date"
                type="date"
                defaultValue={order.deliveryDateConfirmed ?? order.deliveryDateRequested}
                className="rounded-md border border-zinc-700 bg-zinc-950 p-2"
                required
              />
            </label>
            <label className="mt-3 flex flex-col gap-2 text-sm">
              Nové okno
              <select
                name="window"
                defaultValue={order.timeWindowConfirmed ?? order.timeWindowRequested}
                className="rounded-md border border-zinc-700 bg-zinc-950 p-2"
                required
              >
                {TIME_WINDOW_VALUES.map((windowValue) => (
                  <option value={windowValue} key={windowValue}>
                    {windowValue}
                  </option>
                ))}
              </select>
            </label>
            <button className={cx(ui.buttonSecondary, "mt-4 w-full")} type="submit">
              Uložit nový termín
            </button>
          </form>

          <form
            action={`/api/admin/orders/${order.id}/cancel`}
            method="post"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <h3 className="text-xl font-bold">3. Stornovat</h3>
            <label className="mt-3 flex flex-col gap-2 text-sm">
              Důvod storna
              <input name="reason" defaultValue={order.cancelReason ?? ""} className="rounded-md border border-zinc-700 bg-zinc-950 p-2" required />
            </label>
            <button className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 font-semibold text-white" type="submit">
              Stornovat objednávku
            </button>
          </form>
        </div>
      </section>

      <form
        action={`/api/admin/orders/${order.id}/internal-note`}
        method="post"
        className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
      >
        <h2 className="text-xl font-bold">Interní poznámka</h2>
        <textarea
          name="note"
          defaultValue={order.internalNote ?? ""}
          className="mt-3 w-full rounded-md border border-zinc-700 bg-zinc-950 p-3"
          rows={5}
        />
        <button className={cx(ui.buttonSecondary, "mt-3")} type="submit">
          Uložit poznámku
        </button>
      </form>
    </div>
  );
}
