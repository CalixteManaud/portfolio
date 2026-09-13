import { existsSync } from "node:fs";
import path from "node:path";
import {
  BriefcaseBusiness,
  Dumbbell,
  Languages,
  Layers,
  MapPin,
  Quote,
  ShieldCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";
import { CrownDoodle } from "@/components/shared/Doodles";
import { Kicker } from "./Kicker";

type Fact = { top: string; bottom: string };
type Stat = { value: string; label: string };
type IconType = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Le portrait bras croisés s'il a été déposé, sinon le portrait existant.
 * Résolu au build : déposer `public/photos/about-portrait.webp` suffit à le
 * mettre en ligne, sans toucher au code.
 */
const PORTRAIT = existsSync(path.join(process.cwd(), "public", "photos", "about-portrait.webp"))
  ? "/photos/about-portrait.webp"
  : "/photos/portrait.webp";

const FACT_ICONS: IconType[] = [MapPin, BriefcaseBusiness, Dumbbell];
const STAT_ICONS: IconType[] = [Layers, Users, ShieldCheck, Languages];

export async function AboutHero() {
  const t = await getTranslations("About.hero");
  const facts = t.raw("facts") as Fact[];
  const stats = t.raw("stats") as Stat[];
  const motto = t.raw("motto") as string[];

  return (
    <section aria-labelledby="about-title" className="relative lg:pb-5">
      <div className="grid lg:grid-cols-[44%_minmax(0,1fr)]">
        {/* Le panneau photo court jusqu'au bord gauche de la fenêtre, comme
            sur la maquette ; seul son coin bas-droit est arrondi. */}
        <figure className="relative min-h-[460px] overflow-hidden sm:min-h-[560px] lg:min-h-[713px] lg:rounded-br-[28px]">
          <Image
            src={PORTRAIT}
            alt={t("portraitAlt")}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 44vw"
            className="object-cover object-[center_22%]"
          />
          {/* Voile de lecture : il garantit le contraste des annotations
              blanches quelle que soit la photo déposée. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/25"
          />

          <p
            aria-hidden="true"
            className="absolute top-[11%] left-[7%] -rotate-[8deg] font-hand text-[26px] leading-[1.05] text-white [text-shadow:0_1px_14px_rgb(0_0_0/0.5)] lg:text-[30px]"
          >
            {motto.map((word) => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
            <CrownDoodle className="mt-2 ml-12 text-copper-bright" />
          </p>

          <figcaption className="absolute right-6 bottom-6 left-6 max-w-[340px] rounded-2xl bg-black/40 p-5 text-white ring-1 ring-white/15 backdrop-blur-md sm:bottom-10 sm:left-8">
            <Quote className="size-5 fill-copper-bright text-copper-bright" aria-hidden="true" />
            <p className="mt-2 text-[14.5px] leading-snug">{t("photoQuote")}</p>
            <p className="mt-3 font-hand text-[26px] leading-none">{t("signature")}</p>
          </figcaption>
        </figure>

        <div className="px-[clamp(1.25rem,4vw,3rem)] pt-10 pb-12 lg:px-[4vw] lg:pt-[58px] lg:pb-10">
          <Kicker>{t("kicker")}</Kicker>
          <h1
            id="about-title"
            className="mt-4 text-[clamp(2.6rem,4.3vw,3.75rem)] font-bold leading-none tracking-[-0.04em] text-ink"
          >
            {t.rich("title", { accent: (chunks) => <span className="text-copper">{chunks}</span> })}
          </h1>

          <div className="mt-6 max-w-[690px] space-y-4 text-[16px] leading-relaxed text-ink-soft">
            <p>
              {t.rich("p1", {
                b: (chunks) => <strong className="font-semibold text-ink">{chunks}</strong>,
              })}
            </p>
            <p>{t("p2")}</p>
          </div>

          <ul className="mt-7 grid gap-5 sm:grid-cols-[auto_auto_auto] sm:justify-between">
            {facts.map((fact, i) => {
              const Icon = FACT_ICONS[i] ?? MapPin;
              return (
                <li key={fact.top} className="flex items-center gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-copper-tint text-copper-deep">
                    <Icon className="size-[18px]" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <span className="text-[13px] leading-snug">
                    <span className="block text-ink-soft">{fact.top}</span>
                    <span className="block font-semibold text-ink">{fact.bottom}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          <figure className="mt-7 flex flex-col gap-4 rounded-2xl bg-board-sunk px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <blockquote className="flex items-start gap-4">
              <Quote
                className="mt-0.5 size-6 shrink-0 fill-copper text-copper"
                aria-hidden="true"
              />
              <p className="max-w-[330px] text-[15px] leading-snug text-ink">{t("quote")}</p>
            </blockquote>
            <figcaption className="flex items-center gap-3 self-end sm:self-auto">
              <span aria-hidden="true" className="h-px w-14 bg-ink/40" />
              <span className="font-hand text-[24px] leading-none text-ink">{t("signature")}</span>
            </figcaption>
          </figure>

          <dl aria-label={t("statsLabel")} className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = STAT_ICONS[i] ?? Layers;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col-reverse items-center justify-end rounded-xl border border-rule bg-chalk px-2 py-4 text-center shadow-lift-1"
                >
                  <dt className="mt-1 text-[12px] leading-snug text-ink-soft">{stat.label}</dt>
                  <dd className="flex flex-col items-center gap-2">
                    <Icon className="size-6 text-copper" strokeWidth={1.5} aria-hidden="true" />
                    <span className="text-[26px] font-bold leading-none tracking-[-0.02em] text-ink">
                      {stat.value}
                    </span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
