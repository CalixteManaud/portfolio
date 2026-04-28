import { describe, expect, it } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows up to limit requests within the window", () => {
    const key = `t-allow-${Math.random()}`;
    expect(rateLimit(key, 3, 60_000).ok).toBe(true);
    expect(rateLimit(key, 3, 60_000).ok).toBe(true);
    expect(rateLimit(key, 3, 60_000).ok).toBe(true);
    expect(rateLimit(key, 3, 60_000).ok).toBe(false);
  });

  it("decrements remaining count correctly", () => {
    const key = `t-remaining-${Math.random()}`;
    expect(rateLimit(key, 5, 60_000).remaining).toBe(4);
    expect(rateLimit(key, 5, 60_000).remaining).toBe(3);
    expect(rateLimit(key, 5, 60_000).remaining).toBe(2);
  });

  it("uses independent buckets per key", () => {
    const k1 = `t-isolation-1-${Math.random()}`;
    const k2 = `t-isolation-2-${Math.random()}`;
    rateLimit(k1, 1, 60_000);
    expect(rateLimit(k1, 1, 60_000).ok).toBe(false);
    expect(rateLimit(k2, 1, 60_000).ok).toBe(true);
  });

  it("resets the bucket after the window expires", () => {
    const key = `t-reset-${Math.random()}`;
    expect(rateLimit(key, 1, 1).ok).toBe(true);
    // Wait past the 1ms window.
    const start = Date.now();
    while (Date.now() - start < 5) {
      // Busy-wait — short and avoids async timer flakiness.
    }
    expect(rateLimit(key, 1, 60_000).ok).toBe(true);
  });
});
