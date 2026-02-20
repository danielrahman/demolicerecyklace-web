"use client";

import { useCallback, useMemo, useState } from "react";

import { AdminOrderPinMap } from "@/components/admin-order-pin-map";
import type { OrderStatus } from "@/lib/types";
import { cx, ui } from "@/lib/ui";

type PinLocation = {
  lat: number;
  lng: number;
};

type AdminOrderLocationEditorProps = {
  orderId: string;
  orderStatus: OrderStatus;
  initialLocation: {
    postalCode: string;
    city: string;
    street: string;
    houseNumber: string;
  };
  initialPin?: PinLocation | null;
};

function PencilIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.86 3.22a1.9 1.9 0 0 1 2.69 0l1.23 1.23a1.9 1.9 0 0 1 0 2.69l-8.83 8.83-3.78.88.88-3.78 8.81-8.85Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m11.63 4.45 3.92 3.92" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function formatAddress(location: { postalCode: string; city: string; street: string; houseNumber: string }) {
  return `${location.street} ${location.houseNumber}, ${location.city}, ${location.postalCode}`;
}

function createGoogleMapsLink(address: string, pinLocation: PinLocation | null) {
  if (pinLocation) {
    return `https://www.google.com/maps?q=${pinLocation.lat},${pinLocation.lng}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function AdminOrderLocationEditor({
  orderId,
  orderStatus,
  initialLocation,
  initialPin = null,
}: AdminOrderLocationEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [postalCode, setPostalCode] = useState(initialLocation.postalCode);
  const [city, setCity] = useState(initialLocation.city);
  const [street, setStreet] = useState(initialLocation.street);
  const [houseNumber, setHouseNumber] = useState(initialLocation.houseNumber);
  const [currentPin, setCurrentPin] = useState<PinLocation | null>(initialPin ? { ...initialPin } : null);

  const formId = `location-form-${orderId}`;
  const canEdit = orderStatus === "new" || orderStatus === "confirmed";

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

  const mapsLink = useMemo(
    () => createGoogleMapsLink(isEditing ? editingAddress : displayAddress, currentPin),
    [currentPin, displayAddress, editingAddress, isEditing],
  );

  const handlePinAddressResolved = useCallback(
    (payload: {
      pinLocation: PinLocation;
      parsedAddress: {
        postalCode: string;
        city: string;
        street: string;
        houseNumber: string;
      } | null;
    }) => {
      setCurrentPin(payload.pinLocation);

      if (!payload.parsedAddress) return;
      setPostalCode(payload.parsedAddress.postalCode);
      setCity(payload.parsedAddress.city);
      setStreet(payload.parsedAddress.street);
      setHouseNumber(payload.parsedAddress.houseNumber);
    },
    [],
  );

  const cancelEdit = () => {
    setPostalCode(initialLocation.postalCode);
    setCity(initialLocation.city);
    setStreet(initialLocation.street);
    setHouseNumber(initialLocation.houseNumber);
    setCurrentPin(initialPin ? { ...initialPin } : null);
    setIsEditing(false);
  };

  return (
    <section className={cx(ui.card, "p-4 sm:p-5")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">Lokalita a přesný pin</h2>
          <p className="mt-1 text-sm text-zinc-400">Adresa přistavení a přesná poloha kontejneru na mapě.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a href={mapsLink} target="_blank" rel="noreferrer" className="admin-order-map-link text-sm font-semibold underline underline-offset-4">
            Zobrazit v mapách
          </a>
          {canEdit && !isEditing ? (
            <button type="button" className="admin-section-edit-toggle" onClick={() => setIsEditing(true)}>
              <span>Upravit</span>
              <span className="admin-section-edit-toggle-icon">
                <PencilIcon className="h-3.5 w-3.5" />
              </span>
            </button>
          ) : null}
        </div>
      </div>
      {!canEdit ? (
        <p className="admin-order-location-lock mt-2 text-xs">Lokalitu lze upravovat jen ve stavech Přijatá a Potvrzená.</p>
      ) : null}

      {!isEditing ? (
        <div className="mt-4 space-y-3">
          <div className="admin-order-location-summary rounded-2xl border p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Lokalita přistavení</p>
            <p className="mt-2 text-base font-semibold text-zinc-100">{displayAddress}</p>
          </div>
          <AdminOrderPinMap
            title="Mapa přistavení"
            address={displayAddress}
            initialPin={currentPin}
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
          className="admin-order-location-edit mt-4 space-y-4 rounded-2xl border p-4"
        >
          <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="admin-order-location-fields rounded-xl border p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Ruční úprava adresy</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-zinc-300">
                  PSČ
                  <input
                    name="postalCode"
                    value={postalCode}
                    onChange={(event) => setPostalCode(event.target.value.replace(/[^\d\s]/g, "").slice(0, 6))}
                    inputMode="numeric"
                    pattern="[0-9]{3} ?[0-9]{2}"
                    title="PSČ ve formátu 12345 nebo 123 45"
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
              <p className="mt-3 text-xs text-zinc-500">Při posunutí pinu se adresa doplní automaticky podle mapy.</p>
            </div>

            <AdminOrderPinMap
              title="Přesný pin přistavení"
              address={editingAddress}
              initialPin={currentPin}
              inputTargets={[{ latName: "pinLat", lngName: "pinLng", formId }]}
              editable
              heightClassName="h-64 sm:h-80"
              onPinAddressResolved={handlePinAddressResolved}
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
