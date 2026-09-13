import type { MetadataRoute } from "next";
import { defaultLocale, type Locale, locales } from "@/i18n/config";
import { listSlugs } from "@/lib/content";
import { env } from "@/lib/env";

const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

type LocalizedPath = Record<Locale, string>;

const STATIC_PATHS: Record<string, LocalizedPath> = {
  home: { fr: "/", en: "/", es: "/", de: "/" },
  about: { fr: "/parcours", en: "/about", es: "/recorrido", de: "/werdegang" },
  skills: { fr: "/competences", en: "/skills", es: "/competencias", de: "/kompetenzen" },
  projects: { fr: "/projets", en: "/projects", es: "/proyectos", de: "/projekte" },
  contact: { fr: "/contact", en: "/contact", es: "/contacto", de: "/kontakt" },
  legal: {
    fr: "/mentions-legales",
    en: "/legal",
    es: "/aviso-legal",
    de: "/impressum",
  },
  privacy: {
    fr: "/confidentialite",
    en: "/privacy",
    es: "/privacidad",
    de: "/datenschutz",
  },
};

/** Pages de service : indexables mais sans valeur de référencement. */
const LOW_PRIORITY = new Set(["legal", "privacy"]);

const PROJECT_BASE: LocalizedPath = STATIC_PATHS.projects as LocalizedPath;

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
  const projectSlugs = await listSlugs("projects");

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const key of Object.keys(STATIC_PATHS)) {
    const paths = STATIC_PATHS[key] as LocalizedPath;
    entries.push({
      url: urlFor(defaultLocale, paths[defaultLocale]),
      lastModified: now,
      changeFrequency: key === "home" ? "weekly" : "monthly",
      priority: key === "home" ? 1.0 : LOW_PRIORITY.has(key) ? 0.2 : 0.7,
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

  return entries;
}
