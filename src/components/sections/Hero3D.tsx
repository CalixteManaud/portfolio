"use client";

import dynamic from "next/dynamic";
import { HeroFallback } from "./HeroFallback";

/**
 * Lazy-load the entire Three.js stack so the initial bundle stays small.
 * `ssr: false` is allowed here because this is a Client Component.
 */
const SceneCanvas = dynamic(
  () => import("@/components/3d/canvas/SceneCanvas").then((m) => m.SceneCanvas),
  { ssr: false, loading: () => <HeroFallback /> },
);

const HeroScene = dynamic(
  () => import("@/components/3d/scenes/HeroScene").then((m) => m.HeroScene),
  { ssr: false },
);

type Props = {
  className?: string;
};

export function Hero3D({ className }: Props) {
  return (
    <SceneCanvas className={className} fallback={<HeroFallback />}>
      <HeroScene />
    </SceneCanvas>
  );
}
