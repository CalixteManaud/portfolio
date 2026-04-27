import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/config";
import { getEntry, listSlugs } from "@/lib/content";

export async function generateStaticParams() {
  const slugs = await listSlugs("meetings");
  return slugs.flatMap((slug) =>
    locales.map((locale) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const entry = await getEntry("meetings", slug, locale);
  if (!entry) return {};
  return {
    title: String(entry.frontmatter.title ?? entry.meta.person),
    description: String(entry.frontmatter.summary ?? ""),
  };
}

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const entry = await getEntry("meetings", slug, locale);
  if (!entry) notFound();

  const t = await getTranslations("Meetings");
  const title = String(entry.frontmatter.title ?? entry.meta.person);
  const summary = String(entry.frontmatter.summary ?? "");

  return (
    <main className="mx-auto max-w-3xl px-4 pt-32 pb-24 md:px-6">
      <Link
        href="/meetings"
        className="mb-8 inline-flex items-center gap-1 text-sm text-foreground/60 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("title")}
      </Link>

      {entry.isFallback ? (
        <p className="mb-6 inline-flex rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-200">
          {t("fallbackBadge")}
        </p>
      ) : null}

      <header className="mb-10 space-y-3 border-b border-border pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-foreground/60">
          {entry.meta.role ?? entry.meta.person}
        </p>
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          {title}
        </h1>
        {summary ? (
          <p className="text-lg leading-relaxed text-foreground/75">{summary}</p>
        ) : null}
      </header>

      <article className="prose-invert max-w-none">{entry.content}</article>
    </main>
  );
}
