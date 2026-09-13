export const locales = ["fr", "en", "es", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  de: "Deutsch",
};

/* Pas de drapeaux : Windows ne rend pas les emoji drapeaux (ils retombent sur
   les deux lettres du code pays), et une langue n'est de toute façon pas un
   pays — l'espagnol n'appartient pas à l'Espagne. Le code locale suffit. */

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
