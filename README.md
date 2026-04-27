# Calixte Manaud — Portfolio Design System

Personal portfolio design system for **Calixte Manaud**, a DevOps / DevSecOps / Web Developer.

## Sources

- **GitHub repository:** https://github.com/CalixteManaud/portfolio (Next.js 15, App Router, TypeScript)
- **Globals CSS:** `src/styles/globals.css` — Tailwind v4 @theme block; all tokens defined here
- **Copy / i18n:** `messages/fr.json`, `en.json`, `es.json`, `de.json`
- **Components:** `src/components/` — shared (Header, Footer), sections (Hero, ProjectCard, ContactForm…), ui (shadcn/Button)
- **CLAUDE.md:** Full architecture brief in repo root

---

## Product Overview

Single-page portfolio presenting Calixte as a DevOps/DevSecOps expert and web developer. The site is:
- **Interactive 3D** — Three.js / React Three Fiber hero scene
- **MDX-driven** — projects, career timeline, meetings all authored in MDX
- **Multilingual** — FR (default), EN, ES, DE via next-intl
- **Dark-mode first** — no light mode defined in the codebase

**Sections:**
1. **Hero** — full-viewport 3D scene, headline, two CTAs
2. **Parcours** — horizontal pinned GSAP timeline of career steps
3. **Projets** — filterable grid of project cards
4. **Rencontres** — narrative cards about notable encounters
5. **Contact** — Resend-backed form with Turnstile anti-bot

---

## CONTENT FUNDAMENTALS

**Language:** French-first. All nav labels are lowercase ("parcours", "projets", "rencontres"). Translated to EN/ES/DE.

**Tone:** Technical, concise, first-person implied. No exclamation marks in UI copy. Direct and confident.
- ✅ "Construire des systèmes qui tiennent debout."
- ✅ "Pipelines automatisés, plateformes sécurisées, expériences web qui en mettent plein la vue."
- ✅ "Une mission, une question, un café ?"
- ❌ No marketing fluff, no superlatives

**Person:** First-person singular ("mon projet", "ma boîte mail"). Speaks TO the user with "tu" ("Raconte-moi ton projet…", "Ton prénom et nom").

**Casing:** Sentence case for headings and UI labels. Nav items lowercase. Section eyebrows ALL CAPS with wide letter-spacing.

**Emoji:** Used once in footer footer ("❤️") and scaffold notices — not in production UI.

**Numbers/stats:** Used sparingly. No fake metrics or filler data.

---

## VISUAL FOUNDATIONS

### Colors
Dark-mode only. Background is near-black with a subtle blue hue (hue 270°):
- **Background:** `oklch(0.13 0.01 270)` — very dark navy-black
- **Foreground:** `oklch(0.96 0.01 270)` — off-white, slightly blue-tinted
- **Muted (card bg):** `oklch(0.22 0.01 270)` — dark elevated surface
- **Muted foreground:** `oklch(0.65 0.02 270)` — secondary text
- **Border:** `oklch(0.25 0.01 270)` — subtle divider
- **Accent (blue):** `oklch(0.72 0.18 250)` — primary interactive color, a bright perceptual blue

### Typography
- **Sans (UI):** Geist Sans — clean, modern, slightly geometric. Variable font.
- **Mono (code/labels):** Geist Mono — used for the logo (`~/portfolio`), nav section labels, stack badges, terminal elements.
- No serif font in use.

**Type scale:**
- Hero h1: `text-5xl`→`text-7xl`, `font-bold`, `leading-[1.05]`
- Section titles: `text-3xl`, `font-bold`
- Body: `text-base`–`text-lg`, `leading-relaxed`
- Eyebrows: `text-sm uppercase tracking-[0.25em]`
- Small labels: `text-xs`–`text-[11px]`, `font-mono`, `uppercase tracking-wider`

### Spacing
- Container max-width: `max-w-6xl` with `px-4 md:px-6`
- Responsive horizontal padding: `clamp(1rem, 4vw, 3rem)` via `.container-px`
- Section padding: `py-12`–`py-24`
- Card padding: `p-6`
- Gap between elements: `gap-4`–`gap-10`

