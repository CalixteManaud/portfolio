# À faire pour terminer le portfolio

État au 11 septembre 2026 : les 7 pages sont refaites (accueil, parcours, compétences,
projets, contact, mentions légales, confidentialité). Typecheck, Biome, tests unitaires,
i18n (399 clés) et contenu passent, et le build de production passe aussi.
Ce qui reste est listé ici dans l'ordre à suivre. Coche au fur et à mesure.

---

## 1. Git : enregistrer le travail (à faire en premier)

1. [ ] Créer une branche, parce que tu es sur `main` : `git switch -c feat/redesign`
2. [ ] Relire ce qui part : `git status`
3. [ ] Ajouter tout le travail : `git add -A`
4. [ ] Vérifier qu'aucune maquette n'est indexée. Elles contiennent ton téléphone et ton Gmail en pixels, et `.gitignore` les exclut désormais : `git ls-files .impeccable | grep -E "mocks|/diff/"` ne doit rien afficher.
5. [ ] Committer : `git commit -m "feat: refonte complète du portfolio à partir des maquettes"`
6. [ ] Pousser : `git push -u origin feat/redesign`
7. [ ] Ouvrir la Pull Request vers `main` sur GitHub, puis la fusionner quand la CI est verte.
8. [ ] Après le push, vérifier que https://github.com/CalixteManaud/portfolio répond. Le panneau CI de l'accueil et le lien « Code source » de la carte Portfolio en dépendent.

## 2. Images à déposer (le code les prend tout seul, sans modification)

Format WebP. Dès qu'un fichier existe, il remplace la photo de repli au prochain build.
Les prompts de génération, le cadrage et les tailles de chaque image sont dans
`docs/PROMPTS-IMAGES.md`.

9. [x] `public/photos/about-portrait.webp` : portrait bras croisés (hero de Parcours)
10. [x] `public/photos/about-desk.webp` : photo au bureau (bloc parcours)
11. [x] `public/photos/about-higher.webp` : photo « viser plus haut » (bloc valeurs)
12. [x] `public/photos/skills-hero.webp` : hero de Compétences
13. [x] `public/photos/skills-desk.webp` : appel à l'action de Compétences
14. [x] `public/photos/projects-hero.webp` : hero de Projets
15. [x] `public/photos/contact-hero.webp` : hero de Contact
16. [x] `public/photos/contact-marseille.webp` : carte de localisation
17. [ ] Captures de projets en 1600×1000 dans `public/projects/` :
    - [ ] `chatbot-ia.webp` : **une vraie capture de ton chatbot**. L'image déposée le 13 septembre était une illustration de banque d'images (« Hi! I am Looper ») ; elle est rangée dans `assets/plates/chatbot-ia-stock-image.webp` et n'est pas publiée.
    - [ ] `k8s-openstack.webp`
    - [ ] `pipeline-cicd-securite.webp`
    - [x] `rgt-city-cdm.webp` : vraie capture de https://cdm.rgtcity.fr/
    - [ ] `msfs-career.webp`
    - [ ] `salesforce-integration.webp`
    - [x] `portfolio-3d.webp` : déjà fait, c'est une vraie capture du site
18. [ ] `public/projects/chatbot-ia-feature.webp` : l'ordinateur à écran vert est prêt (`assets/plates/chatbot-ia-feature-greenscreen.webp`). Dès que la vraie capture du chatbot existe, j'incruste la capture dans l'écran et je publie la scène.
19. [ ] Optionnel : ta vraie signature en SVG. Aujourd'hui les citations sont signées avec une police manuscrite ; les relecteurs demandent un vrai tracé.
20. [ ] Dis-moi quand les images sont déposées : je crée leurs fichiers de provenance (`.webp.json`) et je revérifie les pages.

## 3. Informations que toi seul peux donner

