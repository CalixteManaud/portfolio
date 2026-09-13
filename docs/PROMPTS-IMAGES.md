# Prompts pour les images du portfolio

Chaque image ci-dessous remplace automatiquement une photo de repli dès que le fichier
existe, au bon nom et au bon endroit. Aucun code n'est à toucher.

## Mode d'emploi

1. Dans ChatGPT (ou ton générateur habituel), **joins tes photos de référence** à chaque
   prompt de portrait, pour garder ton visage d'une image à l'autre :
   `public/photos/portrait.webp` et `public/photos/quotidien-1.webp` à `quotidien-4.webp`.
2. Colle d'abord le **bloc commun**, puis le prompt de l'image.
3. Pas de texte incrusté dans l'image : la devise manuscrite, les citations et la
   signature sont dessinées par le site, par-dessus la photo. Un texte généré serait en
   double, et souvent déformé.
4. Enregistre au nom exact indiqué. Si l'outil sort du PNG, garde le même nom en `.png` et
   dis-le-moi : je convertis en WebP et j'ajoute le fichier de provenance.
5. Les **captures de projets** et la **signature** ne se génèrent pas : ce sont de vraies
   images (voir en bas). Une fausse interface serait une fiction sur le site.

---

## Bloc commun (à coller avant chaque portrait)

```
Photographie réaliste, pas une illustration. La personne est celle des photos de
référence jointes : même visage, même coupe de cheveux courte, même barbe taillée,
mêmes lunettes à fine monture. Tenue identique sur toutes les images : surchemise ou
veste sombre anthracite, t-shirt blanc uni. Décor : bureau ou atelier tech le soir,
plantes vertes, lampe à la lumière chaude tungstène, arrière-plan flou (bokeh).
Étalonnage : ombres profondes gris anthracite presque noir (#1E2023), reflets chauds
cuivrés (#C4875C), peau naturelle, contraste doux. Objectif 50 mm, faible profondeur
de champ. Aucun texte, aucun logo, aucun filigrane dans l'image. Mains naturelles,
cinq doigts.
```

---

## 1. Parcours : portrait bras croisés

- **Fichier** : `public/photos/about-portrait.webp`
- **Format** : vertical, 1200 × 1400 px
- **Où** : grand panneau gauche du haut de la page Parcours. Le site ajoute la devise
  manuscrite en haut à gauche et une carte citation en bas à gauche.

```
Portrait vertical à mi-corps, face caméra, bras croisés, léger sourire confiant.
Le sujet est centré, légèrement décalé à droite, le visage dans le tiers supérieur de
l'image. Laisse de l'espace calme et sombre en haut à gauche et en bas à gauche : du
texte sera posé dessus. Arrière-plan : bureau le soir, plantes, étagère floue, lampe
chaude sur le côté.
```

## 2. Parcours : bureau (bloc « Mon parcours »)

- **Fichier** : `public/photos/about-desk.webp`
- **Format** : paysage, 1400 × 1000 px
- **Où** : coin bas-droit de la bande sombre du parcours. L'image est fondue depuis ce
  coin : seul le bas-droit reste bien visible.

```
Nature morte de bureau, sans personne, le soir, sur fond très sombre. Tout l'intérêt
est concentré dans le quart inférieur droit de l'image : un ordinateur portable
entrouvert vu de biais, une pile de livres techniques, une plante en pot, une tasse
noire mate. Le reste de l'image (haut et gauche) est presque noir, uni, sans détail.
Lumière chaude rasante venant de la droite. Aucun texte lisible sur les objets.
```

## 3. Parcours : « Toujours plus haut » (bloc valeurs)

- **Fichier** : `public/photos/about-higher.webp`
- **Format** : paysage, 1200 × 700 px
- **Où** : haut de la carte sombre « Toujours plus haut », fondu vers le bas.

```
Paysage de montagne au crépuscule : sommets découpés, forêt de sapins dans la brume,
dernières lueurs chaudes cuivrées derrière les crêtes, ciel sombre. Ambiance calme et
ambitieuse. La moitié basse de l'image est plus sombre et plus simple : elle sera
fondue dans une carte gris anthracite (#1E2023). Aucune personne, aucun texte.
```

## 4. Compétences : main au menton

- **Fichier** : `public/photos/skills-hero.webp`
- **Format** : paysage, 1600 × 1000 px
- **Où** : moitié droite du bandeau sombre en haut de Compétences, fondue vers la gauche
  sous le texte. Sur mobile, l'image est recadrée en **carré centré**.

```
Plan poitrine, le sujet assis devant son ordinateur portable, la main sous le menton,
regard concentré vers l'écran, expression réfléchie. Le visage se trouve vers 60 % de
la largeur et 30 % de la hauteur : il doit rester entier dans un recadrage carré centré.
Le tiers gauche de l'image est sombre et peu chargé (le texte du site passe dessus), et
le coin bas-droit reste calme (une carte citation s'y pose). Lumière chaude de l'écran
et d'une lampe, fond de bureau flou.
```

## 5. Compétences : bureau (appel à l'action « Une opportunité en tête ? »)

- **Fichier** : `public/photos/skills-desk.webp`
- **Format** : paysage, 1200 × 700 px
- **Où** : moitié gauche de la bande sombre du bas de Compétences, fondue vers la droite.

