"use client";

import { Canvas } from "@react-three/fiber";
import { type ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  /** Active la passe d'ombres. Un objet posé sans ombre flotte, et tout le
   *  monde de l'établi repose sur ce contact au sol. */
  shadows?: boolean;
};

/**
 * R3F Canvas wrapper enforcing project-wide rules:
 *   - dpr capped at [1, 2] (retina without melting GPU)
 *   - prefers-reduced-motion → return fallback, never mount the canvas
 *   - Suspense around children for async asset loading
 *   - alpha:true so the scene composes over CSS background
 *   - render loop suspended while off-screen (see below)
 */
export function SceneCanvas({
  children,
  fallback,
  className,
  cameraPosition = [0, 0, 5],
  fov = 45,
  shadows = false,
}: Props) {
  const reducedMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Une scène hors écran continue sinon de rendre à 60 fps une fois l'utilisateur
  // descendu dans la page : GPU et batterie consommés pour des pixels invisibles.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? true),
      { rootMargin: "120px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  if (reducedMotion) return <>{fallback}</>;

  return (
    <div ref={hostRef} className={className}>
      <Canvas
        dpr={[1, 2]}
        shadows={shadows}
        frameloop={visible ? "always" : "never"}
        camera={{ position: cameraPosition, fov }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
