"use client";

import { useMemo, useState } from "react";

import { AdminOrderPinMap } from "@/components/admin-order-pin-map";
import { cx, ui } from "@/lib/ui";

type PinLocation = {
  lat: number;
  lng: number;
};

type AdminOrderLocationEditorProps = {
  orderId: string;
  isCancelled: boolean;
  initialLocation: {
    postalCode: string;
    city: string;
    street: string;
    houseNumber: string;
  };
  initialPin?: PinLocation | null;
};

function formatAddress(location: { postalCode: string; city: string; street: string; houseNumber: string }) {
  return `${location.street} ${location.houseNumber}, ${location.city}, ${location.postalCode}`;
}

export function AdminOrderLocationEditor({
  orderId,
  isCancelled,
  initialLocation,
  initialPin = null,
}: AdminOrderLocationEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [postalCode, setPostalCode] = useState(initialLocation.postalCode);
  const [city, setCity] = useState(initialLocation.city);
  const [street, setStreet] = useState(initialLocation.street);
  const [houseNumber, setHouseNumber] = useState(initialLocation.houseNumber);

  const formId = `location-form-${orderId}`;
  const canEdit = !isCancelled;

  const displayAddress = formatAddress({
    postalCode: initialLocation.postalCode,
    city: initialLocation.city,
    street: initialLocation.street,
    houseNumber: initialLocation.houseNumber,
  });

  const editingAddress = useMemo(
    () =>
      formatAddress({
        postalCode,
        city,
        street,
        houseNumber,
      }),
    [city, houseNumber, postalCode, street],
  );

  const cancelEdit = () => {
    setPostalCode(initialLocation.postalCode);
    setCity(initialLocation.city);
    setStreet(initialLocation.street);
    setHouseNumber(initialLocation.houseNumber);
    setIsEditing(false);
  };

  return (
    <section className={cx(ui.card, "p-4 sm:p-5")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">Lokalita a přesný pin</h2>
          <p className="mt-1 text-sm text-zinc-400">Adresa přistavení a přesná poloha kontejneru na mapě.</p>
        </div>
        {canEdit && !isEditing ? (
          <button type="button" className={ui.buttonSecondary} onClick={() => setIsEditing(true)}>
            Upravit
          </button>
        ) : null}
      </div>

      {!isEditing ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-zinc-700/80 bg-gradient-to-b from-zinc-900/90 to-zinc-950/80 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Lokalita přistavení</p>
            <p className="mt-2 text-base font-semibold text-zinc-100">{displayAddress}</p>
          </div>
          <AdminOrderPinMap
            title="Mapa přistavení"
            address={displayAddress}
            initialPin={initialPin}
            inputTargets={[]}
            editable={false}
            heightClassName="h-64 sm:h-72"
          />
        </div>
      ) : (
        <form
          id={formId}
          action={`/api/admin/orders/${orderId}/location`}
          method="post"
          className="mt-4 space-y-4 rounded-2xl border border-zinc-700/80 bg-gradient-to-b from-zinc-900/80 to-zinc-950/70 p-4"
        >
          <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-xl border border-zinc-700/80 bg-zinc-950/80 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Ruční úprava adresy</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-zinc-300">
                  PSČ
                  <input
                    name="postalCode"
                    value={postalCode}
                    onChange={(event) => setPostalCode(event.target.value)}
                    inputMode="numeric"
                    pattern="\\d{5}"
                    className={ui.field}
                    required
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-zinc-300">
                  Město
                  <input name="city" value={city} onChange={(event) => setCity(event.target.value)} className={ui.field} required />
                </label>
                <label className="sm:col-span-2 flex flex-col gap-2 text-sm text-zinc-300">
                  Ulice
                  <input name="street" value={street} onChange={(event) => setStreet(event.target.value)} className={ui.field} required />
                </label>
                <label className="sm:col-span-2 flex flex-col gap-2 text-sm text-zinc-300">
                  Číslo popisné
                  <input
                    name="houseNumber"
                    value={houseNumber}
                    onChange={(event) => setHouseNumber(event.target.value)}
                    className={ui.field}
                    required
                  />
                </label>
              </div>
            </div>

            <AdminOrderPinMap
              title="Přesný pin přistavení"
              address={editingAddress}
              initialPin={initialPin}
              inputTargets={[{ latName: "pinLat", lngName: "pinLng", formId }]}
              editable
              heightClassName="h-64 sm:h-80"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="submit" className={cx(ui.buttonPrimary, "min-w-36")}>
              Uložit lokalitu
            </button>
            <button type="button" className={cx(ui.buttonSecondary, "min-w-32")} onClick={cancelEdit}>
              Zrušit
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
