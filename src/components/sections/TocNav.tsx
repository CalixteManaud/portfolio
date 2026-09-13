"use client";

import { useEffect, useState } from "react";
import { Kicker } from "@/components/about/Kicker";

type Item = { id: string; text: string };

/**
 * Le sommaire des pages éditoriales. Collé à gauche sur grand écran, il suit
 * la lecture : la section en cours porte `aria-current`. Elle se calcule à
 * chaque défilement (dernière section passée sous le tiers haut de l'écran,
 * la dernière au bas de la page) plutôt que par un observateur, qui laisse un
 * état périmé quand on revient d'un coup en haut.
 */
export function TocNav({ label, items }: { label: string; items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current = targets[0]?.id;
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) current = targets[targets.length - 1]?.id;
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className="mb-6 lg:mb-0">
      <div className="rounded-2xl border border-rule bg-chalk p-5 shadow-lift-1 lg:sticky lg:top-24">
        <Kicker>{label}</Kicker>
        <ol className="mt-3 space-y-0.5">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "location" : undefined}
                className="flex items-baseline gap-3 rounded-lg px-2.5 py-1.5 text-[13.5px] leading-snug text-ink-soft transition-colors hover:bg-board hover:text-ink aria-[current=location]:bg-board aria-[current=location]:font-medium aria-[current=location]:text-ink"
              >
                <span className="font-mono text-[11.5px] text-copper-deep">{item.id.slice(2)}</span>
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
