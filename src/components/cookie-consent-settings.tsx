"use client";

import { useEffect, useState } from "react";

import {
  COOKIE_CONSENT_CHANGE_EVENT,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentStatus,
} from "@/lib/cookie-consent";
import { cx, ui } from "@/lib/ui";

function statusLabel(status: CookieConsentStatus | null) {
  if (status === "accepted") {
    return "Analytické cookies jsou povolené.";
  }

  if (status === "rejected") {
    return "Analytické cookies jsou odmítnuté.";
  }

  return "Volba ještě nebyla nastavena.";
}

export function CookieConsentSettings() {
  const [status, setStatus] = useState<CookieConsentStatus | null>(null);

  useEffect(() => {
    const syncStatus = () => {
      setStatus(readCookieConsent());
    };

    syncStatus();
    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, syncStatus as EventListener);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, syncStatus as EventListener);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <p className="text-sm text-zinc-300">{statusLabel(status)}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={cx(ui.buttonPrimary, "min-w-44")} onClick={() => writeCookieConsent("accepted")}>
          Povolit analytiku
        </button>
        <button
          type="button"
          className={cx(ui.buttonSecondary, "min-w-44")}
          onClick={() => writeCookieConsent("rejected")}
        >
          Odmítnout analytiku
        </button>
      </div>
    </div>
  );
}
