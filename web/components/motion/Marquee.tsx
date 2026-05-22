"use client";
import { useReducedMotion } from "framer-motion";

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const reduced = useReducedMotion() ?? false;
  const row = [...items, ...items];
  return (
    <div className={"overflow-hidden border-y border-line bg-white py-4 " + (className ?? "")}>
      <div
        className={"flex whitespace-nowrap gap-12 " + (reduced ? "" : "animate-marquee")}
        style={{ width: "max-content" }}
      >
        {row.map((s, i) => (
          <span key={i} className="font-display font-extrabold text-xl text-ink-2 inline-flex items-center gap-12">
            {s}
            <span className="w-2 h-2 rounded-full bg-yellow" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
