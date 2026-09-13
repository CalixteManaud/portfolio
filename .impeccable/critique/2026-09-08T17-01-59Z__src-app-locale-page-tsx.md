---
target: la home
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:E:\\Perso\\portofolio\\src\\app\\[locale]\\page.tsx"
target_fingerprint: "sha256:c531814898d16c2e31853022ed45e5b2ca6ad89dfd1a2a925679e786743b0ec9"
target_path: "E:\\Perso\\portofolio\\src\\app\\[locale]\\page.tsx"
timestamp: 2026-09-08T17-01-59Z
slug: src-app-locale-page-tsx
---
Method: dual-agent (A: revue de design isolée · B: détecteur + navigateur isolé). Décompte du détecteur revérifié en propre.

# Critique — la home (`src/app/[locale]/page.tsx`)

Mode de surface : **Persuade**. Le visiteur est un recruteur ou un CTO qui décide, en deux minutes, si ce profil vaut un entretien.

## Design Health Score

| # | Heuristic | Score | Problème clé |
|---|-----------|-------|--------------|
| 1 | Visibility of System Status | 2 | `lastPushed` calculé (`src/lib/github.ts:167`) et jamais rendu : la carte affirme « actualisé toutes les heures » sans horodatage. Le passage fallback CSS → WebGL n'est signalé par rien |
| 2 | Match System / Real World | 2 | Le CTA final dit « Un projet à mettre debout ? » à un public défini comme recruteur en process CDI. Section de preuve en anglais dans une page `lang="fr"` |
| 3 | User Control and Freedom | 3 | Terminal avec ↑/↓ et Ctrl-L, mais `open /projects` fait `window.location.assign` sans préfixe de locale (`Terminal.tsx:114`) |
| 4 | Consistency and Standards | 2 | Deux échelles de h2 (`md:text-4xl` vs `md:text-5xl`) ; `FeaturedProjects:16` et `MeetingsPreview:16` omettent `border-t border-border/40` ; couleurs hex hors palette dans la scène pipeline |
| 5 | Error Prevention | 2 | Aucune défense contre `n = 1` dans les grilles ; `DashboardSkeleton` peut livrer une consigne de développeur au visiteur |
| 6 | Recognition Rather Than Recall | 3 | Bon : eyebrows-chemins, chips de stack, soulignement ambre `aria-current`. Mauvais : commandes du terminal invisibles avant `help` |
| 7 | Flexibility and Efficiency | 2 | Pas de complétion Tab ; aucun raccourci vers CV, LinkedIn ou email avant le footer (~6 écrans) |
| 8 | Aesthetic and Minimalist Design | 3 | `Sparkles` décoratif en couleur de marque, pastille de scroll rebondissante, satellite GitHub à 18+ objets dans une colonne 2/5 |
| 9 | Error Recovery | 2 | Échecs GitHub en anglais développeur ; échec WebGL dégradé en silence |
| 10 | Help and Documentation | 2 | Colonne de `help` désalignée (`Terminal.tsx:17-27`) ; champ d'ondes documenté nulle part |
| **Total** | | **23/40** | **Acceptable** (57,5 %) |

Aucun `n/a` : la home porte une surface de commande réellement interactive, H7 et H10 s'appliquent.

## Design Specificity Verdict

Le système est authentiquement spécifique ; la home ne l'est qu'à partir du deuxième scroll. Le hero — la seule zone que 100 % des visiteurs voient — est interchangeable.

Réellement authored : l'ambre sur ardoise comme rejet documenté ; les eyebrows-chemins `~/parcours`, `$ ./prove --it` ; le champ d'ondes dont le relief est 52 semaines de commits en 46 lignes de contour ; les pastilles du terminal en vocabulaire de supervision ; la Règle de la Pièce Maîtresse appliquée (`lg:col-span-3` contre `2`).

Interchangeable : le hero entier (Badge + `Sparkles` + slogan + sous-titre + deux boutons + pastille de scroll). Le rythme « SectionHeader + 3 cartes + lien » répété trois fois.

Paradoxe central : les preuves d'ingénierie réelles sont invisibles (frameloop suspendu hors écran, `sr-only` de la révélation mot à mot, shader lisant les tokens CSS, token GitHub confiné serveur) et le contenu visible est fictif.

