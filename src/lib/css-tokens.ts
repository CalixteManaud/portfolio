/**
 * Lecture des primitives de couleur du design system depuis le CSS, à l'usage
 * des scènes 3D.
 *
 * Pourquoi ce détour : `getComputedStyle` restitue nos tokens `oklch()` sous la
 * forme `lab(...)`, que `THREE.Color` ne sait pas parser — il émet « Unknown
 * color model » et retombe sur du noir. Un canvas 2D, lui, accepte n'importe
 * quelle couleur CSS valide et la restitue en hexadécimal sRGB.
 *
 * La règle du système est qu'aucune couleur n'est écrite en dur ailleurs que
 * dans le bloc `:root` de `globals.css`. Le GLSL et les matériaux Three ne font
 * pas exception : ils lisent, ils ne recopient pas.
 */

/** Hex sRGB correspondant à une primitive CSS, ou `fallback` hors navigateur. */
export function readCssColorHex(token: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;

  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  if (!value) return fallback;

  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fallback;

  // Le premier assignement sert de garde : si `value` est invalide, le canvas
  // conserve la valeur précédente plutôt que de lever.
  ctx.fillStyle = fallback;
  ctx.fillStyle = value;
  return ctx.fillStyle as string;
}
