import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import type { Locale } from "@/i18n/config";
import { listEntries } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects" });
  return { title: t("title"), description: t("intro") };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Projects");
  const entries = await listEntries("projects", locale);

  const items = entries.map((entry) => ({
    meta: entry.meta,
    title: String(entry.frontmatter.title ?? entry.meta.slug),
    summary: String(entry.frontmatter.summary ?? ""),
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 pt-32 pb-24 md:px-6">
      <header className="mb-12 space-y-3">
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-foreground/75 leading-relaxed">
          {t("intro")}
        </p>
      </header>

      <ProjectsGrid items={items} />
    </main>
  );
}
