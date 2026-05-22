"use client";
import { useRef, ReactNode } from "react";
import { useMotionValue, useSpring, useMotionTemplate, motion, useReducedMotion } from "framer-motion";

export function CursorGlow({ children, className, color = "rgba(245,197,24,0.28)" }:
  { children: ReactNode; className?: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 140, damping: 22 });
  const sy = useSpring(y, { stiffness: 140, damping: 22 });
  const background = useMotionTemplate`radial-gradient(420px circle at ${sx}px ${sy}px, ${color}, transparent 60%)`;

  function onMove(e: React.MouseEvent) {
    if (reduced) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  }
  function onLeave() { x.set(-400); y.set(-400); }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={"relative overflow-hidden " + (className ?? "")}>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background }} />
      <div className="relative">{children}</div>
    </div>
  );
}
