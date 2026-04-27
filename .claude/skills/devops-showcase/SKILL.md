---
name: devops-showcase
description: Building the "signature" DevOps/DevSecOps showcase elements that prove expertise — interactive terminal, live GitHub dashboard, 3D CI/CD pipeline visualization, security headers demo, Docker setup, GitHub Actions workflows, observability stack. Use whenever the task involves demonstrating DevOps skills visibly, configuring CI/CD, writing Dockerfiles, setting security headers, or building the `src/components/devops/` components.
---

# Skill — DevOps Showcase Elements

L'idée : chaque élément ici est à la fois **un composant du portfolio** ET **une preuve de compétence**. Un recruteur DevOps qui visite doit voir le savoir-faire incarné dans le site lui-même.

---

## 1. Interactive terminal (landing / about)

Terminal stylisé qui accepte des commandes fictives pour explorer le portfolio.

### Commandes à implémenter

```
whoami          → "warthoz — DevOps / DevSecOps Engineer"
pwd             → "/portfolio/home"
ls              → "about/ projects/ meetings/ contact/ skills.json"
cat skills.json → affiche les compétences en JSON
cat about.md    → résumé du parcours
tree projects   → arborescence des projets
deploy          → simule un déploiement avec logs qui défilent (easter egg)
help            → liste des commandes
clear           → nettoie l'écran
sudo rm -rf /   → "Nice try 😏"
```

### Implémentation

```tsx
"use client";
import { useState, useRef, useEffect, KeyboardEvent } from "react";

type Line = { type: "input" | "output" | "error"; text: string };

const commands: Record<string, () => string | Promise<string>> = {
  whoami: () => "warthoz — DevOps / DevSecOps Engineer",
  pwd: () => "/portfolio/home",
  ls: () => "about/  projects/  meetings/  contact/  skills.json",
  help: () => "Available: whoami, pwd, ls, cat, tree, deploy, clear, help",
  clear: () => "__clear__",
  "sudo rm -rf /": () => "Nice try 😏",
  // ... autres
};

export function Terminal() {
  const [history, setHistory] = useState<Line[]>([
    { type: "output", text: "Welcome. Type 'help' to start." },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [history]);

  const run = async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setHistory((h) => [...h, { type: "input", text: cmd }]);
    const handler = commands[cmd];
    if (!handler) {
      setHistory((h) => [...h, { type: "error", text: `command not found: ${cmd}` }]);
      return;
    }
    const out = await handler();
    if (out === "__clear__") setHistory([]);
    else setHistory((h) => [...h, { type: "output", text: out }]);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { run(input); setInput(""); }
  };

  return (
    <div className="rounded-lg border bg-black p-4 font-mono text-sm text-green-400">
      <div className="max-h-80 overflow-y-auto">
        {history.map((l, i) => (
          <div key={i}>
            {l.type === "input" && <><span className="text-blue-400">$</span> {l.text}</>}
            {l.type === "output" && <pre className="whitespace-pre-wrap">{l.text}</pre>}
            {l.type === "error" && <span className="text-red-400">{l.text}</span>}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex">
        <span className="text-blue-400">$</span>
        <input
          className="ml-2 flex-1 bg-transparent outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          aria-label="Terminal input"
          autoFocus
        />
      </div>
    </div>
  );
}
```

Ajouts possibles : history up/down (flèches), autocomplete tab, coloration syntaxique des sorties.

---

## 2. Live GitHub dashboard

Affiche les contributions, top languages, stars reçues — mais avec un design premium (pas juste un embed).

### Backend : API route cached

