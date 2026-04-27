---
name: portfolio-3d
description: Creating, modifying, or debugging React Three Fiber scenes, 3D models, shaders, and post-processing effects for the portfolio. Use whenever the task involves the `/components/3d/` folder, `.glb` files, `useFrame`, `useThree`, Drei helpers, or any three.js code. Do NOT use for 2D animations (see portfolio-animations skill).
---

# Skill — 3D Scenes with React Three Fiber

## Core principles

1. **Déclaratif, jamais impératif.** Pas de `new THREE.Mesh()` en dehors d'un use-case shader custom. Tout passe par JSX.
2. **Suspense first.** Toute scène chargeant un asset externe (modèle, texture, HDRI) est dans un `<Suspense fallback={...}>`.
3. **SSR off.** Les composants R3F sont importés via `next/dynamic(() => import(...), { ssr: false })` pour éviter les erreurs d'hydratation et réduire le bundle SSR.
4. **Reduced motion.** Si `useReducedMotion()` retourne true → remplacer la scène par un fallback statique (image OG ou `<video muted autoplay loop>`).
5. **Performance budget :** 60fps cible, 30fps plancher sur mid-range Android. Mesurer avec `r3f-perf` en dev.

## Folder structure

```
src/components/3d/
├── canvas/
│   └── SceneCanvas.tsx        # Canvas + Suspense + controls (réutilisable)
├── scenes/
│   ├── HeroScene.tsx
│   ├── ProjectsScene.tsx
│   └── ContactScene.tsx
├── models/
│   ├── Workstation.tsx        # useGLTF wrappers typés
│   └── ServerRack.tsx
├── effects/
│   ├── PostFX.tsx             # EffectComposer + passes
│   └── ScrollCamera.tsx       # camera driven by scroll
├── shaders/
│   └── holographic.glsl
└── hooks/
    ├── useScrollProgress.ts
    └── useViewportSize.ts
```

## Canvas template (copier-coller)

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Preload } from "@react-three/drei";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
};

export function SceneCanvas({ children, fallback, className }: Props) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return <>{fallback}</>;

  return (
    <Canvas
      className={className}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 45 }}
      frameloop="demand"
      // frameloop="always" uniquement si animation continue
    >
      <Suspense fallback={null}>
        {children}
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
```

## Model loading pattern

```tsx
"use client";

import { useGLTF } from "@react-three/drei";
import type { GroupProps } from "@react-three/fiber";
import type { GLTF } from "three-stdlib";

type WorkstationGLTF = GLTF & {
  nodes: { monitor: THREE.Mesh; keyboard: THREE.Mesh /* ... */ };
  materials: { screen: THREE.MeshStandardMaterial };
};

export function Workstation(props: GroupProps) {
  const { nodes, materials } = useGLTF("/models/workstation.glb") as WorkstationGLTF;

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.monitor.geometry} material={materials.screen} />
      <mesh geometry={nodes.keyboard.geometry} material={materials.screen} />
    </group>
  );
}

useGLTF.preload("/models/workstation.glb");
```

**Pour générer le typage et le JSX** : `npx gltfjsx public/models/workstation.glb --transform --types`. Ça compresse aussi en Draco/Meshopt et produit un `.tsx` clean.

## Post-processing (signature visuelle)

```tsx
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function PostFX() {
  return (
    <EffectComposer multisampling={0} disableNormalPass>
      <Bloom intensity={0.6} luminanceThreshold={0.8} mipmapBlur />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0005, 0.0005]}
      />
      <Noise premultiply blendFunction={BlendFunction.ADD} opacity={0.15} />
      <Vignette eskil={false} offset={0.1} darkness={0.7} />
    </EffectComposer>
  );
}
```

## Scroll-driven camera (pattern)

Sync Lenis avec la caméra R3F sans passer par `document.scrollTop` :

```tsx
import { useFrame } from "@react-three/fiber";
import { useScrollProgress } from "@/hooks/useScrollProgress"; // Lenis-backed

export function ScrollCamera() {
  const progress = useScrollProgress(); // 0 → 1

  useFrame(({ camera }) => {
    camera.position.lerp(
      new THREE.Vector3(0, -progress.current * 10, 5 - progress.current * 3),
      0.05
    );
    camera.lookAt(0, -progress.current * 10, 0);
  });

  return null;
}
```

## Optimization checklist

- [ ] Modèles passés par `gltf-transform optimize` (Draco + Meshopt + texture resize)
- [ ] Textures en KTX2 (basis compressed) si supporté
- [ ] `<Instances>` pour répéter un mesh (>10 fois)
- [ ] `BVH` pour raycasting sur meshs complexes (`three-mesh-bvh`)
- [ ] `frameloop="demand"` + `invalidate()` si scène statique avec interactions ponctuelles
- [ ] `<Detailed>` (LOD) pour modèles vus de loin
- [ ] Éviter `shadows` sauf si vraiment nécessaire ; préférer baked shadows dans la texture
- [ ] `<Environment preset="..." />` plutôt que lumières custom quand possible

## Debug tools (dev only)

```tsx
import { Perf } from "r3f-perf";
import { Stats } from "@react-three/drei";

{process.env.NODE_ENV === "development" && <Perf position="top-left" />}
```

## Red flags — ne JAMAIS faire

- ❌ `import model from './model.glb'` — casse Webpack, tue le SSR
- ❌ `new THREE.Vector3()` dans le render (crée des objets à chaque frame) → utiliser `useMemo` ou refs
- ❌ State React muté dans `useFrame` avec `setState` → utiliser des refs
- ❌ `OrbitControls` sans `makeDefault` si d'autres hooks ont besoin de la caméra
- ❌ `dispose={null}` oublié sur les `<group>` de modèles partagés
- ❌ Texture chargée à chaque render (utiliser `useTexture` qui cache)

## Accessibility fallback

Chaque scène 3D doit avoir :
```tsx
<div role="img" aria-label="Animation 3D d'un poste de travail DevOps avec serveurs">
  <SceneCanvas fallback={<img src="/fallbacks/hero.jpg" alt="..." />}>
    ...
  </SceneCanvas>
</div>
```
