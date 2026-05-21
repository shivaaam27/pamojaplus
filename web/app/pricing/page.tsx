"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { plans, boosts } from "@/content/pricing";
import { tzs } from "@/lib/format";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

export default function PricingPage() {
  const [growth, setGrowth] = useState(10);
  const [plus, setPlus] = useState(5);
  const [partner, setPartner] = useState(1);
  const [boostsPerMonth, setBoosts] = useState(8);
  const [spotlights, setSpotlights] = useState(1);

  const monthly = useMemo(() => {
    return growth * 15000 + plus * 35000 + partner * 75000 + boostsPerMonth * 25000 + spotlights * 150000;
  }, [growth, plus, partner, boostsPerMonth, spotlights]);

  return (
    <>
      <Section>
        <Container>
          <SectionHeading eyebrow="Pricing" title="Free to join. Easy to grow. Fair to monetize."
            sub="Built for the Tanzanian market. Mobile-money friendly. Commission only when value is created." />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className={cn("relative rounded-2xl p-6 border bg-white",
                  p.highlight ? "border-yellow shadow-lift" : "border-line shadow-card")}>
                {p.highlight && (
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-1 bg-yellow text-ink text-xs font-bold px-3 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" /> MOST POPULAR
                  </div>
                )}
                <div className="text-sm font-bold text-ink-2 uppercase tracking-wide">{p.best}</div>
                <div className="mt-1 font-display font-extrabold text-2xl">{p.name}</div>
                <div className="mt-4">
                  <span className="font-display font-extrabold text-4xl">{p.price === 0 ? "Free" : tzs(p.price)}</span>
                  {p.price > 0 && <span className="text-ink-2 text-sm">/month</span>}
                </div>
                <div className="mt-1 text-sm text-ink-2">{p.listings} listings</div>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button href="/sellers/apply" variant={p.highlight ? "yellow" : "primary"} className="mt-6 w-full">
                  {p.price === 0 ? "Start Free" : "Choose Plan"}
                </Button>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* SIMULATOR */}
      <Section className="bg-white border-y border-line">
        <Container>
          <SectionHeading eyebrow="Revenue simulator" title="Model your monthly revenue."
            sub="Move the sliders to see the indicative monthly revenue based on the current pricing model." />
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <Slider label="Pamoja Growth sellers" value={growth} setValue={setGrowth} max={60} unit="sellers" perUnit={15000} />
              <Slider label="Pamoja Plus sellers" value={plus} setValue={setPlus} max={40} unit="sellers" perUnit={35000} />
              <Slider label="Pamoja Partner sellers" value={partner} setValue={setPartner} max={10} unit="sellers" perUnit={75000} />
              <Slider label="Weekly Deal Boosts (per month)" value={boostsPerMonth} setValue={setBoosts} max={40} unit="boosts" perUnit={25000} />
              <Slider label="Brand Spotlight campaigns" value={spotlights} setValue={setSpotlights} max={6} unit="campaigns" perUnit={150000} />
            </div>
            <div className="bg-ink text-white rounded-3xl p-8 sm:p-10 self-start">
              <div className="text-sm uppercase tracking-widest text-white/60">Indicative monthly revenue</div>
              <div className="mt-3 font-display font-extrabold text-5xl text-yellow">{tzs(monthly)}</div>
              <div className="mt-2 text-white/70 text-sm">Before mobile-money MDR (~1.5–2.5%) and commission.</div>
              <div className="mt-8 space-y-3">
                <Line label="Subscriptions" value={growth * 15000 + plus * 35000 + partner * 75000} />
                <Line label="Boosts" value={boostsPerMonth * 25000} />
                <Line label="Spotlights" value={spotlights * 150000} />
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="font-display font-extrabold text-2xl mb-4">Boost & campaign rates</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {boosts.map((b) => (
                <Card key={b.name}>
                  <div className="text-xs uppercase tracking-wider text-green-dark font-bold">{b.per}</div>
                  <div className="mt-1 font-display font-bold">{b.name}</div>
                  <div className="mt-2 font-display font-extrabold text-2xl">{tzs(b.price)}</div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Commission */}
      <Section>
        <Container>
          <SectionHeading eyebrow="Commission" title="Charged only when Pamoja+ processes the order." />
          <div className="grid sm:grid-cols-3 gap-5">
            <Card><Badge>Direct inquiry</Badge><div className="mt-2 font-display font-extrabold text-3xl">0%</div><div className="text-ink-2 text-sm">Buyer contacts seller directly via WhatsApp / phone.</div></Card>
            <Card><Badge tone="yellow">Processed order</Badge><div className="mt-2 font-display font-extrabold text-3xl">3–5%</div><div className="text-ink-2 text-sm">Order placed through Pamoja+ with payment processed.</div></Card>
            <Card><Badge tone="ink">Campaign sale</Badge><div className="mt-2 font-display font-extrabold text-3xl">5–8%</div><div className="text-ink-2 text-sm">Sales from sponsored Brand Spotlight campaigns.</div></Card>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Slider({ label, value, setValue, max, unit, perUnit }:
  { label: string; value: number; setValue: (v: number) => void; max: number; unit: string; perUnit: number; }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <label className="font-display font-bold text-sm">{label}</label>
        <div className="text-sm"><span className="font-display font-extrabold text-green">{value}</span> <span className="text-ink-2">{unit} · {tzs(value * perUnit)}/mo</span></div>
      </div>
      <input type="range" min={0} max={max} value={value} onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-green" />
    </div>
  );
}

function Line({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center pb-2 border-b border-white/10">
      <span className="text-white/70 text-sm">{label}</span>
      <span className="font-display font-bold">{tzs(value)}</span>
    </div>
  );
}
