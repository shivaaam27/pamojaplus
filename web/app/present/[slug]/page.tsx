"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { decks } from "@/content/decks";
import { LogoMark } from "@/components/brand/Logo";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Link from "next/link";

export default function PresentRunner() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const deck = decks.find((d) => d.slug === slug);
  const [i, setI] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!deck) return;
      if (e.key === "ArrowRight" || e.key === " ") setI((v) => Math.min(v + 1, deck.slides.length - 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(v - 1, 0));
      if (e.key === "Escape") router.push("/present");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deck, router]);

  if (!deck) return <div className="p-10">Deck not found.</div>;
  const slide = deck.slides[i];

  return (
    <div className="fixed inset-0 z-50 bg-bg flex flex-col">
      {/* chrome */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-line bg-white/80 backdrop-blur">
        <Link href="/present" className="inline-flex items-center gap-2 text-sm font-bold text-ink-2 hover:text-ink">
          <X className="w-4 h-4" /> Exit
        </Link>
        <div className="font-display font-bold text-sm">{deck.title}</div>
        <div className="text-sm text-ink-2 font-mono">{i + 1} / {deck.slides.length}</div>
      </div>

      {/* slide */}
      <div className="flex-1 grid place-items-center p-6 sm:p-12">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl w-full">
            {slide.kicker && (
              <div className="text-sm font-bold uppercase tracking-widest text-green mb-4">{slide.kicker}</div>
            )}
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl leading-[1.05] text-balance">{slide.title}</h1>
            {slide.big && <div className="mt-6 text-2xl sm:text-3xl text-ink-2 max-w-2xl">{slide.big}</div>}
            {slide.bullets && (
              <ul className="mt-8 space-y-3">
                {slide.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-xl sm:text-2xl">
                    <span className="mt-2 w-2 h-2 rounded-full bg-green shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-line bg-white/80 backdrop-blur">
        <LogoMark size={24} />
        <div className="flex gap-2">
          <button onClick={() => setI((v) => Math.max(v - 1, 0))} disabled={i === 0}
            className="w-10 h-10 rounded-full bg-white border border-line hover:border-green disabled:opacity-40 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setI((v) => Math.min(v + 1, deck.slides.length - 1))} disabled={i === deck.slides.length - 1}
            className="w-10 h-10 rounded-full bg-ink text-white disabled:opacity-40 flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
