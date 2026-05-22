"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ReactNode } from "react";

const baseVariants = (reduced: boolean): Variants => ({
  hidden: { opacity: 0, y: reduced ? 0 : 32, filter: reduced ? "none" : "blur(6px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
});

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
      variants={baseVariants(reduced)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({ children, className, stagger = 0.08 }: { children: ReactNode; className?: string; stagger?: number }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: 0.05 } }
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : 32, scale: reduced ? 1 : 0.94, filter: reduced ? "none" : "blur(4px)" },
        show: {
          opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
      }}
      whileHover={reduced ? undefined : { y: -6, scale: 1.015, transition: { duration: 0.25 } }}
    >
      {children}
    </motion.div>
  );
}
