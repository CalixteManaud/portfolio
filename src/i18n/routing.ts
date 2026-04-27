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
    "/meetings": {
      fr: "/rencontres",
      en: "/meetings",
      es: "/encuentros",
      de: "/begegnungen",
    },
    "/meetings/[slug]": {
      fr: "/rencontres/[slug]",
      en: "/meetings/[slug]",
      es: "/encuentros/[slug]",
      de: "/begegnungen/[slug]",
    },
    "/contact": {
      fr: "/contact",
      en: "/contact",
      es: "/contacto",
      de: "/kontakt",
    },
  },
});

export type AppPathnames = keyof typeof routing.pathnames;
