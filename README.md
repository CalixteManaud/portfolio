# Portfolio — Calixte Manaud

Portfolio personnel de **Calixte Manaud** (DevOps · DevSecOps · développeur web).
Site statique multilingue, contenu en MDX versionné, scène 3D dont le relief est de la donnée réelle.

Le parti pris : le site ne liste pas des compétences, il les prouve. Terminal jouable, statistiques GitHub
en direct, pipeline CI/CD en 3D, en-têtes de sécurité, conteneur non-root — chaque élément est une
démonstration exécutable.

**Production :** https://portfolio.devcorporation.fr

---

## Documents de référence

| Fichier | Rôle |
|---|---|
| [`PRODUCT.md`](./PRODUCT.md) | Vérité produit durable : audience, positionnement, contraintes, preuves disponibles |
| [`DESIGN.md`](./DESIGN.md) | Système visuel : tokens, typographie, layout, composants, règles nommées |
| [`.impeccable/design.json`](./.impeccable/design.json) | Sidecar du système visuel : rampes tonales, ombres, motion, composants en HTML/CSS autonome |
| [`CLAUDE.md`](./CLAUDE.md) | Briefing d'architecture pour Claude Code |
| [`.claude/skills/`](./.claude/skills/) | Skills projet : 3D, animations, i18n, contenu, showcase DevOps |

---

## Stack

**Core** — Next.js 16 (App Router, RSC, Server Actions) · React 19 · TypeScript strict
**UI** — Tailwind CSS v4 · shadcn/ui (style `radix-nova`) · Radix UI · lucide-react
**3D & motion** — Three.js · React Three Fiber · Drei · @react-three/postprocessing · Framer Motion · GSAP · Lenis
**Contenu** — MDX via `next-mdx-remote/rsc` · gray-matter · rehype-pretty-code (Shiki) · remark-gfm
**i18n** — next-intl · FR (défaut) / EN / ES / DE, pathnames localisés
**Contact** — Server Action + Zod + next-safe-action · Cloudflare Turnstile · Resend · react-email
**Observabilité** — Sentry · Vercel Analytics · Speed Insights
**Outillage** — Biome · Vitest · Playwright · Husky + lint-staged · GitHub Actions · Docker · Trivy

Aucune base de données, aucune authentification. Le dépôt Git est la source de vérité du contenu.

---

## Démarrage

```bash
pnpm install
cp .env.example .env.local   # puis renseigner les clés
pnpm dev                     # http://localhost:3000
```

Le site démarre sans aucune clé : le formulaire de contact et le dashboard GitHub dégradent proprement,
et la scène 3D retombe sur un relief procédural en l'absence de `GITHUB_TOKEN`.

---

## Commandes

```bash
# Développement
pnpm dev                    # serveur de dev (Turbopack)
pnpm build                  # build de production
pnpm start                  # serveur de production

# Qualité
pnpm lint                   # Biome lint
pnpm format                 # Biome format
pnpm check                  # Biome lint + format, avec écriture
pnpm typecheck              # tsc --noEmit
pnpm test                   # Vitest
pnpm test:e2e               # Playwright
pnpm audit:security         # pnpm audit --prod (Trivy tourne en CI)

# Contenu & i18n
pnpm i18n:check             # parité des clés entre fr/en/es/de
pnpm content:check          # chaque slug a ses 4 locales + un meta.json valide

# Docker
docker compose up --build   # image de production, en local
docker build -t portfolio . # build de l'image seule
```

---

## Variables d'environnement

Toutes documentées dans [`.env.example`](./.env.example), validées par Zod au démarrage
(`src/lib/env.ts`). Aucun secret n'est commité.

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canonique, base des métadonnées et du sitemap |
| `RESEND_API_KEY` · `CONTACT_EMAIL_FROM` · `CONTACT_EMAIL_TO` | Envoi du formulaire de contact |
| `TURNSTILE_SECRET_KEY` · `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Anti-bot Cloudflare |
| `GITHUB_TOKEN` · `GITHUB_USERNAME` | Dashboard live et relief du hero (fine-grained, lecture seule) |
| `SENTRY_DSN` · `SENTRY_ORG` · `SENTRY_PROJECT` · `SENTRY_AUTH_TOKEN` | Erreurs et performance |
| `NEXT_PUBLIC_POSTHOG_KEY` · `NEXT_PUBLIC_POSTHOG_HOST` | Analytics produit (optionnel) |

---

## Structure

```
content/                    # Source de vérité éditoriale (MDX)
  projects/[slug]/          #   meta.json + fr|en|es|de.mdx
  career/[id]/
  meetings/[slug]/
  pages/[slug]/             #   mentions légales, confidentialité