### Backgrounds & Surfaces
- Page background: flat dark `oklch(0.13 0.01 270)` — no texture or gradient
- Cards: `bg-card/40 backdrop-blur-sm` — semi-transparent with blur
- Header/Footer: `bg-background/40 backdrop-blur-md` — more blur
- Hero: vignette gradient `from-background/30 via-transparent to-background/80` over 3D scene
- No full-bleed images, no repeating textures, no decorative gradients

### Borders & Radii
- Default border: `border-border/40`–`border-border/60` (subtle opacity)
- Hover border: `hover:border-primary/50` — accent blue at 50%
- Radius scale: `sm=0.25rem`, `md=0.5rem`, `lg=0.75rem`
- Cards: `rounded-2xl` (1rem)
- Buttons: `rounded-md` (0.5rem) → `rounded-lg` (0.75rem)
- Icon buttons: `rounded-lg`
- Badges: `rounded-full` (pill)

### Shadows
- Hero CTA shadow: `shadow-lg shadow-primary/20` — colored shadow matching accent
- No card drop shadows — blur + border used instead

### Animations
- **Framer Motion:** hover/tap/layout/page transitions
- **GSAP + ScrollTrigger:** career timeline (horizontal pinned)
- **Three.js:** hero scene continuous render
- **Lenis:** smooth scroll global
- `prefers-reduced-motion` respected — all animations disabled
- Subtle: no bouncy spring physics, no dramatic zooms. Easing is smooth and restrained.

### Hover / Press States
- Links: `text-foreground/70 → text-foreground` (opacity bump)
- Cards: `border-primary/50 + bg-card/60` (border lights up + background lifts slightly)
- Icon buttons: `hover:border-primary/50 hover:text-primary`
- Buttons (primary): `hover:opacity-90`
- Arrow icons: `group-hover:translate-x-0.5 group-hover:-translate-y-0.5` (subtle diagonal nudge)
- Active/press: `active:translate-y-px` (1px sink)

### Cards
- Shape: `rounded-2xl`
- Background: `bg-card/40 backdrop-blur-sm`
- Border: `border-border`, hover → `border-primary/50`
- Padding: `p-6`
- No drop shadow

### Imagery / Color Vibe
- No decorative images in the codebase (scaffold state)
- OG images generated dynamically via `@vercel/og`
- 3D scene provides all visual interest in hero — lazy-loaded `.glb` models
- Color vibe: cool, dark, blue-shifted

### Iconography
See ICONOGRAPHY section below.

---

## ICONOGRAPHY

**Icon library:** `lucide-react` (default) + `@icons-pack/react-simple-icons` (brand logos).
- Lucide: outline style, 16×16 default (`size-4`), stroked, no fill
- Simple Icons: brand SVG logos (GitHub, etc.)
- Custom SVG: `LinkedinIcon` at `src/components/icons/LinkedinIcon.tsx`
- No icon font, no PNG icons, no emoji as icons
- Usage: always `aria-hidden="true"` on decorative icons; `aria-label` on icon-only buttons

**Icons in use:**
- `ArrowUpRight` (Lucide) — project card CTA
- `Mail`, `Rss` (Lucide) — social links
- `SiGithub` (Simple Icons) — GitHub social
- `LinkedinIcon` (custom SVG) — LinkedIn social
- No icon assets to copy (all via npm)

---

## File Index

| File | Description |
|------|-------------|
| `README.md` | This file — full design system documentation |
| `colors_and_type.css` | CSS custom properties: colors, type, spacing, radii |
| `SKILL.md` | Claude Code skill manifest |
| `preview/` | Design system card previews (register in DS tab) |
| `ui_kits/portfolio/` | High-fidelity portfolio UI kit |
| `ui_kits/portfolio/index.html` | Interactive portfolio prototype |

---

## UI Kits

### Portfolio Website (`ui_kits/portfolio/`)
Full-fidelity click-through prototype of the portfolio site.
- `index.html` — main interactive prototype (Hero → Projets → Contact)
- Core screens: Hero, Projects grid, Project detail, Contact form, About/Parcours