```ts
// src/app/api/github-stats/route.ts
import { NextResponse } from "next/server";

export const revalidate = 3600; // 1h cache

export async function GET() {
  const username = "your-github";
  const headers = { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` };

  const [user, repos] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers, next: { revalidate } }).then(r => r.json()),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers, next: { revalidate } }).then(r => r.json()),
  ]);

  const stars = repos.reduce((sum: number, r: any) => sum + r.stargazers_count, 0);
  const languages = aggregateLanguages(repos);

  return NextResponse.json({
    public_repos: user.public_repos,
    followers: user.followers,
    stars,
    languages,
  });
}
```

### Frontend : dashboard animé

- Cards avec compteurs animés (framer motion `useSpring` pour counter)
- Donut chart langages (Recharts ou SVG custom)
- Heatmap contributions (via `github-contributions-api` ou scraping SVG de github.com)

---

## 3. 3D CI/CD pipeline visualization

**Signature visuelle forte.** Représenter un pipeline (lint → test → build → security scan → deploy) comme un graph 3D animé avec R3F.

### Concept

- Nœuds = jobs (cubes/sphères)
- Edges = dépendances (tubes connectant)
- Animation : flux lumineux qui passe de gauche à droite le long des edges
- Hover sur un nœud → affiche les logs (faux logs stylisés)

### Structure de données

```ts
export const pipeline = {
  nodes: [
    { id: "lint", label: "Biome Lint", status: "success", duration: "12s" },
    { id: "typecheck", label: "TS Check", status: "success", duration: "28s" },
    { id: "test", label: "Vitest", status: "success", duration: "45s" },
    { id: "audit", label: "npm audit", status: "success", duration: "8s" },
    { id: "trivy", label: "Trivy Scan", status: "success", duration: "1m 12s" },
    { id: "build", label: "Next Build", status: "success", duration: "1m 48s" },
    { id: "deploy", label: "Vercel Deploy", status: "success", duration: "32s" },
  ],
  edges: [
    ["lint", "build"], ["typecheck", "build"], ["test", "build"],
    ["audit", "build"], ["trivy", "build"], ["build", "deploy"],
  ],
};
```

Rendu R3F : positions calculées par niveau (topological sort), liens via `<Line>` de drei, particules le long des edges avec shader custom.

---

## 4. Security headers showcase

Page/section qui affiche les headers HTTP de sécurité de ton propre site (meta : le site démontre ce qu'il prêche).

```tsx
// Appelle HEAD sur son propre domaine et liste les headers
const SECURITY_HEADERS = [
  "Strict-Transport-Security",
  "Content-Security-Policy",
  "X-Frame-Options",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "Permissions-Policy",
];
```

Afficher chaque header avec une ✅ + explication courte + lien vers MDN.

### Next.js config (à avoir vraiment)

```ts
// next.config.ts
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // CSP complexe — voir fichier dédié
];

export default {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};
```

---

## 5. Dockerfile (réellement utilisé + visible)

Multi-stage, non-root user, slim. À commiter ET à afficher dans la section "Infrastructure".

```dockerfile
# syntax=docker/dockerfile:1.7
FROM node:20-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
```

Exige `output: "standalone"` dans `next.config.ts`.

---

## 6. GitHub Actions workflows (réels)

### `.github/workflows/ci.yml`

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main, dev]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "pnpm" }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test --run
      - run: pnpm build

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high --production
      - uses: aquasecurity/trivy-action@master
        with:
          scan-type: fs
          severity: HIGH,CRITICAL
          exit-code: 1
      - uses: github/codeql-action/init@v3
        with: { languages: javascript-typescript }
      - uses: github/codeql-action/analyze@v3
```

### `.github/workflows/e2e.yml`

Playwright sur PR, avec preview Vercel URL injectée.

---

## 7. Observabilité (réelle + visible)

- **Sentry** configuré avec source maps, release tracking, performance
- **Vercel Analytics** + **Speed Insights** dans le layout
- Page `/status` (si tu veux pousser le délire) qui affiche un faux status de services inspiré de statuspage.io

---

## 8. Idées bonus

- **Konami code** → active un mode debug avec overlay CRT + affichage FPS, memory, network requests
- **`/humans.txt`** custom et élégant
- **Crédits techniques** en footer : "Built with Next.js 15, deployed on Vercel, monitored with Sentry"
- **Badge "Lighthouse 100"** visible (fait de vrais tests et pas un fake)
- **Carbon footprint** du site (via websitecarbon.com API ou calcul maison) — point fort pour un DevOps éco-conscient

---

## Règle générale

Chaque élément ici doit être **authentique** — si tu affiches un pipeline de sécurité, ton repo doit vraiment avoir ce pipeline. Un recruteur technique détectera le fake en 5 secondes. Le portfolio est ton CV exécutable ; chaque ligne de code doit pouvoir être lue comme une preuve.
