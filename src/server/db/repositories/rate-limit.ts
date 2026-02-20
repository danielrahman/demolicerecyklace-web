import { eq } from "drizzle-orm";

import { db } from "@/server/db/client";
import { rateLimitBuckets } from "@/server/db/schema";

export type RateLimitConsumeResult = {
  allowed: boolean;
  count: number;
  limit: number;
  resetAt: string;
};

function windowStartToDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}

export async function consumeBucket(key: string, limit: number, windowMinutes: number): Promise<RateLimitConsumeResult> {
  const now = new Date();
  const windowMs = windowMinutes * 60 * 1000;

  return db.transaction(async (tx) => {
    const [current] = await tx
      .select()
      .from(rateLimitBuckets)
      .where(eq(rateLimitBuckets.key, key))
      .limit(1);

    if (!current) {
      await tx.insert(rateLimitBuckets).values({
        key,
        count: 1,
        windowStart: now,
      });

      return {
        allowed: true,
        count: 1,
        limit,
        resetAt: new Date(now.getTime() + windowMs).toISOString(),
      };
    }

    const windowStart = windowStartToDate(current.windowStart);
    const age = now.getTime() - windowStart.getTime();
    const resetAt = new Date(windowStart.getTime() + windowMs);

    if (age >= windowMs) {
      await tx
        .update(rateLimitBuckets)
        .set({
          count: 1,
          windowStart: now,
        })
        .where(eq(rateLimitBuckets.key, key));

      return {
        allowed: true,
        count: 1,
        limit,
        resetAt: new Date(now.getTime() + windowMs).toISOString(),
      };
    }

    if (current.count >= limit) {
      return {
        allowed: false,
        count: current.count,
        limit,
        resetAt: resetAt.toISOString(),
      };
    }

    const nextCount = current.count + 1;
    await tx
      .update(rateLimitBuckets)
      .set({
        count: nextCount,
      })
      .where(eq(rateLimitBuckets.key, key));

    return {
      allowed: true,
      count: nextCount,
      limit,
      resetAt: resetAt.toISOString(),
    };
  });
}
