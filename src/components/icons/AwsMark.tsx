import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { color?: string };

/**
 * simple-icons a retiré la marque AWS de son catalogue : le logotype est
 * redessiné au format d'une icône — le mot, dans la couleur du texte, et le
 * sourire orange. `color` est accepté pour garder la signature des icônes de
 * marque, et ignoré.
 */
export function AwsMark({ color: _color, ...rest }: Props) {
  return (
    <svg viewBox="0 0 48 30" aria-hidden="true" {...rest}>
      <text
        x="24"
        y="17"
        textAnchor="middle"
        fontWeight="700"
        fontSize="17"
        fill="currentColor"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        aws
      </text>
      <path
        d="M9 21.5c9 5 21 5 30 0"
        fill="none"
        stroke="#FF9900"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M35.6 19.3l3.9 2.1-3.9 2"
        fill="none"
        stroke="#FF9900"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
