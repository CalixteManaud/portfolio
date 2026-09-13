# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Visiteur prioritaire : recruteur tech, CTO ou lead engineer en phase de recrutement salarié.**
Il arrive depuis LinkedIn, un CV ou un lien envoyé en candidature, souvent entre deux entretiens, parfois sur mobile.
Il dispose de quelques minutes et fait un seul travail : décider si ce profil vaut un entretien.
Ce qu'il cherche dans cet ordre — niveau technique réel, fiabilité/sérieux, fit avec son équipe.

Audiences secondaires, jamais prioritaires sur les arbitrages : pairs développeurs/DevOps (crédibilité entre pairs),
clients potentiels de missions freelance.

## Product Purpose

Portfolio personnel de **Manaud Calixte** — DevOps / DevSecOps / développeur web.
Il existe pour convertir une consultation de quelques minutes en prise de contact de recrutement.

Le parti pris fondateur : le site ne **liste** pas des compétences, il les **prouve**.
Chaque élément signature est une démonstration exécutable (scène 3D, terminal jouable, dashboard GitHub live,
pipeline CI/CD animé, en-têtes de sécurité, Dockerfile, CI GitHub Actions).

**Succès** = un message qualifié arrive dans la boîte mail via le formulaire de contact, ou un recruteur ouvre le GitHub
depuis le site. **Échec** = le visiteur repart en ayant vu un joli site sans pouvoir juger du niveau technique.

## Positioning

**Dev web et Ops dans la même tête.**
Le différenciateur revendiqué n'est ni la 3D ni le DevOps pris isolément, mais leur réunion chez une seule personne :
quelqu'un qui construit l'interface *et* la plateforme qui la fait tourner.

Le portfolio est la preuve de cette réunion — un profil purement ops ne pourrait pas produire cette exécution front,
un profil purement front ne pourrait pas produire la chaîne CI/CD, la sécurité et le conteneur qui l'accompagnent.
C'est ce qu'un portfolio voisin ne peut pas copier honnêtement.

## Operating Context

- Consulté **avant ou pendant un process de recrutement**, à côté du CV, de LinkedIn et du GitHub — le site doit
  compléter ces surfaces, pas les répéter.
- Situation actuelle du propriétaire : **recherche active de CDI**. La disponibilité est un fait affichable et le
  chemin vers le contact doit rester court depuis n'importe quelle page.
- Ancrage géographique : **Marseille**, bassins visés **Paris** et **Aix-Marseille**, en remote comme en présentiel.
  La géographie n'est pas un obstacle, mais elle doit être lisible : un recruteur trie dessus.
- Multilingue **fr (défaut) / en / es / de** — un recruteur non francophone doit trouver son entrée sans friction.
- Contenu éditorial versionné en MDX dans `content/` (projets, parcours, rencontres, pages légales) : le dépôt Git
  est la source de vérité, la publication est un commit.
- Le formulaire de contact envoie directement un email (Resend) ; la promesse affichée est une **réponse sous 48 h**.

## Capabilities and Constraints

**Fonctionnel confirmé**
- Sections : Hero, Parcours (timeline), Projets (grille filtrable + pages détail), Rencontres, Contact, pages légales.
- Démonstrations DevOps : terminal interactif, dashboard GitHub live (revalidation horaire), pipeline CI/CD 3D.
- Contact : Server Action validée Zod + Turnstile + rate-limit in-memory, envoi Resend, fallback log Sentry.
- SEO : sitemap et RSS générés depuis `content/`, OG images dynamiques, JSON-LD, hreflang sur les 4 locales.

**Contraintes techniques durables**
- 100 % statique côté backend : **aucune base de données, aucune authentification, aucun compte utilisateur**.
  Réintroduire l'un des trois est une décision d'architecture à valider explicitement.
- Aucune dépendance runtime payante critique hors Resend.
- Budgets de qualité : Lighthouse ≥ 95 sur les 4 catégories, chargement initial < 2 s hors 3D lazy-loadée,
  animations 60 fps sur mobile moyen de gamme, < 200 KB de JS initial, modèles 3D ≤ 2 MB compressés Draco.
- Déploiement Vercel, avec Dockerfile prêt pour une alternative auto-hébergée.
- Domaine de production : `portfolio.devcorporation.fr`.

**Explicitement indécis — à ne pas inventer**
- La liste réelle des projets à publier : `content/projects/` n'en contient qu'un, le portfolio lui-même.
- Le contenu de `content/meetings/` : la section existe, aucune rencontre n'est écrite.
- Les mois exacts de début et de fin des deux formations : le CV ne donne que les années, et les dates actuelles
  supposent une rentrée en septembre.

## Brand Commitments

- Nom public : **Manaud Calixte**, nom puis prénom, comme le logo et les maquettes (décision du propriétaire, 2026-09-10). GitHub : `CalixteManaud`. Domaine : `portfolio.devcorporation.fr`.
  Le handle « Warthoz » n'est plus employé publiquement ; aucun pseudo ne le remplace à ce jour.
