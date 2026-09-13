"use client";

import { MotionConfig } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    // Lenis pilote le scroll : sans ces deux liaisons, ScrollTrigger continue
    // de lire la position native du scroll et les sections pinnées (timeline
    // parcours) se décalent puis saccadent.
    lenis.on("scroll", ScrollTrigger.update);

    // Un seul rAF pour tout le monde — gsap.ticker au lieu d'une boucle isolée,
    // sinon Lenis et GSAP avancent sur deux horloges différentes.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, [reduced]);

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
    </MotionConfig>
  );
}
