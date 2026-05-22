"use client";
import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-green text-white hover:bg-green-dark shadow-card",
  yellow: "bg-yellow text-ink hover:brightness-95 shadow-card",
  ghost: "text-ink hover:bg-green-soft"
} as const;

export function MagneticButton({
  children, href, variant = "primary", className, strength = 0.35
}: {
  children: ReactNode; href?: string; variant?: keyof typeof variants; className?: string; strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  function onMove(e: React.MouseEvent) {
    if (reduced) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  }
  function reset() { x.set(0); y.set(0); }

  const cls = cn(
    "inline-flex items-center justify-center gap-2 font-display font-bold rounded-full h-11 px-5 text-sm transition-colors duration-200",
    variants[variant], className
  );
  const inner = (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ x: sx, y: sy }} className="inline-block">
      <div className={cls}>{children}</div>
    </motion.div>
  );
  if (href) return <Link href={href} className="inline-block">{inner}</Link>;
  return inner;
}
