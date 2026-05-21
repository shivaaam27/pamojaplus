"use client";
import { motion } from "framer-motion";

export function StarSpark({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 24 24" className={className}
      animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
    >
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="#F5C518" />
    </motion.svg>
  );
}
