import { existsSync } from "node:fs";
import path from "node:path";
import { ArrowRight, Lightbulb, Target, TrendingUp, UsersRound } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { PeaksIcon } from "@/components/shared/Doodles";
import { Link } from "@/i18n/navigation";
import { Kicker } from "./Kicker";

/** La forêt brumeuse de la carte « Toujours plus haut », affichée une fois déposée. */
const HIGHER = existsSync(path.join(process.cwd(), "public", "photos", "about-higher.webp"))
  ? "/photos/about-higher.webp"
  : null;

type ValueId = "curiosity" | "impact" | "collaboration" | "progression";

const VALUES: Array<{ id: ValueId; Icon: ComponentType<SVGProps<SVGSVGElement>> }> = [
  { id: "curiosity", Icon: Lightbulb },
  { id: "impact", Icon: Target },
  { id: "collaboration", Icon: UsersRound },
  { id: "progression", Icon: TrendingUp },
];

export async function AboutValues() {
  const t = await getTranslations("About.values");

  return (
    <section aria-labelledby="values-title" className="py-14 lg:pt-[54px] lg:pb-[40px]">
      <div className="mx-auto w-[min(100%-2.5rem,82.5rem)]">
        <Kicker>{t("kicker")}</Kicker>
        <h2
          id="values-title"
          className="mt-3 text-balance text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.035em] text-ink"
        >
          {t("title")}
        </h2>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.7fr)]">
          {VALUES.map(({ id, Icon }, i) => (
            <Reveal key={id} delay={i * 0.06} className="h-full">
              <article className="h-full rounded-2xl border border-rule bg-chalk p-5 shadow-lift-1 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lift-2">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-copper-tint text-copper-deep">
                  <Icon className="size-6" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-[16.5px] font-semibold tracking-[-0.01em] text-ink">
                  {t(`items.${id}.title`)}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                  {t(`items.${id}.body`)}
                </p>
              </article>
            </Reveal>
          ))}

          <Reveal delay={0.24} className="h-full sm:col-span-2 lg:col-span-1">
            <article className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-screen p-7 text-screen-ink shadow-lift-3">
              {HIGHER ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[55%] [mask-image:linear-gradient(to_bottom,black_35%,transparent)]"
                >
                  <Image
                    src={HIGHER}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <h3
                className={`relative flex items-center gap-3 text-[17px] font-semibold ${HIGHER ? "mt-24" : ""}`}
              >
                <PeaksIcon className="text-copper-bright" />
                {t("higher.title")}
              </h3>
              <p className="relative mt-4 text-[14px] leading-relaxed text-screen-soft">
                {t("higher.body")}
              </p>
              <Link
                href="/contact"
                className="group relative mt-6 inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-copper-bright px-5 text-[13.5px] font-semibold text-screen transition-[filter,transform] hover:-translate-y-px hover:brightness-110"
              >
                {t("higher.cta")}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
