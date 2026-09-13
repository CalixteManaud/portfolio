"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  children: ReactNode;
  /** Décalage en secondes, pour cascader les éléments d'une même rangée. */
  delay?: number;
  className?: string;
};

/**
 * Apparition au scroll : léger glissement vers le haut + fondu, une seule fois.
 *
 * `once: true` est délibéré — un élément qui rejoue son animation à chaque
 * passage devient fatigant sur une page qu'on parcourt de haut en bas.
 */
export function Reveal({ children, delay = 0, className }: Props) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
