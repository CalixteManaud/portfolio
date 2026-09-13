---
name: L'Établi — Portfolio Calixte Manaud
description: Plan de travail beige et craie, cuivre en signal exclusif — un établi d'ingénieur, pas une plaquette.
colors:
  board: "oklch(0.927 0.018 81.3)"
  board-sunk: "oklch(0.895 0.020 81.0)"
  chalk: "oklch(0.980 0.006 84.6)"
  ink: "oklch(0.180 0.008 67.3)"
  ink-soft: "oklch(0.430 0.010 70.0)"
  rule: "oklch(0.845 0.014 80.0)"
  copper: "oklch(0.675 0.097 64.9)"
  copper-ink: "oklch(0.980 0.006 84.6)"
  steel: "oklch(0.626 0.012 95.3)"
  go: "oklch(0.560 0.110 150.0)"
  stop: "oklch(0.550 0.170 27.0)"
  screen: "oklch(0.185 0.012 62.0)"
  screen-ink: "oklch(0.900 0.010 84.0)"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 92"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 92"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 92"
  body:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.06em"
  eyebrow:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.18em"
  hand:
    fontFamily: "Caveat, ui-rounded, cursive"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  sm: "0.3rem"
  md: "0.45rem"
  lg: "0.75rem"
  xl: "1.05rem"
  2xl: "1.425rem"
  3xl: "1.8rem"
  4xl: "2.25rem"
spacing:
  xs: "0.375rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "1.5rem"
  xl: "2rem"
  section: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.copper}"
    textColor: "{colors.copper-ink}"
    rounded: "{rounded.md}"
    padding: "0 2rem"
    height: "2.75rem"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.copper}"
    textColor: "{colors.copper-ink}"
  button-secondary:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-secondary-hover:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
  card-surface:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  card-surface-hover:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink}"
  photo-slot:
    backgroundColor: "{colors.chalk}"
    rounded: "{rounded.lg}"
    padding: "0.375rem"
  eyebrow-label:
    textColor: "{colors.copper}"
    typography: "{typography.eyebrow}"
  nav-link:
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.sm}"
    padding: "0 0.75rem"
    height: "2.25rem"
  nav-link-hover:
    backgroundColor: "{colors.board-sunk}"
    textColor: "{colors.ink}"
  terminal-screen:
    backgroundColor: "{colors.screen}"
    textColor: "{colors.screen-ink}"
    rounded: "{rounded.lg}"
    typography: "{typography.label}"
---

# Design System: L'Établi — Portfolio Calixte Manaud

## Overview

**Creative North Star : « L'Établi »**

Un plan de travail d'ingénieur, pas une plaquette. Le monde précédent — poste de supervision, ardoise froide,
ambre sodium — a été intégralement retiré ; il n'existe plus nulle part dans le build actuel et ne doit pas être
réintroduit par réflexe. Ce qui le remplace refuse le même arrangement que le métier affiche toujours (héros
centré, rangée de statistiques, grille de cartes de services égales) parce qu'une grille de cartes range des
affirmations, quand un établi expose des objets. Chaque compétence est un outil posé sur le panneau, qu'on prend
en main et qu'on repose ; ce qui est absent du panneau (`ToolPegboard`, silhouette vide, `.learning`) est aussi
lisible que ce qui y est.

