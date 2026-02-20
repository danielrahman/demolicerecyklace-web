"use client";

import Image from "next/image";
import Link from "next/link";
import { type MouseEvent as ReactMouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { trackAnalyticsEvent } from "@/lib/analytics";
import {
  FALLBACK_CONTAINER_ORDER_WASTE_TYPES,
  type ContainerOrderWasteType,
} from "@/lib/container-order-catalog";
import { formatCzechDayCount } from "@/lib/czech";
import {
  formatIsoLocalDate,
  parseIsoLocalDate,
  todayIsoLocalDate,
  validateDeliveryDateRequested,
} from "@/lib/delivery-date";
import { CONTAINER_PRODUCT, CONTACT } from "@/lib/site-config";
import { isSupportedPostalCode } from "@/lib/service-area";
import { TIME_WINDOW_VALUES } from "@/lib/time-windows";
import type { PriceEstimate, WasteTypeId } from "@/lib/types";
import { cx, ui } from "@/lib/ui";

type WizardData = {
  customerType: "fo" | "firma";
  name: string;
  companyName: string;
  ico: string;
  dic: string;
  email: string;
  phone: string;
  postalCode: string;
  city: string;
  street: string;
  houseNumber: string;
  wasteType: WasteTypeId;
  containerCount: number;
  rentalDays: number;
  deliveryDateRequested: string;
  deliveryDateEndRequested: string;
  timeWindowRequested: (typeof TIME_WINDOW_VALUES)[number];
  placementType: "soukromy" | "verejny";
  permitConfirmed: boolean;
  nakladkaOdNas: boolean;
  expresniPristaveni: boolean;
  opakovanyOdvoz: boolean;
  note: string;
  callbackNote: string;
  website: string;
  gdprConsent: boolean;
  marketingConsent: boolean;
};

type CompanyLookupMatch = {
  ico: string;
  companyName: string;
  dic?: string;
  addressText?: string;
  postalCode?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
};

type CallbackForm = {
  phone: string;
  name: string;
  note: string;
};

type PricingPreviewResponse = {
  estimate?: PriceEstimate;
  error?: string;
};

type CompanyLookupResponse = {
  match?: CompanyLookupMatch;
  suggestions?: CompanyLookupMatch[];
  error?: string;
};

type CallbackResponse = {
  ok?: boolean;
  requestId?: string;
  etaMinutes?: number;
  error?: string;
};

type PinLocation = {
  lat: number;
  lng: number;
};

type WasteHoverPreview = {
  waste: ContainerOrderWasteType;
  x: number;
  y: number;
};

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GoogleLatLng = {
  lat: () => number;
  lng: () => number;
};

type GoogleGeometry = {
  location?: GoogleLatLng | PinLocation;
};

type GooglePlaceResult = {
  formatted_address?: string;
  address_components?: GoogleAddressComponent[];
  geometry?: GoogleGeometry;
};

type GoogleGeocoderResult = {
  formatted_address: string;
  address_components: GoogleAddressComponent[];
  geometry?: GoogleGeometry;
};

type GoogleMapsListener = {
  remove: () => void;
};

type GoogleMapMouseEvent = {
  latLng?: GoogleLatLng;
};

type GoogleMap = {
  panTo: (location: PinLocation) => void;
  setZoom: (value: number) => void;
  getZoom: () => number | undefined;
  addListener: (eventName: string, handler: (event?: GoogleMapMouseEvent) => void) => GoogleMapsListener;
};

type GoogleMapConstructor = new (
  mapDiv: HTMLElement,
  options: {
    center: PinLocation;
    zoom: number;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
  },
) => GoogleMap;

type GoogleMarker = {
  setMap: (map: GoogleMap | null) => void;
  setPosition: (location: PinLocation) => void;
  addListener: (eventName: string, handler: (event?: GoogleMapMouseEvent) => void) => GoogleMapsListener;
};

type GoogleMarkerConstructor = new (options: {
  map: GoogleMap;
  position: PinLocation;
  draggable?: boolean;
}) => GoogleMarker;

type GoogleAutocompleteField = "formatted_address" | "address_components" | "geometry";

type GoogleAutocompleteOptions = {
  types: string[];
  componentRestrictions: { country: string };
  fields: GoogleAutocompleteField[];
};

type GoogleAutocomplete = {
  getPlace: () => GooglePlaceResult;
  addListener: (eventName: string, handler: () => void) => GoogleMapsListener;
};

type GoogleAutocompleteConstructor = new (
  input: HTMLInputElement,
  options: GoogleAutocompleteOptions,
) => GoogleAutocomplete;

type GoogleGeocoder = {
  geocode: (
    request: {
      address?: string;
      location?: PinLocation;
      componentRestrictions?: { country: string };
    },
    callback: (results: GoogleGeocoderResult[] | null, status: string) => void,
  ) => void;
};

type GoogleMapsApi = {
  maps: {
    Map: GoogleMapConstructor;
    Marker: GoogleMarkerConstructor;
    places: {
      Autocomplete: GoogleAutocompleteConstructor;
    };
    Geocoder: new () => GoogleGeocoder;
  };
};

declare global {
  interface Window {
    google?: GoogleMapsApi;
  }
}

type ParsedAddress = {
  formattedAddress: string;
  postalCode: string;
  city: string;
  street: string;
  houseNumber: string;
  pinLocation?: PinLocation;
};

type StepFieldKey =
  | "addressInput"
  | "postalCode"
  | "city"
  | "street"
  | "houseNumber"
  | "wasteType"
  | "containerCount"
  | "deliveryDateRequested"
  | "deliveryDateEndRequested"
  | "rentalDays"
  | "timeWindowRequested"
  | "permitConfirmed"
  | "name"
  | "companyName"
  | "ico"
  | "email"
  | "phone"
  | "gdprConsent";

type ValidationErrors = Partial<Record<StepFieldKey, string>>;

type WizardDraft = {
  version: 1;
  updatedAt: number;
  data: WizardData;
  addressInput: string;
  pinLocation: PinLocation | null;
  addressEditedByUser: boolean;
};

const stepTitles = ["Adresa", "Kontejner", "Termín + cena", "Kontakt + souhrn"] as const;

const phoneRegex = /^(\+420|\+421|0)?\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const icoRegex = /^\d{8}$/;
const postalCodeRegex = /^\d{5}$/;
const rentalDayOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const callbackEtaFallbackMinutes = 15;
const draftStorageKey = "order-wizard-draft-v3";
const draftTtlMs = 30 * 24 * 60 * 60 * 1000;
const wastePreviewWidth = 320;
const wastePreviewAspectRatio = 1.7;
const wastePreviewHeight = Math.round(wastePreviewWidth / wastePreviewAspectRatio);

function buildDefaultData(initialWasteType: WasteTypeId): WizardData {
  return {
    customerType: "firma",
    name: "",
    companyName: "",
    ico: "",
    dic: "",
    email: "",
    phone: "",
    postalCode: "",
    city: "",
    street: "",
    houseNumber: "",
    wasteType: initialWasteType,
    containerCount: 1,
    rentalDays: 1,
    deliveryDateRequested: "",
    deliveryDateEndRequested: "",
    timeWindowRequested: "08:00-09:00",
    placementType: "soukromy",
    permitConfirmed: false,
    nakladkaOdNas: false,
    expresniPristaveni: false,
    opakovanyOdvoz: false,
    note: "",
    callbackNote: "",
    website: "",
    gdprConsent: false,
    marketingConsent: false,
  };
}

function isAddressInputReadyForMap(addressInput: string) {
  const trimmed = addressInput.trim();
  if (!trimmed) return false;
  if (postalCodeRegex.test(trimmed)) return false;
  return trimmed.length >= 6;
}

function shouldRestorePinFromDraft(data: WizardData, addressInput: string) {
  return Boolean(addressInput.trim()) || Boolean(data.postalCode || data.city || data.street || data.houseNumber);
}

const stepFieldLabels: Record<StepFieldKey, string> = {
  addressInput: "Adresa",
  postalCode: "PSČ",
  city: "Město",
  street: "Ulice",
  houseNumber: "Číslo popisné",
  wasteType: "Typ odpadu",
  containerCount: "Počet kontejnerů",
  deliveryDateRequested: "Datum přistavení",
  deliveryDateEndRequested: "Datum odvozu",
  rentalDays: "Počet dní pronájmu",
  timeWindowRequested: "Časové okno",
  permitConfirmed: "Povolení k záboru",
  name: "Jméno a příjmení",
  companyName: "Název firmy",
  ico: "IČO",
  email: "E-mail",
  phone: "Telefon",
  gdprConsent: "Souhlas s GDPR",
};

const stepFieldInputIds: Record<StepFieldKey, string> = {
  addressInput: "order-address-input",
  postalCode: "order-postal-code",
  city: "order-city",
  street: "order-street",
  houseNumber: "order-house-number",
  wasteType: "order-waste-type",
  containerCount: "order-container-count",
  deliveryDateRequested: "order-delivery-date",
  deliveryDateEndRequested: "order-delivery-date-end",
  rentalDays: "order-rental-days",
  timeWindowRequested: "order-time-window",
  permitConfirmed: "order-permit-confirmed",
  name: "order-name",
  companyName: "order-company-name",
  ico: "order-ico",
  email: "order-email",
  phone: "order-phone",
  gdprConsent: "order-gdpr-consent",
};

let googleMapsLoadPromise: Promise<void> | null = null;

function formatPrice(amount: number) {
  return `${new Intl.NumberFormat("cs-CZ").format(amount)} Kč`;
}

function addDays(value: Date, dayDelta: number) {
  const next = new Date(value.getFullYear(), value.getMonth(), value.getDate());
  next.setDate(next.getDate() + dayDelta);
  return next;
}

function formatDisplayDate(value: string) {
  const parsed = parseIsoLocalDate(value);
  if (!parsed) return value;
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function formatDisplayDateWithoutYear(value: string) {
  const parsed = parseIsoLocalDate(value);
  if (!parsed) return value;
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "long",
  }).format(parsed);
}

function calculateRentalDays(startIso: string, endIso: string) {
  const start = parseIsoLocalDate(startIso);
  const end = parseIsoLocalDate(endIso);
  if (!start || !end) return null;
  if (end < start) return null;

  const dayMs = 24 * 60 * 60 * 1000;
  return Math.floor((end.getTime() - start.getTime()) / dayMs) + 1;
}

function normalizeRentalDays(value: unknown) {
  if (typeof value !== "number" || !Number.isInteger(value)) return rentalDayOptions[0];
  const minimumRentalDays = rentalDayOptions[0];
  const maximumRentalDays = rentalDayOptions[rentalDayOptions.length - 1];
  if (value < minimumRentalDays) return minimumRentalDays;
  if (value > maximumRentalDays) return maximumRentalDays;
  return value;
}

function calculateDeliveryEndDate(startIso: string, rentalDays: number) {
  const startDate = parseIsoLocalDate(startIso);
  if (!startDate) return "";

  const normalizedDays = normalizeRentalDays(rentalDays);
  return formatIsoLocalDate(addDays(startDate, normalizedDays - 1));
}

function formatAvailableDayLabel(value: Date) {
  const day = new Intl.DateTimeFormat("cs-CZ", { day: "numeric" }).format(value).replace(/\.$/, "");
  const month = new Intl.DateTimeFormat("cs-CZ", { month: "long" }).format(value);
  const weekDayRaw = new Intl.DateTimeFormat("cs-CZ", { weekday: "long" }).format(value);
  const weekDay = weekDayRaw.charAt(0).toUpperCase() + weekDayRaw.slice(1);
  return `${day}. ${month} • ${weekDay}`;
}

