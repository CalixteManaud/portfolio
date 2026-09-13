"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { ExtrudeGeometry, type Group, Path, Shape, Vector2 } from "three";
import {
  type FlatShape,
  MONOGRAM_BODY,
  MONOGRAM_COPPER,
} from "@/components/3d/models/monogramShapes";
import { readCssColorHex } from "@/lib/css-tokens";

const BODY_DEPTH = 0.16;
const BEVEL = 0.018;

function points(flat: number[]): Vector2[] {
  const out: Vector2[] = [];
  for (let i = 0; i + 1 < flat.length; i += 2) {
    out.push(new Vector2(flat[i] ?? 0, flat[i + 1] ?? 0));
  }
  return out;
}

/** Centre horizontal moyen d une forme : la piste du C est a droite de -0.4. */
function isTrace({ outer }: FlatShape): boolean {
  let sum = 0;
  for (let i = 0; i < outer.length; i += 2) sum += outer[i] ?? 0;
  return sum / (outer.length / 2) > -0.4;
}

function toShape({ outer, holes }: FlatShape): Shape {
  const shape = new Shape(points(outer));
  for (const hole of holes) shape.holes.push(new Path(points(hole)));
  return shape;
}

/**
 * Le monogramme MC, extrudé depuis les contours vectorisés du logo.
 *
 * Le corps est pâle, presque de la couleur du fond : il porte le relief sans
 * disputer l'attention au portrait posé devant. La piste de circuit du logo
 * affleure en saillie sur la face avant, en cuivre éteint. Le tout suit
 * légèrement le pointeur, sur toute la fenêtre — le portrait couvre la toile et
 * intercepterait sinon les événements.
 */
export function MonogramScene() {
  const group = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const colors = useMemo(
    () => ({
      body: readCssColorHex("--monogram", "#d6cfc6"),
      trace: readCssColorHex("--monogram-trace", "#c9a184"),
    }),
    [],
  );

  const bodyGeometry = useMemo(() => {
    const g = new ExtrudeGeometry(MONOGRAM_BODY.map(toShape), {
      depth: BODY_DEPTH,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: 0.012,
      bevelSegments: 3,
      curveSegments: 8,
    });
    g.translate(0, 0, -BODY_DEPTH / 2);
    return g;
  }, []);

  const traceGeometry = useMemo(() => {
    // Seule la piste de circuit du C affleure : le glyphe du M passerait sous
    // l annotation manuscrite posee devant.
    const g = new ExtrudeGeometry(MONOGRAM_COPPER.filter(isTrace).map(toShape), {
      depth: 0.012,
      bevelEnabled: false,
    });
    g.translate(0, 0, BODY_DEPTH / 2 + BEVEL);
    return g;
  }, []);

  useEffect(
    () => () => {
      bodyGeometry.dispose();
      traceGeometry.dispose();
    },
    [bodyGeometry, traceGeometry],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    // Amorti exponentiel : indépendant de la cadence d'affichage.
    const k = 1 - Math.exp(-delta * 2.5);
    const t = state.clock.elapsedTime;
    const targetY = -0.2 + pointer.current.x * 0.22 + Math.sin(t * 0.35) * 0.035;
    const targetX = 0.08 + pointer.current.y * 0.1;
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
  });

  return (
    <>
      <hemisphereLight args={["#fffaf2", "#b9ad9f", 0.8]} />
      <ambientLight intensity={0.3} />
      {/* Lumiere ponctuelle proche : un degrade sur les faces avant, comme le platre eclaire de la maquette. */}
      <pointLight
        position={[-1.2, 0.9, 1.6]}
        intensity={2.4}
        distance={5}
        decay={1.5}
        color="#fff4e6"
      />
      <directionalLight position={[3, -1.5, 2]} intensity={0.35} />
      <group ref={group} rotation={[0.08, -0.2, 0]}>
        <mesh geometry={bodyGeometry}>
          <meshStandardMaterial color={colors.body} roughness={0.88} metalness={0} />
        </mesh>
        <mesh geometry={traceGeometry}>
          <meshStandardMaterial color={colors.trace} roughness={0.4} metalness={0.45} />
        </mesh>
      </group>
    </>
  );
}
