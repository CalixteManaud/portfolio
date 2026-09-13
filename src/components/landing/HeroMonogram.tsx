"use client";

import dynamic from "next/dynamic";
import { MONOGRAM_ASPECT, MONOGRAM_BODY } from "@/components/3d/models/monogramShapes";

function toPath(flat: number[]): string {
  let d = "";
  for (let i = 0; i + 1 < flat.length; i += 2) {
    // y est vers le haut dans les contours (convention Three.js), vers le bas en SVG.
    d += `${i === 0 ? "M" : "L"}${flat[i]} ${-(flat[i + 1] ?? 0)}`;
  }
  return `${d}Z`;
}

const FLAT_PATH = MONOGRAM_BODY.map((s) => [s.outer, ...s.holes].map(toPath).join("")).join("");

/**
 * Le même monogramme, à plat. Il sert avant l'hydratation, sans WebGL et sous
 * `prefers-reduced-motion` : la place n'est jamais vide, et la silhouette est
 * identique à celle que la 3D va extruder.
 */
function FlatMonogram() {
  return (
    <svg
      viewBox={`${-MONOGRAM_ASPECT / 2 - 0.04} -0.54 ${MONOGRAM_ASPECT + 0.08} 1.08`}
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <path d={FLAT_PATH} fill="var(--monogram)" fillRule="evenodd" />
    </svg>
  );
}

const SceneCanvas = dynamic(
  () => import("@/components/3d/canvas/SceneCanvas").then((m) => m.SceneCanvas),
  { ssr: false, loading: FlatMonogram },
);
const MonogramScene = dynamic(
  () => import("@/components/3d/scenes/MonogramScene").then((m) => m.MonogramScene),
  { ssr: false },
);

/** Le grand « MC » en relief derrière le portrait. Décoratif : le nom et le
 *  métier sont déjà écrits en clair à côté. */
export function HeroMonogram({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <SceneCanvas
        className="h-full w-full"
        fallback={<FlatMonogram />}
        cameraPosition={[0, 0, 2.15]}
        fov={30}
      >
        <MonogramScene />
      </SceneCanvas>
    </div>
  );
}
