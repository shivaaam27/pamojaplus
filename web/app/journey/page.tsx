"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Card";
import { timeline, Track } from "@/content/timeline";
import { Check, Circle, Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const tracks: ("All" | Track)[] = ["All", "Business", "Legal", "Product"];

export default function JourneyPage() {
  const [filter, setFilter] = useState<"All" | Track>("All");
  const [open, setOpen] = useState<number | null>(null);

  const filtered = filter === "All" ? timeline : timeline.filter((t) => t.track === filter);
  const done = timeline.filter((t) => t.status === "done").length;
  const pct = Math.round((done / timeline.length) * 100);

  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="The 90-day journey" title="From zero to 40+ sellers."
          sub="Twelve weeks. Three months. One disciplined operating rhythm." />

        {/* Progress + filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-48 h-2 bg-line rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-green to-yellow" />
            </div>
            <div className="font-display font-bold text-sm">{pct}% complete</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {tracks.map((t) => (
              <button key={t} onClick={() => setFilter(t)}
                className={cn("px-4 py-2 rounded-full text-sm font-bold transition",
                  filter === t ? "bg-ink text-white" : "bg-white border border-line text-ink-2 hover:border-green")}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-line" />
          <div className="space-y-4">
            {filtered.map((node) => {
              const isOpen = open === node.week;
              const isDone = node.status === "done";
              const isActive = node.status === "active";
              return (
                <motion.div key={node.week} layout className="relative pl-12 sm:pl-20">
                  <div className={cn("absolute left-0 sm:left-4 top-3 w-8 h-8 rounded-full border-2 flex items-center justify-center",
                    isDone && "bg-green border-green text-white",
                    isActive && "bg-yellow border-yellow text-ink animate-pulse",
                    node.status === "upcoming" && "bg-white border-line text-ink-2")}>
                    {isDone ? <Check className="w-4 h-4" /> : isActive ? <Clock className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
                  </div>

                  <motion.button layout onClick={() => setOpen(isOpen ? null : node.week)}
                    className="w-full text-left bg-white border border-line rounded-2xl p-5 hover:shadow-card transition">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1 text-xs font-bold text-ink-2">
                          <span>WEEK {node.week}</span>
                          <span>·</span>
                          <span>MONTH {node.month}</span>
                        </div>
                        <div className="font-display font-extrabold text-lg">{node.title}</div>
                        <div className="text-ink-2 text-sm mt-1">{node.summary}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge tone={node.track === "Business" ? "green" : node.track === "Product" ? "yellow" : "ink"}>{node.track}</Badge>
                        <ChevronDown className={cn("w-5 h-5 transition", isOpen && "rotate-180")} />
                      </div>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <ul className="mt-4 pt-4 border-t border-line space-y-2">
                            {node.actions.map((a) => (
                              <li key={a} className="flex items-start gap-2 text-sm">
                                <Check className="w-4 h-4 text-green mt-0.5 shrink-0" /> {a}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