### Scan déterministe

Sortie 2, **21 findings** (20 advisory, 1 warning) :
- `design-system-font-size` × 15 — `CareerPreview:52`, `ProjectCard:22,45,51`, `TimelineCareer:116`, `Footer:117`, `LangSwitcher:48,61`, `CIPipelineScene:107`, `GitHubDashboard:57,74,97,102,120`, `Terminal:176`
- `design-system-color` × 5 — `CIPipelineScene.tsx:10-14`
- `bounce-easing` × 1 (warning) — `Hero.tsx:76`

Le détecteur a vu ce que la revue a manqué : `CIPipelineScene.tsx:10-14` code en dur violet `#a78bfa`, cyan `#22d3ee`, rose `#f472b6` — la palette néon explicitement rejetée par `globals.css`, dans la section de preuve, en violation de la Règle de la Source Unique.

Faux positif partiel : les 15 findings `font-size` visent des valeurs 10px/11px qui sont un registre réel du projet ; elles sont signalées parce que `DESIGN.md` ne déclare pas ces paliers. À trancher : documenter un palier `label-sm` ou remonter à `0.75rem`.

Overlays visuels indisponibles : extension Chrome non connectée (2 tentatives). Aucune capture desktop/mobile, aucune erreur console, aucune injection. `pnpm dev` échoue sur la machine (shim `@pnpm+exe\12.3.4` incomplet) ; serveur démarré via `next` directement.

## Overall Impression

Le craft d'ingénierie est nettement au-dessus du contenu qu'il sert. La page raconte l'histoire d'un profil vide parce que les seules choses lisibles en deux minutes sont un slogan, deux emplois inventés et un unique projet qui est le site lui-même. Plus grande opportunité : la page ne dit jamais qui parle — « Calixte Manaud » n'apparaît nulle part dans le DOM visible de la home.

## What's Working

1. Le champ d'ondes : relief = donnée mesurée, résolue serveur, en lignes de contour pour une raison de craft précise, couleurs lues sur les tokens au runtime.
2. La rigueur d'accessibilité là où presque tout le monde échoue : `sr-only` + `aria-hidden` sur la révélation mot à mot, fallback retourné avant montage du Canvas sous `prefers-reduced-motion`, `IntersectionObserver` coupant le frameloop.
3. Le vocabulaire de supervision tenu jusqu'au détail : prompt en quatre couleurs de rôle, pastilles alert/signal/healthy, `$ ./prove --it`.

## Priority Issues

### [P1] Le contenu placeholder est publié comme s'il était vrai, et il occupe le premier scroll
`content/career/01-junior-devops` (« Studio Tech », 2022→2024, Paris), `02-senior-devsecops` (Senior DevSecOps Freelance en cours, Vault/Sigstore/ArgoCD), `content/meetings/le-mentor-pragmatique` (anecdote avec citation). `PRODUCT.md` dit que ce contenu ne décrit aucune expérience réelle. Risque fatal : vérifier un employeur est le métier du recruteur ; « Studio Tech » ne renvoie rien.
Fix : retirer les dossiers placeholder — les deux composants retournent déjà `null` sur liste vide. Purger aussi `SECTIONS.stack` du terminal.
Commande : `/impeccable harden`

### [P1] La pipeline CI/CD est peinte dans la palette que le projet rejette
`CIPipelineScene.tsx:10-14` : violet, cyan, rose en dur, plus `style={{ color }}` écrasant la classe token. Seul endroit du site contredisant visuellement son pari identitaire, et il est dans la section de preuve.
Fix : remplacer par `--signal`, `--info`, `--healthy`, `--depth`, `--paper-dim` lus comme le fait `WaveFieldScene` ; supprimer le style inline.
Commande : `/impeccable colorize`

### [P1] Le visiteur ne sait jamais qui c'est, ni s'il est disponible, ni où
Nom absent du DOM visible ; `Meta.title` sans nom dans les 4 locales ; aucun signal de disponibilité malgré « recherche active de CDI » dans `PRODUCT.md` ; `CareerPreview:52-60` n'affiche la localisation que pour les postes terminés ; aucun lien CV/email/LinkedIn avant le footer.
Fix : nom + ligne mono de faits sous le H1 (`Calixte Manaud · France · disponible pour un CDI`), `Meta.title` nommé dans les 4 locales, GitHub/LinkedIn en liens tertiaires du hero, localisation rendue en plus de la pastille « aujourd'hui ».
Commande : `/impeccable clarify`

