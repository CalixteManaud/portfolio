import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";
import { listEntries } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meetings" });
  return { title: t("title"), description: t("intro") };
}

export default async function MeetingsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Meetings");
  const entries = await listEntries("meetings", locale);

  return (
    <main className="mx-auto max-w-3xl px-4 pt-32 pb-24 md:px-6">
      <header className="mb-12 space-y-3">
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="text-foreground/75 leading-relaxed">{t("intro")}</p>
      </header>

      {entries.length === 0 ? (
        <p className="text-foreground/60">{t("empty")}</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry) => {
            const title = String(entry.frontmatter.title ?? entry.meta.person);
            const summary = String(entry.frontmatter.summary ?? "");
            return (
              <li key={entry.meta.slug}>
                <Link
                  href={{
                    pathname: "/meetings/[slug]",
                    params: { slug: entry.meta.slug },
                  }}
                  className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                >
                  <div className="space-y-2">
                    <p className="font-mono text-xs uppercase tracking-wider text-foreground/60">
                      {entry.meta.role ?? entry.meta.person}
                    </p>
                    <h2 className="text-balance text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                      {title}
                    </h2>
                    {summary ? (
                      <p className="text-sm leading-relaxed text-foreground/70 line-clamp-2">
                        {summary}
                      </p>
                    ) : null}
                  </div>
                  <ArrowUpRight
                    className="size-5 shrink-0 text-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
