import { existsSync } from "node:fs";
import path from "node:path";
import {
  Activity,
  ArrowRight,
  Boxes,
  type LucideIcon,
  MonitorSmartphone,
  ShieldCheck,
  Ship,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Kicker } from "@/components/about/Kicker";
import { ArrowDoodle } from "@/components/shared/Doodles";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ProjectVisual } from "./ProjectVisual";
import type { ProjectKind } from "./types";

const HIGHLIGHT_ICONS: LucideIcon[] = [Boxes, ShieldCheck, Ship, Activity, MonitorSmartphone];

type Props = {
  slug: string;
  kind?: ProjectKind;
  title: string;
  body: string;
  highlights: string[];
  /** Capture de la carte, en repli quand la mise en scène n'est pas déposée. */
  image: string | null;
};

/**
 * Le projet phare, en bande sombre. Tout son texte vient du frontmatter de sa
 * fiche MDX (`featureTitle`, `featureBody`, `highlights`) : changer de projet
 * phare, c'est déplacer `featured: true` d'une fiche à l'autre.
 */
export async function FeaturedProject({ slug, kind, title, body, highlights, image }: Props) {
  const t = await getTranslations("Projects");
  // La mise en scène détourée (ordinateur portable) déborde sous la bande,
  // comme sur la maquette ; en son absence, la capture reste dans son cadre.
  const hasScene = existsSync(
    path.join(process.cwd(), "public", "projects", `${slug}-feature.webp`),
  );
  const scene = hasScene ? `/projects/${slug}-feature.webp` : image;
  const note = t.raw("feature.note") as string[];

  return (
    <section
      aria-labelledby="featured-title"
      className="mx-auto mt-10 w-[min(100%-2.5rem,82.5rem)]"
    >
      <div className="relative grid items-center gap-8 rounded-3xl bg-screen p-7 text-screen-ink shadow-lift-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10 lg:p-9">
        <div>
          <Kicker tone="dark">{t("feature.kicker")}</Kicker>
          <h2
            id="featured-title"
            className="mt-3 text-[clamp(1.6rem,2.3vw,2rem)] font-bold leading-[1.05] tracking-[-0.03em]"
          >
            {title}
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-screen-soft">{body}</p>
          <Link
            href={{ pathname: "/projects/[slug]", params: { slug } }}
            className="group mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-copper-bright px-6 text-[14px] font-semibold text-screen transition-[filter,transform] hover:-translate-y-px hover:brightness-110"
          >
            {t("feature.cta")}
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <ProjectVisual
          image={scene}
          kind={kind}
          alt={title}
          pendingLabel={t("imagePending")}
          sizes="(max-width: 1024px) 90vw, 480px"
          fit={hasScene ? "contain" : "cover"}
          className={cn(
            "aspect-[16/10]",
            hasScene
              ? "bg-transparent lg:relative lg:z-10 lg:-mb-20 lg:self-end"
              : "rounded-xl ring-1 ring-screen-rule",
          )}
        />

        <div className="relative">
          <ul
            aria-label={t("feature.highlightsLabel")}
            className="space-y-3.5 rounded-2xl border border-screen-rule bg-screen-raised p-5"
          >
            {highlights.map((line, i) => {
              const Icon = HIGHLIGHT_ICONS[i] ?? Boxes;
              return (
                <li key={line} className="flex items-center gap-3 text-[13.5px]">
                  <Icon
                    className="size-[18px] shrink-0 text-copper-bright"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                  {line}
                </li>
              );
            })}
          </ul>
          <p
            aria-hidden="true"
            className="mt-5 ml-auto w-fit -rotate-[8deg] pr-2 font-hand text-[26px] leading-[1.02] text-copper-bright"
          >
            {note.map((word) => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
            <ArrowDoodle className="mt-1 ml-8" />
          </p>
        </div>
      </div>
    </section>
  );
}
