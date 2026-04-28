"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { CareerMeta } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type TimelineStep = {
  meta: CareerMeta;
  title: string;
  body: React.ReactElement;
};

type Props = {
  steps: TimelineStep[];
};

export function TimelineCareer({ steps }: Props) {
  const t = useTranslations("About");
  const formatter = useFormatter();
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    if (window.innerWidth < 768) return;

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth - container.clientWidth;
      if (distance <= 0) return;

      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 0.6,
          start: "top top",
          end: () => `+=${distance}`,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [reduced]);

  const formatDate = (iso: string) =>
    formatter.dateTime(new Date(iso), { year: "numeric", month: "short" });

  return (
    <div ref={containerRef} className="relative md:h-svh md:overflow-hidden">
      <ol
        ref={trackRef}
        className="flex flex-col gap-6 md:flex-row md:items-center md:gap-12 md:px-[10vw] md:pt-32"
      >
        {steps.map((step, i) => {
          const isCurrent = !step.meta.endDate;
          return (
            <li key={step.meta.slug} className="md:w-[min(620px,80vw)] md:shrink-0">
              <article className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-colors md:p-8">
                <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
                  <span
                    className={[
                      "font-mono text-xs uppercase tracking-wider",
                      isCurrent ? "text-[oklch(0.70_0.28_240)]" : "text-foreground/50",
                    ].join(" ")}
                  >
                    {String(i + 1).padStart(2, "0")} · {formatDate(step.meta.startDate)} —{" "}
                    {step.meta.endDate ? formatDate(step.meta.endDate) : t("present")}
                  </span>
                  {step.meta.location ? (
                    <span className="font-mono text-xs text-foreground/45">
                      {step.meta.location}
                    </span>
                  ) : null}
                </header>

                {/* Dot indicateur */}
                <div className="mb-3 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={[
                      "inline-block h-2 w-2 rounded-full",
                      isCurrent
                        ? "bg-[oklch(0.70_0.28_240)] shadow-[0_0_8px_oklch(0.70_0.28_240/0.6)]"
                        : "bg-border",
                    ].join(" ")}
                  />
                  <h3 className="text-balance text-xl font-semibold tracking-tight md:text-2xl">
                    {step.meta.role}
                  </h3>
                </div>

                <p className="text-sm text-[oklch(0.70_0.28_240)]">{step.meta.company}</p>
                <h4 className="mt-3 font-mono text-sm text-foreground/55">{step.title}</h4>

                <div className="mt-4 text-sm leading-relaxed text-foreground/75">{step.body}</div>

                {step.meta.stack.length > 0 ? (
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {step.meta.stack.map((s) => (
                      <li
                        key={s}
                        className="rounded-md border border-border/50 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-foreground/65"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
