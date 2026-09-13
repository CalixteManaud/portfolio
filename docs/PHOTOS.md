# Photos de la landing

Toutes les photos vont dans `public/photos/`. Les noms sont référencés tels quels
par le code : un fichier renommé est une image qui disparaît de la page.

| Fichier | Format | Utilisé par | Ce qu'on y voit |
|---|---|---|---|
| `portrait.webp` | 1200 × 1500, 4:5 | source du détourage `public/landing/hero-portrait.png` | Portrait buste, regard caméra. |
| `quotidien-1.webp` | 1200 × 1090, ~1,1:1 | carte « Développement » | Assis au bureau, sur un ordinateur portable. |
| `quotidien-2.webp` | 1200 × 1090 | carte « Analyse » | Main au menton, regard vers l'écran. |
| `quotidien-3.webp` | 1200 × 1090 | carte « Partage » | Au tableau blanc, schéma d'architecture cloud. |
| `quotidien-4.webp` | 1200 × 1090 | carte « Focus » | Vue par-dessus l'épaule, écran de code. |

Le carrousel « Mon quotidien » (`src/components/landing/DailySection.tsx`) recadre
chaque photo au ratio 11:10 avec `object-fit: cover` : garder le sujet au centre.

## Remplacer une photo

1. Même nom, même ratio, **WebP qualité 82**, moins de 250 Ko :

   ```bash
   ffmpeg -i source.jpg -vf "scale=1200:1090:force_original_aspect_ratio=increase,crop=1200:1090" -q:v 82 quotidien-1.webp
   ```

   Le `crop` après le `scale` garantit le ratio exact.

2. Inscrire son origine dans le fichier. Chaque image servie porte sa
   provenance :

   ```bash
   impeccable embed-prompt public/photos/quotidien-1.webp --prompt "origin: …"
   ```

## Changer le portrait du hero

Le hero n'affiche pas `portrait.webp` directement, mais sa version détourée
`public/landing/hero-portrait.png` (fond transparent, recadrée au ratio 1200 × 1021).
Un nouveau portrait doit donc être détouré à nouveau, par exemple avec `rembg` et
le modèle `isnet-general-use` avec alpha matting, puis recadré tête en haut,
coupé à mi-buste.

## Direction

Lumière de bureau chaude et latérale, fonds clairs et neutres, même tenue et même
lieu sur toute la série : c'est ce qui fait une série plutôt qu'un assemblage.
Pour une image générée, vérifiez les mains et les montures de lunettes, les deux
endroits où le rendu se trahit le plus souvent.
