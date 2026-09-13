---
version: 1
slug: "src-app-locale-about-page-tsx"
primary_target: "src/app/[locale]/about/page.tsx"
related_targets: ["src/components/about/AboutHero.tsx","src/components/about/AboutJourney.tsx","src/components/about/AboutValues.tsx"]
---

Portée : la page À propos (`/parcours` en français). L'en-tête et le pied de page sont hérités de la landing et restent inchangés, à la demande de l'utilisateur (« ne refait pas la navbar »).
Mode visiteur : Persuade/Read. Le recruteur vient vérifier qui est la personne, son parcours réel et sa manière de travailler.

## Direction contract

THESIS : la page de présentation d'une personne, pas un CV recopié. Un portrait en grand, une voix à la première personne, puis le parcours complet en frise sur fond sombre et les valeurs. Elle reprend la maquette de l'utilisateur et en refuse la fiction : pas de « 15+ projets », pas de « 100 % motivé », pas de trait de caractère inventé, et des dates et descriptions tirées du CV.

OWN-WORLD : le monde de la landing. Fond crème #F6F1EA, encre #17171B, cuivre du logo (#A4653E en aplat, #8F5431 en texte, #C4875C sur fond sombre), bande sombre #1E2023, cartes claires #FDFBF8, Be Vietnam Pro, Waiting for the Sunrise pour les notes et la signature. Libellés de section précédés d'un triangle cuivré, grille élargie à 1320 px.

STORY : le visiteur lit qui parle et à quelles conditions, voit quatre faits vérifiables, puis parcourt les cinq étapes réelles, certifications rattachées au Master, et repart vers le contact.

FIRST VIEWPORT : à gauche, un panneau photo de 44 % qui court jusqu'au bord de la fenêtre, coin bas-droit arrondi, avec la devise manuscrite en haut et la carte citation vitrée en bas. À droite : le libellé « À PROPOS », le H1 « Qui suis-je ? » dont le « ? » est en cuivre, deux paragraphes, trois faits illustrés d'icônes, la citation signée et quatre cartes de chiffres.

FORM : maquette fournie par l'utilisateur (`.impeccable/mocks/about-comp.png`, 1024×1536), épinglée. Pas de tirage (une direction épinglée prime), donc pas de clé de seed. Construite dans le monde établi de la landing, mesurée par comp-diff.

FINISH : unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Contraintes épinglées

- Chiffres vérifiables, sur décision de l'utilisateur : 3+ années d'expérience (depuis 2023), 3 000+ utilisateurs servis, 2 certifications cloud, 3 langues.
- Certifications en pastilles sous le Master 2 (Terraform Associate, AWS Cloud Practitioner), sur décision de l'utilisateur.
- Les résumés du parcours vivent dans le frontmatter `summary` de `content/career/*/<locale>.mdx`, sourcés depuis le CV.
- « Toujours partant pour un bon café » devient « En dehors du code : basket, tennis, musculation » (centres d'intérêt du CV). La disponibilité devient « un CDI ou une mission ».

## Décisions ouvertes

- Deux images restent à fournir par l'utilisateur : `public/photos/about-portrait.webp` (le portrait bras croisés, environ 1200×1340) et `public/photos/about-desk.webp` (la nature morte du bureau, environ 1400×1100). Le code les prend dès qu'elles sont déposées ; d'ici là, le panneau affiche `portrait.webp` et la bande n'a pas de photo.
- Tranché le 2026-09-10 : le nom s'écrit « Manaud Calixte » partout (PRODUCT.md mis à jour).
- Tranché le 2026-09-10 : les libellés de section sont conservés par décision explicite du propriétaire (« Les garder »), en exception assumée à la règle du craft floor.
