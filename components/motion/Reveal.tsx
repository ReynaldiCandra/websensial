"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export default function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    /* SSR always ships the animated wrapper with `opacity: 0`; during
       hydration React reuses that node and keeps the attribute. Clear it so
       reduced-motion visitors get fully visible content right away. */
    return (
      <div
        className={className}
        ref={(node) => {
          if (!node) return;
          node.style.opacity = "1";
          node.style.transform = "none";
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
