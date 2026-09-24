import React from "react";
import { motion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds — use for adjacent items revealing in sequence. */
  delay?: number;
}

// Subtle fade + rise on scroll entry, used once per section (not per element within a
// section) so the page feels considered without becoming busy. Visitors who prefer reduced
// motion get the content in its final state from the [data-reveal] rule in index.css — a CSS
// override rather than a different element, so prerendered pages hydrate the same for everyone.
export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0 }) => (
  <motion.div
    data-reveal
    className={className}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);
