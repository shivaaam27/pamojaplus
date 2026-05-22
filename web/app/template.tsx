"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <>
      <ScrollProgress />
      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
