import { getTranslations, setRequestLocale } from "next-intl/server";
import { TimelineCareer } from "@/components/sections/TimelineCareer";
import type { Locale } from "@/i18n/config";
import { listEntries } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: t("title"), description: t("intro") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("About");
  const entries = await listEntries("career", locale);

  const steps = entries.map((entry) => ({
    meta: entry.meta,
    title: String(entry.frontmatter.title ?? entry.meta.role),
    body: entry.content,
  }));

  return (
    <main>
      <section className="mx-auto max-w-4xl px-4 pt-32 pb-12 md:px-6">
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-foreground/75 leading-relaxed">
          {t("intro")}
        </p>
      </section>

      {steps.length > 0 ? <TimelineCareer steps={steps} /> : null}
    </main>
  );
}
