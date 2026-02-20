import { hasAnalyticsConsent } from "@/lib/cookie-consent";

export type FunnelEventName =
  | "start_order"
  | "order_step_view"
  | "order_step_complete"
  | "order_validation_error"
  | "submit_order"
  | "submit_order_success"
  | "submit_order_fail";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackAnalyticsEvent(eventName: FunnelEventName, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") {
    return;
  }

  if (!hasAnalyticsConsent()) {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}
