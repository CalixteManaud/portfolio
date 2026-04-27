---
name: portfolio-content
description: Building or modifying the main content sections of the portfolio — Hero, Parcours (career timeline), Projects, Meetings (rencontres), Contact form. Use whenever the task involves `src/components/sections/`, MDX project/meeting content, the contact form with Resend/Zod/rate-limiting, filtering/sorting projects, or section-specific UX patterns.
---

# Skill — Content Sections

## Sections overview

| Section | Route | Source de contenu | Animations clés |
|---|---|---|---|
| Hero | `/` | i18n messages | Scène 3D + texte split animé |
| Parcours | `/about` | MDX dans `content/career/` | GSAP pinned timeline |
| Projets | `/projects` + `/projects/[slug]` | MDX dans `content/projects/` | Grid avec Framer + hover 3D |
| Rencontres | `/meetings` + `/meetings/[slug]` | MDX dans `content/meetings/` | Storytelling vertical, illustrations |
| Contact | `/contact` | Formulaire → Resend + Sentry | Form animé, état de soumission |

---

## 0. MDX loader (fondation de toute l'app)

**L'architecture est 100% MDX versionné.** Le loader doit être robuste, typé, avec fallback de locale, et côté RSC pour zéro JS runtime sur le contenu.

### Structure d'un contenu

```
content/projects/adsmithy/
├── meta.json
├── fr.mdx
├── en.mdx
├── es.mdx
└── de.mdx
```

`meta.json` — métadonnées non-traduisibles :
```json
{
  "slug": "adsmithy",
  "featured": true,
  "order": 1,
  "tags": ["devops", "ai", "saas"],
  "stack": ["nextjs", "prisma", "postgres", "replicate"],
  "repoUrl": "https://github.com/warthoz/adsmithy",
  "liveUrl": "https://adsmithy.com",
  "cover": "/projects/adsmithy/cover.jpg",
  "startDate": "2024-10-01",
  "endDate": null,
  "role": "Founder & Lead Engineer"
}
```

### Schémas Zod (une fois, dans `src/lib/content.ts`)

```ts
import { z } from "zod";

export const projectMetaSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  tags: z.array(z.string()),
  stack: z.array(z.string()),
  repoUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  cover: z.string().optional(),
  startDate: z.string().transform((s) => new Date(s)),
  endDate: z.string().transform((s) => new Date(s)).nullable().optional(),
  role: z.string().optional(),
});

export type ProjectMeta = z.infer<typeof projectMetaSchema>;

export const meetingMetaSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  personName: z.string(),
  personRole: z.string().optional(),
  date: z.string().transform((s) => new Date(s)),
  context: z.string().optional(),
  cover: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const careerMetaSchema = z.object({
  id: z.string(),
  order: z.number(),
  type: z.enum(["job", "freelance", "education", "milestone"]),
  start: z.string().transform((s) => new Date(s)),
  end: z.union([z.literal("present"), z.string().transform((s) => new Date(s))]),
  company: z.string(),
  location: z.string().optional(),
  stack: z.array(z.string()).default([]),
});
```

### Le loader (`src/lib/content.ts`)

