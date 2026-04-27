"use client";

import { Canvas } from "@react-three/fiber";
import { type ReactNode, Suspense } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
};

/**
 * R3F Canvas wrapper enforcing project-wide rules:
 *   - dpr capped at [1, 2] (retina without melting GPU)
 *   - prefers-reduced-motion → return fallback, never mount the canvas
 *   - Suspense around children for async asset loading
 *   - alpha:true so the scene composes over CSS background
 */
export function SceneCanvas({
  children,
  fallback,
  className,
  cameraPosition = [0, 0, 5],
  fov = 45,
}: Props) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <>{fallback}</>;

  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: cameraPosition, fov }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
