import { ArrowRight, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SplitTextReveal } from "@/components/animations/SplitTextReveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Hero3D } from "./Hero3D";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section className="relative flex min-h-dvh w-full items-center overflow-hidden">
      <Hero3D className="absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="hero-ambient-glow pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden="true"
        className="hero-grid-pattern pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background/30 via-transparent to-background/90"
      />

      <div className="container-px relative z-10 mx-auto w-full max-w-6xl py-32">
        <div className="max-w-3xl space-y-7">
          <Badge
            variant="outline"
            className="h-7 gap-1.5 border-border/60 bg-background/40 px-3 font-mono text-xs uppercase tracking-wider text-foreground/70 backdrop-blur-sm"
          >
            <Sparkles className="size-3 text-primary" aria-hidden="true" />
            {t("eyebrow")}
          </Badge>

          <h1 className="font-heading text-balance text-5xl font-extrabold leading-[1.03] tracking-[-0.033em] md:text-7xl">
            <SplitTextReveal>{t("title")}</SplitTextReveal>
          </h1>

          <p className="max-w-2xl text-pretty text-lg text-foreground/65 md:text-xl">
            {t("subtitle")}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className="h-11 px-5 text-sm font-semibold">
              <Link href="/projects">
                {t("ctaProjects")}
                <ArrowRight className="size-4" aria-hidden="true" data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 px-5 text-sm">
              <Link href="/contact">{t("ctaContact")}</Link>
            </Button>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
      >
        <div className="h-10 w-6 rounded-full border border-border/50 p-1">
          <div className="mx-auto h-2 w-1 animate-bounce rounded-full bg-foreground/50" />
        </div>
      </div>
    </section>
  );
}
