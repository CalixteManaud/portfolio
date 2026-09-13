import { ArrowRight, Blocks, UsersRound } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";
import { Reveal } from "@/components/animations/Reveal";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { listEntries } from "@/lib/content";
import { SectionHead } from "./SectionHead";

type VentureId = "merlio" | "twintable";

/** Les deux entités du CV. Elles n'ont pas de page projet : leur lien mène au
 *  parcours, où elles sont décrites, plutôt qu'à une 404. */
const VENTURES: Array<{ id: VentureId; Icon: ComponentType<SVGProps<SVGSVGElement>> }> = [
  { id: "merlio", Icon: Blocks },
  { id: "twintable", Icon: UsersRound },
];

export async function ProjectsSpotlight({ locale }: { locale: Locale }) {
  const [t, projects] = await Promise.all([
    getTranslations("Landing.projects"),
    listEntries("projects", locale),
  ]);
  // La carte de la landing présente ce site lui-même, quel que soit le projet
  // mis en avant sur la page Projets.
  const featured = projects.find((p) => p.meta.slug === "portfolio-3d") ?? projects[0];

  return (
    <section aria-labelledby="projects-title" className="pt-14 lg:pt-[52px]">
      <div className="container-page">
        <SectionHead
          id="projects-title"
          kicker={t("kicker")}
          title={t("title")}
          aside={t("aside")}
          action={{ kind: "button", href: "/projects", label: t("cta") }}
        />

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.46fr_1fr_1fr]">
          {featured ? (
            <FeaturedCard entry={featured} viewLabel={t("view")} imageAlt={t("imageAlt")} />
          ) : null}

          {VENTURES.map(({ id, Icon }, i) => {
            const tags = t.raw(`ventures.${id}.tags`) as string[];
            return (
              <Reveal key={id} delay={0.08 + i * 0.08} className="h-full">
                <article className="flex h-full flex-col rounded-2xl bg-chalk p-5 shadow-lift-1 ring-1 ring-rule/60">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex size-[68px] shrink-0 items-center justify-center rounded-xl bg-tile text-tile-ink">
                      <Icon className="size-8" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">
                        {t(`ventures.${id}.title`)}
                      </h3>
                      <p className="text-[13px] text-ink-soft">{t(`ventures.${id}.role`)}</p>
                    </div>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md bg-board-sunk px-2.5 py-1 text-[11.5px] text-ink-soft"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">
                    {t(`ventures.${id}.body`)}
                  </p>
                  <Link
                    href="/about"
                    className="group mt-auto inline-flex w-fit items-center gap-1.5 pt-4 text-[13px] font-semibold text-copper-deep transition-colors hover:text-ink"
                  >
                    {t("journey")}
                    <ArrowRight
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type Entry = Awaited<ReturnType<typeof listEntries<"projects">>>[number];

function FeaturedCard({
  entry,
  viewLabel,
  imageAlt,
}: {
  entry: Entry;
  viewLabel: string;
  imageAlt: string;
}) {
  // Le titre MDX porte le nom et sa promesse, séparés par un tiret cadratin :
  // la maquette les affiche sur deux lignes, le second en cuivre.
  const [name, tagline] = String(entry.frontmatter.title ?? entry.meta.slug).split(" — ");
  const summary = String(entry.frontmatter.summary ?? "");

  return (
    <Reveal className="h-full">
      <article className="group grid h-full gap-5 rounded-2xl bg-screen p-3 text-screen-ink shadow-lift-2 ring-1 ring-white/5 sm:grid-cols-[43%_1fr]">
        <div className="relative min-h-[210px] overflow-hidden rounded-xl bg-screen-raised">
          <Image
            src="/landing/project-portfolio-proof.png"
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 90vw, 240px"
            className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex flex-col py-3 pr-3 pl-2 sm:pl-0">
          <h3 className="text-[18px] font-semibold tracking-[-0.01em]">{name}</h3>
          {tagline ? <p className="mt-0.5 text-[13.5px] text-copper-bright">{tagline}</p> : null}
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {entry.meta.stack.slice(0, 4).map((tech) => (
              <li
                key={tech}
                className="rounded-md bg-screen-raised px-2.5 py-1 text-[11.5px] text-screen-ink/85"
              >
                {tech}
              </li>
            ))}
          </ul>
          {summary ? (
            <p className="mt-4 text-[13px] leading-relaxed text-screen-soft">{summary}</p>
          ) : null}
          <Link
            href={{ pathname: "/projects/[slug]", params: { slug: entry.meta.slug } }}
            className="group/link mt-auto inline-flex w-fit items-center gap-1.5 pt-4 text-[13px] font-semibold text-copper-bright transition-colors hover:text-screen-ink"
          >
            {viewLabel}
            <ArrowRight
              className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}
