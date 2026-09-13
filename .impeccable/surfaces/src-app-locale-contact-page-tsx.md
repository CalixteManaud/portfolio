---
version: 1
slug: "src-app-locale-contact-page-tsx"
primary_target: "src/app/[locale]/contact/page.tsx"
related_targets: ["src/components/contact/ContactHero.tsx","src/components/contact/ContactInfo.tsx","src/components/contact/ContactExtras.tsx","src/components/contact/CopyButton.tsx","src/components/sections/ContactForm.tsx","src/actions/contact.ts"]
---

Portée : la page Contact (`/contact`). L'en-tête et le pied de page sont hérités et restent inchangés, à la demande du propriétaire.
Mode visiteur : Persuade. Le visiteur a décidé d'écrire, ou hésite encore : la page doit rassurer et rendre l'envoi simple.

## Direction contract

THESIS : une page de contact qui rassure et convertit sans rien promettre de faux. Le délai affiché est tenu (48 h), seules les coordonnées publiques apparaissent, le formulaire est protégé, et la FAQ repose sur des faits.

OWN-WORLD : le monde établi. Un hero sombre avec la photo fondue. En dessous, deux cartes claires. La première contient le formulaire : champs à icône, sujet en liste, bouton cuivre pleine largeur. La seconde donne les coordonnées : chaque ligne a sa pastille cuivrée et son bouton copier, et un bloc sombre indique la disponibilité. Suivent quatre cartes d'intention, puis la localisation et la FAQ en cartes sombres, la FAQ en accordéon.

STORY : le visiteur comprend qu'il peut écrire pour un CDI, une mission ou une simple question. Il choisit son canal (formulaire ou coordonnées) et trouve les réponses sur la disponibilité et le délai.

FIRST VIEWPORT : une bande sombre. À gauche, le libellé « / CONTACT », le H1 « Échangeons sur / votre besoin. » (« besoin. » en cuivre), le chapeau et trois engagements : réponse sous 48 h, échange sans engagement, café virtuel. À droite, la photo fondue, la devise manuscrite « Discuter Planifier Construire Avancer » et la citation vitrée signée.

FORM : maquette fournie par le propriétaire (`.impeccable/mocks/contact-comp.png`, 1024×1536), épinglée. Pas de tirage : une direction épinglée prime, donc pas de clé de seed. Mesure par comp-diff.

FINISH : unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Contraintes épinglées

- Sur demande du propriétaire, le numéro de téléphone est retiré (PRODUCT.md le réserve également). L'email devient `contact@devcorporation.fr` et le site `portfolio.devcorporation.fr`.
- Copie ajustée au cadre de contact de PRODUCT.md : « votre projet » devient « votre besoin ». « En général beaucoup plus vite ! » devient « Jours ouvrés compris. ». Émojis et points d'exclamation sont retirés. « à l'international » est retiré, car non attesté.
- « Voir toutes les réponses » est omis (aucune destination) ; « Télécharger mon CV » est hors périmètre (barre de navigation).
- Le champ Entreprise s'appelle `organization`, pour ne pas se confondre avec le honeypot `company`. Le consentement RGPD et Turnstile sont conservés, car ce sont des exigences du projet.
- Les libellés de section sont conservés sur décision explicite du propriétaire (exception au craft floor). Le nom s'écrit « Manaud Calixte ».

## Décisions ouvertes

- Images à fournir par le propriétaire : `public/photos/contact-hero.webp` (le hero ; en attendant, `quotidien-3.webp`) et `public/photos/contact-marseille.webp` (la carte de localisation ; en attendant, une trame de points).