```ts
import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx/components";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import {
  projectMetaSchema,
  meetingMetaSchema,
  careerMetaSchema,
  type ProjectMeta,
} from "./content-schemas";

const CONTENT_ROOT = path.join(process.cwd(), "content");

const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: "wrap" }],
    [rehypePrettyCode, { theme: { dark: "github-dark", light: "github-light" } }],
  ],
} as const;

type ContentKind = "projects" | "meetings" | "career";

// Lit un meta.json et le valide via Zod
async function readMeta<T>(kind: ContentKind, slug: string, schema: z.ZodSchema<T>): Promise<T> {
  const raw = await fs.readFile(
    path.join(CONTENT_ROOT, kind, slug, "meta.json"),
    "utf-8"
  );
  return schema.parse(JSON.parse(raw));
}

// Lit un MDX avec fallback de locale
async function readLocalizedMdx(
  kind: ContentKind,
  slug: string,
  locale: Locale
): Promise<{ source: string; usedLocale: Locale; isFallback: boolean }> {
  const tryLocale = async (l: Locale) => {
    try {
      return await fs.readFile(
        path.join(CONTENT_ROOT, kind, slug, `${l}.mdx`),
        "utf-8"
      );
    } catch {
      return null;
    }
  };

  const primary = await tryLocale(locale);
  if (primary) return { source: primary, usedLocale: locale, isFallback: false };

  const fallback = await tryLocale(defaultLocale);
  if (fallback) return { source: fallback, usedLocale: defaultLocale, isFallback: true };

  throw new Error(`No MDX found for ${kind}/${slug} (tried ${locale} then ${defaultLocale})`);
}

// API publique — cache React pour déduplication par request
export const getProject = cache(async (slug: string, locale: Locale) => {
  const meta = await readMeta("projects", slug, projectMetaSchema);
  const { source, usedLocale, isFallback } = await readLocalizedMdx("projects", slug, locale);
  const { content, frontmatter } = await compileMDX<{ title: string; summary: string }>({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true, mdxOptions },
  });
  return { meta, frontmatter, content, isFallback, usedLocale };
});

export const listProjects = cache(async (locale: Locale) => {
  const dir = path.join(CONTENT_ROOT, "projects");
  const slugs = (await fs.readdir(dir, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const projects = await Promise.all(
    slugs.map(async (slug) => {
      const meta = await readMeta("projects", slug, projectMetaSchema);
      const { source, isFallback } = await readLocalizedMdx("projects", slug, locale);
      const { frontmatter } = await compileMDX<{ title: string; summary: string }>({
        source,
        options: { parseFrontmatter: true },
      });
      return { meta, frontmatter, isFallback };
    })
  );

  return projects.sort((a, b) => {
    if (a.meta.featured !== b.meta.featured) return a.meta.featured ? -1 : 1;
    if (a.meta.order !== b.meta.order) return a.meta.order - b.meta.order;
    return b.meta.startDate.getTime() - a.meta.startDate.getTime();
  });
});

// Même pattern pour getMeeting / listMeetings / getCareerStep / listCareerSteps
```

### Composants MDX custom (`src/components/mdx/components.tsx`)

```tsx
import Image from "next/image";
import { Callout } from "./Callout";
import { ImageGallery } from "./ImageGallery";
import { TechStack } from "./TechStack";
import { Metrics } from "./Metrics";

export const mdxComponents = {
  Callout,
  ImageGallery,
  TechStack,
  Metrics,
  img: (props: any) => (
    <Image
      {...props}
      width={800}
      height={450}
      className="rounded-lg my-6"
      sizes="(max-width: 768px) 100vw, 800px"
    />
  ),
  a: (props: any) => (
    <a {...props} target={props.href?.startsWith("http") ? "_blank" : undefined} />
  ),
};
```

### Script de validation (`scripts/check-content.ts`)

