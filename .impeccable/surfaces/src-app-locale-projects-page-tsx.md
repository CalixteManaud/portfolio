---
version: 1
slug: "src-app-locale-projects-page-tsx"
primary_target: "src/app/[locale]/projects/page.tsx"
related_targets: ["src/components/projects/ProjectsHero.tsx","src/components/projects/ProjectsExplorer.tsx","src/components/projects/ProjectVisual.tsx","src/components/projects/FeaturedProject.tsx","src/components/projects/ProjectsCta.tsx","content/projects"]
---

Portée : la page Projets (`/projets` en français). L'en-tête et le pied de page sont hérités et restent inchangés, à la demande du propriétaire.
Mode visiteur : Persuade/Read. Le recruteur vient voir ce qui a été construit, avec quoi, et en ouvrir le détail.

## Direction contract

THESIS : la vitrine des projets, où chaque carte est une fiche MDX réelle du dépôt, filtrable et cherchable. Elle refuse les compteurs sans source.

OWN-WORLD : le monde établi. Un hero sombre avec la photo fondue à droite, puis une barre de filtres en pastilles claires (l'actif en encre) avec une recherche. Viennent ensuite les cartes claires : capture sombre en tête, pastille de type vitrée, tags bordés, lien « Voir le projet », plus un lien de code ou de documentation quand il existe. Puis une bande sombre pour le projet phare, en trois colonnes : texte, capture, points clés avec note manuscrite. Pour finir, un appel à l'action sur fond beige.

STORY : le visiteur voit l'ensemble (7 projets publiés, 12 dépôts publics mesurés). Il filtre par domaine, ouvre une fiche, lit le projet phare, puis prend contact.

FIRST VIEWPORT : une bande sombre. À gauche, le libellé « / PROJETS », le H1 sur deux lignes « Des projets concrets / pour un réel impact. » (« réel impact. » en cuivre), le chapeau et trois chiffres mesurés, chacun avec son icône. À droite, la photo au portable fondue vers la gauche, la devise manuscrite « Build Deploy Improve Repeat » soulignée au pinceau et la citation vitrée signée.

FORM : maquette fournie par le propriétaire (`.impeccable/mocks/projects-comp.png`, 1024×1536), épinglée. Pas de tirage : une direction épinglée prime, donc pas de clé de seed. Mesure par comp-diff.

FINISH : unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Contraintes épinglées

- Six projets confirmés réels par le propriétaire (Chatbot IA, Cluster Kubernetes sur OpenStack, Pipeline CI/CD & Sécurité, RGT CITY CDM, MSFS Career, Intégration Salesforce), chacun en fiche MDX dans les 4 langues. Le Portfolio 3D occupe la 7e carte.
- Projet phare : le Chatbot IA (`featured`), sans le pseudo « Warthoz » que montrait la maquette. La landing et la bande de preuve ciblent désormais explicitement la fiche `portfolio-3d`.
- Chiffres : le nombre de fiches publiées, les dépôts GitHub publics (API) et 3 000+ utilisateurs (CV), à la place des « 10+ projets / 5 stacks » de la maquette.
- « Planifier un appel » est retiré sur décision du propriétaire, car aucun outil de rendez-vous n'existe. L'appel à l'action n'a pas de point d'exclamation.
- L'appel à l'action dit « Une opportunité en tête ? » au lieu de « Un projet en tête ? ». PRODUCT.md cadre le contact sur une recherche active (CDI ou mission), et Compétences porte la même reformulation.
- Pas de carte orpheline : quand le nombre de fiches laisse une carte seule en dernière ligne, elle passe au format horizontal sur toute la largeur. C'est une adaptation de la grille fermée 3×2 de la maquette, puisqu'il y a sept fiches.
- Capture de la carte Portfolio 3D : premier écran réel du site à 1440×900. Ce n'est pas une maquette, c'est le projet lui-même.
- Les libellés de section sont conservés sur décision explicite du propriétaire (exception au craft floor). Le nom s'écrit « Manaud Calixte ».

## Décisions ouvertes

- Captures à fournir par le propriétaire : `public/projects/<slug>.webp` (1600×1000) pour chaque projet, `public/photos/projects-hero.webp` et `public/projects/chatbot-ia-feature.webp`. En attendant, les cartes affichent une réserve « Capture à venir ».
- Liens de dépôt et de documentation des six projets, à fournir par le propriétaire.