Le système est **tactile et matériel** dans son vocabulaire (tirages photo légèrement de travers, étiquettes
rivetées, silhouettes d'outils peintes, objets 3D en géométrie primitive) et **retenu** dans sa palette : deux
neutres de bois et de craie, une encre, un unique accent cuivre — la couleur du logo, et non une couleur choisie
pour le web. Le bois n'est jamais rendu comme une texture bitmap ; il n'existe que sous forme de lumière rasante
(`.board-light`, deux nappes radiales très larges) et d'ombre portée (`--lift-1/2/3`). C'est la discipline qui
sépare l'atelier du skeuomorphisme, et elle est écrite en commentaire au sommet de `globals.css`.

Le thème clair (« l'atelier de jour ») est la valeur par défaut ; le thème sombre (« la nuit, sous une lampe
d'établi ») n'inverse pas mécaniquement les valeurs — le bois devient noyer, le cuivre gagne en présence puisqu'il
reste la seule source chaude. Un couple de tokens fait exception : `--screen` / `--screen-ink`, l'écran allumé du
terminal, volontairement absent du bloc `.dark` — un écran reste sombre dans les deux thèmes, ce qui en fait un
objet posé sur l'établi plutôt qu'une surface du site.

**Key Characteristics:**
- Plan de travail beige (`--board`) et craie (`--chalk`) comme matières de fond, jamais de blanc pur ni de noir pur
- Un seul accent de marque, le cuivre du logo, jamais concurrencé par une seconde couleur d'interaction
- Trois faces typographiques à rôles étanches (signalétique frappée / lecture / donnée), plus une main courante
  réservée aux annotations
- Objets posés avec ombre douce à deux couches (`--lift-1/2/3`), jamais de bordure comme seul moyen de détachement
- Le bois est une lumière et une ombre, jamais une texture — c'est la Règle du Bois Immatériel, non négociable
- Le monde précédent (ardoise/ambre) est retiré en totalité ; ses tokens ne réapparaissent dans aucun nouveau code

## Colors

Palette de bois clair, craie et encre, avec un unique accent chaud et deux couleurs d'état empruntées à
l'atelier plutôt qu'au tableau de bord.

### Primary
- **Cuivre** (`--copper`, `oklch(0.675 0.097 64.9)` clair / `oklch(0.760 0.105 66.0)` sombre) : l'unique accent de
  marque, littéralement la couleur du logo (`public/logo.png`). Il porte le CTA principal (étiquette rivetée), les
  eyebrows de section, l'anneau de focus, le survol des liens et cartes, le prompt du terminal (`portfolio`), et
  les émissives des objets 3D quand ils sont pris en main. Sur aplat, le texte posé dessus est **Craie sur cuivre**
  (`--copper-ink`), jamais du blanc pur ni de l'encre.

### Neutral
- **Plan de travail** (`--board`) : fond principal de page, la couleur du bois lui-même. C'est aussi la valeur de
  `theme-color` (`#EDE6DA`).
- **Plan de travail en retrait** (`--board-sunk`) : bandes de section alternées (`CareerPreview`,
  `ToolPegboard`), fond de scrollbar, renfoncements.
- **Craie** (`--chalk`) : surfaces posées sur le bois — cartes, tirages photo, boutons secondaires, popovers. C'est
  l'objet, pas le support.
- **Encre** (`--ink`) : texte principal.
- **Encre délavée** (`--ink-soft`) : texte secondaire, légendes, sous-titres, libellés de colonnes.
- **Filet** (`--rule`) : toutes les bordures et séparateurs, quasi toujours en opacité partielle (`/40`–`/70`).
- **Acier** (`--steel`) : outillage — silhouettes du panneau à outils au repos, embouts et rails des objets 3D,
  pouce de scrollbar.
- **Écran** (`--screen` / `--screen-ink`) : fond et texte du terminal uniquement. Fixe dans les deux thèmes — voir
  la Règle de l'Écran Fixe ci-dessous.

### Tertiary
- **Vert Marche** (`--go`) : état sain uniquement — pastille de disponibilité du hero, étape en cours du parcours,
  utilisateur du prompt terminal. Emprunté au voyant de machine, pas au tableau de bord.
- **Rouge Arrêt** (`--stop`, exposé aussi en `--destructive`) : erreurs de formulaire, actions destructives, premier
  bouton de la barre de titre du terminal. Emprunté à l'arrêt d'urgence.

### Named Rules

**La Règle du Bois Immatériel.** Le bois n'est jamais une image ni un motif répété : c'est uniquement `.board-light`
(deux nappes radiales de lumière) et les ombres `--lift-1/2/3`. Toute tentative d'ajouter une texture de grain de
bois, même subtile, viole l'invariant fondateur du monde et doit être refusée.

**La Règle de la Source Unique.** Les treize primitives de `:root`/`.dark` dans `src/styles/globals.css` sont la
seule définition de couleur du projet. Tout code nouveau les référence via `var(--copper)` ou les classes Tailwind
dérivées (`text-copper`, `bg-board-sunk`) — jamais un hex en dur.

**La Règle de l'Écran Fixe.** `--screen` et `--screen-ink` ne sont volontairement pas redéfinis dans `.dark` : un
écran allumé reste sombre dans les deux thèmes. C'est ce qui distingue un objet posé sur l'établi (le terminal)
d'une surface du site qui, elle, s'inverse avec le thème.

**Le monde retiré.** Les tokens `signal`, `healthy`, `ink-deep`, `alert`, `info` appartenaient au monde précédent
(ardoise/ambre) et n'existent plus dans `globals.css`. Ils ne sont **pas** des tokens du système actuel et ne
doivent jamais être réintroduits dans une nouvelle surface — voir Do's and Don'ts.

## Typography

**Display Font:** Archivo (fallback `ui-sans-serif, system-ui, sans-serif`), axe de chasse variable frappé à
`font-variation-settings: "wdth" 92` sur `h1`, `h2`, `h3` et `.font-display`/`.font-heading`
**Body Font:** Public Sans (fallback `ui-sans-serif, system-ui, sans-serif`)
**Label/Mono Font:** JetBrains Mono (fallback `ui-monospace, "SF Mono", Menlo, monospace`)
**Hand Font:** Caveat (fallback `ui-rounded, cursive`) — annotations manuscrites uniquement

**Character:** Une grotesque à chasse variable, resserrée plutôt qu'élargie, qui donne aux titres l'appui d'un
tampon frappé sur le bois — l'inverse du réglage étendu qu'utilisait le monde précédent pour la signalétique.
Public Sans, dessinée pour la notice administrative, porte la lecture sans manière. JetBrains Mono étiquette la
donnée. Caveat écrit à la main dans les marges des tirages photo, comme sur un plan relu au crayon — jamais pour
lire un contenu réel, seulement pour l'annoter.

### Hierarchy
- **Display** (Archivo, 700, `2.6rem` → `3.5rem` selon le point de rupture, interligne 0.98, `-0.035em`,
  `wdth 92`) : le H1 du hero, exclusivement.
- **Headline** (Archivo, 700, `1.5rem` → `1.875rem`/`3xl` selon la section, interligne 1.15, `-0.02em`, `wdth 92`) :
  titres de section (`h2`, `h3`), titre de projet en vedette (`ProjectFeature`).
- **Title** (Archivo, 700, `1.125rem`, `-0.015em`, `wdth 92`) : titres de fiche de domaine (`SkillDomains`),
  carte d'état du hero.
- **Body** (Public Sans, 400, `1rem`, interligne 1.625) : prose, résumés, descriptions, `max-w-prose`.
- **Label** (JetBrains Mono, 400, `0.6875rem`/11px, `0.06em`) : métadonnées denses — dates (`tabular-nums`),
  badges de stack, lignes de terminal, certifications.
- **Eyebrow** (JetBrains Mono, 400, `0.625rem`/10px, `0.18em`, capitales) : titres de bandeau (« outils »,
  « démontré ici »), le registre le plus étroit de la rampe.
- **Hand** (Caveat, 400, `15px`) : légende manuscrite posée en biais (`rotate-[-4deg]`) sur un tirage photo.

### Named Rules

**La Règle de la Chasse Frappée.** Archivo sans `wdth 92` n'est pas la display du projet : elle perd exactement ce
qui la caractérise, l'effet de tampon compact. Tout nouveau titre passe par `h1`–`h3` ou `.font-display`, qui
portent déjà le réglage.

**La Règle de la Main Réservée.** Caveat n'apparaît que pour une annotation en marge d'un objet posé (le tirage
photo). Elle ne porte jamais un titre, un CTA ou un contenu qui doit être lu sans effort — sa lisibilité est
volontairement dégradée par le genre.

## Layout

Colonne unique centrée : `max-w-6xl` (72rem) avec `px-4 md:px-6`, ou l'utilitaire `.container-px`
(`padding-inline: clamp(1rem, 4vw, 3rem)`) quand une section gère elle-même sa gouttière.

**Rythme vertical.** Les sections de la home font `py-24` (6rem), séparées par `border-t border-border/40`, avec
alternance de fond entre `--board` et `--board-sunk/40`. Un en-tête de section (`SectionHeader`) est suivi d'un
`mt-10` avant son contenu. Le hero (`BenchHero`) est la seule section composée en trois bandes empilées (dire /
montrer / manipuler) plutôt qu'en un seul bloc `min-h-dvh`.

**Grilles.** Le hero utilise `lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]` pour opposer texte et tirages photo, et
une sous-grille `grid-cols-5` (`col-span-3` / `col-span-2`) pour le tirage principal contre les tirages secondaires
empilés. Les listes de parcours utilisent `md:grid-cols-[9rem_1fr_auto]` alignées sur la ligne de base. Les fiches
de domaine sont en `md:grid-cols-2`, jamais en trois colonnes égales.

**Rythme d'espacement.** `gap-1.5` (0.375rem) entre une pastille et son libellé, `gap-3`/`gap-4` (0.75–1rem) dans
un groupe d'actions, `gap-6` (1.5rem) entre cartes de grille, `mt-9`/`mt-10` entre un bloc de texte et ses CTA,
`py-24` (6rem) entre sections. Le padding interne de carte est `p-6` (fiches de domaine) ; le tirage photo garde
une marge de `p-1.5` autour de l'image, comme un passe-partout.

**Responsive.** Mobile d'abord, un seul point de bascule structurel par section (`md` pour la navigation, les
grilles de fiches et le hero ; `lg` pour la colonne texte/photos du hero). La navigation principale bascule dans un
`Sheet` sous `md`.

### Named Rules

**La Règle du Léger Décalage.** Un tirage photo n'est jamais posé droit : `rotate-[-1.2deg]` ou
`rotate-[1.4deg]` selon sa position, comme une épreuve sortie d'une planche-contact. Un objet parfaitement aligné
au pixel près lit comme une interface, pas comme un objet posé.

## Elevation & Depth

Système **d'objets posés**, pas de surfaces plates ni de paliers d'encre empilés. Chaque élément détaché du plan de
travail (carte, tirage photo, bouton, terminal) porte une ombre à deux couches — un contact net et une diffusion
large — jamais une seule ombre, parce qu'un objet réel a les deux à la fois.

### Shadow Vocabulary
- **`--lift-1`** (`0 1px 2px oklch(.../.06), 0 2px 8px oklch(.../.05)`) : contact léger — bouton secondaire,
  fiche du panneau à outils au survol, bascule de thème.
- **`--lift-2`** (`0 2px 4px oklch(.../.07), 0 12px 28px oklch(.../.09)`) : élévation standard — carte d'état du
  hero, tirage photo, fiche de domaine, terminal.
- **`--lift-3`** (`0 4px 8px oklch(.../.08), 0 28px 56px oklch(.../.14)`) : élévation maximale, réservée aux
  survols et aux éléments les plus détachés du plan.
- **`.board-light`** : ce n'est pas une ombre mais son inverse — deux nappes radiales très larges qui simulent la
  lumière rasante tombant sur le bois, seule source de relief du fond lui-même.

### Named Rules

**La Règle de l'Objet Posé.** Une ombre au repos est normale ici — c'est l'inverse du monde précédent, où les
surfaces étaient plates par défaut. Chaque composant détaché du fond (carte, tirage, bouton, badge) porte au
minimum `--lift-1`. Un élément sans ombre doit être visuellement soit un fond, soit une étiquette rivetée
(`.riveted`), qui elle est vissée dans le bois plutôt que posée dessus — donc délibérément sans ombre.

## Shapes

Rayons doux issus d'une base unique `--radius: 0.75rem`, déclinée par facteurs : `sm 0.3rem`, `md 0.45rem`,
`lg 0.75rem`, `xl 1.05rem`, `2xl 1.425rem`, `3xl 1.8rem`, `4xl 2.25rem`. Rien d'anguleux, rien de complètement rond
hors des pastilles d'état et des rivets.

- **Cartes et fiches** : `rounded-xl`/`rounded-2xl` (1.05–1.425rem) — fiches de domaine, panneau vide.
- **Objets posés** (boutons, tirages photo, terminal, bascule de thème) : `rounded-lg`/`rounded-md`
  (0.75/0.45rem).
- **Pastilles d'état** : `rounded-full`, 6px (`size-1.5`) pour les voyants de disponibilité et d'étape en cours.
- **Rivets** : deux points de 3px (`.riveted::before/::after`), non un radius mais un ornement de fixation, réservé
  à l'action principale du hero.
- **Bordures** : toujours 1px, servies en opacité (`border-rule/60`–`/70`, `border-border/40` pour les séparations
  de section). Le passage au survol se fait vers `copper/50`.

### Named Rules

**La Règle de la Vis, pas du Clou.** Une étiquette rivetée (`.riveted`) n'a pas d'ombre — elle est fixée dans le
bois, pas posée dessus. Tout le reste qui n'est pas rivé porte une ombre `--lift-*`. Les deux traitements ne se
mélangent jamais sur un même élément.

## Components

### Buttons
- **Shape:** rayon doux (`rounded-md`, 0.75rem).
- **Primary:** aplat **Cuivre** avec texte **Craie sur cuivre**, hauteur `h-11`, `px-8`. C'est aussi le seul bouton
  qui porte `.riveted` — l'action principale du hero est vissée dans le plan de travail.
- **Hover / Focus:** survol `hover:bg-copper/90` ; focus visible en anneau cuivre 2px doublé de l'outline global
  `2px solid var(--copper)` à 2px d'offset. Pression : `active:translate-y-px`, un enfoncement d'un pixel.
- **Secondary:** fond **Craie**, bordure `--rule`, ombre `--lift-1`, survol vers `border-copper/50`.
- **Icon-only:** carrés (`size-9`), toujours avec `aria-label` (bascule de thème, boutons sociaux).

### Cards / Containers
- **Corner Style:** `rounded-xl` (1.05rem), fiches de domaine et panneau vide en `rounded-2xl`/`rounded-xl` selon
  le contexte.
- **Background:** `bg-chalk`, opaque — contrairement au monde précédent, pas de transparence fonctionnelle par
  défaut ; le `backdrop-blur` reste réservé aux surfaces qui passent devant la scène 3D (header).
- **Shadow Strategy:** `--lift-1` au repos, `--lift-2` au survol, avec léger soulèvement (`hover:-translate-y-0.5`).
- **Border:** `border-rule` pleine, passant à `border-copper/50` au survol.
- **Internal Padding:** `p-6`.

### Photo Slot (composant signature)
Un tirage photo posé sur l'établi : cadre `bg-chalk p-1.5` (passe-partout) autour d'une image en `AspectRatio`,
ombre `--lift-2`, jamais de bordure — l'objet a une ombre et un fond craie, pas une fenêtre découpée dans le bois.
Tant que le fichier n'existe pas, `src: null` rend un cadre de réserve qui annonce le chemin attendu
(`public/photos/...`) et son ratio (`4:5`, `1:1`…), plutôt qu'un aplat gris muet ou une image d'emprunt. Certains
tirages portent une légende manuscrite (`.font-hand`) décalée en biais sous le cadre.

### Terminal (composant signature)
Cadre `rounded-lg` sur fond **Écran** (`--screen`, fixe dans les deux thèmes), `shadow-lift-2`, entièrement en
mono. Barre de titre à trois pastilles de 10px (`stop`, `copper`, `go` — le vocabulaire de l'atelier, pas une
imitation de fenêtre d'OS). Shell interactif avec historique de commandes, `cat`/`ls`/`open`/`clear`/`whoami`.

### Tool Pegboard (composant signature)
Chaque compétence est une silhouette d'icône `text-steel` posée sans bordure ; au survol elle se soulève
(`hover:-translate-y-0.5`), prend une bordure `--rule`, un fond `--chalk`, une ombre `--lift-1`, et l'icône passe au
cuivre. Le dernier emplacement est une silhouette **vide** (`.tool-shadow`, bordure pointillée `border-dashed
border-steel/50`) libellée « en cours d'apprentissage » — l'absence est aussi lisible que la présence, et c'est
délibéré.

### Bench Scene (composant signature)
Trois objets 3D en géométrie primitive (boîtier serveur, cadenas, niveau à bulle), sans fichier `.glb`, dont les
couleurs sont lues au runtime sur les tokens CSS (`readCssColorHex("--copper", ...)`) plutôt que recopiées en dur.
Au survol, l'objet se soulève, pivote d'un quart de tour et répond dans sa matière propre : le cadenas ouvre son
anse, le niveau centre sa bulle sur l'axe X.

### Navigation
- **Header:** barre collante `h-16`, fond `bg-board/85` + `backdrop-blur-md`, bordure basse nette
  `border-rule/70` — « une règle posée sur le plan de travail, elle ne flotte pas, elle s'appuie » (commentaire du
  composant). Le monogramme du logo est posé sur une plaque craie fixe (`bg-[oklch(0.98_0.006_84.6)]`), non
  filtrée par le thème sombre.
- **Liens:** `text-ink-soft`, survol vers `text-ink` sur fond `bg-board-sunk`.
- **Mobile:** sous `md`, la navigation bascule dans un `Sheet` latéral.

## Do's and Don'ts

### Do:
- **Do** garder le bois comme lumière et ombre uniquement (`.board-light`, `--lift-1/2/3`) — jamais un fichier
  image ni un motif répété.
- **Do** référencer les couleurs via `var(--copper)` et les classes Tailwind dérivées ; `globals.css` reste la
  source unique.
- **Do** donner une ombre `--lift-*` à tout objet détaché du plan de travail ; réserver `.riveted` (sans ombre) à
  la seule action principale du hero.
- **Do** lire les couleurs 3D au runtime sur les tokens CSS (`readCssColorHex`), comme le fait `BenchScene`, plutôt
  que de les recopier en valeur figée.
- **Do** garder `--screen`/`--screen-ink` fixes dans les deux thèmes : le terminal ne s'inverse jamais.

### Don't:
- **Don't** réintroduire les tokens du monde retiré (`signal`, `healthy`, `ink-deep`, `alert`, `info`) : ils
  n'existent plus dans `globals.css`, et le build actuel ne les canonise pas malgré leur présence résiduelle dans
  cinq fichiers non nettoyés (voir la note de dérive ci-dessous).
- **Don't** rendre le bois comme une texture bitmap, même subtile — c'est l'invariant fondateur de ce monde.
- **Don't** appliquer `wdth 92` en dehors de `h1`–`h3`/`.font-display` : la chasse frappée est réservée à la
  signalétique.
- **Don't** utiliser Caveat pour un contenu qui doit être lu sans effort ; elle est réservée à l'annotation en
  marge.