Lancé en CI. Vérifie pour chaque slug :
- `meta.json` présent et valide Zod
- Au moins `fr.mdx` présent (source de vérité)
- Warnings (pas d'erreur) si `en/es/de.mdx` manquants → fallback FR au runtime
- Tous les `cover` référencés existent dans `/public`

### Règles d'or

- ❌ **Jamais** d'import de MDX dans un composant (`import post from "./post.mdx"`) → tout passe par le loader
- ❌ Pas de `fs` côté client (les loaders sont appelés uniquement dans des RSC / Server Actions)
- ✅ `cache()` de React systématique pour éviter de re-lire/re-parser à chaque hit dans le même request
- ✅ Le fallback de locale retourne toujours `isFallback: true` → afficher un badge UI
- ✅ Les dates sont des `Date` JS typées (Zod transform), jamais des strings qui traînent

---

## 1. Hero

**Objectif :** capturer en 3 secondes qui tu es. Scène 3D signature + nom + one-liner + 2 CTA (voir projets / me contacter).

### Structure

```tsx
<section className="relative h-screen">
  {/* Scène 3D en background, lazy-loaded */}
  <SceneCanvas className="absolute inset-0 -z-10" fallback={<HeroFallback />}>
    <HeroScene />
    <PostFX />
  </SceneCanvas>

  {/* Contenu par-dessus */}
  <div className="relative z-10 flex h-full flex-col justify-center px-6">
    <SplitTextReveal>{t("hero.title")}</SplitTextReveal>
    <p className="text-xl text-muted-foreground">{t("hero.subtitle")}</p>
    <div className="flex gap-4">
      <MagneticButton href="/projects">{t("cta.seeProjects")}</MagneticButton>
      <MagneticButton href="/contact" variant="outline">{t("cta.contact")}</MagneticButton>
    </div>
  </div>
</section>
```

### Text split reveal (signature)

```tsx
"use client";
import { motion } from "framer-motion";

export function SplitTextReveal({ children }: { children: string }) {
  const words = children.split(" ");
  return (
    <h1 className="text-6xl font-bold">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-3"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}
```

---

## 2. Parcours (career timeline)

**Source de contenu :** `content/career/[id]/` — chaque étape = un dossier avec `meta.json` + MDX par locale.

**Meta structuré** (`meta.json`) — exemple :

```json
{
  "id": "2024-adsmithy-founder",
  "order": 10,
  "type": "freelance",
  "start": "2024-10-01",
  "end": "present",
  "company": "AdSmithy (self-founded)",
  "location": "Remote",
  "stack": ["nextjs", "typescript", "prisma", "replicate", "vercel"]
}
```

Le MDX (`fr.mdx`, `en.mdx`, etc.) décrit le rôle, les réalisations, les highlights. Frontmatter attendu : `title`, `role`, `summary`.

### UX : pinned horizontal scroll (signature)

La section se "pin" et le parcours défile horizontalement pendant que l'utilisateur scrolle verticalement. GSAP ScrollTrigger pinning + `horizontalScroll`.

Voir `portfolio-animations/SKILL.md` → pattern "Pinned section".

**Alternative mobile :** timeline verticale classique (`md:hidden` / `hidden md:block`).

### Chaque étape (carte)

- Icône/illustration minimale (pictogramme Lucide par `type`)
- Dates formatées via `useFormatter().dateTime({ year: "numeric", month: "short" })`
- Stack sous forme de pills (badges shadcn)
- Highlights extraits du MDX (composant `<Metrics>` custom)
- Reveal au scroll (Framer `whileInView` ou ScrollTrigger batch)

---

## 3. Projets

### Liste `/projects`

- **Filtres** : par tag (DevOps, Web, AI…) et par stack (React, Terraform, Docker…). URL-synced via `useSearchParams`.
- **Tri** : featured d'abord, puis par date desc
- **Card** : image de couverture, titre, summary 2 lignes, stack pills, hover = tilt 3D léger + apparition d'un overlay avec "Voir le projet"

```tsx
"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";

export function ProjectCard({ project }: { project: Project }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  return (
    <motion.article
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={{ scale: 1.02 }}
    >
      {/* ... */}
    </motion.article>
  );
}
```

### Détail `/projects/[slug]`

MDX rendu via `next-mdx-remote/rsc`. Components MDX custom :
- `<Callout type="info|warn|security">`
- `<CodeBlock language="tsx">` (Shiki server-side)
- `<ImageGallery>` (Framer layout, lightbox)
- `<TechStack items={[...]}>`
- `<Metrics>` (KPIs : perf, CO2 saved, temps de build réduit…)

**Meta par projet** (`meta.json`) :
```json
{
  "slug": "adsmithy",
  "featured": true,
  "order": 1,
  "tags": ["devops", "ai", "saas"],
  "stack": ["nextjs", "prisma", "postgres", "replicate"],
  "repoUrl": "https://github.com/...",
  "liveUrl": "https://adsmithy.com",
  "cover": "/projects/adsmithy/cover.jpg",
  "startDate": "2024-10-01",
  "endDate": "present",
  "role": "Founder & Lead Engineer"
}
```

---

## 4. Rencontres

Section **différenciante** — les autres portfolios ne l'ont pas. Format carnet de voyage / récit court sur des personnes qui ont marqué ton parcours (mentors, collègues inspirants, speakers d'événements, keynotes, hackathons).

### Structure de contenu

```json
// content/meetings/john-doe/meta.json
{
  "slug": "john-doe",
  "personName": "John Doe",
  "personRole": "Principal SRE @ Datadog",
  "date": "2024-06-15",
  "context": "KubeCon Paris 2024",
  "cover": "/meetings/john-doe/cover.jpg",
  "tags": ["kubernetes", "sre", "mentorship"]
}
```

Le MDX raconte la rencontre, l'échange, ce que tu en as tiré.

### UX

- Liste : feed chronologique type journal, avec grande illustration
- Détail : mise en page éditoriale, citation mise en avant, photo (avec permission), liens vers la personne

**Attention éthique :** toujours obtenir l'accord de la personne avant publication + possibilité d'anonymisation.

---

## 5. Contact

### Formulaire — checklist complète

- [ ] Validation Zod (client + server)
- [ ] Server Action via `next-safe-action`
- [ ] **Turnstile** (Cloudflare) — anti-bot gratuit, filtre 99%+
- [ ] Rate limiting **in-memory** : 3 messages / heure / IP (Map TTL)
- [ ] Honeypot field (`<input name="website" tabIndex={-1}>` hidden en CSS)
- [ ] Envoi via Resend avec template react-email
- [ ] Fallback Sentry si Resend échoue (pour rattrapage manuel)
- [ ] UX : états loading / success / error animés (Framer)
- [ ] Accessibilité : labels, aria-invalid, aria-describedby, focus management
- [ ] RGPD : checkbox consent, lien politique de confidentialité

