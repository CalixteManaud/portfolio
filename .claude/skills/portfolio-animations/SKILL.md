---
name: portfolio-animations
description: Creating, modifying, or debugging 2D animations — Framer Motion transitions, GSAP ScrollTrigger timelines, Lenis smooth scroll, page transitions, hover/tap interactions, parallax, reveal animations. Use whenever the task involves `motion.*` components, `useScroll`, `gsap.timeline`, `ScrollTrigger`, or `Lenis`. Do NOT use for 3D scene animations (see portfolio-3d skill — use `useFrame` there).
---

# Skill — 2D Animation System

## Tool split (décidé, non négociable)

| Besoin | Outil |
|---|---|
| Hover, tap, layout transitions, shared layout, page transitions | **Framer Motion** |
| Animations scrollées complexes, pinned sections, timeline multi-step, SplitText | **GSAP + ScrollTrigger** |
| Smooth scroll global, lerp scroll | **Lenis** |
| Animations dans Canvas R3F | `useFrame` (voir portfolio-3d) |

**Règle :** ne jamais animer la même propriété avec deux outils en même temps (GSAP + Framer sur le même `transform` = conflits).

## `prefers-reduced-motion` — toujours

Hook central :

```tsx
// src/hooks/useReducedMotion.ts
import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefers(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefers;
}
```

Framer Motion lit automatiquement `prefers-reduced-motion` via `MotionConfig reducedMotion="user"` dans le layout. Le faire une fois :

```tsx
// src/app/[locale]/layout.tsx
import { MotionConfig } from "framer-motion";

<MotionConfig reducedMotion="user">
  {children}
</MotionConfig>
```

Pour GSAP, conditionner manuellement :
```ts
if (!prefersReducedMotion) {
  gsap.timeline({ scrollTrigger: {...} }).to(...);
}
```

## Framer Motion patterns

### Hover / tap cards

```tsx
<motion.a
  whileHover={{ y: -4, scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
/>
```

### Reveal on mount (stagger)

```tsx
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map((i) => <motion.li key={i.id} variants={item}>...</motion.li>)}
</motion.ul>
```

### Page transitions (App Router)

```tsx
// src/components/shared/PageTransition.tsx
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### Magnetic button (signature)

```tsx
const ref = useRef<HTMLButtonElement>(null);
const x = useMotionValue(0);
const y = useMotionValue(0);
const sx = useSpring(x, { stiffness: 200, damping: 20 });
const sy = useSpring(y, { stiffness: 200, damping: 20 });

const onMove = (e: React.MouseEvent) => {
  const rect = ref.current!.getBoundingClientRect();
  x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
  y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
};
const onLeave = () => { x.set(0); y.set(0); };

<motion.button ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave}>
  Contact
</motion.button>
```

## GSAP + ScrollTrigger patterns

### Setup (une fois, dans un provider)

```tsx
// src/components/animations/GsapProvider.tsx
"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function GsapProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Refresh on route change to recompute trigger positions
    ScrollTrigger.refresh();
  }, []);
  return <>{children}</>;
}
```

### Pinned section (timeline parcours)

```tsx
"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export function ParcoursTimeline({ steps }: { steps: Step[] }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = gsap.utils.toArray<HTMLElement>(".timeline-step");

    gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: `+=${items.length * 100}%`,
        pin: true,
        scrub: 1,
      },
    })
      .from(items, {
        opacity: 0,
        y: 80,
        stagger: 0.5,
        ease: "power2.out",
      });
  }, { scope: container });

  return (
    <div ref={container} className="h-screen">
      {steps.map((s) => (
        <div key={s.id} className="timeline-step">...</div>
      ))}
    </div>
  );
}
```

### Parallax multi-layer

```tsx
useGSAP(() => {
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const speed = parseFloat(el.dataset.parallax ?? "0.5");
    gsap.to(el, {
      yPercent: -100 * speed,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
});
```

## Lenis — smooth scroll global

```tsx
// src/components/shared/LenisProvider.tsx
"use client";
import Lenis from "lenis";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => { lenis.destroy(); gsap.ticker.remove(lenis.raf); };
  }, []);
  return <>{children}</>;
}
```

⚠️ Lenis peut casser :
- Les modales / drawers (bloquer le scroll body) → utiliser `lenis.stop()` / `lenis.start()`
- Les `position: sticky` → fonctionne avec Lenis mais tester
- Les ancres `#section` → utiliser `lenis.scrollTo("#section")` au lieu de l'hash natif

## Performance — les 5 règles

1. **Animer `transform` et `opacity` uniquement.** Jamais `top`, `left`, `width`, `height`, `margin` → ça force le layout.
2. **`will-change` avec parcimonie.** Sur éléments animés en continu, pas partout.
3. **Throttle** les listeners mousemove/scroll (même si Framer/GSAP le font déjà en interne).
4. **Batch DOM reads/writes** : `useLayoutEffect` pour les mesures, `useEffect` pour les effets.
5. **Profiler en Chrome DevTools Performance** : cible 60fps, chute à 30fps = problème.

## Anti-patterns

- ❌ Animer le même élément avec Framer ET GSAP simultanément
- ❌ `scroll` listener natif pour parallax → utiliser Lenis + ScrollTrigger
- ❌ Animations de +300ms sur des micro-interactions (hover, tap) — max 200ms
- ❌ `ease-linear` sur tout → utiliser `ease-out` (entrée) / `ease-in` (sortie) / spring
- ❌ Oublier `cleanup` des ScrollTriggers → memory leaks au changement de route
