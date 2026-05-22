"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

export function WordReveal({ text, className, accent }: { text: string; className?: string; accent?: string }) {
  const reduced = useReducedMotion() ?? false;
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => {
        const isAccent = accent && w.toLowerCase().includes(accent.toLowerCase());
        return (
          <motion.span
            key={i}
            className={"inline-block " + (isAccent ? "text-green" : "")}
            initial={{ opacity: 0, y: reduced ? 0 : 24, filter: reduced ? "none" : "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: reduced ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginRight: "0.25em" }}
          >
            {w}
          </motion.span>
        );
      })}
    </span>
  );
}

export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={
        "bg-clip-text text-transparent bg-[linear-gradient(90deg,#2BB24C,#1E8638,#F5C518,#2BB24C)] bg-[length:200%_auto] animate-gradientSweep " +
        (className ?? "")
      }
    >
      {children}
    </span>
  );
}
