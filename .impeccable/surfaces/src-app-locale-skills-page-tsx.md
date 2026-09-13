---
version: 1
slug: "src-app-locale-skills-page-tsx"
primary_target: "src/app/[locale]/skills/page.tsx"
related_targets: ["src/components/skills/SkillsHero.tsx","src/components/skills/SkillsDomains.tsx","src/components/skills/SkillsDetails.tsx","src/components/skills/StackExplorer.tsx","src/components/skills/NextStep.tsx"]
---

Portée : la page Compétences (`/competences` en français). L'en-tête et le pied de page sont hérités et restent inchangés, à la demande de l'utilisateur, comme pour À propos.
Mode visiteur : Persuade/Read. Le recruteur vient mesurer l'étendue et la réalité des compétences.

## Direction contract

THESIS : une vitrine des compétences qui refuse l'auto-évaluation chiffrée. Chaque domaine nomme ses outils réels, chaque langue son niveau sur l'échelle européenne, chaque certification son organisme et son année. Elle est construite sur la maquette du propriétaire.

OWN-WORLD : le monde établi de la landing, décliné surtout en sombre. Un hero sombre avec la photo fondue sur la droite, puis la bande claire des domaines (cartes sombres), puis une suite sombre #1E2023 : filtres en pastilles cuivre, tuiles d'outils aux couleurs de marque éclaircies pour le fond sombre, cartes de certification, segments CECR cuivre, soft skills, et l'appel à l'action sur #16181A. Be Vietnam Pro, Waiting for the Sunrise, et les tracés à la main partagés (couronne, flèche).

STORY : le visiteur voit l'étendue (6 domaines, 20 outils, 3+ ans). Il filtre les outils par catégorie, vérifie les certifications datées et les langues au niveau CECR, puis écrit.

FIRST VIEWPORT : une bande sombre. À gauche, le libellé « / COMPÉTENCES », le H1 sur deux lignes « Des compétences / au service de l'impact. » (« l'impact. » en cuivre), le chapeau et quatre faits à icône cerclée. À droite, la photo main au menton, fondue vers la gauche, la devise manuscrite avec sa couronne dessinée, et la carte citation vitrée signée en bas à droite.

FORM : maquette fournie par l'utilisateur (`.impeccable/mocks/skills-comp.png`, 1024×1536), épinglée. Il n'y a pas eu de tirage, car une direction épinglée prime ; donc pas de clé de seed. La page est construite dans le monde établi et mesurée par comp-diff.

FINISH : unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Contraintes épinglées

- Jauges de maîtrise remplacées par les outils réels de chaque domaine, sur décision du propriétaire.
- Stack de 20 outils, tous confirmés par le propriétaire (dont Helm, Nginx, PostgreSQL, MongoDB, Supabase, SonarQube).
- Années des certifications confirmées par le propriétaire : Terraform Associate 2024, AWS Cloud Practitioner 2023, Méthodes agiles 2023.
- Langues : échelle CECR à six segments au lieu des pourcentages. Pas de drapeaux, car la configuration i18n du projet les exclut (une langue n'est pas un pays).
- Appel à l'action reformulé selon le cadre de contact de PRODUCT.md : « Une opportunité en tête ? », sans « projet » ni point d'exclamation.
- Libellés de section conservés par décision explicite du propriétaire (2026-09-10), en exception assumée au craft floor. Le nom s'écrit « Manaud Calixte ».
- Le lien « Voir toutes » des certifications a été omis : il n'existe aucune destination.

## Décisions ouvertes

- Images à fournir par le propriétaire : `public/photos/skills-hero.webp` (environ 1400×1000, sujet à droite, fond sombre) et `public/photos/skills-desk.webp` (environ 1200×700). Le code les prend dès qu'elles sont déposées. D'ici là, le hero affiche `quotidien-2.webp` et l'appel à l'action n'a pas d'image.
