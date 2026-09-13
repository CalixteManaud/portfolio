import { cn } from "@/lib/utils";

type Props = { className?: string };

/*
 * Les tracés à la main des pages. Un seul crayon pour tous : même épaisseur,
 * extrémités rondes, couleur héritée du texte. Mélanger une icône de
 * bibliothèque, une barre CSS et un trait dessiné trahit l'assemblage.
 */
const pen = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function CrownDoodle({ className }: Props) {
  return (
    <svg viewBox="0 0 64 48" className={cn("h-10 w-14", className)} aria-hidden="true" {...pen}>
      <path d="M9 31 L6 11 L20 23 L31 5 L41 22 L56 10 L52 31" />
      <path d="M9 31 C 22 34, 38 34, 52 31" />
      <path d="M4 43 C 20 37, 40 39, 60 35" />
    </svg>
  );
}

export function ArrowDoodle({ className }: Props) {
  return (
    <svg viewBox="0 0 64 40" className={cn("h-8 w-14", className)} aria-hidden="true" {...pen}>
      <path d="M4 34 C 20 30, 40 22, 58 6" strokeWidth={2.4} />
      <path d="M46 6 L58 6 L55 18" strokeWidth={2.4} />
    </svg>
  );
}

/** Deux coups de pinceau effilés, le second plus court et décalé. */
export function BrushUnderline({ className }: Props) {
  return (
    <svg
      viewBox="0 0 120 18"
      className={cn("h-4 w-28", className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M3 9 C 30 4, 70 2, 116 4 C 118 5, 117 7, 114 7 C 76 7, 38 9, 5 12 C 2 12, 1 10, 3 9 Z" />
      <path d="M26 15 C 50 12, 80 11, 104 12 C 106 13, 105 14, 102 14 C 80 14, 54 15, 28 17 C 25 17, 24 15, 26 15 Z" />
    </svg>
  );
}

/** Deux sommets pleins, pour « Toujours plus haut ». */
export function PeaksIcon({ className }: Props) {
  return (
    <svg
      viewBox="0 0 48 32"
      className={cn("h-7 w-10", className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M2 30 L17 7 L25 18 L31 10 L46 30 Z" />
    </svg>
  );
}
