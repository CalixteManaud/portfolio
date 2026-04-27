import { getTranslations } from "next-intl/server";
import { SplitTextReveal } from "@/components/animations/SplitTextReveal";
import { Link } from "@/i18n/navigation";
import { Hero3D } from "./Hero3D";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section className="relative h-dvh w-full overflow-hidden">
      <Hero3D className="absolute inset-0 -z-10" />

      {/* Vignette so text stays readable over the scene */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/30 via-transparent to-background/80"
      />

      <div className="container-px relative z-10 flex h-full flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
            {t("eyebrow")}
          </p>

          <h1 className="text-balance text-5xl font-bold leading-[1.05] md:text-7xl">
            <SplitTextReveal>{t("title")}</SplitTextReveal>
          </h1>

          <p className="max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            {t("subtitle")}
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              href="/projects"
              className="rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t("ctaProjects")}
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-border bg-background/40 px-5 py-3 font-medium backdrop-blur-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
          className="h-10 w-6 rounded-full border border-border/60 p-1"
        >
          <div className="mx-auto h-2 w-1 animate-bounce rounded-full bg-foreground/60" />
        </div>
      </div>
    </section>
  );
}
