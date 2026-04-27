import { getTranslations } from "next-intl/server";
import { SplitTextReveal } from "@/components/animations/SplitTextReveal";
import { Link } from "@/i18n/navigation";
import { Hero3D } from "./Hero3D";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section className="relative h-dvh w-full overflow-hidden">
      {/* 3D scene */}
      <Hero3D className="absolute inset-0 -z-10" />

      {/* Glow ambiant violet + bleu (fallback visuel quand la scène 3D charge) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            "radial-gradient(ellipse 55% 65% at 68% 35%, oklch(0.65 0.25 295 / 0.30), transparent 65%)",
            "radial-gradient(ellipse 35% 40% at 72% 65%, oklch(0.70 0.28 240 / 0.16), transparent 60%)",
          ].join(", "),
        }}
      />

      {/* Grid décoratif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.033]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.96 0.008 260) 1px, transparent 1px), linear-gradient(90deg, oklch(0.96 0.008 260) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background/20 via-transparent to-background/85"
      />

      {/* Contenu */}
      <div className="container-px relative z-10 flex h-full flex-col justify-center">
        <div className="max-w-3xl space-y-6">

          {/* Eyebrow */}
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/40">
            {t("eyebrow")}
          </p>

          {/* Titre avec mot accent */}
          <h1 className="text-balance text-5xl font-extrabold leading-[1.03] tracking-[-0.033em] md:text-7xl">
            <SplitTextReveal>
              {/* Le mot "systèmes" sera stylisé via CSS dans SplitTextReveal
                  ou wrappé manuellement selon ton implémentation */}
              {t("title")}
            </SplitTextReveal>
          </h1>

          <p className="max-w-2xl text-pretty text-lg text-foreground/60 md:text-xl">
            {t("subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              href="/projects"
              className="rounded-lg bg-foreground px-5 py-3 text-sm font-bold text-background shadow-lg transition hover:opacity-88 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.70_0.28_240)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t("ctaProjects")}
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-border bg-background/40 px-5 py-3 text-sm font-medium backdrop-blur-sm transition hover:border-[oklch(0.70_0.28_240/0.4)] hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.70_0.28_240)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t("ctaContact")}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
        <div
          aria-hidden="true"
          className="h-10 w-6 rounded-full border border-border/50 p-1"
        >
          <div className="mx-auto h-2 w-1 animate-bounce rounded-full bg-foreground/50" />
        </div>
      </div>
    </section>
  );
}
