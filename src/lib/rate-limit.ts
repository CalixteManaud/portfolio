import "server-only";

type Bucket = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Bucket>();
const CLEANUP_INTERVAL_MS = 60 * 1000;

let cleanupTimer: NodeJS.Timeout | null = null;
function ensureCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store) {
      if (bucket.resetAt <= now) store.delete(key);
    }
  }, CLEANUP_INTERVAL_MS);
  // Allow Node to exit even if timer is active.
  cleanupTimer.unref?.();
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * Fixed-window in-memory rate limit.
 * NOTE: serverless environments may distribute requests across isolates —
 * this provides best-effort throttling, not strict enforcement.
 * For a portfolio with low volume + Turnstile upstream, that's acceptable.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  ensureCleanup();
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const bucket = { count: 1, resetAt: now + windowMs };
    store.set(key, bucket);
    return { ok: true, remaining: limit - 1, resetAt: bucket.resetAt };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}
