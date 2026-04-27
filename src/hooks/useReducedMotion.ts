"use client";

import { useEffect, useState } from "react";

/**
 * Returns true if the user has requested reduced motion.
 * Defaults to false during SSR / first render to avoid hydration mismatch;
 * the real value lands on first effect tick (no visible flash for 3D, since
 * the canvas is dynamic-imported with ssr:false anyway).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
