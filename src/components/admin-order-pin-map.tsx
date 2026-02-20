"use client";

import { useEffect, useRef, useState } from "react";

type PinLocation = {
  lat: number;
  lng: number;
};

type MapsStatus = "idle" | "loading" | "ready" | "missing-key" | "error";

type GoogleLatLng = {
  lat: () => number;
  lng: () => number;
};

type GoogleMapMouseEvent = {
  latLng?: GoogleLatLng;
};

type GoogleMapsListener = {
  remove: () => void;
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
    draggable?: boolean;
    scrollwheel?: boolean;
    disableDoubleClickZoom?: boolean;
    gestureHandling?: "none" | "cooperative" | "greedy" | "auto";
    keyboardShortcuts?: boolean;
  },
) => GoogleMap;

type GoogleMarker = {
  setMap: (map: GoogleMap | null) => void;
  setPosition: (location: PinLocation) => void;
  setDraggable: (value: boolean) => void;
  addListener: (eventName: string, handler: (event?: GoogleMapMouseEvent) => void) => GoogleMapsListener;
};

type GoogleMarkerConstructor = new (options: {
  map: GoogleMap;
  position: PinLocation;
  draggable?: boolean;
}) => GoogleMarker;

type GoogleGeocoderResult = {
  geometry?: {
    location?: GoogleLatLng;
  };
};

type GoogleGeocoder = {
  geocode: (
    request: {
      address: string;
      componentRestrictions?: { country: string };
    },
    callback: (results: GoogleGeocoderResult[] | null, status: string) => void,
  ) => void;
};

type GoogleMapsApi = {
  maps: {
    Map: GoogleMapConstructor;
    Marker: GoogleMarkerConstructor;
    Geocoder: new () => GoogleGeocoder;
  };
};

declare global {
  interface Window {
    google?: GoogleMapsApi;
  }
}

type AdminOrderPinMapProps = {
  title: string;
  address: string;
  initialPin?: PinLocation | null;
  inputTargets?: Array<{
    latName: string;
    lngName: string;
    formId?: string;
  }>;
  editable?: boolean;
  heightClassName?: string;
};

const fallbackCenter: PinLocation = { lat: 50.0755, lng: 14.4378 };
let googleMapsLoadPromise: Promise<void> | null = null;

function hasGoogleMapsLoaded() {
  return Boolean(window.google?.maps?.Map && window.google?.maps?.Marker && window.google?.maps?.Geocoder);
}

async function resolveGoogleMapsApiKey() {
  const directGoogleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
  if (directGoogleMapsApiKey) {
    return directGoogleMapsApiKey;
  }

  try {
    const response = await fetch("/api/maps/config", { cache: "no-store" });
    if (!response.ok) return "";
    const payload = (await response.json()) as { apiKey?: string };
    return payload.apiKey?.trim() ?? "";
  } catch {
    return "";
  }
}

