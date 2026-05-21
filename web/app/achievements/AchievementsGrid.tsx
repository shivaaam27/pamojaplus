"use client";
import { motion } from "framer-motion";
import { Card, Badge } from "@/components/ui/Card";
import { Star, CheckCircle, Trophy, Rocket, Users, Coins } from "lucide-react";
import { cn } from "@/lib/cn";

const icons = {
  star: Star, check: CheckCircle, trophy: Trophy, rocket: Rocket, users: Users, money: Coins
} as const;

interface Item {
  date: string;
  title: string;
  description: string;
  icon: keyof typeof icons;
  featured: boolean;
}

export function AchievementsGrid({ milestones }: { milestones: Item[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {milestones.map((m, i) => {
        const Icon = icons[m.icon] ?? Star;
        return (
          <motion.div key={`${m.title}-${i}`}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: (i % 6) * 0.05 }}
            className={cn(m.featured && "sm:col-span-2 lg:col-span-1")}>
            <Card className={cn("h-full", m.featured && "ring-2 ring-yellow")}>
              <div className="flex items-start justify-between">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center",
                  m.featured ? "bg-yellow text-ink" : "bg-green-soft text-green-dark")}>
                  <Icon className="w-6 h-6" />
                </div>
                {m.featured && <Badge tone="yellow">FEATURED</Badge>}
              </div>
              <div className="mt-4 text-xs uppercase tracking-widest text-ink-2 font-bold">
                {new Date(m.date).toLocaleDateString("en-TZ", { day: "numeric", month: "short", year: "numeric" })}
              </div>
              <h3 className="mt-1 font-display font-extrabold text-lg">{m.title}</h3>
              <p className="mt-2 text-sm text-ink-2">{m.description}</p>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