### Schéma Zod

```ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(20).max(5000),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consentement requis" }),
  }),
  turnstileToken: z.string().min(1, "Captcha requis"),
  website: z.string().max(0).optional().default(""), // honeypot
});

export type ContactInput = z.infer<typeof contactSchema>;
```

### Server Action

```ts
"use server";
import { actionClient } from "@/lib/safe-action";
import { contactLimit } from "@/lib/rate-limit";
import { resend } from "@/lib/resend";
import { verifyTurnstile } from "@/lib/turnstile";
import { headers } from "next/headers";
import * as Sentry from "@sentry/nextjs";
import ContactEmail from "@/emails/ContactEmail";
import { env } from "@/lib/env";

export const sendContact = actionClient
  .metadata({ actionName: "sendContact" })
  .schema(contactSchema)
  .action(async ({ parsedInput }) => {
    // Honeypot trigger
    if (parsedInput.website) throw new Error("SPAM_DETECTED");

    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

    // Vérification Turnstile
    const turnstileOk = await verifyTurnstile(parsedInput.turnstileToken, ip);
    if (!turnstileOk) throw new Error("CAPTCHA_FAILED");

    // Rate limit in-memory
    if (!contactLimit.tryAcquire(`contact:${ip}`)) {
      throw new Error("RATE_LIMITED");
    }

    try {
      await resend.emails.send({
        from: env.CONTACT_EMAIL_FROM,
        to: env.CONTACT_EMAIL_TO,
        replyTo: parsedInput.email,
        subject: `[Portfolio] ${parsedInput.subject}`,
        react: ContactEmail({
          name: parsedInput.name,
          email: parsedInput.email,
          subject: parsedInput.subject,
          message: parsedInput.message,
        }),
      });
    } catch (err) {
      // Fallback : log dans Sentry pour rattrapage manuel
      Sentry.captureException(err, {
        tags: { action: "sendContact" },
        extra: {
          name: parsedInput.name,
          email: parsedInput.email,
          subject: parsedInput.subject,
          // Pas de message complet pour éviter PII dans Sentry — juste un preview
          messagePreview: parsedInput.message.slice(0, 120),
        },
      });
      throw new Error("SEND_FAILED");
    }

    return { ok: true };
  });
```

### Rate limit in-memory (sans Redis)

```ts
// src/lib/rate-limit.ts
type Entry = { count: number; resetAt: number };

export class InMemoryRateLimit {
  private store = new Map<string, Entry>();
  constructor(
    private readonly max: number,
    private readonly windowMs: number
  ) {
    // Cleanup toutes les 5min pour éviter fuite mémoire
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }
  }

  tryAcquire(key: string): boolean {
    const now = Date.now();
    const entry = this.store.get(key);
    if (!entry || entry.resetAt < now) {
      this.store.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    if (entry.count >= this.max) return false;
    entry.count++;
    return true;
  }

  private cleanup() {
    const now = Date.now();
    for (const [k, v] of this.store) {
      if (v.resetAt < now) this.store.delete(k);
    }
  }
}

export const contactLimit = new InMemoryRateLimit(3, 60 * 60 * 1000); // 3/h
```

**Limite connue :** sur Vercel serverless, chaque lambda est isolée. Un attaquant pourrait contourner via cold starts multi-régions. Acceptable pour un portfolio + Turnstile filtre l'essentiel. Si abus → migrer vers Upstash Redis.

### Turnstile verification

```ts
// src/lib/turnstile.ts
import { env } from "./env";

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
    }
  );
  const data = (await res.json()) as { success: boolean };
  return data.success;
}
```

### UX de soumission

```tsx
<AnimatePresence mode="wait">
  {status === "idle" && <motion.form key="form" ... />}
  {status === "loading" && <motion.div key="loading">Envoi...</motion.div>}
  {status === "success" && (
    <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
      <CheckCircle /> {t("contact.success")}
    </motion.div>
  )}
</AnimatePresence>
```

---

## Cross-section patterns

### Section wrapper avec titre animé

```tsx
export function Section({ title, children }: SectionProps) {
  return (
    <section className="py-24">
      <motion.h2
        className="mb-12 text-4xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {title}
      </motion.h2>
      {children}
    </section>
  );
}
```

### Progress reading bar

Pour les pages longues (parcours, projets détail), petite barre de progression fixed en haut.

### Easter eggs

- Commande Konami → active un mode rétro (shader CRT sur la scène 3D)
- `console.log` stylisé au chargement : "👋 Curieux ? Regarde aussi github.com/..."
- Lien caché dans `robots.txt` : "If you're reading this, we should probably talk."
