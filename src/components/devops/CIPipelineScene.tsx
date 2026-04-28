"use client";

import { Float, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, InstancedMesh, Mesh } from "three";
import { Color, MathUtils, Matrix4, Vector3 } from "three";

const STAGES = [
  { label: "lint", color: "#a78bfa" },
  { label: "test", color: "#22d3ee" },
  { label: "build", color: "#34d399" },
  { label: "scan", color: "#f59e0b" },
  { label: "deploy", color: "#f472b6" },
] as const;

const STAGE_GAP = 2.4;
const PARTICLE_COUNT = 60;
const TRACK_LENGTH = (STAGES.length - 1) * STAGE_GAP;

export function CIPipelineScene() {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 6, 4]} intensity={1.0} color="#a78bfa" />
      <pointLight position={[-4, -2, 4]} intensity={0.6} color="#22d3ee" />

      <group ref={groupRef} position={[-(TRACK_LENGTH / 2), 0, 0]}>
        {/* Track rail */}
        <mesh position={[TRACK_LENGTH / 2, 0, 0]}>
          <boxGeometry args={[TRACK_LENGTH + 0.5, 0.04, 0.04]} />
          <meshBasicMaterial color="#3a3a55" transparent opacity={0.8} />
        </mesh>

        {STAGES.map((stage, i) => (
          <PipelineStage
            key={stage.label}
            position={[i * STAGE_GAP, 0, 0]}
            label={stage.label}
            color={stage.color}
            phase={i / STAGES.length}
          />
        ))}

        <FlowParticles trackLength={TRACK_LENGTH} />
      </group>
    </>
  );
}

function PipelineStage({
  position,
  label,
  color,
  phase,
}: {
  position: [number, number, number];
  label: string;
  color: string;
  phase: number;
}) {
  const ring = useRef<Mesh>(null);
  const core = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime + phase * Math.PI;
    if (ring.current) ring.current.rotation.z = t * 0.6;
    if (core.current) {
      const s = 1 + Math.sin(t * 1.4) * 0.04;
      core.current.scale.setScalar(s);
    }
  });

  return (
    <group position={position}>
      <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.25}>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.35}
            metalness={0.6}
            roughness={0.25}
          />
        </mesh>
        <mesh ref={ring}>
          <torusGeometry args={[0.7, 0.02, 8, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.55} />
        </mesh>
      </Float>

      <Html
        position={[0, -1.05, 0]}
        center
        distanceFactor={6}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: "none" }}
      >
        <span
          className="select-none rounded-md border border-border/50 bg-background/70 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-foreground/85 backdrop-blur"
          style={{ color }}
        >
          {label}
        </span>
      </Html>
    </group>
  );
}

function FlowParticles({ trackLength }: { trackLength: number }) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Matrix4(), []);
  const tmp = useMemo(() => new Vector3(), []);
  const colors = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    const c = new Color();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const stage = STAGES[Math.floor((i / PARTICLE_COUNT) * STAGES.length)] ?? STAGES[0];
      c.set(stage?.color ?? "#a78bfa");
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, []);
  const offsets = useMemo(
    () => Array.from({ length: PARTICLE_COUNT }, () => Math.random() * trackLength),
    [trackLength],
  );

  useFrame((_, delta) => {
    const m = meshRef.current;
    if (!m) return;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const speed = 0.6 + (i % 5) * 0.08;
      offsets[i] = ((offsets[i] ?? 0) + delta * speed) % trackLength;
      const wob = Math.sin(performance.now() * 0.001 + i) * 0.05;
      tmp.set(offsets[i] ?? 0, wob, MathUtils.degToRad((i * 13) % 360) * 0.05);
      dummy.makeTranslation(tmp.x, tmp.y, tmp.z);
      m.setMatrixAt(i, dummy);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial vertexColors transparent opacity={0.85} />
      <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
    </instancedMesh>
  );
}
