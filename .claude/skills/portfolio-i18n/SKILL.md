---
name: portfolio-i18n
description: Internationalization setup and maintenance — adding new locales, creating translation keys, localizing routes, translating MDX content, formatting dates/numbers/currency, locale-aware navigation. Use whenever the task involves `next-intl`, `messages/*.json`, `useTranslations`, `getTranslations`, `useLocale`, `useFormatter`, the `[locale]` segment, or hreflang tags.
---

# Skill — i18n with next-intl

## Supported locales

```ts
// src/i18n/config.ts
export const locales = ["fr", "en", "es", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const localeLabels: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  de: "Deutsch",
};

export const localeFlags: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  es: "🇪🇸",
  de: "🇩🇪",
};
```

Ajouter une nouvelle locale = 4 étapes :
1. Ajouter le code dans `locales` + `localeLabels` + `localeFlags`
2. Créer `messages/xx.json` (copier `fr.json` puis traduire)
3. Ajouter les pathnames localisés dans `routing.ts`
4. Créer les MDX correspondants dans `content/*/[slug]/xx.mdx` (ou laisser vide pour déclencher le fallback FR)

## Routing setup

```ts
// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always", // Toujours /fr, /en, /es, /de — jamais de URL sans prefix
  pathnames: {
    "/": "/",
    "/about": {
      fr: "/parcours",
      en: "/about",
      es: "/trayectoria",
      de: "/werdegang",
    },
    "/projects": {
      fr: "/projets",
      en: "/projects",
      es: "/proyectos",
      de: "/projekte",
    },
    "/meetings": {
      fr: "/rencontres",
      en: "/meetings",
      es: "/encuentros",
      de: "/begegnungen",
    },
    "/contact": {
      fr: "/contact",
      en: "/contact",
      es: "/contacto",
      de: "/kontakt",
    },
  },
});

export type Pathname = keyof typeof routing.pathnames;
```

```ts
// src/i18n/navigation.ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

**Règle :** ne **jamais** utiliser `next/link` ni `next/navigation` directement. Toujours importer depuis `@/i18n/navigation`.

## Request config

```ts
// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: "Europe/Paris",
    now: new Date(),
  };
});
```

## Middleware (next-intl uniquement, pas d'auth)

```ts
// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

## Messages structure

```
messages/
├── fr.json        # Source de vérité (FR par défaut)
├── en.json
├── es.json
└── de.json
```

Organisation par namespace :

```json
{
  "common": {
    "nav": { "home": "Accueil", "about": "Parcours", "projects": "Projets", ... },
    "cta": { "contact": "Me contacter", "seeMore": "Voir plus" },
    "meta": { "siteName": "Portfolio — Warthoz" }
  },
  "home": {
    "hero": {
      "title": "DevOps & DevSecOps Engineer",
      "subtitle": "Je sécurise et industrialise vos infrastructures."
    }
  },
  "about": { ... },
  "projects": { ... },
  "meetings": { ... },
  "contact": { ... },
  "errors": { ... }
}
```

**Règles :**
- Namespacing obligatoire (jamais de clés à plat)
- Pas plus de 3 niveaux de nesting
- Clés en camelCase
- Même structure dans toutes les locales — un script CI le vérifie

## Usage in components

### Server Component (préféré)

```tsx
import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("about");
  return <h1>{t("title")}</h1>;
}
```

### Client Component

```tsx
"use client";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("contact.form");
  return <label>{t("name")}</label>;
}
```

### Interpolation et pluriels (ICU)

```json
"projects": {
  "count": "{count, plural, =0 {Aucun projet} one {# projet} other {# projets}}",
  "greeting": "Bonjour {name}, bienvenue !"
}
```

```tsx
t("count", { count: projects.length })
t("greeting", { name: user.name })
```

### Rich text (liens, bold)

```json
"about": {
  "bio": "J'ai fondé <link>AdSmithy</link> en 2024."
}
```

```tsx
t.rich("bio", {
  link: (chunks) => <a href="https://adsmithy.com">{chunks}</a>,
});
```

## Formatter (dates, nombres, devises)

```tsx
import { useFormatter } from "next-intl";

const format = useFormatter();
format.dateTime(new Date(), { dateStyle: "long" });
format.number(1234.5, { style: "currency", currency: "EUR" });
format.relativeTime(date);
```

**Jamais** `Date.toLocaleDateString()` — pas synchrone avec la locale next-intl.

## Localized content (MDX)

Structure :
```
content/projects/adsmithy/
├── meta.json          # slug, tags, dates (non traduits)
├── fr.mdx
├── en.mdx
├── es.mdx
└── de.mdx
```

Loader :
```ts
// src/lib/content.ts
import fs from "node:fs/promises";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import type { Locale } from "@/i18n/config";

export async function getProject(slug: string, locale: Locale) {
  const meta = JSON.parse(
    await fs.readFile(path.join("content/projects", slug, "meta.json"), "utf-8")
  );
  const source = await fs.readFile(
    path.join("content/projects", slug, `${locale}.mdx`),
    "utf-8"
  );
  const { content, frontmatter } = await compileMDX({
    source,
    options: { parseFrontmatter: true },
  });
  return { meta, frontmatter, content };
}
```

**Fallback :** si un MDX manque dans une locale → fallback vers `defaultLocale` + flag `isFallback: true` pour afficher un petit badge "EN (original)".

## SEO — hreflang & canonical

```ts
// Dans chaque page.tsx
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}/about`])
  );

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/about`,
      languages,
    },
  };
}
```

## Language switcher

```tsx
"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/config";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const onChange = (next: Locale) => {
    router.replace(pathname, { locale: next });
  };

  return (
    <select value={locale} onChange={(e) => onChange(e.target.value as Locale)}>
      {locales.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
    </select>
  );
}
```

## CI check — clés manquantes

Script `pnpm i18n:check` qui compare les clés entre `fr.json` (source de vérité) et les autres. Échoue si divergence. À brancher dans GitHub Actions.

## Anti-patterns

- ❌ Chaînes en dur dans le JSX (même "OK", "Fermer") → toujours via `t()`
- ❌ `next/link` au lieu de `@/i18n/navigation`'s Link → casse les routes localisées
- ❌ Concaténation de traductions : `t("hello") + " " + name` → utiliser interpolation ICU
- ❌ Clés génériques (`"text1"`, `"label"`) → toujours descriptives (`"contact.form.submitButton"`)
- ❌ Traductions hardcodées dans la BDD sans schéma de traduction → utiliser la table `*Translation`