### [P2] La section de preuve n'est pas lisible par un CTO qui ne tape rien
« Trois preuves en direct » : le terminal est un script figé, la pipeline une animation sans exécution réelle, seul le dashboard est live — et il peut afficher une consigne de développeur. Anglais dans une page française, 18+ objets concurrents dans le satellite.
Fix : reformuler sans revendiquer trois directs ; trois chips ambre cliquables (`whoami`, `cat stack`, `ls`) ; amaigrir le satellite à trois chiffres et un horodatage `lastPushed`.
Commande : `/impeccable distill`

### [P2] Manquements d'accessibilité qui touchent l'engagement WCAG AA
Listes cassées (`<ol>` → `<div>` de `Reveal` → `<li>`) ; contraste ≈3,4–3,8:1 sur les métadonnées mono contre 4,5:1 requis, registre que `DESIGN.md` codifie donc le système encode l'échec ; `<canvas>` sans nom accessible et `HeroFallback` en `aria-hidden` — personne n'apprend jamais que le relief est l'activité GitHub réelle.
Fix : `Reveal as="li"` ; registre métadonnées remonté à `/60` et `DESIGN.md` corrigé ; ligne mono visible et lue sous le hero (`relief : 52 semaines de commits · pic à <n>`).
Commande : `/impeccable audit`

## Persona Red Flags

**Recruteur pressé, mobile, 4G** : `min-h-dvh` de slogan avant le moindre fait ; bundle 3D téléchargé sans indication d'attente ; ne connaît pas le nom, ne peut ni noter ni partager ; section de preuve empilée en blocs lourds avec un champ de saisie `h-72` inutilisable au clavier tactile ; aucun email cliquable avant le footer.

**CTO sceptique** : « trois preuves en direct » dont une seule l'est ; « Studio Tech » introuvable ; pastille `--healthy` accrochée à un emploi fictif ; `cat stack` liste Sigstore/Vault/ArgoCD sans artefact ; pipeline peinte en violet et cyan ; le vrai craft (shader lisant les tokens, frameloop suspendu, token serveur) n'est écrit nulle part.

**Clavier / lecteur d'écran** : listes cassées sans annonce de cardinalité ; `<canvas>` sans nom accessible ; métadonnées à 3,4–3,8:1 ; terminal annoncé en anglais dans un document `lang="fr"`. À conserver : `SkipLink` traduit, focus-visible ambre global.

## Minor Observations

- `Hero.tsx:45` — `Sparkles` : décor pur en couleur de marque, contre la Règle du Seuil.
- `messages/fr.json:16` — « expériences web qui en mettent plein la vue » : registre marketing banni par `PRODUCT.md`.
- `FeaturedProjects:16` / `MeetingsPreview:16` — `border-t border-border/40` manquant (`ContactCTA:12` l'a bien).
- Deux échelles de h2 sur la même page ; `text-4xl` sous-tire la rampe déclarée.
- `Terminal.tsx:17-27` — colonne de `help` désalignée d'un caractère.
- `whoami` retourne « guest@portfolio » sans le nom de la personne.
- Grilles sans défense contre `n = 1` : deux tiers de vide avec un seul projet.
- `proceduralWeeks()` : si le token manque en prod, la « donnée réelle » est une onde composite et rien ne le signale.
- La même triade servie trois fois (hero, `cat about`, footer) sans ajouter un fait.

## Questions to Consider

1. Si un recruteur capture une seule zone de cette page pour un Slack d'équipe, laquelle — et contient-elle ton nom ?
2. Le relief du hero est ton activité GitHub réelle et aucun visiteur ne l'apprendra jamais. Preuve, ou décoration coûteuse ?
3. « Un projet à mettre debout ? » a été écrit pour qui ?
4. Si tu supprimais `content/career/` et `content/meetings/` ce soir, la page serait-elle plus faible — ou plus courte et enfin vraie ?
5. Deux des trois « preuves en direct » sont scriptées. Laquelle défendrais-tu devant un CTO, et pourquoi les deux autres sont-elles au même rang ?
