---
version: 1
slug: "src-app-locale-page-tsx"
primary_target: "src/app/[locale]/page.tsx"
related_targets: ["src/components/shared/Header.tsx","src/components/shared/Footer.tsx"]
---

Portée : la landing (`/`) et, par partage, l'en-tête et le pied de page. Les autres pages suivent dans une seconde passe, dans le même langage.
Mode visiteur : Persuade. Recruteur ou CTO, deux minutes, souvent depuis LinkedIn ; il décide si ce profil vaut un entretien.

## Direction contract

THESIS : une landing de recrutement qui prouve au lieu d'affirmer, dans la grammaire exacte de la maquette validée par l'utilisateur. D'abord un hero portrait avec le monogramme en relief, puis des sections denses et régulières. Elle refuse la fiction que contenait la maquette : chiffres décoratifs, projets inventés, fausses dates, statuts de CI et de prod simulés. Toute mesure affichée est lue à sa source.

OWN-WORLD : fond crème #F6F1EA, encre #17171B, et comme seul signal le cuivre du logo (#A4653E en aplat, #8F5431 en texte). Des cartes sombres #1E2023 portent l'expertise, le projet phare et la bande de preuve ; des cartes claires #FDFBF8, à ombre douce, portent le reste. Be Vietnam Pro en 700 et 400, JetBrains Mono pour la donnée, Waiting for the Sunrise pour deux annotations manuscrites. Des kickers « / SECTION » en cuivre, et des trames de points dans les marges.

STORY : en un écran, le visiteur sait qui parle, quel métier, où et à quelles conditions. Il parcourt ensuite les domaines, les outils, le quotidien en photo, le parcours réel et les projets réels. La bande sombre prouve par le code : terminal jouable, activité GitHub réelle, CI et production interrogées en direct. Il écrit.

FIRST VIEWPORT : une barre avec le monogramme et le nom, une navigation à cinq entrées soulignée de cuivre et le CTA « Discutons ». À gauche, une colonne de 520 px : badge de disponibilité, H1 de 48 px sur trois lignes dont « plus grandes. » en cuivre, chapeau, CTA cuivre et bouton secondaire, trois faits vérifiables, réseaux. À droite : le MC extrudé en WebGL qui suit le pointeur, le portrait détouré devant lui, l'annotation manuscrite, la carte d'identité sombre en haut à droite et la carte de localisation en bas. Action principale : « Discutons ensemble ».

FORM : maquette fournie par l'utilisateur (`.impeccable/mocks/landing-comp.png`), épinglée. Il n'y a pas eu de tirage, car une direction épinglée prime sur le tirage, et donc pas de clé de seed. Build comp-led, spec de 112 régions (`.impeccable/build/spec.json`).

FINISH : unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Contraintes épinglées

- La maquette fixe la structure, les faits viennent de `content/` et de PRODUCT.md. Écarts de copie assumés : disponibilité « CDI ou mission », CTA sans « projet », email `contact@devcorporation.fr`, parcours tiré du dépôt, faits vérifiables à la place des chiffres « 3+ / 12 / 100 % ».
- Projets : le portfolio, puis Merlio et Twintable, avec les seuls faits du CV.
- 3D : monogramme extrudé depuis les contours vectorisés du logo (`src/components/3d/models/monogramShapes.ts`).
- Photos : `public/photos/quotidien-1..4.webp`, régénérées par l'utilisateur au cadrage de la maquette. Le verrou des plaques est resté ouvert à cause d'un défaut de l'outil : ses découpes de référence sont des aplats (voir la note dans state.json).
- La bande de preuve n'affiche que du mesuré : compteurs et calendrier GitHub, dernier run CI (neutre tant que le dépôt n'est pas poussé), HEAD sur le domaine.
- Les kickers « / SECTION » au-dessus des titres sont conservés par décision explicite du propriétaire (2026-09-10) : « Les garder ». C'est une exception assumée à la règle du craft floor qui les proscrit, car ses trois maquettes les demandent.
- Le nom s'écrit « Manaud Calixte », nom puis prénom, partout (décision du propriétaire, 2026-09-10, reportée dans PRODUCT.md).

## Décisions ouvertes

- Le dépôt `CalixteManaud/portfolio` n'est pas encore poussé. Le lien « code source » et le panneau CI s'allumeront après le push.
- Les descriptions de Merlio et Twintable restent à valider par l'utilisateur.
