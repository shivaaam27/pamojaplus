"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { plans, boosts, paymentMethods, savingsClub } from "@/content/pricing";
import { tzs } from "@/lib/format";
import { Check, Sparkles, Smartphone, Banknote, CreditCard, Wallet, Star } from "lucide-react";
import { cn } from "@/lib/cn";

const WEEKS_PER_MONTH = 4.33;

export default function PricingPage() {
  const [growth, setGrowth] = useState(10);
  const [plus, setPlus] = useState(5);
  const [partner, setPartner] = useState(1);
  const [boostsPerMonth, setBoosts] = useState(8);
  const [spotlights, setSpotlights] = useState(1);

  // Growth: 35k/week, Plus: 65k/week, Partner: 75k/month
  // Weekly Deal Boost: 40k/week → monthly cost per recurring boost ≈ 40k × 4.33
  // Featured Brand Slot: 70k/week
  const monthly = useMemo(() => {
    return Math.round(
      growth * 35000 * WEEKS_PER_MONTH +
      plus * 65000 * WEEKS_PER_MONTH +
      partner * 75000 +
      boostsPerMonth * 40000 +
      spotlights * 70000
    );
  }, [growth, plus, partner, boostsPerMonth, spotlights]);

  return (
    <>
      <Section>
        <Container>
          <SectionHeading eyebrow="Pricing" title="Free to join. Easy to grow. Fair to monetize."
            sub="Built for the Tanzanian market. Mobile-money friendly. Commission only when value is created." />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {plans.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className={cn("relative rounded-2xl p-6 border bg-white flex flex-col h-full",
                  p.highlight ? "border-yellow shadow-lift" : "border-line shadow-card")}>
                {p.highlight && (
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-1 bg-yellow text-ink text-xs font-bold px-3 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" /> MOST POPULAR
                  </div>
                )}
                <div className="text-sm font-bold text-ink-2 uppercase tracking-wide">{p.best}</div>
                <div className="mt-1 font-display font-extrabold text-2xl">{p.name}</div>
                <div className="mt-4 flex items-baseline gap-1 flex-wrap">
                  <span className="font-display font-extrabold text-2xl lg:text-3xl leading-none break-words">{tzs(p.price)}</span>
                  <span className="text-ink-2 text-xs">/{p.per}</span>
                </div>
                <div className="mt-1 text-sm text-ink-2">{p.listings} listing{p.listings === "1" ? "" : "s"}</div>
                <ul className="mt-5 space-y-2 text-sm flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button href="/sellers/apply" variant={p.highlight ? "yellow" : "primary"} className="mt-6 w-full">
                  Choose Plan
                </Button>
              </motion.div>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-2">Regional pricing will be reviewed before any expansion outside Dar es Salaam.</p>
        </Container>
      </Section>

      {/* PAYMENT METHODS */}
      <Section className="bg-white border-y border-line">
        <Container>
          <SectionHeading eyebrow="Payment methods" title="Pay the way Tanzania actually pays."
            sub="Mobile-money first. Cash and pickup still welcome. Cards for diaspora from Month 3." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map((m) => {
              const Icon =
                m.type === "Mobile money" ? Smartphone :
                m.type === "Bank" ? Banknote :
                m.type === "Card" ? CreditCard : Wallet;
              return (
                <Card key={m.name}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-soft text-green-dark flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-display font-bold">{m.name}</div>
                      <div className="text-xs uppercase tracking-wider text-ink-2">{m.type}</div>
                      {m.note && <div className="mt-1 text-sm text-ink-2">{m.note}</div>}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-ink-2">
            Payment aggregators under review: Selcom, Clickpesa, Pesapal, Flutterwave, DPO Pay.
          </p>
        </Container>
      </Section>

      {/* SIMULATOR */}
      <Section>
        <Container>
          <SectionHeading eyebrow="Revenue simulator" title="Model your monthly revenue."
            sub="Move the sliders to see indicative monthly revenue at current pricing (weekly plans normalised to a month)." />
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <Slider label="Pamoja Growth sellers (35k/week)" value={growth} setValue={setGrowth} max={60} unit="sellers" perUnit={Math.round(35000 * WEEKS_PER_MONTH)} />
              <Slider label="Pamoja Plus sellers (65k/week)" value={plus} setValue={setPlus} max={40} unit="sellers" perUnit={Math.round(65000 * WEEKS_PER_MONTH)} />
              <Slider label="Pamoja Partner sellers (75k/month)" value={partner} setValue={setPartner} max={10} unit="sellers" perUnit={75000} />
              <Slider label="Weekly Deal Boosts (per month)" value={boostsPerMonth} setValue={setBoosts} max={40} unit="boosts" perUnit={40000} />
              <Slider label="Featured Brand Slots (weeks)" value={spotlights} setValue={setSpotlights} max={6} unit="weeks" perUnit={70000} />
            </div>
            <div className="bg-ink text-white rounded-3xl p-8 sm:p-10 self-start">
              <div className="text-sm uppercase tracking-widest text-white/60">Indicative monthly revenue</div>
              <div className="mt-3 font-display font-extrabold text-5xl text-yellow">{tzs(monthly)}</div>
              <div className="mt-2 text-white/70 text-sm">Before mobile-money MDR (~1.5–2.5%) and commission.</div>
              <div className="mt-8 space-y-3">
                <Line label="Subscriptions" value={Math.round(growth * 35000 * WEEKS_PER_MONTH + plus * 65000 * WEEKS_PER_MONTH + partner * 75000)} />
                <Line label="Boosts" value={boostsPerMonth * 40000} />
                <Line label="Featured slots" value={spotlights * 70000} />
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="font-display font-extrabold text-2xl mb-4">Promotional boost & campaign rates</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {boosts.map((b) => (
                <Card key={b.name}>
                  <div className="text-xs uppercase tracking-wider text-green-dark font-bold">per {b.per}</div>
                  <div className="mt-1 font-display font-bold">{b.name}</div>
                  <div className="mt-2 font-display font-extrabold text-2xl">
                    {b.price === null ? "Custom" : tzs(b.price)}
                  </div>
                  {b.note && <div className="mt-2 text-xs text-ink-2">{b.note}</div>}
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* SAVINGS CLUB */}
      <Section className="bg-white border-y border-line">
        <Container>
          <SectionHeading eyebrow="For shoppers" title="Pamoja+ Savings Club"
            sub="Browsing, deal discovery, and contacting businesses stay free. The Savings Club is an optional membership for shoppers who want more." />
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <Card className="lg:col-span-1">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow" />
                <Badge tone="yellow">{savingsClub.status}</Badge>
              </div>
              <div className="mt-4 font-display font-extrabold text-3xl">{tzs(savingsClub.monthly)}<span className="text-ink-2 text-base font-normal">/month</span></div>
              <div className="mt-1 text-ink-2 text-sm">or {tzs(savingsClub.yearly)} per year</div>
              <Button href="/contact" variant="primary" className="mt-6 w-full">Join the waitlist</Button>
            </Card>
            <Card className="lg:col-span-2">
              <div className="font-display font-bold mb-3">What members get</div>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                {savingsClub.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-ink-2">Launches after the marketplace soft-launch. Pricing indicative and subject to confirmation.</p>
            </Card>
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
          <p className="mt-4 text-sm text-ink-2">Net commission is approximately gross commission minus 1.5–2.5% mobile-money MDR.</p>
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
