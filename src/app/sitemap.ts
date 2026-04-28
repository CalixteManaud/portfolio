import type { MetadataRoute } from "next";
import { defaultLocale, type Locale, locales } from "@/i18n/config";
import { listSlugs } from "@/lib/content";
import { env } from "@/lib/env";

const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

type LocalizedPath = Record<Locale, string>;

const STATIC_PATHS: Record<string, LocalizedPath> = {
  home: { fr: "/", en: "/", es: "/", de: "/" },
  about: { fr: "/parcours", en: "/about", es: "/recorrido", de: "/werdegang" },
  projects: { fr: "/projets", en: "/projects", es: "/proyectos", de: "/projekte" },
  meetings: { fr: "/rencontres", en: "/meetings", es: "/encuentros", de: "/begegnungen" },
  contact: { fr: "/contact", en: "/contact", es: "/contacto", de: "/kontakt" },
};

const PROJECT_BASE: LocalizedPath = STATIC_PATHS.projects as LocalizedPath;
const MEETING_BASE: LocalizedPath = STATIC_PATHS.meetings as LocalizedPath;

function urlFor(locale: Locale, pathname: string): string {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const cleanPath = pathname === "/" ? "" : pathname;
  return `${baseUrl}${prefix}${cleanPath}`;
}

function localesMap(pathByLocale: LocalizedPath): Record<string, string> {
  const out: Record<string, string> = {};
  for (const loc of locales) out[loc] = urlFor(loc, pathByLocale[loc]);
  out["x-default"] = urlFor(defaultLocale, pathByLocale[defaultLocale]);
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, meetingSlugs] = await Promise.all([
    listSlugs("projects"),
    listSlugs("meetings"),
  ]);

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const key of Object.keys(STATIC_PATHS)) {
    const paths = STATIC_PATHS[key] as LocalizedPath;
    entries.push({
      url: urlFor(defaultLocale, paths[defaultLocale]),
      lastModified: now,
      changeFrequency: key === "home" ? "weekly" : "monthly",
      priority: key === "home" ? 1.0 : 0.7,
      alternates: { languages: localesMap(paths) },
    });
  }

  for (const slug of projectSlugs) {
    const paths: LocalizedPath = {
      fr: `${PROJECT_BASE.fr}/${slug}`,
      en: `${PROJECT_BASE.en}/${slug}`,
      es: `${PROJECT_BASE.es}/${slug}`,
      de: `${PROJECT_BASE.de}/${slug}`,
    };
    entries.push({
      url: urlFor(defaultLocale, paths[defaultLocale]),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: localesMap(paths) },
    });
  }

  for (const slug of meetingSlugs) {
    const paths: LocalizedPath = {
      fr: `${MEETING_BASE.fr}/${slug}`,
      en: `${MEETING_BASE.en}/${slug}`,
      es: `${MEETING_BASE.es}/${slug}`,
      de: `${MEETING_BASE.de}/${slug}`,
    };
    entries.push({
      url: urlFor(defaultLocale, paths[defaultLocale]),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: { languages: localesMap(paths) },
    });
  }

  return entries;
}