function buildAvailableDeliveryDayOptions(todayDate: Date, limit = 120) {
  const options: Array<{ iso: string; label: string }> = [];
  let dayOffset = 0;

  while (options.length < limit) {
    const candidate = addDays(todayDate, dayOffset);
    const candidateIso = formatIsoLocalDate(candidate);
    const candidateError = validateDeliveryDateRequested(candidateIso, todayDate);

    if (!candidateError) {
      options.push({
        iso: candidateIso,
        label: formatAvailableDayLabel(candidate),
      });
    }

    dayOffset += 1;
  }

  return options;
}

function hasGooglePlacesLoaded() {
  return Boolean(window.google?.maps?.places?.Autocomplete);
}

function loadGoogleMapsApi(apiKey: string) {
  if (typeof window === "undefined") return Promise.resolve();
  if (hasGooglePlacesLoaded()) return Promise.resolve();
  if (googleMapsLoadPromise) return googleMapsLoadPromise;

  googleMapsLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector("script[data-google-maps='true']") as HTMLScriptElement | null;

    if (existingScript) {
      if (hasGooglePlacesLoaded()) {
        resolve();
        return;
      }

      if (existingScript.dataset.loaded === "true") {
        reject(new Error("Google Maps API se načetlo bez Places knihovny."));
        return;
      }

      existingScript.addEventListener(
        "load",
        () => {
          if (!hasGooglePlacesLoaded()) {
            reject(new Error("Google Maps API se načetlo, ale Places knihovna není dostupná."));
            return;
          }
          resolve();
        },
        { once: true },
      );
      existingScript.addEventListener("error", () => reject(new Error("Google Maps script load failed")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=cs&region=CZ`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = () => {
      script.dataset.loaded = "true";
      if (!hasGooglePlacesLoaded()) {
        reject(new Error("Google Maps API se načetlo, ale Places knihovna není dostupná."));
        return;
      }
      resolve();
    };
    script.onerror = () => reject(new Error("Google Maps script load failed"));
    document.head.appendChild(script);
  });

  return googleMapsLoadPromise;
}

async function resolveGoogleMapsApiKey() {
  const directGoogleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
  if (directGoogleMapsApiKey) {
    return directGoogleMapsApiKey;
  }

  try {
    const response = await fetch("/api/maps/config", { cache: "no-store" });
    if (!response.ok) return "";

    const json = (await response.json()) as { apiKey?: string };
    return String(json.apiKey ?? "").trim();
  } catch {
    return "";
  }
}

function componentValue(components: GoogleAddressComponent[], types: string[]) {
  const found = components.find((component) => types.some((type) => component.types.includes(type)));
  return found?.long_name ?? "";
}

function normalizePinLocation(location?: GoogleLatLng | PinLocation): PinLocation | null {
  if (!location) return null;

  if (typeof location.lat === "function" && typeof location.lng === "function") {
    return { lat: location.lat(), lng: location.lng() };
  }

  if (typeof location.lat === "number" && typeof location.lng === "number") {
    return { lat: location.lat, lng: location.lng };
  }

  return null;
}

function formatPinLocation(location: PinLocation) {
  return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
}

function parseAddress(
  components?: GoogleAddressComponent[],
  formattedAddress = "",
  location?: GoogleLatLng | PinLocation,
): ParsedAddress | null {
  if (!components || components.length === 0) return null;

  const postalCode = componentValue(components, ["postal_code"]).replace(/\D/g, "").slice(0, 5);
  const city = componentValue(components, ["locality", "postal_town", "administrative_area_level_2", "sublocality"]);
  const street = componentValue(components, ["route"]);
  const houseNumber = componentValue(components, ["street_number", "premise", "subpremise"]);

  if (!postalCode || !city || !street || !houseNumber) {
    return null;
  }

  return {
    formattedAddress: formattedAddress || `${street} ${houseNumber}, ${city}, ${postalCode}`,
    postalCode,
    city,
    street,
    houseNumber,
    pinLocation: normalizePinLocation(location) ?? undefined,
  };
}

function saveDraft(draft: WizardDraft) {
  localStorage.setItem(draftStorageKey, JSON.stringify(draft));
}

function readDraft() {
  const rawDraft = localStorage.getItem(draftStorageKey);
  if (!rawDraft) return null;

  try {
    const parsed = JSON.parse(rawDraft) as Partial<WizardDraft>;
    if (parsed.version !== 1 || typeof parsed.updatedAt !== "number") {
      localStorage.removeItem(draftStorageKey);
      return null;
    }

    if (Date.now() - parsed.updatedAt > draftTtlMs) {
      localStorage.removeItem(draftStorageKey);
      return null;
    }

    if (!parsed.data || typeof parsed.data !== "object") {
      localStorage.removeItem(draftStorageKey);
      return null;
    }

    return parsed as WizardDraft;
  } catch {
    localStorage.removeItem(draftStorageKey);
    return null;
  }
}

function clearDraft() {
  localStorage.removeItem(draftStorageKey);
}

type DeliveryDatePickerProps = {
  value: string;
  rentalDays: number;
  onChange: (nextValue: string) => void;
  error?: string;
  todayIso: string;
};

function DeliveryDatePicker({
  value,
  rentalDays,
  onChange,
  error,
  todayIso,
}: DeliveryDatePickerProps) {
  const desktopPageSize = 10;
  const mobilePageSize = 6;
  const todayDate = useMemo(() => parseIsoLocalDate(todayIso) ?? new Date(), [todayIso]);
  const availableDays = useMemo(() => buildAvailableDeliveryDayOptions(todayDate), [todayDate]);
  const initialDesktopPageIndex = useMemo(() => {
    if (!value) return 0;
    const selectedIndex = availableDays.findIndex((option) => option.iso === value);
    return selectedIndex >= 0 ? Math.floor(selectedIndex / desktopPageSize) : 0;
  }, [availableDays, desktopPageSize, value]);
  const [desktopPageIndex, setDesktopPageIndex] = useState(initialDesktopPageIndex);
  const maxDesktopPageIndex = Math.max(0, Math.ceil(availableDays.length / desktopPageSize) - 1);
  const safeDesktopPageIndex = Math.min(desktopPageIndex, maxDesktopPageIndex);
  const canGoDesktopPrev = safeDesktopPageIndex > 0;
  const canGoDesktopNext = safeDesktopPageIndex < maxDesktopPageIndex;
  const visibleDayOptions = availableDays.slice(
    safeDesktopPageIndex * desktopPageSize,
    safeDesktopPageIndex * desktopPageSize + desktopPageSize,
  );
  const splitIndex = Math.ceil(visibleDayOptions.length / 2);
  const leftColumnOptions = visibleDayOptions.slice(0, splitIndex);
  const rightColumnOptions = visibleDayOptions.slice(splitIndex);
  const firstVisibleDay = visibleDayOptions[0]?.iso;
  const lastVisibleDay = visibleDayOptions[visibleDayOptions.length - 1]?.iso;
  const initialMobilePageIndex = useMemo(() => {
    if (!value) return 0;
    const selectedIndex = availableDays.findIndex((option) => option.iso === value);
    return selectedIndex >= 0 ? Math.floor(selectedIndex / mobilePageSize) : 0;
  }, [availableDays, mobilePageSize, value]);
  const [mobilePageIndex, setMobilePageIndex] = useState(initialMobilePageIndex);
  const maxMobilePageIndex = Math.max(0, Math.ceil(availableDays.length / mobilePageSize) - 1);
  const safeMobilePageIndex = Math.min(mobilePageIndex, maxMobilePageIndex);
  const canGoMobilePrev = safeMobilePageIndex > 0;
  const canGoMobileNext = safeMobilePageIndex < maxMobilePageIndex;
  const mobileVisibleDayOptions = availableDays.slice(
    safeMobilePageIndex * mobilePageSize,
    safeMobilePageIndex * mobilePageSize + mobilePageSize,
  );
  const firstMobileVisibleDay = mobileVisibleDayOptions[0]?.iso;
  const lastMobileVisibleDay = mobileVisibleDayOptions[mobileVisibleDayOptions.length - 1]?.iso;
  const selectedEndValue = calculateDeliveryEndDate(value, rentalDays);
  const selectedRentalDays = calculateRentalDays(value, selectedEndValue);

  return (
    <div className={cx("rounded-2xl border p-3 sm:p-4", error ? "border-red-500 bg-red-950/20" : "border-zinc-700 bg-zinc-950")}>
      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-2 px-1 py-1.5">
          <button
            type="button"
            onClick={() => setMobilePageIndex((previous) => Math.max(0, previous - 1))}
            disabled={!canGoMobilePrev}
            className="rounded-full border border-zinc-700 px-2.5 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            ←
          </button>
          <p className="text-center text-xs text-zinc-300">
            {firstMobileVisibleDay && lastMobileVisibleDay
              ? `${formatDisplayDateWithoutYear(firstMobileVisibleDay)} - ${formatDisplayDateWithoutYear(lastMobileVisibleDay)}`
              : "Vyberte datum"}
          </p>
          <button
            type="button"
            onClick={() => setMobilePageIndex((previous) => Math.min(maxMobilePageIndex, previous + 1))}
            disabled={!canGoMobileNext}
            className="rounded-full border border-zinc-700 px-2.5 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </button>
        </div>
        <div className="mt-2 space-y-2 px-1">
          {mobileVisibleDayOptions.map((option) => (
            <button
              key={option.iso}
              type="button"
              onClick={() => onChange(option.iso)}
              className={cx(
                "w-full rounded-full border px-3 py-2 text-left text-sm transition",
                value === option.iso
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] font-semibold text-black"
                  : "border-zinc-700 bg-zinc-900 text-zinc-100",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="flex items-center justify-between gap-2 px-1 py-1.5">
          <button
            type="button"
            onClick={() => setDesktopPageIndex((previous) => Math.max(0, previous - 1))}
            disabled={!canGoDesktopPrev}
            className="rounded-full border border-zinc-700 px-2.5 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            ←
          </button>
          <p className="text-center text-sm text-zinc-300">
            {firstVisibleDay && lastVisibleDay
              ? `${formatDisplayDateWithoutYear(firstVisibleDay)} - ${formatDisplayDateWithoutYear(lastVisibleDay)}`
              : "Vyberte datum"}
          </p>
          <button
            type="button"
            onClick={() => setDesktopPageIndex((previous) => Math.min(maxDesktopPageIndex, previous + 1))}
            disabled={!canGoDesktopNext}
            className="rounded-full border border-zinc-700 px-2.5 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto px-1 pb-1 pt-1">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-2">
              {leftColumnOptions.map((option) => (
                <button
                  key={option.iso}
                  type="button"
                  onClick={() => onChange(option.iso)}
                  className={cx(
                    "w-full rounded-full border px-3 py-2 text-left text-sm transition sm:text-base",
                    value === option.iso
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] font-semibold text-black"
                      : "border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-500",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {rightColumnOptions.map((option) => (
                <button
                  key={option.iso}
                  type="button"
                  onClick={() => onChange(option.iso)}
                  className={cx(
                    "w-full rounded-full border px-3 py-2 text-left text-sm transition sm:text-base",
                    value === option.iso
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] font-semibold text-black"
                      : "border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-500",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-300">
        {value && selectedEndValue ? (
          <p>
            Termín: <strong className="text-zinc-100">{formatDisplayDate(value)}</strong> -{" "}
            <strong className="text-zinc-100">{formatDisplayDate(selectedEndValue)}</strong>
            {selectedRentalDays ? ` (${formatCzechDayCount(selectedRentalDays)})` : ""}
          </p>
        ) : (
          <p>Vyberte datum přistavení.</p>
        )}
      </div>

      <p className="mt-3 text-xs text-zinc-400">Online objednávka nepodporuje víkendy. Vyberte pracovní den.</p>
    </div>
  );
}

function mobileProgressClass(index: number, activeStep: number) {
  if (index < activeStep) return "bg-emerald-500 border-emerald-500";
  if (index === activeStep) return "bg-[var(--color-accent)] border-[var(--color-accent)]";
  return "bg-zinc-700 border-zinc-600";
}

const chevronArrowPx = 14;

function chevronClipPath(index: number, total: number) {
  if (index === 0) {
    return `polygon(0 0, calc(100% - ${chevronArrowPx}px) 0, 100% 50%, calc(100% - ${chevronArrowPx}px) 100%, 0 100%)`;
  }

  if (index === total - 1) {
    return `polygon(${chevronArrowPx}px 0, 100% 0, 100% 100%, ${chevronArrowPx}px 100%, 0 50%)`;
  }

  return `polygon(${chevronArrowPx}px 0, calc(100% - ${chevronArrowPx}px) 0, 100% 50%, calc(100% - ${chevronArrowPx}px) 100%, ${chevronArrowPx}px 100%, 0 50%)`;
}

function clampPreviewPosition(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function buildWasteHoverPreview(waste: ContainerOrderWasteType, event: ReactMouseEvent<HTMLElement>): WasteHoverPreview {
  const x = clampPreviewPosition(event.clientX + 16, 16, window.innerWidth - wastePreviewWidth - 16);
  const y = clampPreviewPosition(event.clientY + 16, 16, window.innerHeight - wastePreviewHeight - 16);
  return { waste, x, y };
}

export function OrderWizard({
  initialPostalCode = "",
  initialWasteTypeId = "",
  wasteTypes,
}: {
  initialPostalCode?: string;
  initialWasteTypeId?: string;
  wasteTypes: ContainerOrderWasteType[];
}) {
  const availableWasteTypes = wasteTypes.length > 0 ? wasteTypes : FALLBACK_CONTAINER_ORDER_WASTE_TYPES;
  const defaultWasteTypeId = availableWasteTypes[0]?.id ?? "";
  const normalizedInitialPostalCode = initialPostalCode.replace(/\D/g, "").slice(0, 5);
  const normalizedInitialWasteTypeId = initialWasteTypeId.trim().toLowerCase();
  const resolvedInitialWasteTypeId = availableWasteTypes.some((wasteType) => wasteType.id === normalizedInitialWasteTypeId)
    ? normalizedInitialWasteTypeId
    : defaultWasteTypeId;

  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [data, setData] = useState<WizardData>(() => ({
    ...buildDefaultData(resolvedInitialWasteTypeId),
    postalCode: normalizedInitialPostalCode,
  }));
  const [showManualAddress, setShowManualAddress] = useState(false);
  const [postalAreaStatusVisible, setPostalAreaStatusVisible] = useState(false);

  const [addressInput, setAddressInput] = useState(normalizedInitialPostalCode);
  const [mapsRequested, setMapsRequested] = useState(false);
  const [mapsStatus, setMapsStatus] = useState<"idle" | "loading" | "ready" | "missing-key" | "error">("idle");
  const [mapsErrorDetail, setMapsErrorDetail] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationHelperText, setLocationHelperText] = useState<string | null>(null);
  const [resolvingAddress, setResolvingAddress] = useState(false);
  const [resolvingPin, setResolvingPin] = useState(false);
  const [resolvingAddressForMap, setResolvingAddressForMap] = useState(false);
  const [pinLocation, setPinLocation] = useState<PinLocation | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState<string | null>(null);
  const [pricePreview, setPricePreview] = useState<PriceEstimate | null>(null);
  const [wasteHoverPreview, setWasteHoverPreview] = useState<WasteHoverPreview | null>(null);

  const [callbackModalOpen, setCallbackModalOpen] = useState(false);
  const [callbackSubmitting, setCallbackSubmitting] = useState(false);
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [callbackSuccess, setCallbackSuccess] = useState<string | null>(null);
  const [callbackForm, setCallbackForm] = useState<CallbackForm>({
    phone: "",
    name: "",
    note: "",
  });

  const [companySuggestions, setCompanySuggestions] = useState<CompanyLookupMatch[]>([]);
  const [companyLookupLoading, setCompanyLookupLoading] = useState(false);
  const [companyLookupError, setCompanyLookupError] = useState<string | null>(null);
  const [icoLookupLoading, setIcoLookupLoading] = useState(false);
  const [icoLookupError, setIcoLookupError] = useState<string | null>(null);

  const [companyNameEditedByUser, setCompanyNameEditedByUser] = useState(false);
  const [dicEditedByUser, setDicEditedByUser] = useState(false);
  const [addressEditedByUser, setAddressEditedByUser] = useState(false);

  const draftHydratedRef = useRef(false);
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<GoogleAutocomplete | null>(null);
  const geocoderRef = useRef<GoogleGeocoder | null>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const mapMarkerRef = useRef<GoogleMarker | null>(null);
  const markerDragListenerRef = useRef<GoogleMapsListener | null>(null);
  const mapClickListenerRef = useRef<GoogleMapsListener | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const errorSummaryRef = useRef<HTMLDivElement | null>(null);
  const lastIcoLookupRef = useRef("");
  const resolveAddressFromPinRef = useRef<(nextPinLocation: PinLocation) => Promise<void>>(async () => undefined);

  const todayIso = useMemo(() => todayIsoLocalDate(), []);
  const selectedWaste = useMemo(
    () => availableWasteTypes.find((waste) => waste.id === data.wasteType),
    [availableWasteTypes, data.wasteType],
  );
  const shouldShowAddressMap = isAddressInputReadyForMap(addressInput) || Boolean(pinLocation);

  const postalCodeOk = useMemo(() => {
    if (data.postalCode.length !== 5) return false;
    return isSupportedPostalCode(data.postalCode);
  }, [data.postalCode]);

  const hasFullAddressData =
    data.postalCode.length === 5 &&
    Boolean(data.city.trim()) &&
    Boolean(data.street.trim()) &&
    Boolean(data.houseNumber.trim());

  const estimatedTotal = pricePreview?.total ?? null;

  const errorSummaryItems = useMemo(
    () =>
      (Object.keys(fieldErrors) as StepFieldKey[])
        .filter((fieldName) => Boolean(fieldErrors[fieldName]))
        .map((fieldName) => ({
          fieldName,
          label: stepFieldLabels[fieldName],
          message: fieldErrors[fieldName] ?? "",
          id: stepFieldInputIds[fieldName],
        })),
    [fieldErrors],
  );

  function update<K extends keyof WizardData>(key: K, value: WizardData[K]) {
    setData((previous) => ({ ...previous, [key]: value }));
  }

  function clearErrors() {
    setFieldErrors({});
    setSubmitError(null);
  }

  const clearFieldError = useCallback((fieldName: StepFieldKey) => {
    setFieldErrors((previous) => {
      if (!previous[fieldName]) return previous;
      const next = { ...previous };
      delete next[fieldName];
      return next;
    });
  }, []);

  function fieldClass(fieldName: StepFieldKey) {
    return cx(ui.field, fieldErrors[fieldName] ? "border-red-500 focus-visible:outline-red-400" : "");
  }

  function fieldErrorId(fieldName: StepFieldKey) {
    return `${stepFieldInputIds[fieldName]}-error`;
  }

  function fieldA11yProps(fieldName: StepFieldKey) {
    const hasError = Boolean(fieldErrors[fieldName]);
    return {
      id: stepFieldInputIds[fieldName],
      "aria-invalid": hasError,
      "aria-describedby": hasError ? fieldErrorId(fieldName) : undefined,
    };
  }

  useEffect(() => {
    setFurthestStep((previous) => Math.max(previous, step));
  }, [step]);

  useEffect(() => {
    if (availableWasteTypes.some((wasteType) => wasteType.id === data.wasteType)) {
      return;
    }

    setData((previous) => ({
      ...previous,
      wasteType: defaultWasteTypeId,
    }));
  }, [availableWasteTypes, data.wasteType, defaultWasteTypeId]);

  useEffect(() => {
    if (step !== 1) {
      setWasteHoverPreview(null);
    }
  }, [step]);

  useEffect(() => {
    const nextEndDate = calculateDeliveryEndDate(data.deliveryDateRequested, data.rentalDays);
    setData((previous) => (previous.deliveryDateEndRequested === nextEndDate ? previous : { ...previous, deliveryDateEndRequested: nextEndDate }));
  }, [data.deliveryDateRequested, data.rentalDays]);

  function goToStep(targetStep: number) {
    if (targetStep === step || targetStep < 0 || targetStep > furthestStep) return;

    if (targetStep > step) {
      for (let checkStep = step; checkStep < targetStep; checkStep += 1) {
        const stepErrors = validateStep(checkStep);
        if (Object.keys(stepErrors).length > 0) {
          setStep(checkStep);
          setFieldErrors(stepErrors);
          setSubmitError(null);
          return;
        }
      }

      setStep(targetStep);
      clearErrors();
      return;
    }

    setStep(targetStep);
    clearErrors();
  }

  function revealPostalAreaStatusIfAddressComplete() {
    if (
      data.postalCode.length === 5 &&
      data.city.trim() &&
      data.street.trim() &&
      data.houseNumber.trim()
    ) {
      setPostalAreaStatusVisible(true);
    }
  }

  function renderFieldError(fieldName: StepFieldKey) {
    const message = fieldErrors[fieldName];
    if (!message) return null;

    return (
      <p id={fieldErrorId(fieldName)} className="text-sm text-red-300">
        <span className="font-semibold">Chyba:</span> {message}
      </p>
    );
  }

  function clearPinLocation() {
    setPinLocation(null);
    setPinError(null);
  }

  function clearAddress() {
    const nextData = {
      ...data,
      postalCode: "",
      city: "",
      street: "",
      houseNumber: "",
    };

    setAddressInput("");
    setData(nextData);
    setAddressEditedByUser(true);
    setShowManualAddress(false);
    clearPinLocation();
    setPostalAreaStatusVisible(false);
    setFurthestStep(0);

    try {
      saveDraft({
        version: 1,
        updatedAt: Date.now(),
        data: nextData,
        addressInput: "",
        pinLocation: null,
        addressEditedByUser: true,
      });
    } catch {
      // Ignore storage write errors while clearing address.
    }
  }

  const applyParsedAddress = useCallback((parsed: ParsedAddress, options?: { keepPinLocation?: boolean }) => {
    setAddressInput(parsed.formattedAddress);
    setData((previous) => ({
      ...previous,
      postalCode: parsed.postalCode,
      city: parsed.city,
      street: parsed.street,
      houseNumber: parsed.houseNumber,
    }));

    if (!options?.keepPinLocation) {
      if (parsed.pinLocation) {
        setPinLocation(parsed.pinLocation);
      } else {
        setPinLocation(null);
      }
    }

    setAddressEditedByUser(false);
    setPostalAreaStatusVisible(true);
    clearFieldError("addressInput");
    clearFieldError("postalCode");
    clearFieldError("city");
    clearFieldError("street");
    clearFieldError("houseNumber");
  }, [clearFieldError]);

  function waitForGeocoderReady(timeoutMs = 8000) {
    return new Promise<boolean>((resolve) => {
      const startedAt = Date.now();
      const checkInterval = window.setInterval(() => {
        if (getGeocoder()) {
          window.clearInterval(checkInterval);
          resolve(true);
          return;
        }

        if (Date.now() - startedAt > timeoutMs) {
          window.clearInterval(checkInterval);
          resolve(false);
        }
      }, 120);
    });
  }

  function getGeocoder() {
    if (!window.google?.maps?.Geocoder) return null;
    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
    return geocoderRef.current;
  }

  function geocodeRequest(request: {
    address?: string;
    location?: PinLocation;
    componentRestrictions?: { country: string };
  }) {
    const geocoder = getGeocoder();

    if (!geocoder) {
      return Promise.resolve<ParsedAddress | null>(null);
    }

    return new Promise<ParsedAddress | null>((resolve) => {
      geocoder.geocode(request, (results, status) => {
        if (status !== "OK" || !results || results.length === 0) {
          resolve(null);
          return;
        }

        const parsed = parseAddress(
          results[0].address_components,
          results[0].formatted_address,
          results[0].geometry?.location,
        );
        resolve(parsed);
      });
    });
  }

  async function resolveAddressFromInputText() {
    if (!addressInput.trim() || !isAddressInputReadyForMap(addressInput) || mapsStatus !== "ready") return null;

    setResolvingAddress(true);
    try {
      const parsed = await geocodeRequest({
        address: addressInput.trim(),
        componentRestrictions: { country: "CZ" },
      });

      if (parsed) {
        applyParsedAddress(parsed);
      }

      return parsed;
    } finally {
      setResolvingAddress(false);
    }
  }

  async function fillAddressFromCurrentLocation() {
    setMapsRequested(true);
    setLocationHelperText("Načítám mapové podklady...");
    setSubmitError(null);

    if (!navigator.geolocation) {
      setSubmitError("Tento prohlížeč nepodporuje geolokaci.");
      setLocating(false);
      setLocationHelperText(null);
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void (async () => {
          setLocationHelperText("Vyhledávám adresu podle polohy...");
          const hasGeocoder = await waitForGeocoderReady();

          if (!hasGeocoder) {
            setSubmitError("Nepodařilo se načíst Google Maps, zkuste to prosím znovu.");
            setLocating(false);
            setLocationHelperText(null);
            return;
          }

          const parsed = await geocodeRequest({
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });

          if (!parsed) {
            setSubmitError("Nepodařilo se načíst adresu z aktuální polohy.");
            setLocating(false);
            setLocationHelperText(null);
            return;
          }

          applyParsedAddress(parsed);
          setLocating(false);
          setSubmitError(null);
          setLocationHelperText(null);
        })();
      },
      () => {
        setSubmitError("Přístup k poloze byl zamítnut nebo se polohu nepodařilo načíst.");
        setLocating(false);
        setLocationHelperText(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  async function resolveAddressFromPin(nextPinLocation: PinLocation) {
    setResolvingPin(true);
    setPinError(null);

    try {
      const parsed = await geocodeRequest({
        location: nextPinLocation,
      });

      if (!parsed) {
        setPinError("Pin jsme posunuli, ale adresu se nepodařilo automaticky doplnit. Upravte ji ručně.");
        return;
      }

      applyParsedAddress(parsed, { keepPinLocation: true });
      setSubmitError(null);
    } finally {
      setResolvingPin(false);
    }
  }

  resolveAddressFromPinRef.current = resolveAddressFromPin;

  const applyCompanyLookupMatch = useCallback((match: CompanyLookupMatch, force = false) => {
    const shouldApplyAddress = force || !addressEditedByUser;

    setData((previous) => {
      const next = { ...previous, ico: match.ico };

      if (force || !companyNameEditedByUser || !previous.companyName.trim()) {
        next.companyName = match.companyName;
      }

      if (match.dic && (force || !dicEditedByUser || !previous.dic.trim())) {
        next.dic = match.dic;
      }

      if (shouldApplyAddress) {
        next.postalCode = match.postalCode ?? next.postalCode;
        next.city = match.city ?? next.city;
        next.street = match.street ?? next.street;
        next.houseNumber = match.houseNumber ?? next.houseNumber;
      }

      return next;
    });

    if (shouldApplyAddress) {
      setPostalAreaStatusVisible(true);
    }

    clearFieldError("companyName");
    clearFieldError("ico");
  }, [addressEditedByUser, clearFieldError, companyNameEditedByUser, dicEditedByUser]);

  function validateStep(stepToValidate: number): ValidationErrors {
    const nextErrors: ValidationErrors = {};

    if (stepToValidate === 0) {
      const postalCode = data.postalCode.trim();
      const city = data.city.trim();
      const street = data.street.trim();
      const houseNumber = data.houseNumber.trim();

      if (!addressInput.trim() && !postalCode && !city && !street && !houseNumber) {
        nextErrors.addressInput = "Zadejte adresu a vyberte ji z nabídky, nebo ji vyplňte ručně.";
      }

      if (!postalCode) {
        nextErrors.postalCode = "Doplňte PSČ.";
      } else if (postalCode.length !== 5) {
        nextErrors.postalCode = "PSČ musí mít 5 číslic.";
      } else if (!isSupportedPostalCode(postalCode)) {
        nextErrors.postalCode = "Do této lokality zatím online nedoručujeme. Zavolejte dispečink.";
      }

      if (!city) {
        nextErrors.city = "Doplňte město.";
      }

      if (!street) {
        nextErrors.street = "Doplňte ulici.";
      }

      if (!houseNumber) {
        nextErrors.houseNumber = "Doplňte číslo popisné.";
      }
    }

    if (stepToValidate === 1) {
      if (!availableWasteTypes.some((wasteType) => wasteType.id === data.wasteType)) {
        nextErrors.wasteType = "Vyberte platný typ odpadu.";
      }

      const containerCount = Number(data.containerCount);
      if (!Number.isInteger(containerCount) || containerCount < 1 || containerCount > CONTAINER_PRODUCT.maxContainerCountPerOrder) {
        nextErrors.containerCount = `Počet kontejnerů musí být 1 až ${CONTAINER_PRODUCT.maxContainerCountPerOrder}.`;
      }
    }

    if (stepToValidate === 2) {
      const deliveryDateError = validateDeliveryDateRequested(data.deliveryDateRequested);
      if (deliveryDateError) {
        nextErrors.deliveryDateRequested = `${deliveryDateError}.`;
      }

      const normalizedRentalDays = normalizeRentalDays(data.rentalDays);
      if (!Number.isInteger(data.rentalDays) || normalizedRentalDays !== data.rentalDays) {
        nextErrors.rentalDays = `Počet dní pronájmu musí být ${rentalDayOptions[0]} až ${rentalDayOptions[rentalDayOptions.length - 1]}.`;
      }

      const deliveryDateEnd = calculateDeliveryEndDate(data.deliveryDateRequested, normalizedRentalDays);
      const deliveryDateEndError = deliveryDateEnd ? validateDeliveryDateRequested(deliveryDateEnd) : null;
      if (deliveryDateEndError) {
        nextErrors.rentalDays = "Vybraný počet dní vychází na víkend. Zvolte kratší pronájem nebo jiné datum přistavení.";
      }

      if (!TIME_WINDOW_VALUES.includes(data.timeWindowRequested)) {
        nextErrors.timeWindowRequested = "Vyberte časové okno přistavení.";
      }

      if (data.placementType === "verejny" && !data.permitConfirmed) {
        nextErrors.permitConfirmed = "Pro umístění na veřejnou komunikaci potvrďte povolení.";
      }
    }

    if (stepToValidate === 3) {
      if (data.customerType === "firma" && data.companyName.trim().length < 2) {
        nextErrors.companyName = "Doplňte název firmy.";
      }

      if (data.name.trim().length < 2) {
        nextErrors.name = "Doplňte jméno a příjmení.";
      }

      const normalizedIco = data.ico.replace(/\D/g, "");
      if (data.customerType === "firma" && !icoRegex.test(normalizedIco)) {
        nextErrors.ico = "Doplňte platné IČO (8 číslic).";
      }

      if (!emailRegex.test(data.email.trim())) {
        nextErrors.email = "Zadejte platný e-mail.";
      }

      if (!phoneRegex.test(data.phone.trim())) {
        nextErrors.phone = "Zadejte platné telefonní číslo.";
      }

      if (!data.gdprConsent) {
        nextErrors.gdprConsent = "Bez souhlasu GDPR nelze objednávku odeslat.";
      }
    }

    return nextErrors;
  }

  async function next() {
    const nextErrors = validateStep(step);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setSubmitError(null);
      trackAnalyticsEvent("order_validation_error", {
        step: step + 1,
        step_name: stepTitles[step],
        fields: Object.keys(nextErrors).join(","),
      });
      return;
    }

    if (step === 0 && mapsStatus === "ready" && !addressEditedByUser) {
      await resolveAddressFromInputText();
    }

    trackAnalyticsEvent("order_step_complete", {
      step: step + 1,
      step_name: stepTitles[step],
    });

    clearErrors();
    setStep((previous) => Math.min(previous + 1, stepTitles.length - 1));
  }

  function prev() {
    clearErrors();
    setStep((previous) => Math.max(previous - 1, 0));
  }

  function firstInvalidStep() {
    for (const stepToValidate of [0, 1, 2, 3]) {
      const stepErrors = validateStep(stepToValidate);
      if (Object.keys(stepErrors).length > 0) {
        return { stepToValidate, stepErrors };
      }
    }

    return null;
  }

  async function submit() {
    const invalid = firstInvalidStep();
    if (invalid) {
      setStep(invalid.stepToValidate);
      setFieldErrors(invalid.stepErrors);
      setSubmitError(null);
      trackAnalyticsEvent("order_validation_error", {
        step: invalid.stepToValidate + 1,
        step_name: stepTitles[invalid.stepToValidate],
        fields: Object.keys(invalid.stepErrors).join(","),
      });
      return;
    }

    setSubmitting(true);
    clearErrors();

    trackAnalyticsEvent("submit_order", { step: 4, step_name: stepTitles[3] });

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerType: data.customerType,
          name: data.name.trim(),
          companyName: data.companyName.trim() || undefined,
          ico: data.ico.replace(/\D/g, "") || undefined,
          dic: data.dic.trim() || undefined,
          email: data.email.trim(),
          phone: data.phone.trim(),
          postalCode: data.postalCode,
          city: data.city.trim(),
          street: data.street.trim(),
          houseNumber: data.houseNumber.trim(),
          wasteType: data.wasteType,
          containerSizeM3: 3,
          containerCount: data.containerCount,
          rentalDays: data.rentalDays,
          deliveryDateRequested: data.deliveryDateRequested,
          deliveryDateEndRequested: data.deliveryDateEndRequested,
          timeWindowRequested: data.timeWindowRequested,
          placementType: data.placementType,
          permitConfirmed: data.permitConfirmed,
          extras: {
            nakladkaOdNas: false,
            expresniPristaveni: false,
            opakovanyOdvoz: false,
          },
          note: data.note.trim() || undefined,
          callbackNote: data.callbackNote || undefined,
          website: data.website,
          pinLocation: pinLocation
            ? {
                lat: Number(pinLocation.lat.toFixed(7)),
                lng: Number(pinLocation.lng.toFixed(7)),
              }
            : undefined,
          gdprConsent: data.gdprConsent,
          marketingConsent: data.marketingConsent,
        }),
      });

      let payload: { orderId?: string; error?: string } = {};
      try {
        payload = (await response.json()) as { orderId?: string; error?: string };
      } catch {
        payload = {};
      }

      if (!response.ok || !payload.orderId) {
        const nextError = payload.error ?? "Objednávku se nepodařilo odeslat. Zkuste to prosím znovu.";
        setSubmitError(nextError);
        trackAnalyticsEvent("submit_order_fail", {
          step: 4,
          reason: nextError,
        });
        return;
      }

      setOrderId(payload.orderId);
      clearDraft();
      trackAnalyticsEvent("submit_order_success", {
        step: 4,
        order_id: payload.orderId,
      });
    } catch {
      setSubmitError("Objednávku se nepodařilo odeslat. Zkuste to prosím znovu.");
      trackAnalyticsEvent("submit_order_fail", {
        step: 4,
        reason: "network_error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function submitCallbackRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCallbackError(null);
    setCallbackSuccess(null);

    if (!phoneRegex.test(callbackForm.phone.trim())) {
      setCallbackError("Telefon je povinný a musí mít platný formát.");
      return;
    }

    setCallbackSubmitting(true);

    try {
      const response = await fetch("/api/callback-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: callbackForm.phone.trim(),
          name: callbackForm.name.trim() || undefined,
          note: callbackForm.note.trim() || undefined,
          wizardSnapshot: {
            postalCode: data.postalCode,
            city: data.city,
            street: data.street,
            houseNumber: data.houseNumber,
            wasteType: data.wasteType,
            containerCount: data.containerCount,
            rentalDays: data.rentalDays,
            deliveryDateRequested: data.deliveryDateRequested,
            deliveryDateEndRequested: data.deliveryDateEndRequested,
            timeWindowRequested: data.timeWindowRequested,
          },
        }),
      });

      let payload: CallbackResponse = {};
      try {
        payload = (await response.json()) as CallbackResponse;
      } catch {
        payload = {};
      }

      if (!response.ok || !payload.ok) {
        setCallbackError(payload.error ?? "Požadavek na zavolání se nepodařilo odeslat.");
        return;
      }

      const etaMinutes = payload.etaMinutes ?? callbackEtaFallbackMinutes;
      setCallbackSuccess(`Děkujeme, naši operátoři zavolají do ${etaMinutes} minut.`);
      setCallbackModalOpen(false);
      setData((previous) => ({
        ...previous,
        callbackNote: [
          `Callback požadován (${new Date().toLocaleString("cs-CZ")})`,
          callbackForm.note.trim() ? `poznámka: ${callbackForm.note.trim()}` : "",
        ]
          .filter(Boolean)
          .join("; "),
      }));
    } catch {
      setCallbackError("Požadavek na zavolání se nepodařilo odeslat. Zkuste to prosím znovu.");
    } finally {
      setCallbackSubmitting(false);
    }
  }

  useEffect(() => {
    trackAnalyticsEvent("start_order", {
      step: 1,
      step_name: stepTitles[0],
    });
  }, []);

  useEffect(() => {
    trackAnalyticsEvent("order_step_view", {
      step: step + 1,
      step_name: stepTitles[step],
    });
  }, [step]);

  useEffect(() => {
    if (!draftHydratedRef.current) {
      draftHydratedRef.current = true;

      try {
        const draft = readDraft();
        if (!draft) return;

        setData({
          ...buildDefaultData(defaultWasteTypeId),
          ...draft.data,
          wasteType: resolvedInitialWasteTypeId || draft.data.wasteType || defaultWasteTypeId,
          rentalDays: normalizeRentalDays(draft.data.rentalDays),
          deliveryDateRequested:
            typeof draft.data.deliveryDateRequested === "string" ? draft.data.deliveryDateRequested : "",
          deliveryDateEndRequested:
            typeof draft.data.deliveryDateEndRequested === "string" ? draft.data.deliveryDateEndRequested : "",
          expresniPristaveni: false,
        });
        setAddressInput(draft.addressInput);
        const shouldRestorePin = shouldRestorePinFromDraft(draft.data, draft.addressInput);
        const hasAddressData = Boolean(
          (draft.addressInput.trim() && !postalCodeRegex.test(draft.addressInput.trim()))
            || draft.data.city
            || draft.data.street
            || draft.data.houseNumber
            || draft.data.postalCode,
        );
        setAddressEditedByUser(
          typeof draft.addressEditedByUser === "boolean" ? draft.addressEditedByUser : !hasAddressData,
        );
        setPinLocation(shouldRestorePin ? draft.pinLocation : null);
      } catch {
        clearDraft();
      }
    }
  }, [defaultWasteTypeId, resolvedInitialWasteTypeId]);

  useEffect(() => {
    if (!draftHydratedRef.current || orderId) return;

    const timeout = window.setTimeout(() => {
      try {
        saveDraft({
          version: 1,
          updatedAt: Date.now(),
          data,
          addressInput,
          pinLocation,
          addressEditedByUser,
        });
      } catch {
        // Ignore storage errors (private mode/quota).
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [addressEditedByUser, addressInput, data, orderId, pinLocation]);

  useEffect(() => {
    if (errorSummaryItems.length === 0 && !submitError) return;
    errorSummaryRef.current?.focus();
  }, [errorSummaryItems.length, submitError]);

  useEffect(() => {
    if (!mapsRequested) return;

    let isMounted = true;
    const authFailureKey = "__codexGmAuthFailureOriginal";
    const globalWindow = window as Window & {
      gm_authFailure?: () => void;
      [authFailureKey]?: (() => void) | undefined;
    };

    globalWindow[authFailureKey] = globalWindow.gm_authFailure;
    globalWindow.gm_authFailure = () => {
      if (!isMounted) return;
      googleMapsLoadPromise = null;
      setMapsStatus("error");
      setMapsErrorDetail("Google API klíč je neplatný nebo nemá povolený přístup pro tento web.");
    };

    void (async () => {
      const apiKey = await resolveGoogleMapsApiKey();

      if (!isMounted) return;

      if (!apiKey) {
        setMapsStatus("missing-key");
        setMapsErrorDetail("Není nastaven Google Maps API klíč.");
        return;
      }

      setMapsStatus("loading");
      setMapsErrorDetail(null);

      try {
        await loadGoogleMapsApi(apiKey);

        if (!isMounted) return;

        if (!hasGooglePlacesLoaded()) {
          setMapsStatus("error");
          setMapsErrorDetail("Places knihovna není dostupná. Zkontrolujte API klíč a povolené služby.");
          return;
        }

        setMapsStatus("ready");
      } catch (mapsError) {
        if (!isMounted) return;
        googleMapsLoadPromise = null;
        setMapsStatus("error");
        setMapsErrorDetail(mapsError instanceof Error ? mapsError.message : "Nepodařilo se načíst Google Maps API.");
      }
    })();

    return () => {
      isMounted = false;
      globalWindow.gm_authFailure = globalWindow[authFailureKey];
      delete globalWindow[authFailureKey];
    };
  }, [mapsRequested]);

  useEffect(() => {
    if (mapsStatus !== "ready" || !addressInputRef.current || autocompleteRef.current || !window.google?.maps?.places) {
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "cz" },
      fields: ["formatted_address", "address_components", "geometry"],
    });

    autocompleteRef.current = autocomplete;

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const parsed = parseAddress(place.address_components, place.formatted_address ?? "", place.geometry?.location);

      if (!parsed) {
        return;
      }

      applyParsedAddress(parsed);
      clearErrors();
    });

    return () => {
      listener.remove();
      autocompleteRef.current = null;
    };
  }, [applyParsedAddress, mapsStatus]);

  useEffect(() => {
    if (shouldShowAddressMap) {
      setMapsRequested(true);
    }
  }, [shouldShowAddressMap]);

  useEffect(() => {
    if (!shouldShowAddressMap || mapsStatus !== "ready" || pinLocation) {
      return;
    }

    let cancelled = false;
    const timeout = window.setTimeout(() => {
      const trimmedAddress = addressInput.trim();
      if (!isAddressInputReadyForMap(trimmedAddress)) {
        return;
      }

      setResolvingAddressForMap(true);
      const geocoder = getGeocoder();
      if (!geocoder) {
        setResolvingAddressForMap(false);
        return;
      }

      geocoder.geocode(
        { address: trimmedAddress, componentRestrictions: { country: "CZ" } },
        (results, status) => {
          if (!cancelled) {
            if (status === "OK" && results && results.length > 0) {
              const nextPinLocation = normalizePinLocation(results[0].geometry?.location);
              if (nextPinLocation) {
                setPinLocation(nextPinLocation);
              }
            }

            setResolvingAddressForMap(false);
          }
        },
      );
    }, 350);

    return () => {
      cancelled = true;
      setResolvingAddressForMap(false);
      window.clearTimeout(timeout);
    };
  }, [addressInput, mapsStatus, pinLocation, shouldShowAddressMap]);

  useEffect(() => {
    if (step !== 0) {
      markerDragListenerRef.current?.remove();
      markerDragListenerRef.current = null;
      mapClickListenerRef.current?.remove();
      mapClickListenerRef.current = null;
      mapMarkerRef.current?.setMap(null);
      mapMarkerRef.current = null;
      mapRef.current = null;
      return;
    }

    if (
      !shouldShowAddressMap ||
      mapsStatus !== "ready" ||
      !mapContainerRef.current ||
      !window.google?.maps?.Map ||
      !window.google?.maps?.Marker ||
      !pinLocation
    ) {
      markerDragListenerRef.current?.remove();
      markerDragListenerRef.current = null;
      mapClickListenerRef.current?.remove();
      mapClickListenerRef.current = null;

      mapMarkerRef.current?.setMap(null);
      mapMarkerRef.current = null;
      mapRef.current = null;
      return;
    }

    if (mapRef.current && mapMarkerRef.current) {
      return;
    }

    const center = pinLocation;

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center,
      zoom: 17,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    const marker = new window.google.maps.Marker({
      map,
      position: center,
      draggable: true,
    });

    mapRef.current = map;
    mapMarkerRef.current = marker;

    markerDragListenerRef.current = marker.addListener("dragend", (event) => {
      const nextPinLocation = normalizePinLocation(event?.latLng);
      if (!nextPinLocation) return;

      setPinLocation(nextPinLocation);
      void resolveAddressFromPinRef.current(nextPinLocation);
    });

    mapClickListenerRef.current = map.addListener("click", (event) => {
      const nextPinLocation = normalizePinLocation(event?.latLng);
      if (!nextPinLocation) return;

      marker.setPosition(nextPinLocation);
      setPinLocation(nextPinLocation);
      void resolveAddressFromPinRef.current(nextPinLocation);
    });
  }, [mapsStatus, pinLocation, shouldShowAddressMap, step]);

  useEffect(() => {
    if (!shouldShowAddressMap || step !== 0 || !pinLocation || !mapRef.current || !mapMarkerRef.current) return;

    mapMarkerRef.current.setPosition(pinLocation);
    mapRef.current.panTo(pinLocation);

    const zoom = mapRef.current.getZoom() ?? 0;
    if (zoom < 17) {
      mapRef.current.setZoom(17);
    }
  }, [shouldShowAddressMap, pinLocation, step]);

  useEffect(
    () => () => {
      markerDragListenerRef.current?.remove();
      markerDragListenerRef.current = null;
      mapClickListenerRef.current?.remove();
      mapClickListenerRef.current = null;
      mapMarkerRef.current?.setMap(null);
      mapMarkerRef.current = null;
      mapRef.current = null;
    },
    [],
  );

  useEffect(() => {
    if (!postalCodeOk) {
      setPricePreview(null);
      setPricingError(
        data.postalCode.length === 5 && !isSupportedPostalCode(data.postalCode)
          ? "Pro zadané PSČ zatím online orientační kalkulaci nezobrazujeme."
          : null,
      );
      return;
    }

    const deliveryDateError = validateDeliveryDateRequested(data.deliveryDateRequested);
    if (deliveryDateError) {
      setPricePreview(null);
      setPricingError(null);
      return;
    }

    const normalizedRentalDays = normalizeRentalDays(data.rentalDays);
    if (!Number.isInteger(data.rentalDays) || normalizedRentalDays !== data.rentalDays) {
      setPricePreview(null);
      setPricingError(`Počet dní pronájmu musí být ${rentalDayOptions[0]} až ${rentalDayOptions[rentalDayOptions.length - 1]}.`);
      return;
    }

    const deliveryDateEnd = calculateDeliveryEndDate(data.deliveryDateRequested, normalizedRentalDays);
    const deliveryDateEndError = deliveryDateEnd ? validateDeliveryDateRequested(deliveryDateEnd) : null;
    if (deliveryDateEndError) {
      setPricePreview(null);
      setPricingError("Vybraný počet dní vychází na víkend. Zvolte kratší pronájem nebo jiné datum přistavení.");
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setPricingLoading(true);
      setPricingError(null);

      try {
        const response = await fetch("/api/pricing/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            postalCode: data.postalCode,
            wasteType: data.wasteType,
            containerCount: data.containerCount,
            rentalDays: normalizedRentalDays,
            extras: {
              nakladkaOdNas: false,
              expresniPristaveni: false,
              opakovanyOdvoz: false,
            },
          }),
        });

        const payload = (await response.json()) as PricingPreviewResponse;
        if (!response.ok || !payload.estimate) {
          setPricingError(payload.error ?? "Cenu se nepodařilo spočítat.");
          return;
        }

        setPricePreview(payload.estimate);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setPricingError("Cenu se nepodařilo spočítat.");
      } finally {
        setPricingLoading(false);
      }
    }, 320);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [
    data.containerCount,
    data.deliveryDateRequested,
    data.postalCode,
    data.rentalDays,
    data.wasteType,
    postalCodeOk,
  ]);

  useEffect(() => {
    if (data.customerType !== "firma") return;

    const normalizedIco = data.ico.replace(/\D/g, "").slice(0, 8);
    if (normalizedIco.length !== 8) {
      setIcoLookupError(null);
      return;
    }

    if (lastIcoLookupRef.current === normalizedIco) {
      return;
    }

    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      setIcoLookupLoading(true);
      setIcoLookupError(null);

      try {
        const response = await fetch(`/api/company-lookup?ico=${normalizedIco}`, { cache: "no-store" });
        const payload = (await response.json()) as CompanyLookupResponse;

        if (!response.ok) {
          if (!cancelled) {
            setIcoLookupError(payload.error ?? "ARES lookup se nepodařilo načíst.");
          }
          return;
        }

        if (!payload.match) {
          if (!cancelled) {
            setIcoLookupError("IČO nebylo v ARES nalezeno, doplňte údaje ručně.");
          }
          return;
        }

        if (!cancelled) {
          applyCompanyLookupMatch(payload.match, false);
          lastIcoLookupRef.current = normalizedIco;
          setIcoLookupError(null);
        }
      } catch {
        if (!cancelled) {
          setIcoLookupError("ARES lookup se nepodařilo načíst.");
        }
      } finally {
        if (!cancelled) {
          setIcoLookupLoading(false);
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [addressEditedByUser, applyCompanyLookupMatch, companyNameEditedByUser, data.customerType, data.ico, dicEditedByUser]);

  useEffect(() => {
    if (data.customerType !== "firma") {
      setCompanySuggestions([]);
      setCompanyLookupError(null);
      return;
    }

    const query = data.companyName.trim();
    if (!companyNameEditedByUser || query.length < 3) {
      setCompanySuggestions([]);
      setCompanyLookupError(null);
      return;
    }

    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      setCompanyLookupLoading(true);
      setCompanyLookupError(null);

      try {
        const response = await fetch(`/api/company-lookup?query=${encodeURIComponent(query)}`, {
          cache: "no-store",
        });
        const payload = (await response.json()) as CompanyLookupResponse;

        if (!response.ok) {
          if (!cancelled) {
            setCompanyLookupError(payload.error ?? "Vyhledání firmy se nepodařilo.");
            setCompanySuggestions([]);
          }
          return;
        }

        if (!cancelled) {
          setCompanySuggestions(payload.suggestions ?? []);
        }
      } catch {
        if (!cancelled) {
          setCompanyLookupError("Vyhledání firmy se nepodařilo.");
          setCompanySuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setCompanyLookupLoading(false);
        }
      }
    }, 320);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [companyNameEditedByUser, data.companyName, data.customerType]);

  if (orderId) {
    return (
      <div className="home-hero relative overflow-hidden rounded-2xl border border-zinc-700 px-5 py-5 sm:px-6 sm:py-6">
        <div className="home-hero-overlay absolute inset-0" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#F2C400]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-44 w-44 rounded-full bg-[#F2C400]/10 blur-3xl" />

        <h2 className="relative z-10 font-heading text-3xl font-bold text-white">Objednávka odeslána</h2>
        <p className="relative z-10 mt-2 text-white/90">Objednávku jsme přijali pod číslem {orderId}.</p>
        <p className="relative z-10 mt-1.5 text-white/85">Termín vždy potvrzuje operátor ručně. Ozveme se nejpozději do 1 pracovního dne.</p>
        <p className="relative z-10 mt-1.5 text-white/85">
          Potřebujete něco upravit hned? Zavolejte na{" "}
          <a className="font-semibold text-[#F2C400] underline decoration-[#F2C400]/70 underline-offset-2" href={CONTACT.phoneHref}>
            {CONTACT.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 p-2.5 sm:p-3 md:p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(242,196,0,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(242,196,0,0.06),transparent_45%)]" />

      <div className="relative space-y-3">
        <div className="hidden overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950/80 md:block">
          <ol className="flex items-stretch">
            {stepTitles.map((title, index) => (
              <li
                key={title}
                style={{
                  clipPath: chevronClipPath(index, stepTitles.length),
                  zIndex: stepTitles.length - index,
                }}
                className={cx(
                  "relative flex-1 py-2.5 pl-7 pr-7 text-[10px] font-semibold uppercase tracking-wide first:pl-4 md:pl-6 md:pr-7 md:text-xs",
                  index === step
                    ? "bg-[var(--color-accent)] text-black"
                    : index < step
                      ? "bg-[var(--color-accent)] text-black"
                      : index > step && index <= furthestStep
                        ? "bg-emerald-700/40 text-emerald-100"
                        : "bg-zinc-800 text-zinc-300",
                  index > 0 ? "-ml-1.5" : "",
                )}
              >
                <button
                  type="button"
                  onClick={() => goToStep(index)}
                  aria-current={index === step ? "step" : undefined}
                  className={cx(
                    "h-full w-full truncate text-left",
                    index <= furthestStep ? "cursor-pointer" : "cursor-not-allowed",
                  )}
                  disabled={index > furthestStep}
                >
                  <span className="truncate uppercase tracking-wide">{index + 1}. {title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="md:hidden">
          <ol className="flex items-center justify-between px-1">
            {stepTitles.map((title, index) => (
              <li key={title} className="flex w-1/4 justify-center">
                <button
                  type="button"
                  onClick={() => goToStep(index)}
                  disabled={index > furthestStep}
                  aria-current={index === step ? "step" : undefined}
                  className={cx(
                    "flex h-7 w-7 items-center justify-center rounded-full border",
                    index <= furthestStep ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                  )}
                >
                  <span
                    className={cx(
                      "h-2.5 w-2.5 rounded-full border",
                      mobileProgressClass(index, step),
                    )}
                    aria-hidden="true"
                  />
                  <span className="sr-only">
                    Krok {index + 1}: {title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {callbackSuccess ? (
          <div className="rounded-xl border border-emerald-600 bg-emerald-950/40 p-3 text-sm text-emerald-100">{callbackSuccess}</div>
        ) : null}

        {errorSummaryItems.length > 0 || submitError ? (
          <div
            ref={errorSummaryRef}
            tabIndex={-1}
            role="alert"
            className="rounded-xl border border-red-700 bg-red-950/40 p-3 text-sm"
          >
            <h3 className="text-sm font-bold text-red-200">Formulář obsahuje chyby</h3>
            {errorSummaryItems.length > 0 ? (
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-red-100">
                {errorSummaryItems.map((item) => (
                  <li key={item.fieldName}>
                    <a href={`#${item.id}`} className="underline underline-offset-2">
                      {item.label}: {item.message}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {submitError ? <p className="mt-2 text-red-100">{submitError}</p> : null}
          </div>
        ) : null}

        {step === 0 ? (
          <div className="space-y-3 rounded-2xl border border-zinc-700 bg-zinc-950/80 p-3">
            <p className="text-sm text-zinc-300">Zadejte adresu přistavení.</p>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-3">
                <label className="relative flex flex-col gap-2 text-sm">
                  Adresa přistavení
                  <div className="relative">
                    <input
                      {...fieldA11yProps("addressInput")}
                      ref={addressInputRef}
                      value={addressInput}
                      onFocus={() => {
                        setShowManualAddress(false);
                        setMapsRequested(true);
                      }}
                      onChange={(event) => {
                        setAddressInput(event.target.value);
                        setAddressEditedByUser(true);
                        if (!isAddressInputReadyForMap(event.target.value)) {
                          setPinLocation(null);
                        }
                        clearFieldError("addressInput");
                        setSubmitError(null);
                      }}
                      className={cx(fieldClass("addressInput"), "pr-10")}
                      placeholder="Např. Na Kodymce 1440/17, Praha"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      enterKeyHint="done"
                      name="order-address-autocomplete"
                      data-lpignore="true"
                      data-1p-ignore="true"
                    />
                    {addressInput.trim() ? (
                      <button
                        type="button"
                        onClick={clearAddress}
                        aria-label="Vyčistit adresu"
                        className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
                      >
                        ×
                      </button>
                    ) : null}
                  </div>
                  {renderFieldError("addressInput")}
                </label>

                <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        void fillAddressFromCurrentLocation();
                      }}
                      disabled={locating}
                      className="text-xs font-semibold text-zinc-300 underline decoration-zinc-500 underline-offset-4 hover:text-[var(--color-accent)]"
                    >
                      {locating ? "Načítám polohu..." : "Použít aktuální polohu"}
                    </button>
                </div>

                {mapsStatus === "loading" ? (
                  <p className="text-xs text-zinc-400">Načítám Google adresní našeptávač...</p>
                ) : null}
                {locationHelperText && <p className="text-xs text-zinc-400">{locationHelperText}</p>}
                {mapsStatus === "missing-key" ? (
                  <p className="text-xs text-amber-300">
                    Chybí Google API klíč. Nastavte `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` nebo `GOOGLE_MAPS_API_KEY`.
                  </p>
                ) : null}
                {mapsStatus === "error" ? (
                  <p className="text-xs text-amber-300">
                    Google adresní našeptávač se nepodařilo načíst.
                    {mapsErrorDetail ? ` ${mapsErrorDetail}` : ""}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={() => setShowManualAddress((previous) => !previous)}
                  className="text-xs font-semibold text-zinc-300 underline decoration-zinc-500 underline-offset-4 hover:text-[var(--color-accent)]"
                >
                  {showManualAddress ? "Skrýt ruční zadání" : "Ručně zadat adresu"}
                </button>

                {showManualAddress ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm">
                      PSČ
                      <input
                        {...fieldA11yProps("postalCode")}
                        value={data.postalCode}
                        onChange={(event) => {
                          update("postalCode", event.target.value.replace(/\D/g, "").slice(0, 5));
                          setAddressEditedByUser(true);
                          clearFieldError("postalCode");
                          setSubmitError(null);
                        }}
                        onBlur={() => {
                          if (data.postalCode.length === 5) {
                            revealPostalAreaStatusIfAddressComplete();
                          }
                        }}
                        className={fieldClass("postalCode")}
                        inputMode="numeric"
                      />
                      {renderFieldError("postalCode")}
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                      Město
                      <input
                        {...fieldA11yProps("city")}
                        value={data.city}
                        onChange={(event) => {
                          update("city", event.target.value);
                          setAddressEditedByUser(true);
                          clearFieldError("city");
                          setSubmitError(null);
                        }}
                        onBlur={revealPostalAreaStatusIfAddressComplete}
                        className={fieldClass("city")}
                      />
                      {renderFieldError("city")}
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                      Ulice
                      <input
                        {...fieldA11yProps("street")}
                        value={data.street}
                        onChange={(event) => {
                          update("street", event.target.value);
                          setAddressEditedByUser(true);
                          clearFieldError("street");
                          setSubmitError(null);
                        }}
                        onBlur={revealPostalAreaStatusIfAddressComplete}
                        className={fieldClass("street")}
                      />
                      {renderFieldError("street")}
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                      Číslo popisné
                      <input
                        {...fieldA11yProps("houseNumber")}
                        value={data.houseNumber}
                        onChange={(event) => {
                          update("houseNumber", event.target.value);
                          setAddressEditedByUser(true);
                          clearFieldError("houseNumber");
                          setSubmitError(null);
                        }}
                        onBlur={revealPostalAreaStatusIfAddressComplete}
                        className={fieldClass("houseNumber")}
                      />
                      {renderFieldError("houseNumber")}
                    </label>
                  </div>
                ) : null}
                <div className="min-h-5">
                  {hasFullAddressData && postalAreaStatusVisible ? (
                    <p className={cx("text-sm", postalCodeOk ? "text-emerald-300" : "text-amber-300")}>
                      {postalCodeOk ? "PSČ je v obsluhované oblasti." : "PSČ zatím není v online obsluze."}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <div
                  className={cx(
                    "overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 transition-all duration-200 ease-out",
                    shouldShowAddressMap ? "max-h-[208px] opacity-100 p-2" : "max-h-0 border-transparent p-0 opacity-0",
                  )}
                >
                  <div
                    className={cx(
                      "relative w-full overflow-hidden rounded-xl border border-zinc-700 transition-all duration-200 ease-out",
                      shouldShowAddressMap
                        ? "h-[132px] scale-100 sm:h-[170px] md:h-[184px]"
                        : "h-0 scale-95",
                    )}
                  >
                    {shouldShowAddressMap && (mapsStatus === "ready" ? (
                      pinLocation ? (
                        <div ref={mapContainerRef} className="h-full w-full" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                          {resolvingAddressForMap ? <span className="sr-only">Hledám polohu...</span> : null}
                        </div>
                      )
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                        {mapsStatus === "loading" ? "Načítám mapu..." : "Mapa se načítá..."}
                      </div>
                    ))}
                  </div>
                </div>
                {pinError ? <p className="mt-2 text-xs text-amber-300">{pinError}</p> : null}
              </div>
            </div>

          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-2.5 rounded-2xl border border-zinc-700 bg-zinc-950/80 p-2.5 sm:space-y-3 sm:p-3">
            <p className="text-sm text-zinc-300">Vyberte typ odpadu, počet kontejnerů a doplňkové služby.</p>

            <div id="order-waste-type" className="grid gap-1.5 sm:grid-cols-2 sm:gap-2">
              {availableWasteTypes.map((waste) => (
                <button
                  key={waste.id}
                  type="button"
                  onClick={() => update("wasteType", waste.id)}
                  onMouseEnter={(event) => {
                    setWasteHoverPreview(buildWasteHoverPreview(waste, event));
                  }}
                  onMouseMove={(event) => {
                    setWasteHoverPreview(buildWasteHoverPreview(waste, event));
                  }}
                  onMouseLeave={() => {
                    setWasteHoverPreview(null);
                  }}
                  className={cx(
                    "rounded-lg border px-3 py-2 text-left sm:rounded-xl sm:p-3",
                    waste.id === data.wasteType
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/20"
                      : "border-zinc-700 bg-zinc-900 hover:border-zinc-500",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-tight sm:text-base">{waste.label}</p>
                    <p className="shrink-0 text-sm font-semibold text-[var(--color-accent)] sm:text-base">{waste.priceLabel}</p>
                  </div>
                </button>
              ))}
            </div>
            {renderFieldError("wasteType")}

            {wasteHoverPreview ? (
              <div
                className="pointer-events-none fixed z-40 hidden overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950 shadow-2xl shadow-black/50 md:block"
                style={{ left: wasteHoverPreview.x, top: wasteHoverPreview.y }}
              >
                <div className="relative h-52 w-80">
                  <Image
                    src={wasteHoverPreview.waste.imageUrl}
                    alt={wasteHoverPreview.waste.imageAlt || wasteHoverPreview.waste.label}
                    width={1280}
                    height={720}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                </div>
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-zinc-100">{wasteHoverPreview.waste.label}</p>
                  <p className="text-xs text-zinc-300">{wasteHoverPreview.waste.priceLabel}</p>
                </div>
              </div>
            ) : null}

            <article className="grid gap-3 rounded-xl border border-zinc-700 bg-zinc-900/70 p-3 sm:grid-cols-[132px_auto_1fr] sm:items-center">
              <div className="relative h-28 overflow-hidden rounded-lg border border-zinc-700 sm:h-24">
                <Image
                  src="/photos/kontejnery/kontejner-zluty-01.png"
                  alt={`Kontejner ${CONTAINER_PRODUCT.availableNow} připravený k přistavení`}
                  width={700}
                  height={420}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">Počet kontejnerů</p>
                <div className="mt-1.5 inline-flex items-center rounded-full border border-zinc-700 bg-zinc-950 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      update("containerCount", Math.max(1, data.containerCount - 1));
                      clearFieldError("containerCount");
                    }}
                    disabled={data.containerCount <= 1}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-lg font-semibold text-zinc-100 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Snížit počet kontejnerů"
                  >
                    -
                  </button>
                  <span className="min-w-11 px-3 text-center text-base font-bold text-zinc-100">{data.containerCount}</span>
                  <button
                    type="button"
                    onClick={() => {
                      update("containerCount", Math.min(CONTAINER_PRODUCT.maxContainerCountPerOrder, data.containerCount + 1));
                      clearFieldError("containerCount");
                    }}
                    disabled={data.containerCount >= CONTAINER_PRODUCT.maxContainerCountPerOrder}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-lg font-semibold text-zinc-100 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Zvýšit počet kontejnerů"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <p className="text-base font-bold text-zinc-100">
                  Aktuálně objednáváte kontejner {CONTAINER_PRODUCT.availableNow}
                </p>
                <p className="mt-1 text-sm text-zinc-300">
                  V této online objednávce je dostupná velikost 3 metry krychlové.
                </p>
              </div>
            </article>

            <div>
              {renderFieldError("containerCount")}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3 rounded-2xl border border-zinc-700 bg-zinc-950/80 p-3">
            <DeliveryDatePicker
              value={data.deliveryDateRequested}
              rentalDays={data.rentalDays}
              onChange={(nextDate) => {
                update("deliveryDateRequested", nextDate);
                clearFieldError("deliveryDateRequested");
                clearFieldError("rentalDays");
                setSubmitError(null);
              }}
              error={fieldErrors.deliveryDateRequested || fieldErrors.rentalDays}
              todayIso={todayIso}
            />
            {renderFieldError("deliveryDateRequested")}

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300">Počet dní pronájmu</p>
              <div id={stepFieldInputIds.rentalDays} className="inline-flex flex-wrap items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 p-1">
                {rentalDayOptions.map((days) => {
                  const optionEndDate = calculateDeliveryEndDate(data.deliveryDateRequested, days);
                  const optionDisabled = Boolean(
                    data.deliveryDateRequested
                    && optionEndDate
                    && validateDeliveryDateRequested(optionEndDate),
                  );

                  return (
                    <button
                      key={days}
                      type="button"
                      onClick={() => {
                        update("rentalDays", days);
                        clearFieldError("rentalDays");
                        setSubmitError(null);
                      }}
                      disabled={optionDisabled}
                      className={cx(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition sm:text-sm",
                        data.rentalDays === days
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-black"
                          : "border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-500",
                        optionDisabled ? "cursor-not-allowed opacity-40 hover:border-zinc-700" : "",
                      )}
                    >
                      {formatCzechDayCount(days)}
                    </button>
                  );
                })}
              </div>
              {renderFieldError("rentalDays")}
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300">Časové okno (1 hodina)</p>
              <div id={stepFieldInputIds.timeWindowRequested} className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
                {TIME_WINDOW_VALUES.map((windowValue) => (
                  <button
                    key={windowValue}
                    type="button"
                    onClick={() => {
                      update("timeWindowRequested", windowValue);
                      clearFieldError("timeWindowRequested");
                    }}
                    className={cx(
                      "rounded-lg border px-2 py-1.5 text-xs font-medium leading-none sm:px-2.5 sm:py-1.5 sm:text-sm",
                      data.timeWindowRequested === windowValue
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-black"
                        : "border-zinc-700 bg-zinc-900 hover:border-zinc-500",
                    )}
                  >
                    {windowValue}
                  </button>
                ))}
              </div>
              {renderFieldError("timeWindowRequested")}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                Umístění kontejneru
                <div className="relative">
                  <select
                    value={data.placementType}
                    onChange={(event) => {
                      const nextPlacementType = event.target.value as "soukromy" | "verejny";
                      update("placementType", nextPlacementType);
                      // Force explicit confirmation each time public placement is selected.
                      update("permitConfirmed", false);
                      clearFieldError("permitConfirmed");
                    }}
                    className={cx(ui.field, "appearance-none pr-10")}
                  >
                    <option value="soukromy">Soukromý pozemek</option>
                    <option value="verejny">Veřejná komunikace</option>
                  </select>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-b-2 border-r-2 border-zinc-400"
                  />
                </div>
              </label>

              <div className="text-sm">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Orientační kalkulace</p>
                {pricingLoading ? <p className="mt-1 text-zinc-400">Přepočítávám cenu...</p> : null}
                {pricingError ? <p className="mt-1 text-amber-300">{pricingError}</p> : null}
                {pricePreview ? (
                  <p className="mt-1.5 text-zinc-200">
                    Pro vybraný termín orientačně{" "}
                    <strong className="font-semibold text-[var(--color-accent)]">{formatPrice(pricePreview.total)}</strong>.
                  </p>
                ) : (
                  <p className="mt-1.5 text-zinc-400">Cena se zobrazí po výběru data přistavení.</p>
                )}
                <p className="mt-1 text-xs text-zinc-500">Konečnou cenu vždy potvrzuje operátor podle místa přistavení.</p>
              </div>
            </div>

            {data.placementType === "verejny" ? (
              <div
                className={cx(
                  "rounded-xl border p-3",
                  fieldErrors.permitConfirmed ? "border-red-500 bg-red-950/35" : "border-zinc-600 bg-zinc-900/70",
                )}
              >
                <label className="flex items-start gap-3 text-sm">
                  <input
                    {...fieldA11yProps("permitConfirmed")}
                    type="checkbox"
                    checked={data.permitConfirmed}
                    onChange={(event) => {
                      update("permitConfirmed", event.target.checked);
                      clearFieldError("permitConfirmed");
                    }}
                    className="mt-0.5 h-4 w-4 accent-[var(--color-accent)]"
                  />
                  <span>
                    <span className="block font-semibold text-zinc-100">Veřejná komunikace vyžaduje povolení</span>
                    <span className="mt-1 block text-zinc-300">Potvrzuji, že mám povolení k záboru veřejné komunikace.</span>
                  </span>
                </label>
                <div className="mt-2">{renderFieldError("permitConfirmed")}</div>
              </div>
            ) : null}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3 rounded-2xl border border-zinc-700 bg-zinc-950/80 p-3">
            <div className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 p-1 text-sm">
              <button
                type="button"
                onClick={() => {
                  update("customerType", "firma");
                }}
                className={cx(
                  "rounded-full px-4 py-2 font-semibold",
                  data.customerType === "firma" ? "bg-zinc-100 text-zinc-900" : "text-zinc-300 hover:bg-zinc-800",
                )}
              >
                Firma
              </button>
              <button
                type="button"
                onClick={() => {
                  setData((previous) => ({
                    ...previous,
                    customerType: "fo",
                    name: previous.name.trim() ? previous.name : previous.companyName,
                  }));
                }}
                className={cx(
                  "rounded-full px-4 py-2 font-semibold",
                  data.customerType === "fo" ? "bg-zinc-100 text-zinc-900" : "text-zinc-300 hover:bg-zinc-800",
                )}
              >
                Člověk
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {data.customerType === "firma" ? (
                <>
                  <div className="flex flex-col gap-2 text-sm sm:col-span-2">
                    <label htmlFor={stepFieldInputIds.companyName}>Název firmy (ARES našeptávač)</label>
                    <input
                      {...fieldA11yProps("companyName")}
                      value={data.companyName}
                      onChange={(event) => {
                        update("companyName", event.target.value);
                        setCompanyNameEditedByUser(true);
                        clearFieldError("companyName");
                      }}
                      className={fieldClass("companyName")}
                      autoComplete="organization"
                      placeholder="Začněte psát název firmy"
                    />
                    {renderFieldError("companyName")}

                    {companyLookupLoading ? <p className="text-xs text-zinc-400">Vyhledávám firmy v ARES...</p> : null}
                    {companyLookupError ? <p className="text-xs text-amber-300">{companyLookupError}</p> : null}

                {companySuggestions.length > 0 ? (
                      <ul className="max-h-44 overflow-auto rounded-xl border border-zinc-700 bg-zinc-900">
                        {companySuggestions.map((suggestion) => (
                          <li key={suggestion.ico}>
                            <button
                              type="button"
                              onClick={() => {
                                setCompanyNameEditedByUser(false);
                                setDicEditedByUser(false);
                                setAddressEditedByUser(false);
                                applyCompanyLookupMatch(suggestion, true);
                                setCompanySuggestions([]);
                                setCompanyLookupError(null);
                              }}
                              className="w-full border-b border-zinc-800 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-zinc-800"
                            >
                              <p className="font-semibold text-zinc-100">{suggestion.companyName}</p>
                              <p className="text-xs text-zinc-400">IČO {suggestion.ico}{suggestion.addressText ? ` · ${suggestion.addressText}` : ""}</p>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  <label className="flex flex-col gap-2 text-sm">
                    IČO
                    <input
                      {...fieldA11yProps("ico")}
                      value={data.ico}
                      onChange={(event) => {
                        update("ico", event.target.value.replace(/\D/g, "").slice(0, 8));
                        clearFieldError("ico");
                        setIcoLookupError(null);
                        lastIcoLookupRef.current = "";
                      }}
                      className={fieldClass("ico")}
                      inputMode="numeric"
                    />
                    {renderFieldError("ico")}
                    {icoLookupLoading ? <span className="text-xs text-zinc-400">Načítám data firmy podle IČO...</span> : null}
                    {icoLookupError ? <span className="text-xs text-amber-300">{icoLookupError}</span> : null}
                  </label>

                  <label className="flex flex-col gap-2 text-sm">
                    DIČ (volitelné)
                    <input
                      value={data.dic}
                      onChange={(event) => {
                        update("dic", event.target.value);
                        setDicEditedByUser(true);
                      }}
                      className={ui.field}
                    />
                  </label>
                </>
              ) : null}

              <label className="flex flex-col gap-2 text-sm sm:col-span-2">
                Jméno a příjmení
                <input
                  {...fieldA11yProps("name")}
                  value={data.name}
                  onChange={(event) => {
                    update("name", event.target.value);
                    clearFieldError("name");
                    setSubmitError(null);
                  }}
                  className={fieldClass("name")}
                  autoComplete="name"
                />
                {renderFieldError("name")}
              </label>

              <label className="flex flex-col gap-2 text-sm">
                E-mail
                <input
                  {...fieldA11yProps("email")}
                  value={data.email}
                  onChange={(event) => {
                    update("email", event.target.value);
                    clearFieldError("email");
                    setSubmitError(null);
                  }}
                  className={fieldClass("email")}
                  type="email"
                  autoComplete="email"
                />
                {renderFieldError("email")}
              </label>

              <label className="flex flex-col gap-2 text-sm">
                Telefon
                <input
                  {...fieldA11yProps("phone")}
                  value={data.phone}
                  onChange={(event) => {
                    update("phone", event.target.value);
                    clearFieldError("phone");
                    setSubmitError(null);
                  }}
                  className={fieldClass("phone")}
                  inputMode="tel"
                  autoComplete="tel"
                />
                {renderFieldError("phone")}
              </label>

              <label className="flex flex-col gap-2 text-sm sm:col-span-2">
                Poznámka k objednávce (volitelné)
                <textarea
                  value={data.note}
                  onChange={(event) => update("note", event.target.value)}
                  className={ui.field}
                  rows={3}
                />
              </label>
            </div>

            <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-2.5 text-sm">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Souhrn objednávky</p>
              <div className="mt-2 grid gap-1 text-zinc-200">
                <p>
                  <span className="text-zinc-400">Adresa:</span> {data.street} {data.houseNumber}, {data.city}, {data.postalCode}
                </p>
                {pinLocation ? (
                  <p>
                    <span className="text-zinc-400">Pin:</span> {formatPinLocation(pinLocation)}
                  </p>
                ) : null}
                <p>
                  <span className="text-zinc-400">Odpad:</span> {selectedWaste?.label ?? "nevybráno"}
                </p>
                <p>
                  <span className="text-zinc-400">Kontejner:</span> {CONTAINER_PRODUCT.availableNow}, počet {data.containerCount}
                </p>
                <p>
                  <span className="text-zinc-400">Termín:</span>{" "}
                  {data.deliveryDateRequested && data.deliveryDateEndRequested
                    ? `${formatDisplayDate(data.deliveryDateRequested)} - ${formatDisplayDate(data.deliveryDateEndRequested)}`
                    : "nezadán"}{" "}
                  ({data.timeWindowRequested})
                </p>
                <p>
                  <span className="text-zinc-400">Pronájem:</span> {formatCzechDayCount(data.rentalDays)}
                </p>
                <p>
                  <span className="text-zinc-400">Orientační cena:</span>{" "}
                  {estimatedTotal ? (
                    <strong className="text-[var(--color-accent)]">{formatPrice(estimatedTotal)}</strong>
                  ) : (
                    "bude dopočítána"
                  )}
                </p>
              </div>
              <p className="mt-2 text-xs text-zinc-400">Finální termín i cenu potvrzuje operátor telefonicky/e-mailem.</p>
            </div>

            <label
              className={cx(
                "flex items-start gap-3 rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-sm",
                fieldErrors.gdprConsent ? "border-red-500" : "",
              )}
            >
              <input
                {...fieldA11yProps("gdprConsent")}
                type="checkbox"
                checked={data.gdprConsent}
                onChange={(event) => {
                  update("gdprConsent", event.target.checked);
                  clearFieldError("gdprConsent");
                }}
                className="mt-1"
              />
              <span>
                Souhlasím se zpracováním osobních údajů podle{" "}
                <Link href="/gdpr" className="text-[var(--color-accent)] underline">
                  GDPR
                </Link>{" "}
                a{" "}
                <Link href="/obchodni-podminky" className="text-[var(--color-accent)] underline">
                  obchodních podmínek
                </Link>
                .
                {renderFieldError("gdprConsent")}
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 text-sm">
              <input
                type="checkbox"
                checked={data.marketingConsent}
                onChange={(event) => update("marketingConsent", event.target.checked)}
                className="mt-1"
              />
              Chci dostávat obchodní sdělení (volitelné).
            </label>
          </div>
        ) : null}

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={data.website}
          onChange={(event) => update("website", event.target.value)}
          className="sr-only"
          aria-hidden="true"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={prev} disabled={step === 0 || submitting} className={ui.buttonSecondary}>
              Zpět
            </button>
            <button
              type="button"
              onClick={() => {
                setCallbackError(null);
                setCallbackSuccess(null);
                setCallbackForm((previous) => ({
                  ...previous,
                  phone: previous.phone || data.phone,
                  name: previous.name || data.name,
                }));
                setCallbackModalOpen(true);
              }}
              className="text-xs text-zinc-400 underline decoration-zinc-500 underline-offset-4 transition hover:text-zinc-200"
            >
              Zavolejte mi
            </button>
          </div>

          {step < stepTitles.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                void next();
              }}
              disabled={submitting || resolvingAddress || resolvingPin}
              className={ui.buttonPrimary}
            >
              {resolvingAddress ? "Ověřuji adresu..." : resolvingPin ? "Aktualizuji pin..." : "Pokračovat"}
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={submitting} className={ui.buttonPrimary}>
              {submitting ? "Odesílám..." : "Odeslat objednávku"}
            </button>
          )}
        </div>
      </div>

      {callbackModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="presentation"
          onClick={() => {
            setCallbackModalOpen(false);
            setCallbackError(null);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-950 p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-heading text-lg font-bold">Zavolejte mi</h3>
              <button
                type="button"
                onClick={() => {
                  setCallbackModalOpen(false);
                  setCallbackError(null);
                }}
                className="rounded-lg border border-zinc-700 px-3 py-1 text-sm"
            >
              Zavřít
            </button>
          </div>

          <p className="mt-2 text-sm text-zinc-300">Pošleme kontakt operátorovi, objednávku pak můžete dokončit online.</p>

            <form className="mt-4 space-y-3" onSubmit={(event) => void submitCallbackRequest(event)}>
              <label className="flex flex-col gap-2 text-sm">
                Telefon (povinné)
                <input
                  value={callbackForm.phone}
                  onChange={(event) => setCallbackForm((previous) => ({ ...previous, phone: event.target.value }))}
                  className={ui.field}
                  required
                  inputMode="tel"
                  autoComplete="tel"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm">
                Jméno (volitelné)
                <input
                  value={callbackForm.name}
                  onChange={(event) => setCallbackForm((previous) => ({ ...previous, name: event.target.value }))}
                  className={ui.field}
                  autoComplete="name"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm">
                Poznámka (volitelné)
                <textarea
                  value={callbackForm.note}
                  onChange={(event) => setCallbackForm((previous) => ({ ...previous, note: event.target.value }))}
                  className={ui.field}
                  rows={3}
                />
              </label>

              {callbackError ? <p className="text-sm text-red-300">{callbackError}</p> : null}

              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCallbackModalOpen(false);
                    setCallbackError(null);
                  }}
                  className={ui.buttonSecondary}
                >
                  Zrušit
                </button>
                <button type="submit" disabled={callbackSubmitting} className={ui.buttonPrimary}>
                  {callbackSubmitting ? "Odesílám..." : "Požádat o kontakt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
