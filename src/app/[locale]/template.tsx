"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Transition d'entrée entre pages.
 *
 * `template.tsx` plutôt que `layout.tsx` : Next remonte un template à chaque
 * navigation, ce qui rejoue l'animation — un layout, lui, persiste et ne
 * rejouerait rien.
 *
 * Volontairement en entrée seule : animer la sortie retiendrait la page
 * précédente à l'écran et ferait paraître chaque clic plus lent qu'il ne l'est.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
