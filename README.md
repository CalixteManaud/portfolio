# Portfolio 3D — Setup Claude Code

Bundle de configuration pour développer un portfolio 3D multi-langue avec Claude Code.

## Décisions d'architecture (v2)

- **Architecture 100% statique** — pas d'auth, pas de BDD, le contenu vit dans Git (MDX versionné)
- **Locales** : FR (default), EN, ES, DE
- **Contact** : Resend direct via Server Action, anti-bot Turnstile, rate-limit in-memory, fallback Sentry
- **Stack** : Next.js 15 + R3F + shadcn/ui + Tailwind v4 + next-intl + MDX (next-mdx-remote RSC)

## Structure fournie

```
.
├── CLAUDE.md                                # Briefing permanent du projet
└── .claude/
    └── skills/
        ├── portfolio-3d/SKILL.md             # Scènes R3F, modèles, post-processing
        ├── portfolio-animations/SKILL.md     # Framer Motion + GSAP + Lenis
        ├── portfolio-i18n/SKILL.md           # next-intl, FR/EN/ES/DE
        ├── portfolio-content/SKILL.md        # MDX loader + sections (Hero, Parcours, Projets, Rencontres, Contact)
        └── devops-showcase/SKILL.md          # Terminal, GitHub dashboard, CI/CD viz
```

## Comment utiliser

1. **Initialise le projet** :
   ```bash
   pnpm create next-app@latest portfolio --typescript --tailwind --app --src-dir --import-alias "@/*"
   cd portfolio
   ```

2. **Copie ce bundle** à la racine du projet :
   ```bash
   cp CLAUDE.md /chemin/vers/portfolio/
   cp -r .claude /chemin/vers/portfolio/
   ```

3. **Claude Code** lira automatiquement `CLAUDE.md` et pourra consulter les skills à la demande. Pour Claude web/app, référence les fichiers dans tes messages.

4. **Itère** : ces documents sont des **points de départ**, pas des vérités gravées. Ajuste les patterns selon ce qui marche pour toi.

## Prochaines étapes suggérées

1. ✅ Valider le `CLAUDE.md` et les skills
2. **Scaffolder le projet Next.js** avec les dépendances principales (`package.json` + configs)
3. Configurer `next-intl` + routing localisé FR/EN/ES/DE
4. Mettre en place l'architecture MDX (`src/lib/content.ts` + schémas Zod + scripts de validation)
5. Créer la première scène 3D Hero (commencer simple — un objet qui tourne)
6. Configurer la CI GitHub Actions (lint + typecheck + test + security scan)
7. Créer le formulaire de contact avec Turnstile + Resend
8. Itérer sur les sections et les éléments signature DevOps

## Commandes rapides une fois le projet en place

```bash
pnpm dev                  # Développement
pnpm content:check        # Vérifier que tous les MDX sont présents
pnpm i18n:check           # Vérifier que les clés de traduction sont complètes
pnpm build                # Build de production
pnpm test && pnpm test:e2e # Tests
```

Bon build.
