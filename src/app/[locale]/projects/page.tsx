import { existsSync } from "node:fs";
import path from "node:path";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FeaturedProject } from "@/components/projects/FeaturedProject";
import { ProjectsCta } from "@/components/projects/ProjectsCta";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { ProjectsHero } from "@/components/projects/ProjectsHero";
import type { ProjectItem } from "@/components/projects/types";
import type { Locale } from "@/i18n/config";
import { listEntries } from "@/lib/content";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects" });
  return { title: t("title"), description: t("intro") };
}

/** La capture d'une fiche, résolue au build : déposer
 *  `public/projects/<slug>.webp` suffit à l'afficher. */
function screenshot(slug: string): string | null {
  return existsSync(path.join(process.cwd(), "public", "projects", `${slug}.webp`))
    ? `/projects/${slug}.webp`
    : null;
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, entries] = await Promise.all([
    getTranslations("Projects"),
    listEntries("projects", locale),
  ]);
  const items: ProjectItem[] = entries.map((entry) => ({
    slug: entry.meta.slug,
    title: String(entry.frontmatter.title ?? entry.meta.slug),
    summary: String(entry.frontmatter.summary ?? ""),
    stack: entry.meta.stack,
    kind: entry.meta.kind,
    categories: entry.meta.categories,
    links: entry.meta.links,
    image: screenshot(entry.meta.slug),
  }));

  const featured = entries.find((entry) => entry.meta.featured && entry.frontmatter.featureTitle);

  return (
    <main id="main-content">
      <ProjectsHero projectCount={items.length} />

      <section
        aria-labelledby="projects-list-title"
        className="mx-auto mt-8 w-[min(100%-2.5rem,82.5rem)]"
      >
        <h2 id="projects-list-title" className="sr-only">
          {t("title")}
        </h2>
        <ProjectsExplorer items={items} />
      </section>

      {featured ? (
        <FeaturedProject
          slug={featured.meta.slug}
          kind={featured.meta.kind}
          title={String(featured.frontmatter.featureTitle)}
          body={String(featured.frontmatter.featureBody ?? "")}
          highlights={
            Array.isArray(featured.frontmatter.highlights)
              ? featured.frontmatter.highlights.map(String)
              : []
          }
          image={screenshot(featured.meta.slug)}
        />
      ) : null}

      <ProjectsCta />
    </main>
  );
}
