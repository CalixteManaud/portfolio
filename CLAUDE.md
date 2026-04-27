# CLAUDE.md — Portfolio 3D DevOps/DevSecOps

> Ce fichier est le briefing permanent pour Claude Code sur ce projet. Lis-le **en premier**, puis consulte les skills dans `.claude/skills/` selon la tâche.

---

## 1. Project Overview

Portfolio personnel d'un expert **DevOps / DevSecOps / Développeur Web**, pensé comme une expérience interactive 3D, multi-langue, avec animations scrollées, sections narratives (parcours, projets, rencontres, contact) et éléments "signature" mettant en avant l'expertise DevOps (terminal interactif, dashboard GitHub live, pipeline CI/CD animé).

**Architecture :** **100% statique / MDX-driven**. Pas d'authentification, pas de base de données. Le contenu est versionné dans Git (source de vérité), compilé au build. Le formulaire de contact passe directement par l'API Resend via Server Action.

**Public cible :** recruteurs tech, CTOs, clients potentiels, communauté dev. Le site doit à la fois **raconter** (storytelling) et **démontrer** (le code lui-même est une preuve).

**Objectifs de qualité :**
- Lighthouse ≥ 95 sur les 4 catégories
- Accessibilité WCAG 2.1 AA
- Temps de chargement initial < 2s (hors modèles 3D lazy-loaded)
- Animations 60fps même sur mobile moyen de gamme
- Zéro dépendance runtime vers un service payant critique (hors Resend pour l'envoi de mail)

---

## 2. Tech Stack (final)

### Core
- **Next.js 15** (App Router, Server Components, Server Actions)
- **TypeScript** (strict mode, pas de `any`)
- **React 19**

### UI & Style
- **Tailwind CSS v4**
- **shadcn/ui** (composants de base — approche "copy, not install")
- **Radix UI** (primitives accessibles sous shadcn)
- **lucide-react** (icônes)
- **tailwind-merge** + **clsx** (helper `cn()`)

### 3D & Animations
- **Three.js** (moteur 3D)
- **@react-three/fiber** (wrapper React déclaratif)
- **@react-three/drei** (helpers : useGLTF, OrbitControls, Text3D, Environment, Float)
- **@react-three/postprocessing** (bloom, DOF, chromatic aberration, glitch)
- **Framer Motion** (animations React classiques, page transitions, layout animations)
- **GSAP + ScrollTrigger** (animations scrollées complexes, timeline parcours)
- **Lenis** (smooth scroll global)

### Contenu
- **MDX** via `next-mdx-remote` (RSC-compatible) — projets/rencontres/parcours en MDX versionné Git
- **gray-matter** (frontmatter parsing)
- **rehype-pretty-code** + **Shiki** (code blocks avec coloration syntaxique server-side)
- **rehype-slug** + **rehype-autolink-headings** (anchors auto)
- **remark-gfm** (tables, checkboxes, strikethrough)

### i18n
- **next-intl** (App Router, messages JSON par locale)
- Locales : **FR** (default), **EN**, **ES**, **DE**

### Contact & Emails
- **Resend** (API transactionnelle — envoi direct depuis Server Action)
- **react-email** (templates React pour les mails)
- **Turnstile** (Cloudflare — anti-bot gratuit sur le formulaire)

### Observabilité & Monitoring
- **Sentry** (errors + performance, sert aussi de trace pour les messages contact en cas de défaillance Resend)
- **Vercel Analytics** + **Speed Insights**
- **PostHog** (optionnel — product analytics, heatmaps)

### Sécurité
- **Zod** (validation server-side de tous les inputs)
- **next-safe-action** (Server Actions typées avec validation)
- Rate limiting : **in-memory TTL Map** (suffisant pour un portfolio solo, pas besoin de Redis)

### DevOps / Tooling
- **Biome** (linter + formatter, remplace ESLint+Prettier)
- **Vitest** (tests unitaires)
- **Playwright** (tests E2E)
- **Husky** + **lint-staged** (pre-commit hooks)
- **GitHub Actions** (CI/CD : lint, typecheck, test, security audit)
- **Docker** + `docker-compose.yml` (build prod reproductible + preuve de compétence DevOps)
- **Trivy** (scan de vulnérabilités dans la CI)

### Déploiement
- **Vercel** (principal) — full static / ISR là où pertinent
- Dockerfile prêt pour Railway / Fly.io / self-hosted en alternative

---

## 3. Project Structure

```
.
├── .claude/
│   └── skills/              # Skills Claude Code spécifiques à ce projet
├── .github/
│   └── workflows/           # CI/CD (lint, typecheck, test, security)
├── public/
│   ├── models/              # .glb / .gltf (lazy-loaded, jamais importés statiquement)
│   ├── textures/
│   ├── fonts/
│   └── fallbacks/           # Images de fallback pour les scènes 3D (reduced-motion)
├── messages/                # Traductions next-intl (UI strings)
│   ├── fr.json
│   ├── en.json
│   ├── es.json
│   └── de.json
├── content/                 # MDX — source de vérité du contenu éditorial
│   ├── projects/
│   │   └── [slug]/
│   │       ├── meta.json               # Métadonnées non-traduisibles
│   │       ├── fr.mdx
│   │       ├── en.mdx
│   │       ├── es.mdx
│   │       └── de.mdx
│   ├── meetings/
│   │   └── [slug]/
│   │       ├── meta.json
│   │       └── [locale].mdx
│   └── career/              # Parcours : un fichier par étape
│       └── [id]/
│           ├── meta.json
│           └── [locale].mdx
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx                 # Landing / Hero
│   │   │   ├── about/                   # Parcours
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── meetings/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── github-stats/            # Cache des stats GitHub
│   │   │   └── og/                      # OG images dynamiques (@vercel/og)
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── layout.tsx
│   ├── actions/
│   │   └── contact.ts                   # Server Action envoi Resend
│   ├── components/
│   │   ├── ui/                          # shadcn primitives
│   │   ├── 3d/                          # Scenes R3F, models, effects
│   │   │   ├── canvas/
│   │   │   ├── scenes/
│   │   │   ├── models/
│   │   │   ├── effects/
│   │   │   └── hooks/
│   │   ├── mdx/                         # Components MDX custom (Callout, CodeBlock…)
│   │   ├── sections/                    # Sections pages (Hero, About, Projects…)
│   │   ├── animations/                  # Wrappers Framer/GSAP réutilisables
│   │   ├── devops/                      # Terminal, GitHub dashboard, CI viz
│   │   └── shared/                      # Header, Footer, LangSwitcher…
│   ├── emails/
│   │   └── ContactEmail.tsx             # Template react-email
│   ├── lib/
│   │   ├── content.ts                   # MDX loader (projects, meetings, career)
│   │   ├── resend.ts
│   │   ├── github.ts                    # Client GitHub API
│   │   ├── rate-limit.ts                # In-memory throttle
│   │   ├── env.ts                       # Validation Zod des env vars
│   │   └── utils.ts                     # cn(), formatters
│   ├── i18n/
│   │   ├── config.ts                    # Locales supportées
│   │   ├── request.ts                   # next-intl request config
│   │   ├── routing.ts                   # Pathnames localisés
│   │   └── navigation.ts                # Link/router localisés
│   ├── hooks/
│   ├── stores/                          # Zustand (état UI : menu, audio, theme 3D)
│   ├── middleware.ts                    # next-intl uniquement (pas de Clerk)
│   ├── types/
│   └── styles/
├── tests/
│   ├── unit/                            # Vitest
│   └── e2e/                             # Playwright
├── scripts/
│   ├── check-i18n.ts                    # Vérif clés messages/*.json
│   └── check-content.ts                 # Vérif complétude content/*/[slug]/*
├── .env.example
├── biome.json
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 4. Commands

```bash
# Dev
pnpm dev                    # Next.js dev server (Turbopack)

# Build & Production
pnpm build                  # Build Next.js
pnpm start                  # Start production

# Quality
pnpm lint                   # Biome lint
pnpm format                 # Biome format
pnpm typecheck              # tsc --noEmit
pnpm test                   # Vitest
pnpm test:e2e               # Playwright
pnpm audit:security         # pnpm audit + trivy fs scan

# Content & i18n
pnpm i18n:check             # Vérifie que toutes les clés sont traduites dans fr/en/es/de
pnpm content:check          # Vérifie que chaque slug a les 4 locales MDX + meta.json valide

# Docker
docker compose up --build   # Build + run image prod en local
docker build -t portfolio . # Build image prod seule
```

---

## 5. Environment Variables

Toutes les variables sont documentées dans `.env.example`. Les secrets ne sont **jamais** commités. Validation via Zod au démarrage (`src/lib/env.ts`).

Variables clés :
- `RESEND_API_KEY` — envoi des emails de contact
- `CONTACT_EMAIL_TO` — adresse de réception
- `CONTACT_EMAIL_FROM` — adresse d'envoi (domaine vérifié dans Resend)
- `SENTRY_DSN` / `SENTRY_AUTH_TOKEN`
- `GITHUB_TOKEN` — fine-grained, read-only public repos (pour le dashboard live)
- `NEXT_PUBLIC_SITE_URL`
- `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — anti-bot Cloudflare

**Aucune variable de BDD, aucun secret d'auth.** L'app est statique côté backend.

---

## 6. Content Architecture (MDX)

**Source de vérité : le système de fichiers dans `/content/`.** Chaque entité (projet, rencontre, étape de carrière) est un dossier contenant :

- `meta.json` — métadonnées non-traduisibles (slug, dates, stack, tags, featured, order, URLs)
- `fr.mdx`, `en.mdx`, `es.mdx`, `de.mdx` — contenu traduit

**Fallback :** si une locale manque pour un MDX, on affiche `fr` + un badge "Traduction non disponible — version française affichée".

Le loader `src/lib/content.ts` :
- Liste les slugs (filesystem walk)
- Charge un `meta.json` + le MDX de la locale demandée (avec fallback)
- Compile le MDX via `next-mdx-remote/rsc` (server-side, pas de JS runtime pour le contenu)
- Cache en mémoire via `React.cache` (déduplication par request)

Voir `.claude/skills/portfolio-content/SKILL.md` pour le code complet du loader et les composants MDX custom.

---

## 7. Contact Flow

Pas de BDD : le formulaire déclenche une Server Action qui :

1. Valide les inputs avec **Zod** (honeypot, Turnstile token, longueurs, email bien formé)
2. Vérifie le **Turnstile token** côté serveur (appel Cloudflare)
3. Applique un **rate-limit in-memory** (3 soumissions/heure/IP — Map TTL avec cleanup)
4. Envoie un email via **Resend** avec le template `react-email` (ContactEmail.tsx)
5. En cas d'échec Resend : log l'événement dans **Sentry** avec les détails (rattrapage manuel possible)
6. Retourne `{ ok: true }` ou un message d'erreur localisé (via next-intl côté client)

Pas de persistance = pas de RGPD côté données, mais toujours une checkbox de consentement explicite pour le traitement du mail + lien vers politique de confidentialité.

⚠️ **Note sur le rate-limit in-memory :** sur Vercel, chaque lambda est isolée, donc un attaquant pourrait théoriquement bypasser via cold starts sur différentes régions. C'est acceptable pour un portfolio (volume faible) + Turnstile filtre en amont. Si abus constaté, migrer vers Upstash Redis.

---

## 8. 3D Scene Architecture

Voir `.claude/skills/portfolio-3d/SKILL.md` pour les patterns détaillés.

Règles d'or :
- **Toujours** wrapper les scènes dans `<Suspense>` avec fallback
- **Jamais** de `import` statique de `.glb` — utiliser `useGLTF.preload('/models/x.glb')` et `useGLTF('/models/x.glb')`
- `dpr={[1, 2]}` sur `<Canvas>` pour retina sans exploser GPU
- Désactiver la scène 3D sur `prefers-reduced-motion` → fallback image/vidéo statique
- `frameloop="demand"` si la scène n'a pas besoin de render continu
- Poids max d'un modèle : **2 MB** (Draco-compressed). Utiliser `gltf-transform` en pré-build.

---

## 9. Animation System

Voir `.claude/skills/portfolio-animations/SKILL.md`.

Découpage par responsabilité :
- **Framer Motion** : animations d'UI (hover, tap, layout, page transitions via `AnimatePresence`)
- **GSAP + ScrollTrigger** : animations scrollées (timeline parcours, pinned sections, parallax)
- **Lenis** : smooth scroll global, avec `useLenis` pour synchroniser ScrollTrigger
- **R3F useFrame** : animations continues dans la scène 3D

**Respecter `prefers-reduced-motion` partout.**

---

## 10. i18n Strategy

Voir `.claude/skills/portfolio-i18n/SKILL.md`.

- Locales : **fr** (default), **en**, **es**, **de**
- Routing : `/[locale]/...` via `next-intl`, pathnames localisés
- Fichiers messages : `messages/[locale].json`, organisés par namespace
- Contenu MDX : un fichier par locale dans `content/*/[slug]/[locale].mdx`
- Switcher de langue : préserve le pathname actuel
- SEO : hreflang dans `alternates.languages` via Metadata API

---

## 11. Content Sections

Voir `.claude/skills/portfolio-content/SKILL.md`.

1. **Hero (landing)** : scène 3D signature + nom + tagline animée + CTA
2. **Parcours** : timeline horizontale pinnée (GSAP ScrollTrigger), étapes MDX avec dates, rôles, stacks
3. **Projets** : grid filtrable (tag/stack), card 3D au hover, page détail MDX avec galerie
4. **Rencontres** : récit des personnes marquantes (mentors, collègues, événements), format carnet
5. **Contact** : formulaire validé Zod + Turnstile, envoi via Resend
6. **Sections "signature" DevOps** : terminal interactif, dashboard GitHub live, pipeline CI/CD 3D

---

## 12. Performance Guidelines

- **Images** : `next/image` partout, `priority` uniquement sur le hero, formats AVIF/WebP
- **Fonts** : `next/font` avec `display: swap`, subsetting `latin + latin-ext` (DE/FR/ES ont besoin des caractères étendus ä, ö, ü, é, è, ç, ñ…)
- **3D** : lazy-load via `next/dynamic(... { ssr: false })` pour tout composant R3F
- **Bundle** : analyser avec `@next/bundle-analyzer`, viser < 200 KB JS initial
- **Streaming** : utiliser `<Suspense>` généreusement avec les RSC
- **Cache** : `revalidate = 3600` sur les fetch GitHub (stats mises à jour toutes les heures)
- **MDX** : compilé au build (RSC), pas d'overhead runtime

---

## 13. Accessibility Guidelines

- Tous les composants interactifs : focus visible (ring Tailwind), `aria-label` si icône-only
- Contraste WCAG AA minimum (outil : Lighthouse + axe DevTools)
- Navigation clavier complète, ordre de tab logique, skip link en haut
- `prefers-reduced-motion` : désactive animations 3D, GSAP, Framer
- Formulaires : `<label>` associé, erreurs via `aria-describedby`, annonce vocale des erreurs
- Scène 3D : toujours un fallback accessible (description textuelle visible aux lecteurs d'écran)

---

## 14. SEO Strategy

- Metadata API Next.js (pas de `next-seo`, natif suffit)
- OG images dynamiques via `/api/og` (edge runtime, `@vercel/og`) — une par projet/rencontre, avec le bon layout par type de contenu
- `sitemap.ts` et `robots.ts` dans `/app` — générés automatiquement depuis `/content`
- Structured data JSON-LD : `Person` schema sur la home, `CreativeWork` sur chaque projet, `Article` sur chaque rencontre
- Hreflang pour chaque locale (fr, en, es, de)
- URL canoniques

---

## 15. Security & DevSecOps

Même sans BDD ni auth, la surface de sécurité existe :

- **CSP** strict via `next.config.ts` (headers) — pas d'`unsafe-inline` si possible, nonces sinon
- **HSTS**, **X-Frame-Options**, **Referrer-Policy**, **Permissions-Policy** en headers
- **Rate limiting** sur l'endpoint contact (in-memory TTL Map, suffisant pour un portfolio solo)
- **Turnstile** sur le formulaire contact (bloque >99% des bots)
- **Zod** valide tous les inputs côté serveur (Server Actions)
- **XSS** : MDX compilé safe par défaut (pas de HTML brut auto-exécuté). Si un `<script>` apparaît dans un MDX, c'est nous qui l'y avons mis — contrôlé.
- **Secrets** : jamais dans le client bundle (`NEXT_PUBLIC_*` uniquement pour non-sensible)
- **Dependabot** + **Trivy** dans la CI, `pnpm audit --production` en pre-deploy
- **Sentry** filtre les PII, scrub les emails/IPs
- **Signed webhooks** si un jour ajout Resend webhook (delivery/bounce)

Voir `.claude/skills/devops-showcase/SKILL.md` pour les éléments *visibles* qui mettent en avant ce savoir-faire.

---

## 16. Conventions

- **Imports** : alias `@/*` pointe vers `src/*`. Ordre : externes → internes → relatifs → styles
- **Composants** : PascalCase, un composant par fichier, named export sauf `page.tsx` / `layout.tsx`
- **Hooks** : `use*` en camelCase, dans `src/hooks/` ou colocalisés si ultra-spécifiques
- **Server Components par défaut** : `"use client"` uniquement si nécessaire (hooks, event handlers, state)
- **Server Actions** : dans `src/actions/`, toujours wrappées dans `next-safe-action`
- **Types** : éviter `any` strictement, préférer `unknown` + narrowing
- **Commits** : Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `perf:`, `test:`, `ci:`)
- **Branches** : `main` (prod), `dev` (staging), `feat/*`, `fix/*`
- **PR** : template avec checklist (tests, docs, a11y, perf, sécu)

---

## 17. Quand Claude travaille sur ce projet

1. **Lire d'abord le skill pertinent** dans `.claude/skills/` avant d'écrire du code
2. **Ne jamais contourner** les règles perf / a11y / sécu listées ici — les faire remonter si un trade-off est nécessaire
3. **Server Component par défaut**, `"use client"` doit être justifié
4. **Tester mentalement** : le composant est-il accessible clavier ? respecte-t-il reduced-motion ? fonctionne-t-il sans JS pour le SEO ?
5. **Traductions** : tout texte visible doit passer par `useTranslations` ou `getTranslations`, jamais de chaîne en dur
6. **Contenu éditorial** : va dans `/content` en MDX, jamais en dur dans les composants
7. **Types** : si une prop est mal typée, corriger plutôt que `any`
8. **Demander avant de** : ajouter une nouvelle dépendance lourde (>50 KB), changer la structure de dossiers, réintroduire une BDD/auth (décision archi importante)

---

## 18. Ressources

- R3F docs : https://r3f.docs.pmnd.rs/
- Drei storybook : https://drei.docs.pmnd.rs/
- next-intl : https://next-intl-docs.vercel.app/
- next-mdx-remote (RSC) : https://github.com/hashicorp/next-mdx-remote
- rehype-pretty-code : https://rehype-pretty.pages.dev/
- shadcn/ui : https://ui.shadcn.com/
- react-email : https://react.email/
- Resend : https://resend.com/docs
- Turnstile : https://developers.cloudflare.com/turnstile/
- Awwwards (inspiration) : https://www.awwwards.com/websites/portfolio/
