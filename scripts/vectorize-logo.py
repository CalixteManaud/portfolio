"""Vectorise public/logo-mark.png (usage : python scripts/vectorize-logo.py <sortie.ts> <aperçu.png> ; dépendances : opencv-python-headless, pillow, numpy)
 en contours pour l'extrusion Three.js.

- corps : tout ce qui est encre (noir OU cuivre) → M et C pleins, sans les
  trous que laisserait la piste cuivre ;
- cuivre : la piste de circuit et le « </> », extrudés à part, en saillie.

Coordonnées normalisées : origine au centre de la boîte englobante du corps,
hauteur = 1, y vers le haut (convention Three.js).
"""
import json
import sys

import cv2
import numpy as np
from PIL import Image

SRC = r"E:\Perso\portofolio\public\logo-mark.png"
OUT_TS = sys.argv[1]
PREVIEW = sys.argv[2]

im = np.asarray(Image.open(SRC).convert("RGBA")).astype(np.int16)
r, g, b, a = im[..., 0], im[..., 1], im[..., 2], im[..., 3]
opaque = a > 128
sat = im[..., :3].max(-1) - im[..., :3].min(-1)
dark = opaque & (im[..., :3].max(-1) < 120) & (sat < 45)
copper = opaque & (r - b > 45) & (r > 110)

body = ((dark | copper) * 255).astype(np.uint8)
body = cv2.morphologyEx(body, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
cop = (copper * 255).astype(np.uint8)
cop = cv2.morphologyEx(cop, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))

ys, xs = np.where(body > 0)
cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
H = float(ys.max() - ys.min())


def shapes(mask, eps, min_area):
    cnts, hier = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    if hier is None:
        return []
    hier = hier[0]
    out = []
    for i, c in enumerate(cnts):
        if hier[i][3] != -1 or cv2.contourArea(c) < min_area:
            continue  # trous traités avec leur parent
        def norm(poly):
            p = cv2.approxPolyDP(poly, eps, True).reshape(-1, 2).astype(float)
            flat = []
            for x, y in p:
                flat += [round((x - cx) / H, 4), round(-(y - cy) / H, 4)]
            return flat
        holes = []
        j = hier[i][2]
        while j != -1:
            if cv2.contourArea(cnts[j]) >= min_area / 4:
                holes.append(norm(cnts[j]))
            j = hier[j][0]
        out.append({"outer": norm(c), "holes": holes})
    return out


body_shapes = shapes(body, 0.45, 400)
copper_shapes = shapes(cop, 0.45, 60)

ts = (
    "/* Généré par vectorize_logo.py depuis public/logo-mark.png — ne pas éditer à la main.\n"
    "   Contours normalisés : hauteur 1, origine au centre, y vers le haut. */\n\n"
    "export type FlatShape = { outer: number[]; holes: number[][] };\n\n"
    f"export const MONOGRAM_ASPECT = {round(float(xs.max() - xs.min()) / H, 4)};\n\n"
    f"export const MONOGRAM_BODY: FlatShape[] = {json.dumps(body_shapes, separators=(',', ':'))};\n\n"
    f"export const MONOGRAM_COPPER: FlatShape[] = {json.dumps(copper_shapes, separators=(',', ':'))};\n"
)
open(OUT_TS, "w", encoding="utf-8").write(ts)

# Aperçu de contrôle : les contours redessinés, pour vérifier à l'œil.
W2, H2 = 1070, 510
prev = np.full((H2, W2, 3), 245, np.uint8)
def draw(shs, color):
    for s in shs:
        for poly in [s["outer"]] + s["holes"]:
            pts = np.array([[x * H + cx, -y * H + cy] for x, y in zip(poly[0::2], poly[1::2])], np.int32)
            cv2.polylines(prev, [pts], True, color, 2)
draw(body_shapes, (30, 30, 30))
draw(copper_shapes, (60, 120, 200))
cv2.imwrite(PREVIEW, prev)
pts = sum(len(s["outer"]) // 2 + sum(len(h) // 2 for h in s["holes"]) for s in body_shapes + copper_shapes)
print(f"body {len(body_shapes)} formes, cuivre {len(copper_shapes)} formes, {pts} points, {len(ts)//1024} Ko")
