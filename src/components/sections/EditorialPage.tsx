import { ArrowRight, Cookie, type LucideIcon, Send, ServerOff, Trash2 } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { Kicker } from "@/components/about/Kicker";
import { CopyButton } from "@/components/contact/CopyButton";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { getEntry } from "@/lib/content";
import { TocNav } from "./TocNav";

type Props = {
  slug: "legal" | "privacy";
  locale: Locale;
};

type Highlight = { title: string; body: string };

const EMAIL = "contact@devcorporation.fr";

/** Dans l'ordre du frontmatter : base de données, cookies, envoi, suppression. */
const HIGHLIGHT_ICONS: LucideIcon[] = [ServerOff, Cookie, Send, Trash2];

function isHighlight(value: unknown): value is Highlight {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Highlight).title === "string" &&
    typeof (value as Highlight).body === "string"
  );
}

/**
 * Chaque `<section>` posée par le chargeur (un titre de niveau 2 et ce qui le
 * suit) devient une carte claire, numérotée en cuivre depuis son attribut
 * `data-section`.
 */
const SECTIONS = [
  "space-y-4",
  "[&>section]:scroll-mt-28 [&>section]:rounded-2xl [&>section]:border [&>section]:border-rule [&>section]:bg-chalk [&>section]:p-6 [&>section]:shadow-lift-1 sm:[&>section]:p-8",
  "[&>section]:before:mb-2 [&>section]:before:block [&>section]:before:font-mono [&>section]:before:text-[12px] [&>section]:before:tracking-wide [&>section]:before:text-copper-deep [&>section]:before:content-[attr(data-section)]",
  "[&_h2]:mt-0 [&_h2]:border-0 [&_h2]:pb-0 [&_h2]:text-[clamp(1.25rem,1.8vw,1.45rem)] [&_h2]:font-bold [&_h2]:tracking-[-0.02em] [&_h2]:text-ink",
  "[&_li]:text-[15px] [&_p]:text-[15px] [&_p:first-of-type]:mt-3",
].join(" ");

/**
 * Les pages éditoriales autonomes (mentions légales, confidentialité), tirées
 * de `content/pages/[slug]/[locale].mdx`. Bandeau sombre compact, sommaire
 * collé à gauche, sections en cartes, puis un encart de contact.
 */
export async function EditorialPage({ slug, locale }: Props) {
  const entry = await getEntry("pages", slug, locale);
  if (!entry) return null;

  const [t, format] = await Promise.all([getTranslations("Pages"), getFormatter()]);
  const lede = typeof entry.frontmatter.lede === "string" ? entry.frontmatter.lede : null;
  const highlights = Array.isArray(entry.frontmatter.highlights)
    ? entry.frontmatter.highlights.filter(isHighlight)
    : [];

  return (
    <main id="main-content">
      <header className="relative overflow-hidden bg-screen text-screen-ink">
        <div
          aria-hidden="true"
          className="dot-grid-screen absolute inset-y-0 right-0 w-1/2 [mask-image:linear-gradient(to_right,transparent,black_70%)]"
        />
        <div className="relative mx-auto w-[min(100%-2.5rem,82.5rem)] py-12 lg:py-16">
          <Kicker tone="dark">{t(`${slug}.kicker`)}</Kicker>
          <h1 className="mt-4 max-w-[760px] text-[clamp(2.1rem,3.6vw,3.1rem)] font-bold leading-[1.04] tracking-[-0.04em]">
            {t(`${slug}.title`)}
          </h1>
          {lede ? (
            <p className="mt-4 max-w-[640px] text-[16px] leading-relaxed text-screen-soft">
              {lede}
            </p>
          ) : null}
          <p className="mt-6 font-mono text-[12px] text-screen-soft">
            {t("updatedAt", {
              date: format.dateTime(new Date(entry.meta.updatedAt), {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            })}
          </p>
        </div>
      </header>

      <div className="mx-auto w-[min(100%-2.5rem,82.5rem)] pt-10 pb-16 lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start lg:gap-10">
        <TocNav label={t("tocLabel")} items={entry.headings} />

        <div className="min-w-0 max-w-[860px]">
          {entry.isFallback ? (
            <p className="mb-4 rounded-xl border border-rule bg-board-sunk px-4 py-2.5 text-[13px] text-ink-soft">
              {t("fallbackBadge")}
            </p>
          ) : null}

          {highlights.length > 0 ? (
            <section aria-label={t("highlightsLabel")} className="mb-4">
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {highlights.map((item, i) => {
                  const Icon = HIGHLIGHT_ICONS[i] ?? ServerOff;
                  return (
                    <li
                      key={item.title}
                      className="flex gap-4 rounded-2xl border border-rule bg-chalk p-5 shadow-lift-1"
                    >
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-copper-tint text-copper-deep">
                        <Icon className="size-[18px]" strokeWidth={1.7} aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-[15px] font-semibold text-ink">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-soft">
                          {item.body}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <div className={SECTIONS}>{entry.content}</div>

          <aside
            aria-labelledby="page-contact-title"
            className="mt-4 flex flex-col gap-6 rounded-2xl bg-screen p-6 text-screen-ink sm:p-8 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <Kicker tone="dark">{t("contactCard.kicker")}</Kicker>
              <h2
                id="page-contact-title"
                className="mt-3 text-[clamp(1.25rem,1.8vw,1.45rem)] font-bold tracking-[-0.02em]"
              >
                {t("contactCard.title")}
              </h2>
              <p className="mt-1.5 max-w-[420px] text-[14px] leading-relaxed text-screen-soft">
                {t("contactCard.body")}
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <div className="flex items-center gap-1 rounded-xl bg-screen-raised py-1.5 pr-1.5 pl-4">
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-[14px] font-semibold break-words text-screen-ink transition-colors hover:text-copper-bright"
                >
                  {EMAIL}
                </a>
                <CopyButton
                  value={EMAIL}
                  label={t("contactCard.copy")}
                  copiedLabel={t("contactCard.copied")}
                  tone="dark"
                />
              </div>
              <Link
                href="/contact"
                className="group inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-copper-bright px-5 text-[14px] font-semibold text-screen transition-[filter,transform] hover:-translate-y-px hover:brightness-110"
              >
                {t("contactCard.cta")}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
