import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds — use for adjacent items revealing in sequence. */
  delay?: number;
}

// Subtle fade + rise on scroll entry, used once per section (not per element within a
// section) so the page feels considered without becoming busy. Respects
// prefers-reduced-motion by skipping the animation and rendering content in its final state.
export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0 }) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};