- **Voix** : technique, concise, affirmative. Première personne du singulier pour l'auteur,
  **vouvoiement du visiteur**. Le site s'adresse d'abord à un recruteur ou un CTO qui ne connaît pas
  encore Calixte : en France, le tutoiement d'un inconnu dans un échange professionnel se paie plus
  cher qu'il ne rapporte. Le ton reste direct, seul le registre d'adresse change.
  Pas de superlatifs, pas de jargon marketing, pas de points d'exclamation, pas de métriques décoratives.
- **Cadre de la prise de contact** : ni « projet » ni « poste ». Le site vise en priorité le recrutement
  salarié mais reste ouvert aux missions ; la copy nomme donc l'échange, pas sa nature, pour ne pas
  mettre hors-cible la moitié des visiteurs au moment exact où ils décident d'écrire.
- **Recours de contact** : chaque message d'échec du formulaire donne `contact@devcorporation.fr`. Un
  formulaire cassé sans adresse de repli est une conversation perdue.
- Le français est la langue de rédaction d'origine ; les autres locales sont des traductions, pas des variantes.
- Aucun texte visible en dur dans les composants : tout passe par next-intl ou par le MDX.

## Evidence on Hand

**Preuves réelles disponibles** (source : CV, septembre 2026)
- **Repos GitHub publics** — exploitables tels quels : dashboard live, liens de code sur les projets, activité récente.
- **Certifications** — Terraform Associate (HashiCorp), AWS Cloud Practitioner (Amazon), Méthodes agiles.
- **Diplômes** — Master 2 Expert DevOps, YNOV Aix Campus (2023-2025) ; licence professionnelle Big Data et commerce
  électronique, IUT Aix-Marseille (2022-2023).
- **Expériences** — consultant technique Salesforce chez **Isochronix by TVH Consulting** (2023-2024) ; développeur et
  consultant DevOps en freelance (depuis 2025), dont des sites à plus de 3 000 utilisateurs ; fondateur de **Merlio**
  et co-fondateur de **Twintable** (depuis 2026). Ces trois employeurs ou entités sont nommables publiquement.
- **Langues** — français langue maternelle, anglais B2, créole haïtien B2.
- **Le site lui-même** — code, CI, Dockerfile, en-têtes de sécurité : la démonstration la plus directe du positionnement.

**Absences à ne jamais combler par de la fiction**
- Aucun projet réel publié hors le portfolio lui-même : `content/projects/` contient une seule entrée.
- Aucune rencontre écrite : `content/meetings/` est vide.
- Aucun témoignage, aucune étude de cas chiffrée, aucune métrique d'audience ou de performance business, à la seule
  exception des « plus de 3 000 utilisateurs » que le CV revendique.
- Aucune certification Kubernetes ni sécurité (CKA, CKS, OSCP…) : celles listées ci-dessus sont les seules.
- Les coordonnées personnelles du CV — numéro de téléphone et adresse Gmail — ne sont **pas** publiables sur le site.
  L'adresse publique est `contact@devcorporation.fr`.

## Product Principles

1. **Prouver plutôt qu'affirmer.** Toute compétence revendiquée doit avoir sur le site un artefact qui la démontre.
   Une affirmation sans preuve exécutable est une dette, pas un contenu.
2. **Le recruteur pressé d'abord.** Le jugement « ça vaut un entretien » doit pouvoir se former en moins de deux minutes,
   sans scroll obligatoire jusqu'au bas de page et sans attendre le chargement de la 3D.
3. **Zéro fiction.** Pas de faux clients, de fausses métriques, de faux témoignages ni de certifications non obtenues.
   Un contenu manquant se laisse vide ou se retire — il ne se remplit pas.
4. **La démonstration ne coûte pas la performance.** Une preuve technique qui casse les budgets perf, l'accessibilité
   ou `prefers-reduced-motion` cesse d'être une preuve : elle devient un contre-argument.
5. **Le contenu vit dans Git.** Ajouter un projet, une étape ou une rencontre est un commit MDX, jamais une modification
   de composant.

## Accessibility & Inclusion

- Objectif engagé : **WCAG 2.1 AA**.
- `prefers-reduced-motion` désactive 3D, GSAP et Framer Motion, avec un fallback statique équivalent.
- Navigation clavier complète, skip link, focus visible, ordre de tabulation logique.
- Toute scène 3D dispose d'une alternative textuelle accessible aux lecteurs d'écran.
- Formulaire : labels associés, erreurs annoncées via `aria-describedby`, messages localisés dans les 4 langues.
- Les 4 locales incluent des caractères latins étendus (ä, ö, ü, é, è, ç, ñ) — le sous-ensemble de police doit les couvrir.
