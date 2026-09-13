import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/about": {
      fr: "/parcours",
      en: "/about",
      es: "/recorrido",
      de: "/werdegang",
    },
    "/skills": {
      fr: "/competences",
      en: "/skills",
      es: "/competencias",
      de: "/kompetenzen",
    },
    "/projects": {
      fr: "/projets",
      en: "/projects",
      es: "/proyectos",
      de: "/projekte",
    },
    "/projects/[slug]": {
      fr: "/projets/[slug]",
      en: "/projects/[slug]",
      es: "/proyectos/[slug]",
      de: "/projekte/[slug]",
    },
    "/contact": {
      fr: "/contact",
      en: "/contact",
      es: "/contacto",
      de: "/kontakt",
    },
    "/legal": {
      fr: "/mentions-legales",
      en: "/legal",
      es: "/aviso-legal",
      de: "/impressum",
    },
    "/privacy": {
      fr: "/confidentialite",
      en: "/privacy",
      es: "/privacidad",
      de: "/datenschutz",
    },
  },
});

export type AppPathnames = keyof typeof routing.pathnames;

/** Les entrées de navigation principale. Définies ici, à côté des pathnames
 *  qu'elles doivent respecter : la liste était recopiée dans trois composants,
 *  et ajouter une route en cassait deux. */
export type NavHref = "/" | "/about" | "/skills" | "/projects" | "/contact";
