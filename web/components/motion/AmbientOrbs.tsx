"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export function AmbientOrbs() {
  const reduced = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const yA = useTransform(scrollY, [0, 800], [0, -120]);
  const yB = useTransform(scrollY, [0, 800], [0, 80]);
  const rotate = useTransform(scrollY, [0, 1200], [0, 30]);
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        style={reduced ? undefined : { y: yA, rotate }}
        className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-green/20 blur-3xl animate-floatA motion-reduce:animate-none"
      />
      <motion.div
        style={reduced ? undefined : { y: yB }}
        className="absolute top-40 -right-20 w-[360px] h-[360px] rounded-full bg-yellow/30 blur-3xl animate-floatB motion-reduce:animate-none"
      />
      <motion.div
        style={reduced ? undefined : { y: yA }}
        className="absolute top-[600px] left-1/3 w-[300px] h-[300px] rounded-full bg-green/10 blur-3xl animate-floatA motion-reduce:animate-none"
      />
    </div>
  );
}
