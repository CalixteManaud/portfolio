"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  children: string;
  className?: string;
  delay?: number;
};

/**
 * Word-by-word "rise from below" reveal. Uses overflow:hidden masks per word
 * so descenders don't bleed during the animation.
 */
export function SplitTextReveal({ children, className, delay = 0.2 }: Props) {
  const reduced = useReducedMotion();
  const words = children.split(" ");

  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={className} aria-label={children}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom leading-[1.1]"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{
              delay: delay + i * 0.07,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
