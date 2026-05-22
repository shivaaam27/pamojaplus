"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ReactNode, useRef } from "react";

export function Parallax({
  children, className, speed = 0.15, scaleOnEnter = false
}: { children: ReactNode; className?: string; speed?: number; scaleOnEnter?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80 * speed * 5, -80 * speed * 5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : (scaleOnEnter ? { y, scale } : { y })}>
        {children}
      </motion.div>
    </div>
  );
}

export function Drift({ children, className, amount = 40 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

export function ScrollTilt({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-max, 0, max]);
  return (
    <div ref={ref} className={className} style={{ perspective: 1000 }}>
      <motion.div style={reduced ? undefined : { rotateX: rotate }}>{children}</motion.div>
    </div>
  );
}