21. [ ] L'organisme qui a délivré la certification « Méthodes agiles » (2023). Aujourd'hui la carte n'affiche aucun organisme.
22. [ ] Les liens des 6 projets (dépôt, documentation, démo) à mettre dans `content/projects/<slug>/meta.json`, champ `links`. Sans lien, la carte n'affiche que « Voir le projet ».
23. [ ] RGT CITY CDM : la fiche du projet parle d'un tournoi **FIFA 25**, mais le site en ligne affiche « Le Mondial FIFA 26 ». Lequel est juste ?
23 bis. [ ] Valider le texte des cartes Merlio et Twintable de l'accueil. Il vient du CV et doit être confirmé.
24. [ ] Mentions légales : la LCEN demande aussi le **numéro de téléphone de l'hébergeur**. Récupère celui de Vercel sur leur page légale officielle et donne-le-moi, je l'ajoute. Je ne l'ai pas inventé.

## 4. Services et variables d'environnement

Ton `.env` local contient déjà Resend, Turnstile et GitHub. Le reste :

25. [ ] **Resend** : vérifier le domaine `devcorporation.fr` (enregistrements DNS SPF et DKIM fournis par Resend), sinon aucun mail ne partira depuis `contact@devcorporation.fr`.
26. [ ] **Cloudflare Turnstile** : ajouter `portfolio.devcorporation.fr` aux domaines autorisés du widget.
27. [ ] **Sentry** : créer le projet et remplir `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`. Ils sont vides aujourd'hui. Si tu renonces à Sentry, dis-le-moi : je retire la ligne Sentry de la politique de confidentialité.
28. [ ] **PostHog** : laisser vide. Si tu l'actives un jour, la politique de confidentialité devra le mentionner.
29. [ ] En production : `NEXT_PUBLIC_SITE_URL=https://portfolio.devcorporation.fr`

## 5. Déploiement sur Vercel

30. [ ] Importer le dépôt GitHub dans Vercel (framework Next.js, gestionnaire pnpm).
31. [ ] Copier toutes les variables de la section 4 dans Vercel, pour la Production et les Previews.
32. [ ] Ajouter le domaine `portfolio.devcorporation.fr` dans Vercel.
33. [ ] Chez ton registrar, créer l'enregistrement DNS `portfolio` de type CNAME vers `cname.vercel-dns.com`.
34. [ ] Attendre le certificat HTTPS, puis ouvrir le site.

## 6. Vérifications avant d'annoncer le site

35. [ ] En local, tout d'un coup : `pnpm typecheck && pnpm lint && pnpm test && pnpm i18n:check && pnpm content:check && pnpm build`
36. [ ] Tests de bout en bout : `pnpm test:e2e`. Les 4 passent au 11 septembre : j'ai forcé la locale française dans `playwright.config.ts` et corrigé les sélecteurs du formulaire. À relancer juste avant la mise en ligne.
37. [ ] Envoyer un vrai message depuis le formulaire en production, et vérifier qu'il arrive dans ta boîte.
38. [ ] Parcourir le site dans les 4 langues (FR, EN, ES, DE), en thème clair et en thème sombre, sur mobile et sur ordinateur.
39. [ ] Lancer Lighthouse (Chrome DevTools, onglet Lighthouse) sur l'accueil et le contact. L'objectif est ≥ 95 dans les 4 catégories.

## 7. Suite du design (à faire avec moi)

40. [ ] Relancer les revues finales de Projets, Contact et Compétences. Elles ont été coupées par la limite de dépense ; toutes les corrections sont déjà appliquées.
41. [ ] Faire relire les nouvelles pages Mentions et Confidentialité.
42. [ ] Réécrire `DESIGN.md`, qui décrit encore l'ancienne direction « L'Établi ».
43. [ ] Refaire les pages détail des projets (`/projets/<slug>`). Elles fonctionnent mais n'ont pas été mises en scène : aucune maquette ne les couvrait.
44. [x] Composants shadcn inutilisés supprimés le 13 septembre : `aspect-ratio`, `avatar`, `badge`, `field`, `input`, `item`, `label`, `textarea`.
