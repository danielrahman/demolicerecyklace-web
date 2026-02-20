import Link from "next/link";

import { AdminSignOutButton } from "@/components/admin-signout-button";
import { formatCzechDayCount } from "@/lib/czech";
import { parseIsoLocalDate } from "@/lib/delivery-date";
import { requireAdminPageSession } from "@/lib/auth/guards";
import { listOrders } from "@/lib/order-store";
import type { OrderStatus } from "@/lib/types";
import { cx } from "@/lib/ui";

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

function formatAdminDate(value: string) {
  const parsed = parseIsoLocalDate(value);
  if (!parsed) return value;

  return new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
  }).format(parsed);
}

function formatAdminDateRange(start: string, end?: string) {
  if (!end) return formatAdminDate(start);
  return `${formatAdminDate(start)} - ${formatAdminDate(end)}`;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: OrderStatus }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const status = params?.status;
  await requireAdminPageSession();
  const orders = await listOrders(status);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Objednávky</h1>
          <p className="text-zinc-300">Postup: vyberte objednávku ze seznamu a otevřete detail.</p>
        </div>
        <AdminSignOutButton className="text-sm" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          className={cx(
            "rounded-md border border-zinc-700 px-3 py-2 text-sm",
            !status ? "bg-zinc-100 !text-black" : "text-zinc-100 hover:bg-zinc-800",
          )}
          href="/admin/objednavky"
        >
          Vše
        </Link>
        {Object.keys(statusLabels).map((statusKey) => {
          const typedStatus = statusKey as OrderStatus;

          return (
            <Link
              key={statusKey}
              className={cx(
                "rounded-md border border-zinc-700 px-3 py-2 text-sm",
                status === typedStatus ? "bg-zinc-100 !text-black" : "text-zinc-100 hover:bg-zinc-800",
              )}
              href={`/admin/objednavky?status=${statusKey}`}
            >
              {statusLabels[typedStatus]}
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-300">Zatím nejsou žádné objednávky.</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="hidden grid-cols-[130px_1fr_1.2fr_1.1fr_90px_130px] gap-3 border-b border-zinc-800 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400 md:grid">
            <span>ID</span>
            <span>Zákazník</span>
            <span>Lokalita</span>
            <span>Termín</span>
            <span>Pronájem</span>
            <span>Stav</span>
          </div>
          <ul className="divide-y divide-zinc-800">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/objednavky/${order.id}`}
                  className="admin-order-row block px-4 py-3 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                >
                  <div className="space-y-1 md:hidden">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-xs text-zinc-300">{order.id}</p>
                      <span className={cx("rounded-full border px-2 py-0.5 text-xs font-semibold", statusBadgeClass[order.status])}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <p className="text-sm font-semibold">{order.companyName || "Fyzická osoba"}</p>
                    <p className="text-xs text-zinc-400">{order.name}</p>
                    <p className="text-xs text-zinc-400">
                      {order.street} {order.houseNumber}, {order.city}, {order.postalCode}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {formatAdminDateRange(order.deliveryDateRequested, order.deliveryDateEndRequested)}{" "}
                      ({order.timeWindowRequested}) · {formatCzechDayCount(order.rentalDays)}
                    </p>
                    {order.callbackNote ? <p className="text-xs text-amber-300">Callback: {order.callbackNote}</p> : null}
                  </div>
                  <div className="hidden grid-cols-[130px_1fr_1.2fr_1.1fr_90px_130px] items-center gap-3 md:grid">
                    <p className="font-mono text-xs text-zinc-300">{order.id}</p>
                    <div>
                      <p className="text-sm font-semibold">{order.companyName || "Fyzická osoba"}</p>
                      <p className="text-xs text-zinc-400">{order.name}</p>
                    </div>
                    <p className="truncate text-sm text-zinc-300" title={`${order.street} ${order.houseNumber}, ${order.city}, ${order.postalCode}`}>
                      {order.street} {order.houseNumber}, {order.city}, {order.postalCode}
                    </p>
                    <p className="text-sm text-zinc-300">
                      {formatAdminDateRange(order.deliveryDateRequested, order.deliveryDateEndRequested)}{" "}
                      ({order.timeWindowRequested})
                    </p>
                    <p className="text-sm text-zinc-300">{formatCzechDayCount(order.rentalDays)}</p>
                    <span className={cx("w-fit rounded-full border px-2 py-0.5 text-xs font-semibold", statusBadgeClass[order.status])}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
