export type CookieConsentStatus = "accepted" | "rejected";

export const COOKIE_CONSENT_STORAGE_KEY = "cookie-consent-status";
export const COOKIE_CONSENT_CHANGE_EVENT = "cookie-consent-change";

export function isCookieConsentStatus(value: string | null): value is CookieConsentStatus {
  return value === "accepted" || value === "rejected";
}

export function readCookieConsent(): CookieConsentStatus | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  return isCookieConsentStatus(value) ? value : null;
}

export function writeCookieConsent(status: CookieConsentStatus) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, status);
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_CHANGE_EVENT, { detail: status }));
}

export function hasAnalyticsConsent() {
  return readCookieConsent() === "accepted";
}