```
Nature morte de bureau le soir, sans personne, fond très sombre. De gauche au centre :
une pile de livres, une plante en pot, une tasse noire mate, le bord d'un ordinateur
portable ouvert. La moitié droite de l'image s'assombrit jusqu'au presque noir. Lumière
chaude douce venant de la gauche. Aucun texte lisible sur les objets.
```

## 6. Projets : au travail sur le portable

- **Fichier** : `public/photos/projects-hero.webp`
- **Format** : paysage, 1600 × 1000 px
- **Où** : moitié droite du bandeau sombre en haut de Projets, fondue vers la gauche.
  Recadrage carré centré sur mobile.

```
Plan poitrine, le sujet assis, en train de travailler sur son ordinateur portable,
regard baissé vers l'écran, léger sourire. Une tasse noire mate posée sur le bureau à
gauche. Visage vers 60 % de la largeur et 30 % de la hauteur, entier dans un recadrage
carré centré. Tiers gauche sombre et peu chargé, coin bas-droit calme. À l'arrière-plan,
flou : un tableau blanc au mur, des plantes, une lampe chaude.
```

## 7. Contact : sourire face caméra

- **Fichier** : `public/photos/contact-hero.webp`
- **Format** : paysage, 1600 × 1000 px
- **Où** : moitié droite du bandeau sombre en haut de Contact, fondue vers la gauche.
  Recadrage carré centré sur mobile.

```
Plan poitrine, le sujet assis derrière un ordinateur portable ouvert, il regarde
l'objectif avec un sourire ouvert et accueillant, posture détendue, comme au début d'un
appel. Visage vers 60 % de la largeur et 30 % de la hauteur, entier dans un recadrage
carré centré. Tiers gauche sombre et peu chargé, coin bas-droit calme. Arrière-plan
flou : un cadre au mur, des plantes, une lampe chaude.
```

## 8. Contact : Marseille de nuit

- **Fichier** : `public/photos/contact-marseille.webp`
- **Format** : paysage, 1400 × 900 px
- **Où** : moitié droite de la carte « Basé à Marseille », fondue vers la gauche.
- **Conseil** : une **vraie photo** est préférable, puisque c'est un lieu réel : la tienne,
  ou une photo libre de droits (Unsplash, Pexels) dont tu gardes la licence. Sinon :

```
Photographie de nuit de Marseille : la basilique Notre-Dame de la Garde illuminée sur
sa colline, dominant le Vieux-Port, lumières de la ville et reflets dans l'eau, bateaux
au premier plan. Ciel bleu nuit profond. Le sujet principal occupe les deux tiers
droits de l'image, le tiers gauche est plus sombre et plus simple. Réaliste, pas de
personnes identifiables, aucun texte.
```

## 9. Projet phare : ordinateur portable détouré

- **Fichier** : `public/projects/chatbot-ia-feature.webp`
- **Format** : 1600 × 1000 px, **fond transparent**
- **Où** : au centre de la bande « Projet phare ». Il déborde sous la bande, comme sur
  la maquette.
- **Important** : ne laisse pas l'outil inventer l'interface du chatbot. Génère l'écran
  en vert uni. J'y incruste ensuite la vraie capture `chatbot-ia.webp`, en perspective.

```
Un ordinateur portable moderne gris anthracite, ouvert, vu de face en léger trois-quarts
depuis la gauche, légèrement en plongée. L'écran est entièrement d'un vert uni
#00FF00, sans aucun reflet ni interface. Arrière-plan totalement transparent (PNG avec
canal alpha), sans sol ni décor, avec seulement une ombre de contact douce sous
l'appareil. Rendu photoréaliste, éclairage de studio doux et chaud. Aucun logo sur le
capot ni sur le clavier.
```

---

## Ce qui ne se génère pas

### Captures des projets (vraies captures, 1600 × 1000 px)

Dans `public/projects/`, au nom exact du projet :

| Fichier | Quoi capturer |
|---|---|
| `chatbot-ia.webp` | L'interface du chatbot avec une conversation d'exemple, sans donnée personnelle |
| `k8s-openstack.webp` | Grafana ou k9s sur le cluster, ou le schéma d'architecture du dépôt |
| `pipeline-cicd-securite.webp` | La vue d'un pipeline GitLab qui passe (build, tests, SAST, Trivy, Docker Scout) |
| `rgt-city-cdm.webp` | La page d'accueil ou le tableau du tournoi |
| `msfs-career.webp` | La carte avec un vol et la météo |
| `salesforce-integration.webp` | Attention, projet client : pas de capture de leur environnement. Un schéma de ton pipeline de déploiement convient, sinon la carte garde « Capture à venir ». |

Plus simple : donne-moi l'URL de chaque projet en ligne (ou lance-le en local), et je fais
les captures au bon format avec Playwright, comme pour la carte Portfolio 3D.

### Signature

Ne pas la générer : c'est ta signature. Signe 4 ou 5 fois au feutre noir sur une feuille
blanche, prends la meilleure en photo bien à plat et à la lumière du jour, et dépose-la
dans `docs/references/signature.jpg`. Je la vectorise en SVG, comme le logo, et elle
remplace la police manuscrite sous les citations.
