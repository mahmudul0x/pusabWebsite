import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlowCard({ children, className = "", delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={
        "group relative rounded-2xl border border-border bg-[var(--color-surface)] p-8 transition-colors duration-300 hover:border-[color-mix(in_oklab,var(--color-accent-1)_60%,transparent)] hover:shadow-[0_0_60px_-10px_rgba(79,110,247,0.30)] " +
        className
      }
    >
      {children}
    </motion.div>
  );
}