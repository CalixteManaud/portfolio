import { MapPin } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/animations/Reveal";
import type { Locale } from "@/i18n/config";
import { listEntries } from "@/lib/content";
import { SectionHead } from "./SectionHead";

/**
 * Les trois étapes les plus récentes du parcours, lues dans `content/career`.
 * La maquette montrait des dates et des rôles inventés ; ici, tout vient du
 * dépôt — ajouter une étape est un commit MDX.
 */
export async function JourneySection({ locale }: { locale: Locale }) {
  const [t, tAbout, format] = await Promise.all([
    getTranslations("Landing.journey"),
    getTranslations("About"),
    getFormatter(),
  ]);

  const entries = (await listEntries("career", locale))
    .slice()
    .sort((a, b) => b.meta.startDate.localeCompare(a.meta.startDate))
    .slice(0, 3);

  if (entries.length === 0) return null;

  const year = (iso: string) => format.dateTime(new Date(iso), { year: "numeric" });

  return (
    <section aria-labelledby="journey-title" className="pt-14 lg:pt-[40px]">
      <div className="container-page">
        <SectionHead
          id="journey-title"
          kicker={t("kicker")}
          title={t("title")}
          aside={t("aside")}
          action={{ kind: "button", href: "/about", label: t("cta") }}
        />

        <div className="relative mt-6">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[5px] hidden h-px bg-rule md:block"
          />
          <ol className="grid gap-8 md:grid-cols-3 md:gap-0">
            {entries.map((entry, i) => (
              <li key={entry.meta.slug} className="relative md:pr-10">
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 z-10 size-[11px] rounded-full bg-copper ring-4 ring-board"
                />
                <span
                  aria-hidden="true"
                  className="absolute top-4 bottom-0 left-[5px] w-px bg-rule"
                />
                <Reveal delay={i * 0.08} className="pt-6 pl-8">
                  <p className="text-[12.5px] tabular-nums text-ink-soft">
                    {year(entry.meta.startDate)} —{" "}
                    {entry.meta.endDate ? year(entry.meta.endDate) : tAbout("present")}
                  </p>
                  <h3 className="mt-2 text-[15px] font-semibold leading-snug text-ink">
                    {entry.meta.role}
                  </h3>
                  <p className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-copper-tint px-3 py-1 text-[12px] font-medium text-copper-deep">
                      {entry.meta.company}
                    </span>
                    {entry.meta.location ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-board-sunk px-3 py-1 text-[12px] text-ink-soft">
                        <MapPin className="size-3" aria-hidden="true" />
                        {entry.meta.location}
                      </span>
                    ) : null}
                  </p>
                  {entry.frontmatter.title ? (
                    <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
                      {String(entry.frontmatter.title)}
                    </p>
                  ) : null}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
