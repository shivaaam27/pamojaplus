"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: sx, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green via-yellow to-green z-50"
    />
  );
}
