import { existsSync } from "node:fs";
import path from "node:path";
import { Award, Quote } from "lucide-react";
import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/animations/Reveal";
import { ArrowDoodle, BrushUnderline } from "@/components/shared/Doodles";
import type { Locale } from "@/i18n/config";
import { listEntries } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Kicker } from "./Kicker";

/** La nature morte du bureau, affichée seulement une fois déposée. */
const DESK = existsSync(path.join(process.cwd(), "public", "photos", "about-desk.webp"))
  ? "/photos/about-desk.webp"
  : null;

/**
 * Le parcours complet, en frise verticale sur fond sombre. Chaque étape vient
 * de `content/career` : rôle, structure, dates, et le résumé tiré du CV. Les
 * certifications sont rattachées à l'étape où elles ont été obtenues.
 */
export async function AboutJourney({ locale }: { locale: Locale }) {
  const [t, tAbout, format] = await Promise.all([
    getTranslations("About.journey"),
    getTranslations("About"),
    getFormatter(),
  ]);

  // L'ordre éditorial du dépôt, du plus récent au plus ancien : c'est celui
  // de la maquette, qui place l'expérience Salesforce avant le Master.
  const entries = (await listEntries("career", locale))
    .slice()
    .sort((a, b) => b.meta.order - a.meta.order);
  const note = t.raw("note") as string[];
  const year = (iso: string) => format.dateTime(new Date(iso), { year: "numeric" });

  return (
    <section
      aria-labelledby="journey-title"
      className="relative overflow-hidden bg-screen text-screen-ink"
    >
      {DESK ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 hidden w-[46%] max-w-[700px] [mask-image:radial-gradient(ellipse_at_bottom_right,black_45%,transparent_78%)] lg:block"
        >
          <Image
            src={DESK}
            alt=""
            width={1400}
            height={1100}
            sizes="46vw"
            className="h-auto w-full"
          />
        </div>
      ) : null}

      <div className="relative mx-auto grid w-[min(100%-2.5rem,82.5rem)] gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:py-[62px]">
        <div>
          <Kicker tone="dark">{t("kicker")}</Kicker>
          <h2
            id="journey-title"
            className="mt-3 text-balance text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.035em]"
          >
            {t("title")}
          </h2>
          <p className="mt-3 max-w-[560px] text-[15.5px] leading-relaxed text-screen-soft">
            {t("intro")}
          </p>

          <ol className="relative mt-10 space-y-8">
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[161.5px] hidden w-px bg-copper-bright/40 sm:block"
            />
            {entries.map((entry, i) => {
              const summary = entry.frontmatter.summary ? String(entry.frontmatter.summary) : null;
              return (
                <li key={entry.meta.slug}>
                  <Reveal
                    delay={i * 0.06}
                    className="grid gap-1 sm:grid-cols-[134px_24px_minmax(0,1fr)] sm:gap-x-4"
                  >
                    <p className="pt-0.5 text-[13.5px] font-semibold tabular-nums text-copper-bright">
                      {year(entry.meta.startDate)} –{" "}
                      {entry.meta.endDate ? year(entry.meta.endDate) : tAbout("present")}
                    </p>
                    <span
                      aria-hidden="true"
                      className="relative z-10 mt-1.5 hidden size-3 justify-self-center rounded-full bg-copper-bright ring-4 ring-screen sm:block"
                    />
                    <div>
                      <h3 className="text-[16px] font-semibold leading-snug">{entry.meta.role}</h3>
                      <p className="mt-0.5 text-[13.5px] text-copper-bright">
                        {entry.meta.company}
                      </p>
                      {summary ? (
                        <p className="mt-1.5 max-w-[560px] text-[13.5px] leading-relaxed text-screen-soft">
                          {summary}
                        </p>
                      ) : null}
                      {entry.meta.certifications.length > 0 ? (
                        <ul
                          aria-label={t("certifications")}
                          className="mt-2.5 flex flex-wrap gap-1.5"
                        >
                          {entry.meta.certifications.map((cert) => (
                            <li
                              key={cert}
                              className="inline-flex items-center gap-1.5 rounded-md border border-screen-rule px-2 py-0.5 text-[11.5px] text-screen-ink/85"
                            >
                              <Award className="size-3 text-copper-bright" aria-hidden="true" />
                              {cert}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        <aside
          className={cn(
            "relative flex flex-col items-start gap-10 lg:items-end lg:pt-2",
            !DESK && "lg:h-full",
          )}
        >
          <p
            aria-hidden="true"
            className="-rotate-[10deg] font-hand text-[30px] leading-[1.02] text-copper-bright"
          >
            {note.map((word) => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
            <ArrowDoodle className="mt-1 ml-10" />
          </p>

          <figure
            className={cn(
              "w-full max-w-[300px] rounded-2xl border border-screen-rule bg-screen-raised p-7",
              !DESK && "lg:my-auto",
            )}
          >
            <Quote className="size-6 fill-copper-bright text-copper-bright" aria-hidden="true" />
            <blockquote className="mt-4 text-[20px] leading-snug text-screen-ink">
              {t("quote")}
            </blockquote>
            <BrushUnderline className="mt-5 text-copper-bright" />
          </figure>
        </aside>
      </div>
    </section>
  );
}
