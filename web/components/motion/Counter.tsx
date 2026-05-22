"use client";
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";

export function Counter({ to, suffix = "", prefix = "", duration = 1.6 }: { to: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: "-80px" }); // re-fires every entry/exit
  const reduced = useReducedMotion() ?? false;
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (reduced) { mv.set(to); return; }
    if (!inView) { mv.set(0); return; }
    const controls = animate(mv, to, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, to, duration, reduced, mv]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const unsub = display.on("change", (v) => { el.textContent = v; });
    return unsub;
  }, [display]);

  return <span ref={ref}>{`${prefix}0${suffix}`}</span>;
}
