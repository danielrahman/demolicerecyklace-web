"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  COOKIE_CONSENT_CHANGE_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentStatus,
} from "@/lib/cookie-consent";
import { cx, ui } from "@/lib/ui";

type WindowWithAnalytics = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function setAnalyticsDisabled(measurementId: string, disabled: boolean) {
  if (typeof window === "undefined" || !measurementId) {
    return;
  }

  const analyticsWindow = window as unknown as Record<string, unknown>;
  analyticsWindow[`ga-disable-${measurementId}`] = disabled;
}

function initializeGtag(measurementId: string) {
  const analyticsWindow = window as WindowWithAnalytics;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];

  if (typeof analyticsWindow.gtag !== "function") {
    analyticsWindow.gtag = (...args: unknown[]) => {
      analyticsWindow.dataLayer?.push(args);
    };
  }

  analyticsWindow.gtag("js", new Date());
  analyticsWindow.gtag("config", measurementId);
}

function loadGoogleAnalytics(measurementId: string) {
  if (typeof window === "undefined" || !measurementId) {
    return;
  }

  if (document.querySelector(`script[data-ga-measurement-id="${measurementId}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.async = true;
  script.dataset.gaMeasurementId = measurementId;
  script.onload = () => initializeGtag(measurementId);
  document.head.appendChild(script);
}

export function CookieConsentManager({ gaMeasurementId }: { gaMeasurementId: string }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [consentStatus, setConsentStatus] = useState<CookieConsentStatus | null>(null);

  useEffect(() => {
    const syncConsentStatus = () => {
      setConsentStatus(readCookieConsent());
    };

    syncConsentStatus();
    const hydrationFrame = window.requestAnimationFrame(() => {
      setIsHydrated(true);
    });

    const onStorage = (event: StorageEvent) => {
      if (event.key === COOKIE_CONSENT_STORAGE_KEY) {
        syncConsentStatus();
      }
    };

    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, syncConsentStatus as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.cancelAnimationFrame(hydrationFrame);
      window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, syncConsentStatus as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!gaMeasurementId) {
      return;
    }

    setAnalyticsDisabled(gaMeasurementId, consentStatus !== "accepted");

    if (consentStatus === "accepted") {
      loadGoogleAnalytics(gaMeasurementId);

      const analyticsWindow = window as WindowWithAnalytics;
      if (typeof analyticsWindow.gtag === "function") {
        analyticsWindow.gtag("consent", "update", { analytics_storage: "granted" });
      }
    }

    if (consentStatus === "rejected") {
      const analyticsWindow = window as WindowWithAnalytics;
      if (typeof analyticsWindow.gtag === "function") {
        analyticsWindow.gtag("consent", "update", { analytics_storage: "denied" });
      }
    }
  }, [consentStatus, gaMeasurementId]);

  if (!isHydrated || consentStatus) {
    return null;
  }

  return (
    <aside
      aria-label="Nastavení cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-zinc-950/95 shadow-2xl backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-zinc-100">Používání cookies</p>
          <p className="max-w-3xl text-sm text-zinc-300">
            Pro měření návštěvnosti používáme Google Analytics pouze s vaším souhlasem. Nezbytné cookies jsou potřeba
            pro základní funkce webu.
          </p>
          <Link href="/cookies" className="text-sm text-[var(--color-accent)] underline underline-offset-4">
            Zobrazit zásady cookies
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={cx(ui.buttonSecondary, "min-w-40")}
            onClick={() => writeCookieConsent("rejected")}
          >
            Odmítnout analytiku
          </button>
          <button
            type="button"
            className={cx(ui.buttonPrimary, "min-w-40")}
            onClick={() => writeCookieConsent("accepted")}
          >
            Souhlasím
          </button>
        </div>
      </div>
    </aside>
  );
}
