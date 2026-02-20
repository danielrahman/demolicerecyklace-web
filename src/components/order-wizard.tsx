"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { WASTE_TYPES } from "@/lib/catalog";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { CONTACT, CONTAINER_PRODUCT, SERVICE_AREA } from "@/lib/site-config";
import { isSupportedPostalCode } from "@/lib/service-area";
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
  wasteType: "sut-cista" | "sut-smesna" | "objemny" | "zemina" | "drevo";
  containerCount: number;
  deliveryDateRequested: string;
  timeWindowRequested: "rano" | "dopoledne" | "odpoledne";
  placementType: "soukromy" | "verejny";
  permitConfirmed: boolean;
  nakladkaOdNas: boolean;
  expresniPristaveni: boolean;
  opakovanyOdvoz: boolean;
  note: string;
  gdprConsent: boolean;
  marketingConsent: boolean;
};

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type PinLocation = {
  lat: number;
  lng: number;
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
  | "containerCount"
  | "deliveryDateRequested"
  | "permitConfirmed"
  | "name"
  | "companyName"
  | "ico"
  | "email"
  | "phone"
  | "gdprConsent";

type ValidationErrors = Partial<Record<StepFieldKey, string>>;

const defaultData: WizardData = {
  customerType: "fo",
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
  wasteType: "sut-cista",
  containerCount: 1,
  deliveryDateRequested: "",
  timeWindowRequested: "dopoledne",
  placementType: "soukromy",
  permitConfirmed: false,
  nakladkaOdNas: false,
  expresniPristaveni: false,
  opakovanyOdvoz: false,
  note: "",
  gdprConsent: false,
  marketingConsent: false,
};

const stepTitles = ["Adresa", "Odpad a kontejner", "Termín", "Zákazník", "Souhrn"] as const;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+420|\+421|0)?\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/;
const icoRegex = /^\d{8}$/;
const directGoogleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
const defaultMapCenter: PinLocation = { lat: 50.087451, lng: 14.420671 };

const stepFieldLabels: Record<StepFieldKey, string> = {
  addressInput: "Adresa přistavení",
  postalCode: "PSČ",
  city: "Město",
  street: "Ulice",
  houseNumber: "Číslo popisné",
  containerCount: "Počet kontejnerů",
  deliveryDateRequested: "Datum přistavení",
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
  containerCount: "order-container-count",
  deliveryDateRequested: "order-delivery-date",
  permitConfirmed: "order-permit-confirmed",
  name: "order-name",
  companyName: "order-company-name",
  ico: "order-ico",
  email: "order-email",
  phone: "order-phone",
  gdprConsent: "order-gdpr-consent",
};

let googleMapsLoadPromise: Promise<void> | null = null;

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

