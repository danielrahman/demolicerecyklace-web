import Link from "next/link";

import { formatCzechDayCount } from "@/lib/czech";
import { listOrders } from "@/lib/order-store";
import type { OrderStatus } from "@/lib/types";
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

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: OrderStatus }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const status = params?.status;
  const orders = listOrders(status);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Objednávky</h1>
        <p className="text-zinc-300">Postup: vyberte objednávku ze seznamu, otevřete detail a použijte jedno ze 3 tlačítek.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          className={cx(
            "rounded-md border border-zinc-700 px-3 py-2 text-sm",
            !status ? "bg-zinc-100 text-black" : "text-zinc-100 hover:bg-zinc-800",
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
                status === typedStatus ? "bg-zinc-100 text-black" : "text-zinc-100 hover:bg-zinc-800",
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
        <ul className="grid gap-3">
          {orders.map((order) => (
            <li key={order.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xs text-zinc-300">{order.id}</p>
                <span className={cx("rounded-full border px-2 py-1 text-xs font-semibold", statusBadgeClass[order.status])}>
                  {statusLabels[order.status]}
                </span>
              </div>
              <p className="mt-2 text-lg font-semibold">{order.name}</p>
              <p className="text-sm text-zinc-300">
                {order.street} {order.houseNumber}, {order.city}, {order.postalCode}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Požadovaný termín:{" "}
                {order.deliveryDateEndRequested
                  ? `${order.deliveryDateRequested} - ${order.deliveryDateEndRequested}`
                  : order.deliveryDateRequested}{" "}
                ({order.timeWindowRequested})
              </p>
              {order.deliveryFlexibilityDays ? (
                <p className="mt-1 text-xs text-zinc-400">Flexibilita: ±{formatCzechDayCount(order.deliveryFlexibilityDays)}</p>
              ) : null}
              <p className="mt-1 text-sm text-zinc-400">Pronájem: {formatCzechDayCount(order.rentalDays)}</p>
              {order.callbackNote ? (
                <p className="mt-1 text-sm text-amber-300">Callback: {order.callbackNote}</p>
              ) : null}
              <Link href={`/admin/objednavky/${order.id}`} className={cx(ui.buttonPrimary, "mt-4")}>
                Otevřít detail
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
