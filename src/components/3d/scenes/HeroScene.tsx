"use client";

import { Environment, Float, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

/**
 * Signature hero shape: an icosahedron with metallic + emissive material,
 * wrapped in a wireframe ghost slightly scaled up. Floats and slowly rotates.
 *
 * Intentionally lightweight — no GLB, no textures. First-paint friendly.
 */
export function HeroScene() {
  const solid = useRef<Mesh>(null);
  const wire = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (solid.current) {
      solid.current.rotation.x += delta * 0.12;
      solid.current.rotation.y += delta * 0.18;
    }
    if (wire.current) {
      wire.current.rotation.x -= delta * 0.05;
      wire.current.rotation.y -= delta * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[-5, -3, -5]} intensity={0.6} color="#22d3ee" />
      <pointLight position={[0, 4, -3]} intensity={0.4} color="#f472b6" />

      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh ref={solid}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.9}
            roughness={0.18}
            emissive="#7c3aed"
            emissiveIntensity={0.18}
          />
        </mesh>

        <mesh ref={wire} scale={1.04}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0.35} />
        </mesh>
      </Float>

      {/* Procedural env map — no network fetch (was: <Environment preset="night" />). */}
      <Environment resolution={256} frames={1} background={false}>
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#a78bfa"
          position={[3, 2, 2]}
          scale={[3, 1.5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#22d3ee"
          position={[-3, -1, 2]}
          scale={[3, 1.5, 1]}
        />
        <Lightformer
          form="circle"
          intensity={1}
          color="#f472b6"
          position={[0, 3, -2]}
          scale={[2, 2, 1]}
        />
      </Environment>
    </>
  );
}