function parseIsoDate(value: string) {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function todayLocalIsoDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

export function OrderWizard({ initialPostalCode = "" }: { initialPostalCode?: string }) {
  const normalizedInitialPostalCode = initialPostalCode.replace(/\D/g, "").slice(0, 5);

  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(() => ({
    ...defaultData,
    postalCode: normalizedInitialPostalCode,
  }));
  const [addressInput, setAddressInput] = useState(normalizedInitialPostalCode);
  const [mapsStatus, setMapsStatus] = useState<"idle" | "loading" | "ready" | "missing-key" | "error">("idle");
  const [mapsErrorDetail, setMapsErrorDetail] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [resolvingAddress, setResolvingAddress] = useState(false);
  const [resolvingPin, setResolvingPin] = useState(false);
  const [pinEditorEnabled, setPinEditorEnabled] = useState(false);
  const [pinLocation, setPinLocation] = useState<PinLocation | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<GoogleAutocomplete | null>(null);
  const geocoderRef = useRef<GoogleGeocoder | null>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const mapMarkerRef = useRef<GoogleMarker | null>(null);
  const markerDragListenerRef = useRef<GoogleMapsListener | null>(null);
  const resolveAddressFromPinRef = useRef<(nextPinLocation: PinLocation) => Promise<void>>(async () => undefined);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const errorSummaryRef = useRef<HTMLDivElement | null>(null);

  const postalCodeOk = useMemo(() => {
    if (!data.postalCode || data.postalCode.length !== 5) return false;
    return isSupportedPostalCode(data.postalCode);
  }, [data.postalCode]);
  const minimumDeliveryDate = useMemo(() => todayLocalIsoDate(), []);

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
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function clearFieldError(fieldName: StepFieldKey) {
    setFieldErrors((prev) => {
      if (!prev[fieldName]) return prev;
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  }

  function clearErrors() {
    setFieldErrors({});
    setSubmitError(null);
  }

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
    setPinEditorEnabled(false);
    setPinError(null);
  }

  function applyParsedAddress(parsed: ParsedAddress, options?: { keepPinLocation?: boolean }) {
    setAddressInput(parsed.formattedAddress);
    setData((prev) => ({
      ...prev,
      postalCode: parsed.postalCode,
      city: parsed.city,
      street: parsed.street,
      houseNumber: parsed.houseNumber,
    }));

    if (!options?.keepPinLocation) {
      if (parsed.pinLocation) {
        setPinLocation(parsed.pinLocation);
        setPinError(null);
      } else {
        setPinLocation(null);
      }
    }
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
    if (!addressInput.trim() || mapsStatus !== "ready") return null;

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
    setSubmitError(null);

    if (mapsStatus !== "ready") {
      setSubmitError("Autodoplňování adresy není aktivní. Zkuste to znovu za chvíli nebo doplňte adresu ručně.");
      return;
    }

    if (!navigator.geolocation) {
      setSubmitError("Tento prohlížeč nepodporuje geolokaci.");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void (async () => {
          const parsed = await geocodeRequest({
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });

          if (!parsed) {
            setSubmitError("Nepodařilo se načíst adresu z aktuální polohy.");
            setLocating(false);
            return;
          }

          applyParsedAddress(parsed);
          setSubmitError(null);
          setLocating(false);
        })();
      },
      () => {
        setSubmitError("Přístup k poloze byl zamítnut nebo se polohu nepodařilo načíst.");
        setLocating(false);
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

  async function enablePinEditor() {
    setPinError(null);
    setSubmitError(null);

    if (mapsStatus !== "ready") {
      setPinError("Mapa zatím není dostupná. Zkontrolujte Google Maps API.");
      return;
    }

    if (pinLocation) {
      setPinEditorEnabled(true);
      return;
    }

    const parsed = await resolveAddressFromInputText();
    if (!parsed?.pinLocation) {
      setPinError("Nejdřív vyberte přesnou adresu z našeptávače, potom lze upravit pin.");
      return;
    }

    setPinEditorEnabled(true);
  }

  useEffect(() => {
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
        setMapsErrorDetail(
          mapsError instanceof Error ? mapsError.message : "Nepodařilo se načíst Google Maps API.",
        );
      }
    })();

    return () => {
      isMounted = false;
      globalWindow.gm_authFailure = globalWindow[authFailureKey];
      delete globalWindow[authFailureKey];
    };
  }, []);

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
  }, [mapsStatus]);

  useEffect(() => {
    if (!pinEditorEnabled) {
      markerDragListenerRef.current?.remove();
      markerDragListenerRef.current = null;
      mapMarkerRef.current?.setMap(null);
      mapMarkerRef.current = null;
      mapRef.current = null;
      return;
    }

    if (mapsStatus !== "ready" || !mapContainerRef.current || !window.google?.maps?.Map || !window.google?.maps?.Marker) {
      return;
    }

    if (mapRef.current && mapMarkerRef.current) {
      return;
    }

    const center = pinLocation ?? defaultMapCenter;
    const map = new window.google.maps.Map(mapContainerRef.current, {
      center,
      zoom: pinLocation ? 18 : 12,
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
  }, [mapsStatus, pinEditorEnabled, pinLocation]);

  useEffect(() => {
    if (!pinEditorEnabled || !pinLocation || !mapRef.current || !mapMarkerRef.current) return;

    mapMarkerRef.current.setPosition(pinLocation);
    mapRef.current.panTo(pinLocation);

    const zoom = mapRef.current.getZoom() ?? 0;
    if (zoom < 18) {
      mapRef.current.setZoom(18);
    }
  }, [pinEditorEnabled, pinLocation]);

  useEffect(
    () => () => {
      markerDragListenerRef.current?.remove();
      markerDragListenerRef.current = null;
      mapMarkerRef.current?.setMap(null);
      mapMarkerRef.current = null;
      mapRef.current = null;
    },
    [],
  );

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
    if (errorSummaryItems.length === 0 && !submitError) return;
    errorSummaryRef.current?.focus();
  }, [errorSummaryItems.length, submitError]);

  async function validateStep(stepToValidate: number): Promise<ValidationErrors> {
    const nextErrors: ValidationErrors = {};

    if (stepToValidate === 0) {
      let postalCode = data.postalCode.trim();
      let city = data.city.trim();
      let street = data.street.trim();
      let houseNumber = data.houseNumber.trim();
      const hasAddressParts = Boolean(postalCode && city && street && houseNumber);

      if (!addressInput.trim() && !hasAddressParts) {
        nextErrors.addressInput = "Zadejte adresu přistavení nebo vyplňte adresu ručně níže.";
      }

      if (!hasAddressParts && addressInput.trim() && mapsStatus === "ready") {
        const resolved = await resolveAddressFromInputText();

        if (resolved) {
          postalCode = resolved.postalCode.trim();
          city = resolved.city.trim();
          street = resolved.street.trim();
          houseNumber = resolved.houseNumber.trim();
        }
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
      const containerCount = Number(data.containerCount);

      if (
        !Number.isInteger(containerCount) ||
        containerCount < 1 ||
        containerCount > CONTAINER_PRODUCT.maxContainerCountPerOrder
      ) {
        nextErrors.containerCount = `Počet kontejnerů musí být 1 až ${CONTAINER_PRODUCT.maxContainerCountPerOrder}.`;
      }
    }

    if (stepToValidate === 2) {
      if (!data.deliveryDateRequested) {
        nextErrors.deliveryDateRequested = "Vyberte požadované datum přistavení.";
      } else {
        const requestedDate = parseIsoDate(data.deliveryDateRequested);

        if (!requestedDate) {
          nextErrors.deliveryDateRequested = "Zadejte platné datum přistavení.";
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (requestedDate < today) {
            nextErrors.deliveryDateRequested = "Datum přistavení musí být dnes nebo později.";
          }
        }
      }

      if (data.placementType === "verejny" && !data.permitConfirmed) {
        nextErrors.permitConfirmed = "Pro umístění na veřejnou komunikaci potvrďte, že máte povolení.";
      }
    }

    if (stepToValidate === 3) {
      if (data.name.trim().length < 2) {
        nextErrors.name = "Doplňte jméno a příjmení.";
      }

      if (data.customerType === "firma" && data.companyName.trim().length < 2) {
        nextErrors.companyName = "Doplňte název firmy.";
      }

      const normalizedIco = data.ico.replace(/\D/g, "");
      if (data.customerType === "firma" && !icoRegex.test(normalizedIco)) {
        nextErrors.ico = "Doplňte platné IČO (8 číslic).";
      }

      if (!emailRegex.test(data.email)) {
        nextErrors.email = "Zadejte platný e-mail.";
      }

      if (!phoneRegex.test(data.phone)) {
        nextErrors.phone = "Zadejte platné telefonní číslo.";
      }

      if (!data.gdprConsent) {
        nextErrors.gdprConsent = "Bez souhlasu GDPR nelze objednávku odeslat.";
      }
    }

    return nextErrors;
  }

  async function next() {
    const nextErrors = await validateStep(step);

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

    trackAnalyticsEvent("order_step_complete", {
      step: step + 1,
      step_name: stepTitles[step],
    });

    clearErrors();
    setStep((prev) => Math.min(prev + 1, stepTitles.length - 1));
  }

  function prev() {
    clearErrors();
    setStep((prev) => Math.max(prev - 1, 0));
  }

  async function firstInvalidStep() {
    const stepsToValidate = [0, 1, 2, 3];

    for (const stepToValidate of stepsToValidate) {
      const stepErrors = await validateStep(stepToValidate);
      if (Object.keys(stepErrors).length > 0) {
        return { stepToValidate, stepErrors };
      }
    }

    return null;
  }

  async function submit() {
    const invalid = await firstInvalidStep();
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
    trackAnalyticsEvent("submit_order", { step: 5, step_name: stepTitles[4] });

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerType: data.customerType,
          name: data.name,
          companyName: data.companyName || undefined,
          ico: data.ico.replace(/\D/g, "") || undefined,
          dic: data.dic || undefined,
          email: data.email,
          phone: data.phone,
          postalCode: data.postalCode,
          city: data.city,
          street: data.street,
          houseNumber: data.houseNumber,
          wasteType: data.wasteType,
          containerSizeM3: 3,
          containerCount: data.containerCount,
          deliveryDateRequested: data.deliveryDateRequested,
          timeWindowRequested: data.timeWindowRequested,
          placementType: data.placementType,
          permitConfirmed: data.permitConfirmed,
          extras: {
            nakladkaOdNas: data.nakladkaOdNas,
            expresniPristaveni: data.expresniPristaveni,
            opakovanyOdvoz: data.opakovanyOdvoz,
          },
          note: data.note || undefined,
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

      let json: { orderId?: string; error?: string } = {};

      try {
        json = (await response.json()) as { orderId?: string; error?: string };
      } catch {
        json = {};
      }

      if (!response.ok || !json.orderId) {
        const nextSubmitError = json.error ?? "Objednávku se nepodařilo odeslat. Zkuste to prosím znovu.";
        setSubmitError(nextSubmitError);
        trackAnalyticsEvent("submit_order_fail", {
          step: 5,
          reason: nextSubmitError,
        });
        return;
      }

      setOrderId(json.orderId);
      trackAnalyticsEvent("submit_order_success", {
        step: 5,
        order_id: json.orderId,
      });
    } catch {
      setSubmitError("Objednávku se nepodařilo odeslat. Zkuste to prosím znovu.");
      trackAnalyticsEvent("submit_order_fail", {
        step: 5,
        reason: "network_error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (orderId) {
    return (
      <div className="rounded-2xl border border-emerald-700 bg-emerald-950/40 p-6">
        <h3 className="font-heading text-2xl font-bold text-emerald-300">Objednávka odeslána</h3>
        <p className="mt-2 text-emerald-100">Objednávku jsme přijali pod číslem {orderId}.</p>
        <p className="mt-2 text-emerald-100">Termín vždy potvrzuje operátor ručně. Ozveme se nejpozději do 1 pracovního dne.</p>
        <p className="mt-2 text-emerald-100">
          Potřebujete něco upravit hned? Zavolejte na{" "}
          <a className="text-[var(--color-accent)] underline" href={CONTACT.phoneHref}>
            {CONTACT.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
      <ol className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
        {stepTitles.map((title, idx) => (
          <li
            key={title}
            className={idx === step ? ui.stepBadgeActive : ui.stepBadgeIdle}
            aria-current={idx === step ? "step" : undefined}
          >
            {idx + 1}. {title}
          </li>
        ))}
      </ol>

      {errorSummaryItems.length > 0 || submitError ? (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 rounded-xl border border-red-700 bg-red-950/40 p-4 text-sm"
        >
          <h2 className="text-base font-bold text-red-200">Formulář obsahuje chyby</h2>
          {errorSummaryItems.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-red-100">
              {errorSummaryItems.map((summaryItem) => (
                <li key={summaryItem.fieldName}>
                  <a href={`#${summaryItem.id}`} className="underline underline-offset-2">
                    {summaryItem.label}: {summaryItem.message}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          {submitError ? <p className="mt-2 text-red-100">{submitError}</p> : null}
        </div>
      ) : null}

      {step === 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-zinc-300">
            Zadejte adresu do jednoho pole a vyberte ji z nabídky. Online obsluhujeme oblast {SERVICE_AREA.regionsLabel}.
            Pokud je PSČ mimo obsluhu, objednávku dokončíte telefonicky na{" "}
            <a href={CONTACT.phoneHref} className="text-[var(--color-accent)]">
              {CONTACT.phone}
            </a>
            .
          </p>

          <label className="flex flex-col gap-2">
            Adresa přistavení
            <input
              {...fieldA11yProps("addressInput")}
              ref={addressInputRef}
              value={addressInput}
              onChange={(event) => {
                setAddressInput(event.target.value);
                clearPinLocation();
                clearFieldError("addressInput");
                setSubmitError(null);
              }}
              className={fieldClass("addressInput")}
              placeholder="Např. Na Kodymce 1440/17, Praha"
              autoComplete="street-address"
            />
            {renderFieldError("addressInput")}
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                void fillAddressFromCurrentLocation();
              }}
              disabled={locating || mapsStatus !== "ready"}
              className={ui.buttonSecondary}
            >
              {locating ? "Načítám polohu..." : "Použít aktuální polohu"}
            </button>
            <button
              type="button"
              onClick={() => {
                void enablePinEditor();
              }}
              disabled={mapsStatus !== "ready" || locating || resolvingAddress}
              className={ui.buttonSecondary}
            >
              {pinEditorEnabled ? "Pin lze upravit níže" : "Upravit pin na mapě"}
            </button>
          </div>

          {mapsStatus === "loading" ? <p className="text-sm text-zinc-400">Načítám Google adresní našeptávač...</p> : null}
          {mapsStatus === "missing-key" ? (
            <p className="text-sm text-amber-300">
              Chybí Google API klíč. Nastavte `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` nebo `GOOGLE_MAPS_API_KEY`.
            </p>
          ) : null}
          {mapsStatus === "error" ? (
            <p className="text-sm text-amber-300">
              Google adresní našeptávač se nepodařilo načíst.
              {mapsErrorDetail ? ` ${mapsErrorDetail}` : ""}
            </p>
          ) : null}

          {(data.street || data.city || data.postalCode) ? (
            <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm">
              <p>
                <span className="text-zinc-400">Vybraná adresa:</span> {data.street} {data.houseNumber}, {data.city}, {data.postalCode}
              </p>
              {pinLocation ? (
                <p className="mt-2 text-xs text-zinc-400">
                  Pin: {formatPinLocation(pinLocation)} •{" "}
                  <a
                    href={`https://www.google.com/maps?q=${pinLocation.lat},${pinLocation.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-accent)]"
                  >
                    otevřít bod v mapě
                  </a>
                </p>
              ) : null}
              {data.postalCode.length === 5 ? (
                <p className={postalCodeOk ? "mt-2 text-emerald-300" : "mt-2 text-red-300"}>
                  {postalCodeOk ? "PSČ je v obsluhované oblasti." : "PSČ zatím není v online obsluze."}
                </p>
              ) : null}
            </div>
          ) : null}

          {pinEditorEnabled ? (
            <div className="space-y-3 rounded-xl border border-zinc-700 bg-zinc-950 p-4">
              <p className="text-sm text-zinc-300">
                Přetažením pinu upřesníte přesné místo přistavení. Po posunu pinu adresu automaticky aktualizujeme.
              </p>
              <div ref={mapContainerRef} className="h-[320px] w-full overflow-hidden rounded-xl border border-zinc-700" />
              <p className="text-xs text-zinc-400">
                Aktuální pin: {pinLocation ? formatPinLocation(pinLocation) : "nevybrán"}
              </p>
              {resolvingPin ? <p className="text-xs text-zinc-400">Aktualizuji adresu podle nové pozice pinu...</p> : null}
              {pinError ? <p className="text-xs text-amber-300">{pinError}</p> : null}
            </div>
          ) : null}

          <details className="rounded-xl border border-zinc-700 bg-zinc-950 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-zinc-200">Nemůžete vybrat adresu? Vyplňte ji ručně</summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                PSČ
                <input
                  {...fieldA11yProps("postalCode")}
                  value={data.postalCode}
                  onChange={(event) => {
                    update("postalCode", event.target.value.replace(/\D/g, "").slice(0, 5));
                    clearPinLocation();
                    clearFieldError("addressInput");
                    clearFieldError("postalCode");
                    setSubmitError(null);
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
                    clearPinLocation();
                    clearFieldError("addressInput");
                    clearFieldError("city");
                    setSubmitError(null);
                  }}
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
                    clearPinLocation();
                    clearFieldError("addressInput");
                    clearFieldError("street");
                    setSubmitError(null);
                  }}
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
                    clearPinLocation();
                    clearFieldError("addressInput");
                    clearFieldError("houseNumber");
                    setSubmitError(null);
                  }}
                  className={fieldClass("houseNumber")}
                />
                {renderFieldError("houseNumber")}
              </label>
            </div>
          </details>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 sm:col-span-2">
              Typ odpadu
              <select
                value={data.wasteType}
                onChange={(e) =>
                  update(
                    "wasteType",
                    e.target.value as "sut-cista" | "sut-smesna" | "objemny" | "zemina" | "drevo",
                  )
                }
                className={ui.field}
              >
                {WASTE_TYPES.map((waste) => (
                  <option value={waste.id} key={waste.id}>
                    {waste.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-4">
              <p className="font-semibold text-[var(--color-accent)]">Aktuálně dostupná velikost</p>
              <p className="mt-1 text-zinc-100">Kontejner {CONTAINER_PRODUCT.availableNow}</p>
              <p className="text-sm text-zinc-400">Další velikosti: {CONTAINER_PRODUCT.futureSizes.join(", ")}.</p>
            </div>

            <label className="flex flex-col gap-2">
              Počet kontejnerů
              <input
                {...fieldA11yProps("containerCount")}
                type="number"
                min={1}
                max={CONTAINER_PRODUCT.maxContainerCountPerOrder}
                value={data.containerCount}
                onChange={(e) => {
                  update("containerCount", Number(e.target.value) || 1);
                  clearFieldError("containerCount");
                  setSubmitError(null);
                }}
                className={fieldClass("containerCount")}
              />
              {renderFieldError("containerCount")}
            </label>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm text-zinc-300">
            <p>
              Vybraný odpad: {WASTE_TYPES.find((w) => w.id === data.wasteType)?.label}. Před odesláním doporučujeme
              zkontrolovat stránku &quot;Co patří a nepatří&quot;.
            </p>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              Datum přistavení
              <input
                {...fieldA11yProps("deliveryDateRequested")}
                type="date"
                min={minimumDeliveryDate}
                value={data.deliveryDateRequested}
                onChange={(e) => {
                  update("deliveryDateRequested", e.target.value);
                  clearFieldError("deliveryDateRequested");
                  setSubmitError(null);
                }}
                className={fieldClass("deliveryDateRequested")}
              />
              {renderFieldError("deliveryDateRequested")}
            </label>

            <label className="flex flex-col gap-2">
              Časové okno
              <select
                value={data.timeWindowRequested}
                onChange={(e) =>
                  update("timeWindowRequested", e.target.value as "rano" | "dopoledne" | "odpoledne")
                }
                className={ui.field}
              >
                <option value="rano">Ráno</option>
                <option value="dopoledne">Dopoledne</option>
                <option value="odpoledne">Odpoledne</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 sm:col-span-2">
              Umístění kontejneru
              <select
                value={data.placementType}
                onChange={(e) => {
                  update("placementType", e.target.value as "soukromy" | "verejny");
                  clearFieldError("permitConfirmed");
                  setSubmitError(null);
                }}
                className={ui.field}
              >
                <option value="soukromy">Soukromý pozemek</option>
                <option value="verejny">Veřejná komunikace</option>
              </select>
            </label>
          </div>

          {data.placementType === "verejny" ? (
            <label
              className={cx(
                "flex items-start gap-3 rounded-xl border border-amber-700/60 bg-amber-950/30 p-3 text-sm",
                fieldErrors.permitConfirmed ? "border-red-500 bg-red-950/40" : "",
              )}
            >
              <input
                {...fieldA11yProps("permitConfirmed")}
                type="checkbox"
                checked={data.permitConfirmed}
                onChange={(e) => {
                  update("permitConfirmed", e.target.checked);
                  clearFieldError("permitConfirmed");
                  setSubmitError(null);
                }}
                className="mt-1"
              />
              <span>
                Potvrzuji, že mám zajištěné povolení k záboru veřejné komunikace.
                {renderFieldError("permitConfirmed")}
              </span>
            </label>
          ) : null}

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm">
              <input
                type="checkbox"
                checked={data.nakladkaOdNas}
                onChange={(e) => update("nakladkaOdNas", e.target.checked)}
              />
              Nakládka od nás
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm">
              <input
                type="checkbox"
                checked={data.expresniPristaveni}
                onChange={(e) => update("expresniPristaveni", e.target.checked)}
              />
              Expresní přistavení
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={data.opakovanyOdvoz}
                onChange={(e) => update("opakovanyOdvoz", e.target.checked)}
              />
              Opakovaný odvoz
            </label>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            Typ zákazníka
            <select
              value={data.customerType}
              onChange={(e) => {
                const value = e.target.value as "fo" | "firma";
                update("customerType", value);
                if (value === "fo") {
                  clearFieldError("companyName");
                  clearFieldError("ico");
                }
                setSubmitError(null);
              }}
              className={ui.field}
            >
              <option value="fo">Fyzická osoba</option>
              <option value="firma">Firma</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            Jméno a příjmení
            <input
              {...fieldA11yProps("name")}
              value={data.name}
              onChange={(e) => {
                update("name", e.target.value);
                clearFieldError("name");
                setSubmitError(null);
              }}
              className={fieldClass("name")}
            />
            {renderFieldError("name")}
          </label>

          {data.customerType === "firma" ? (
            <>
              <label className="flex flex-col gap-2">
                Název firmy
                <input
                  {...fieldA11yProps("companyName")}
                  value={data.companyName}
                  onChange={(e) => {
                    update("companyName", e.target.value);
                    clearFieldError("companyName");
                    setSubmitError(null);
                  }}
                  className={fieldClass("companyName")}
                />
                {renderFieldError("companyName")}
              </label>
              <label className="flex flex-col gap-2">
                IČO
                <input
                  {...fieldA11yProps("ico")}
                  value={data.ico}
                  onChange={(e) => {
                    update("ico", e.target.value.replace(/\D/g, "").slice(0, 8));
                    clearFieldError("ico");
                    setSubmitError(null);
                  }}
                  className={fieldClass("ico")}
                  inputMode="numeric"
                />
                {renderFieldError("ico")}
              </label>
              <label className="flex flex-col gap-2 sm:col-span-2">
                DIČ (volitelné)
                <input value={data.dic} onChange={(e) => update("dic", e.target.value)} className={ui.field} />
              </label>
            </>
          ) : null}

          <label className="flex flex-col gap-2">
            E-mail
            <input
              {...fieldA11yProps("email")}
              type="email"
              value={data.email}
              onChange={(e) => {
                update("email", e.target.value);
                clearFieldError("email");
                setSubmitError(null);
              }}
              className={fieldClass("email")}
            />
            {renderFieldError("email")}
          </label>

          <label className="flex flex-col gap-2">
            Telefon
            <input
              {...fieldA11yProps("phone")}
              value={data.phone}
              onChange={(e) => {
                update("phone", e.target.value);
                clearFieldError("phone");
                setSubmitError(null);
              }}
              className={fieldClass("phone")}
            />
            {renderFieldError("phone")}
          </label>

          <label className="flex flex-col gap-2 sm:col-span-2">
            Poznámka k objednávce (volitelné)
            <textarea
              value={data.note}
              onChange={(e) => update("note", e.target.value)}
              className={ui.field}
              rows={3}
            />
          </label>

          <label
            className={cx(
              "sm:col-span-2 flex items-start gap-3 rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm",
              fieldErrors.gdprConsent ? "border-red-500" : "",
            )}
          >
            <input
              {...fieldA11yProps("gdprConsent")}
              type="checkbox"
              checked={data.gdprConsent}
              onChange={(e) => {
                update("gdprConsent", e.target.checked);
                clearFieldError("gdprConsent");
                setSubmitError(null);
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

          <label className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm">
            <input
              type="checkbox"
              checked={data.marketingConsent}
              onChange={(e) => update("marketingConsent", e.target.checked)}
              className="mt-1"
            />
            Chci dostávat obchodní sdělení (volitelné).
          </label>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-3 rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm">
          <p>
            <span className="text-zinc-400">Adresa:</span> {data.street} {data.houseNumber}, {data.city}, {data.postalCode}
          </p>
          {pinLocation ? (
            <p>
              <span className="text-zinc-400">Pin:</span> {formatPinLocation(pinLocation)}
            </p>
          ) : null}
          <p>
            <span className="text-zinc-400">Typ odpadu:</span> {WASTE_TYPES.find((w) => w.id === data.wasteType)?.label}
          </p>
          <p>
            <span className="text-zinc-400">Kontejner:</span> {CONTAINER_PRODUCT.availableNow}, počet {data.containerCount}
          </p>
          <p>
            <span className="text-zinc-400">Požadovaný termín:</span> {data.deliveryDateRequested} ({data.timeWindowRequested})
          </p>
          <p>
            <span className="text-zinc-400">Kontakt:</span> {data.name}, {data.phone}, {data.email}
          </p>
          <p className="text-[var(--color-accent)]">Termín bude potvrzen ručně operátorem.</p>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={prev} disabled={step === 0 || submitting} className={ui.buttonSecondary}>
          Zpět
        </button>

        {step < stepTitles.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              void next();
            }}
            disabled={submitting || locating || resolvingAddress || resolvingPin}
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
  );
}