messages/                   # Traductions d'interface (next-intl)
src/
  app/[locale]/             # Routes localisées
  app/api/                  # OG images, stats GitHub
  actions/                  # Server Actions (contact)
  components/
    3d/                     # Scènes R3F, effets, canvas
    animations/             # Reveal, SplitTextReveal, TiltCard
    devops/                 # Terminal, GitHubDashboard, CIPipeline3D
    mdx/                    # Composants MDX (Callout, CodeBlock)
    sections/               # Sections de page
    shared/                 # Header, Footer, LangSwitcher, MobileMenu
    ui/                     # Primitives shadcn
  i18n/                     # Locales, routing, navigation
  lib/                      # content, env, github, rate-limit, resend, utils
  styles/globals.css        # Source unique des tokens de design
tests/                      # unit (Vitest) · e2e (Playwright)
scripts/                    # check-i18n, check-content
```

---

## Ajouter du contenu

Chaque entité est un dossier contenant un `meta.json` (métadonnées non traduisibles) et un fichier MDX
par locale :

```
content/projects/mon-projet/
  meta.json
  fr.mdx   en.mdx   es.mdx   de.mdx
```

Si une locale manque, la version française est servie avec un badge « traduction non disponible ».
`pnpm content:check` vérifie la complétude avant commit.

---

## Design

Le système visuel complet est dans [`DESIGN.md`](./DESIGN.md). En résumé :

- **Ardoise froide** (hue 235) en fond, jamais du noir pur — le site est nativement sombre, il n'y a pas
  de thème clair
- **Ambre Sodium** `oklch(0.78 0.16 68)` comme unique accent de marque, sous ~10 % de la surface d'un écran
- Trois faces à rôles étanches : **Archivo** (`wdth 112`) pour la signalétique, **IBM Plex Sans** pour la
  lecture, **IBM Plex Mono** pour la donnée
- Surfaces plates au repos ; les lueurs répondent à un état, elles ne décorent pas

Les douze primitives de couleur du bloc `:root` de `src/styles/globals.css` sont la seule définition de
couleur du projet — y compris pour les shaders, qui les lisent au runtime.

---

## Qualité

Objectifs tenus par la CI et vérifiés avant déploiement :

- Lighthouse ≥ 95 sur les quatre catégories
- WCAG 2.1 AA — navigation clavier complète, `prefers-reduced-motion` respecté partout, alternative
  accessible à chaque scène 3D
- Chargement initial < 2 s hors 3D (lazy-loadée), < 200 KB de JS initial
- 60 fps sur mobile moyen de gamme

**CI** (`.github/workflows/ci.yml`) : Biome → TypeScript → parité i18n → intégrité du contenu → tests
unitaires → build → `pnpm audit --prod` + scan Trivy remonté dans GitHub Security.

---

## Déploiement

**Vercel** en principal. Le [`Dockerfile`](./Dockerfile) multi-stage (sortie `standalone`, utilisateur
non-root, healthcheck) permet un déploiement sur Railway, Fly.io ou auto-hébergé sans changement de code.

---

## Sécurité

- CSP stricte, HSTS, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` via `next.config.ts`
- Tous les inputs validés côté serveur par Zod, Server Actions typées via `next-safe-action`
- Rate-limit in-memory sur le formulaire (3 envois/heure/IP) + Turnstile en amont
- `GITHUB_TOKEN` fine-grained en lecture seule, jamais exposé au client
- Trivy et Dependabot dans la CI, `pnpm audit --prod` avant déploiement
