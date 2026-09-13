import { existsSync } from "node:fs";
import path from "node:path";
import { CalendarDays, ChartNoAxesColumn, Settings2, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";
import { Kicker } from "@/components/about/Kicker";
import { CrownDoodle } from "@/components/shared/Doodles";
import { PhotoHero } from "@/components/shared/PhotoHero";
import { DOMAIN_COUNT } from "./SkillsDomains";
import { TOOLS } from "./tools";

type Stat = { value: string; label: string };

/** La photo du hero si elle a été déposée, sinon la pose la plus proche
 *  parmi les photos existantes (main au menton, devant l'écran). */
const PHOTO = existsSync(path.join(process.cwd(), "public", "photos", "skills-hero.webp"))
  ? "/photos/skills-hero.webp"
  : "/photos/quotidien-2.webp";

const STAT_ICONS: ComponentType<SVGProps<SVGSVGElement>>[] = [
  Settings2,
  ChartNoAxesColumn,
  CalendarDays,
  Zap,
];

export async function SkillsHero() {
  const t = await getTranslations("Skills.hero");
  const stats = t.raw("stats") as Stat[];
  // Les deux premiers chiffres se lisent sur les listes elles-memes : ils ne peuvent pas deriver.
  const counts = [String(DOMAIN_COUNT), String(TOOLS.length)];
  const figures = stats.map((stat, i) => (counts[i] ? { ...stat, value: counts[i] } : stat));

  return (
    <PhotoHero
      labelledBy="skills-title"
      photo={PHOTO}
      photoAlt={t("photoAlt")}
      photoPosition="object-[center_30%]"
      motto={t.raw("motto") as string[]}
      doodle={<CrownDoodle className="mt-1 ml-12 text-copper-bright" />}
      mottoClassName="lg:top-[14%] lg:left-[50%]"
      quote={t("quote")}
      signature={t("signature")}
      quoteClassName="sm:max-w-[320px]"
      containerClassName="lg:min-h-[440px] lg:py-[54px]"
    >
      <div className="max-w-[640px]">
        <Kicker tone="dark">{t("kicker")}</Kicker>
        <h1
          id="skills-title"
          className="mt-4 text-[clamp(2.3rem,3.8vw,3.3rem)] font-bold leading-[1.04] tracking-[-0.04em]"
        >
          {t.rich("title", {
            accent: (chunks) => <span className="text-copper-bright">{chunks}</span>,
            br: () => <br className="hidden sm:inline" />,
          })}
        </h1>
        <p className="mt-5 max-w-[560px] text-[16px] leading-relaxed text-screen-soft">
          {t("lede")}
        </p>

        <dl
          aria-label={t("statsLabel")}
          className="mt-9 grid grid-cols-2 gap-y-6 sm:grid-cols-[repeat(4,max-content)] sm:divide-x sm:divide-screen-rule"
        >
          {figures.map((stat, i) => {
            const Icon = STAT_ICONS[i] ?? Zap;
            return (
              <div
                key={stat.label}
                className="flex flex-col-reverse justify-end sm:px-5 sm:first:pl-0"
              >
                <dt className="text-[12.5px] leading-snug text-screen-soft">{stat.label}</dt>
                <dd className="mb-1 flex flex-col gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-full border border-copper-bright/50 text-copper-bright">
                    <Icon className="size-[18px]" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <span className="text-[22px] font-bold leading-none tracking-[-0.02em]">
                    {stat.value}
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </PhotoHero>
  );
}