function loadGoogleMapsApi(apiKey: string) {
  if (hasGoogleMapsLoaded()) return Promise.resolve();
  if (googleMapsLoadPromise) return googleMapsLoadPromise;

  googleMapsLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector("script[data-google-maps-admin-pin='true']") as HTMLScriptElement | null;

    if (existingScript) {
      if (hasGoogleMapsLoaded()) {
        resolve();
        return;
      }

      existingScript.addEventListener(
        "load",
        () => {
          if (!hasGoogleMapsLoaded()) {
            reject(new Error("Google Maps API se načetlo, ale není dostupné."));
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&language=cs&region=CZ`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsAdminPin = "true";
    script.onload = () => {
      if (!hasGoogleMapsLoaded()) {
        reject(new Error("Google Maps API se načetlo, ale není dostupné."));
        return;
      }
      resolve();
    };
    script.onerror = () => reject(new Error("Google Maps script load failed"));
    document.head.append(script);
  });

  return googleMapsLoadPromise;
}

function latLngToPin(value?: GoogleLatLng | PinLocation | null): PinLocation | null {
  if (!value) return null;

  if (typeof (value as GoogleLatLng).lat === "function" && typeof (value as GoogleLatLng).lng === "function") {
    const lat = (value as GoogleLatLng).lat();
    const lng = (value as GoogleLatLng).lng();
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }

  const lat = (value as PinLocation).lat;
  const lng = (value as PinLocation).lng;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

export function AdminOrderPinMap({
  title,
  address,
  initialPin = null,
  inputTargets = [],
  editable = true,
  heightClassName = "h-56",
}: AdminOrderPinMapProps) {
  const [mapsStatus, setMapsStatus] = useState<MapsStatus>("idle");
  const [mapsErrorDetail, setMapsErrorDetail] = useState<string | null>(null);
  const [pinLocation, setPinLocation] = useState<PinLocation | null>(latLngToPin(initialPin));

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const markerRef = useRef<GoogleMarker | null>(null);
  const geocoderRef = useRef<GoogleGeocoder | null>(null);
  const mapClickListenerRef = useRef<GoogleMapsListener | null>(null);
  const markerDragListenerRef = useRef<GoogleMapsListener | null>(null);
  const geocodedAddressRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setMapsStatus("loading");
      setMapsErrorDetail(null);

      const apiKey = await resolveGoogleMapsApiKey();
      if (!apiKey) {
        if (!cancelled) {
          setMapsStatus("missing-key");
          setMapsErrorDetail("Není nastaven Google Maps API klíč.");
        }
        return;
      }

      try {
        await loadGoogleMapsApi(apiKey);
        if (cancelled) return;
        if (!hasGoogleMapsLoaded()) {
          setMapsStatus("error");
          setMapsErrorDetail("Google Maps API není dostupné.");
          return;
        }
        setMapsStatus("ready");
      } catch (error) {
        googleMapsLoadPromise = null;
        if (!cancelled) {
          setMapsStatus("error");
          setMapsErrorDetail(error instanceof Error ? error.message : "Nepodařilo se načíst Google Maps API.");
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (mapsStatus !== "ready" || !mapContainerRef.current || !window.google?.maps?.Map) return;
    if (mapRef.current) return;

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: pinLocation ?? fallbackCenter,
      zoom: pinLocation ? 16 : 11,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      draggable: editable,
      scrollwheel: editable,
      disableDoubleClickZoom: !editable,
      gestureHandling: editable ? "cooperative" : "none",
      keyboardShortcuts: editable,
    });

    mapRef.current = map;

    if (editable) {
      mapClickListenerRef.current = map.addListener("click", (event) => {
        const next = latLngToPin(event?.latLng);
        if (!next) return;
        setPinLocation(next);
      });
    }

    return () => {
      mapClickListenerRef.current?.remove();
      mapClickListenerRef.current = null;
      markerDragListenerRef.current?.remove();
      markerDragListenerRef.current = null;
      markerRef.current?.setMap(null);
      markerRef.current = null;
      mapRef.current = null;
    };
  }, [editable, mapsStatus, pinLocation]);

  useEffect(() => {
    if (mapsStatus !== "ready" || pinLocation || !address.trim() || !window.google?.maps?.Geocoder) return;

    const normalizedAddress = address.trim();
    if (geocodedAddressRef.current === normalizedAddress) return;
    geocodedAddressRef.current = normalizedAddress;

    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }

    geocoderRef.current.geocode(
      { address: normalizedAddress, componentRestrictions: { country: "CZ" } },
      (results, status) => {
        if (status !== "OK" || !results?.[0]?.geometry?.location) return;
        const next = latLngToPin(results[0].geometry.location);
        if (!next) return;
        setPinLocation(next);
      },
    );
  }, [address, mapsStatus, pinLocation]);

  useEffect(() => {
    if (mapsStatus !== "ready" || !mapRef.current || !window.google?.maps?.Marker) return;

    if (!pinLocation) {
      markerDragListenerRef.current?.remove();
      markerDragListenerRef.current = null;
      markerRef.current?.setMap(null);
      markerRef.current = null;
      return;
    }

    if (!markerRef.current) {
      const marker = new window.google.maps.Marker({
        map: mapRef.current,
        position: pinLocation,
        draggable: editable,
      });

      if (editable) {
        markerDragListenerRef.current = marker.addListener("dragend", (event) => {
          const next = latLngToPin(event?.latLng);
          if (!next) return;
          setPinLocation(next);
        });
      }

      markerRef.current = marker;
    } else {
      markerRef.current.setPosition(pinLocation);
      markerRef.current.setDraggable(editable);

      if (!editable) {
        markerDragListenerRef.current?.remove();
        markerDragListenerRef.current = null;
      } else if (!markerDragListenerRef.current) {
        markerDragListenerRef.current = markerRef.current.addListener("dragend", (event) => {
          const next = latLngToPin(event?.latLng);
          if (!next) return;
          setPinLocation(next);
        });
      }
    }

    mapRef.current.panTo(pinLocation);
    const zoom = mapRef.current.getZoom() ?? 0;
    if (zoom < 16) {
      mapRef.current.setZoom(16);
    }
  }, [editable, mapsStatus, pinLocation]);

  const pinLatValue = pinLocation ? pinLocation.lat.toFixed(7) : "";
  const pinLngValue = pinLocation ? pinLocation.lng.toFixed(7) : "";

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-950/60 p-3">
      <p className="text-sm font-semibold text-zinc-200">{title}</p>
      <div className="mt-3 space-y-2">
        <div className={`${heightClassName} overflow-hidden rounded-md border border-zinc-700 bg-zinc-950`}>
          {mapsStatus === "ready" ? (
            <div ref={mapContainerRef} className="h-full w-full" />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs text-zinc-400">
              {mapsStatus === "loading" || mapsStatus === "idle" ? "Načítám mapu..." : "Mapa není dostupná."}
            </div>
          )}
        </div>
        <p className="text-xs text-zinc-400">
          {pinLocation ? `Pin: ${pinLocation.lat.toFixed(6)}, ${pinLocation.lng.toFixed(6)}` : "Pin není nastaven."}
          {editable ? " Klikněte do mapy nebo přetáhněte pin." : " Mapa je jen pro náhled."}
        </p>
        {mapsStatus === "missing-key" || mapsStatus === "error" ? (
          <p className="text-xs text-amber-300">{mapsErrorDetail ?? "Mapu se nepodařilo načíst."}</p>
        ) : null}
      </div>
      {inputTargets.map((target, index) => (
        <div key={`${target.latName}:${target.lngName}:${target.formId ?? "none"}:${index}`}>
          <input type="hidden" name={target.latName} value={pinLatValue} form={target.formId} />
          <input type="hidden" name={target.lngName} value={pinLngValue} form={target.formId} />
        </div>
      ))}
    </div>
  );
}
