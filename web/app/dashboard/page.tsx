"use client";
import { motion } from "framer-motion";
import { Container, Section } from "@/components/ui/Container";
import { Card, Badge } from "@/components/ui/Card";
import { tzs, num } from "@/lib/format";
import { TrendingUp, TrendingDown, Users, ShoppingBag, Coins, Megaphone, AlertCircle } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

const kpis = [
  { label: "Total Sellers", value: 42, delta: +8, icon: Users, tone: "green" },
  { label: "Active Listings", value: 156, delta: +24, icon: ShoppingBag, tone: "green" },
  { label: "Revenue (Month)", value: 685000, isCurrency: true, delta: +12, icon: Coins, tone: "yellow" },
  { label: "Ambassadors", value: 7, delta: +2, icon: Megaphone, tone: "green" }
];

const revenueTrend = [
  { w: "W1", v: 0 }, { w: "W2", v: 0 }, { w: "W3", v: 25000 }, { w: "W4", v: 75000 },
  { w: "W5", v: 95000 }, { w: "W6", v: 140000 }, { w: "W7", v: 210000 }, { w: "W8", v: 285000 },
  { w: "W9", v: 380000 }, { w: "W10", v: 460000 }, { w: "W11", v: 565000 }, { w: "W12", v: 685000 }
];

const categories = [
  { name: "Food", n: 12 }, { name: "Wellness", n: 9 }, { name: "Beauty", n: 8 },
  { name: "Fashion", n: 7 }, { name: "Home", n: 4 }, { name: "Services", n: 2 }
];

const attention = [
  { what: "5 expired deals not removed", who: "Operations", urgent: true },
  { what: "3 sellers unresponsive for 7+ days", who: "Operations", urgent: true },
  { what: "2 new pitches awaiting review", who: "BD", urgent: false },
  { what: "Ambassador payout cycle this Friday", who: "Finance", urgent: false }
];

export default function DashboardPage() {
  return (
    <Section className="py-10">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-sm font-bold uppercase tracking-widest text-green">Internal</div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl mt-1">Dashboard</h1>
            <div className="text-ink-2 text-sm mt-1">Mock data · v1 · Updated weekly during Monday review</div>
          </div>
          <Badge tone="yellow">DEMO DATA</Badge>
        </div>

        {/* KPIs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {kpis.map((k, i) => {
            const up = k.delta >= 0;
            return (
              <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.tone === "yellow" ? "bg-yellow-soft text-ink" : "bg-green-soft text-green-dark"}`}>
                      <k.icon className="w-5 h-5" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-bold ${up ? "text-green-dark" : "text-danger"}`}>
                      {up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {up ? "+" : ""}{k.delta}%
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-ink-2">{k.label}</div>
                  <div className="font-display font-extrabold text-3xl mt-1">
                    {k.isCurrency ? tzs(k.value) : num(k.value)}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-5 mb-8">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="font-display font-extrabold text-lg">Revenue trend</div>
              <Badge>Last 12 weeks</Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend}>
                  <XAxis dataKey="w" stroke="#3A4A40" fontSize={12} />
                  <Tooltip formatter={(v: number) => tzs(v)} />
                  <Line type="monotone" dataKey="v" stroke="#2BB24C" strokeWidth={3} dot={{ fill: "#F5C518", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="font-display font-extrabold text-lg">Top categories</div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories}>
                  <XAxis dataKey="name" stroke="#3A4A40" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="n" fill="#2BB24C" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Attention list */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-extrabold text-lg">Needs attention</div>
            <Badge tone="ink">{attention.length} items</Badge>
          </div>
          <ul className="divide-y divide-line">
            {attention.map((a) => (
              <li key={a.what} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className={`w-5 h-5 ${a.urgent ? "text-danger" : "text-ink-2"}`} />
                  <span className="font-medium">{a.what}</span>
                </div>
                <Badge tone={a.urgent ? "yellow" : "green"}>{a.who}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </Container>
    </Section>
  );
}
