import { ArrowLeft, ExternalLink, FileText, Github } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/config";
import { getEntry, listSlugs } from "@/lib/content";

export async function generateStaticParams() {
  const slugs = await listSlugs("projects");
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
  const entry = await getEntry("projects", slug, locale);
  if (!entry) return {};
  return {
    title: String(entry.frontmatter.title ?? entry.meta.slug),
    description: String(entry.frontmatter.summary ?? ""),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const entry = await getEntry("projects", slug, locale);
  if (!entry) notFound();

  const t = await getTranslations("Projects");
  const title = String(entry.frontmatter.title ?? entry.meta.slug);
  const summary = String(entry.frontmatter.summary ?? "");

  return (
    <main className="mx-auto max-w-3xl px-4 pt-32 pb-24 md:px-6">
      <Link
        href="/projects"
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

      <header className="mb-10 space-y-4 border-b border-border pb-8">
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          {title}
        </h1>
        {summary ? (
          <p className="text-lg leading-relaxed text-foreground/75">{summary}</p>
        ) : null}
        {entry.meta.stack.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5 pt-2">
            {entry.meta.stack.map((s) => (
              <li
                key={s}
                className="rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[11px] text-foreground/70"
              >
                {s}
              </li>
            ))}
          </ul>
        ) : null}
        {entry.meta.links.repo || entry.meta.links.live || entry.meta.links.docs ? (
          <div className="flex flex-wrap gap-3 pt-2">
            {entry.meta.links.repo ? (
              <ExternalActionLink href={entry.meta.links.repo} icon={Github}>
                {t("links.repo")}
              </ExternalActionLink>
            ) : null}
            {entry.meta.links.live ? (
              <ExternalActionLink href={entry.meta.links.live} icon={ExternalLink}>
                {t("links.live")}
              </ExternalActionLink>
            ) : null}
            {entry.meta.links.docs ? (
              <ExternalActionLink href={entry.meta.links.docs} icon={FileText}>
                {t("links.docs")}
              </ExternalActionLink>
            ) : null}
          </div>
        ) : null}
      </header>

      <article className="prose-invert max-w-none">{entry.content}</article>
    </main>
  );
}

function ExternalActionLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: typeof Github;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-sm font-medium text-foreground/85 transition-colors hover:border-primary/50 hover:text-primary"
    >
      <Icon className="size-4" aria-hidden="true" />
      {children}
    </a>
  );
}
