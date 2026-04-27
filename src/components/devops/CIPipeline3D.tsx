"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SceneCanvas = dynamic(
  () =>
    import("@/components/3d/canvas/SceneCanvas").then((m) => m.SceneCanvas),
  { ssr: false },
);
const CIPipelineScene = dynamic(
  () =>
    import("@/components/devops/CIPipelineScene").then(
      (m) => m.CIPipelineScene,
    ),
  { ssr: false },
);

const STAGES = ["lint", "test", "build", "scan", "deploy"];

type Props = { className?: string };

function FallbackPipeline() {
  return (
    <div
      aria-label="CI/CD pipeline"
      className="flex h-full items-center justify-center rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm"
    >
      <ol className="flex flex-wrap items-center gap-2 font-mono text-sm">
        {STAGES.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span className="rounded-md border border-border/60 bg-background/40 px-2.5 py-1 text-foreground/85">
              {s}
            </span>
            {i < STAGES.length - 1 ? (
              <span className="text-foreground/40" aria-hidden="true">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CIPipeline3D({ className }: Props) {
  const reduced = useReducedMotion();
  if (reduced) return <FallbackPipeline />;

  return (
    <SceneCanvas
      className={className}
      cameraPosition={[0, 1.2, 6]}
      fov={45}
      fallback={<FallbackPipeline />}
    >
      <CIPipelineScene />
    </SceneCanvas>
  );
}
