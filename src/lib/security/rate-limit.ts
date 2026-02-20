import { createHash } from "node:crypto";

import { consumeBucket } from "@/server/db/repositories/rate-limit";

export const ORDER_SUBMIT_RATE_LIMIT = {
  limit: 5,
  windowMinutes: 30,
} as const;

export const CALLBACK_SUBMIT_RATE_LIMIT = {
  limit: 4,
  windowMinutes: 30,
} as const;

function firstHeaderValue(value: string | null) {
  if (!value) return "";
  return value.split(",")[0]?.trim() ?? "";
}

export function getRequestIp(request: Request) {
  const xForwardedFor = firstHeaderValue(request.headers.get("x-forwarded-for"));
  if (xForwardedFor) return xForwardedFor;

  const realIp = firstHeaderValue(request.headers.get("x-real-ip"));
  if (realIp) return realIp;

  const cfConnectingIp = firstHeaderValue(request.headers.get("cf-connecting-ip"));
  if (cfConnectingIp) return cfConnectingIp;

  return "request-ip:unknown";
}

export function hashRateLimitIdentity(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function buildOrderRateLimitKey(request: Request) {
  const ip = getRequestIp(request);
  return {
    ip,
    key: `orders:${hashRateLimitIdentity(ip)}`,
  };
}

export async function consumeOrderSubmitRateLimit(request: Request) {
  const { key, ip } = buildOrderRateLimitKey(request);
  const result = await consumeBucket(key, ORDER_SUBMIT_RATE_LIMIT.limit, ORDER_SUBMIT_RATE_LIMIT.windowMinutes);
  return {
    ...result,
    ip,
    key,
  };
}

export async function consumeCallbackSubmitRateLimit(request: Request) {
  const ip = getRequestIp(request);
  const key = `callbacks:${hashRateLimitIdentity(ip)}`;
  const result = await consumeBucket(key, CALLBACK_SUBMIT_RATE_LIMIT.limit, CALLBACK_SUBMIT_RATE_LIMIT.windowMinutes);
  return {
    ...result,
    ip,
    key,
  };
}
