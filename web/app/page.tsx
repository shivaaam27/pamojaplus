"use client";
import { motion } from "framer-motion";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/brand/Logo";
import { StarSpark } from "@/components/brand/StarSpark";
import { ArrowRight, Sparkles, Heart, Users, ShoppingBag, Megaphone, TrendingUp } from "lucide-react";

const valueProps = [
  { icon: ShoppingBag, title: "For Sellers", body: "Free listings, paid growth, and a community that helps you scale." },
  { icon: Heart,       title: "For Shoppers", body: "Discover local brands, exclusive deals, and wellness lifestyles." },
  { icon: Users,       title: "For Community", body: "Ambassadors, campaigns, and shared value across Tanzania." }
];

const stats = [
  { value: "40+", label: "Verified Sellers" },
  { value: "150+", label: "Live Listings" },
  { value: "5+", label: "Active Ambassadors" },
  { value: "1", label: "City — Dar es Salaam" }
];

const categories = ["Food & Beverages", "Wellness & Health", "Beauty & Personal Care", "Fashion", "Home Essentials", "Local Services"];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <Section className="pt-12 sm:pt-20 pb-12 overflow-hidden relative">
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-60" />
        <Container className="relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-soft text-ink text-xs font-bold mb-6">
                <Sparkles className="w-3.5 h-3.5" /> COMMUNITY-POWERED MARKETPLACE
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="font-display font-extrabold text-4xl sm:text-6xl leading-[1.05] tracking-tight text-balance">
                Grow Together.<br /><span className="text-green">Shop Smarter.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="mt-6 text-lg text-ink-2 max-w-xl">
                Pamoja+ connects people, brands, and opportunities across Tanzania through commerce, community, discovery, and shared value.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="mt-8 flex flex-wrap gap-3">
                <Button href="/sellers/apply" size="lg">Join as a Seller <ArrowRight className="w-4 h-4" /></Button>
                <Button href="/pricing" size="lg" variant="secondary">See Pricing</Button>
              </motion.div>
              <div className="mt-10 flex flex-wrap gap-2">
                {categories.map((c) => <Badge key={c} tone="green">{c}</Badge>)}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
              className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-soft to-yellow-soft" />
              <div className="absolute inset-6 rounded-full bg-white shadow-lift flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
                  <LogoMark size={220} />
                </motion.div>
              </div>
              <div className="absolute -top-4 -right-4"><StarSpark size={56} /></div>
              <div className="absolute -bottom-4 -left-4"><StarSpark size={40} /></div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* VALUE PROPS */}
      <Section className="bg-white border-y border-line">
        <Container>
          <SectionHeading eyebrow="Why Pamoja+" title="A marketplace built around people, not just products."
            sub="Three audiences. One community. Shared growth." />
          <div className="grid sm:grid-cols-3 gap-6">
            {valueProps.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Card className="h-full hover:shadow-lift hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-green-soft text-green-dark flex items-center justify-center mb-4">
                    <v.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-extrabold text-xl mb-2">{v.title}</h3>
                  <p className="text-ink-2">{v.body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* HOW IT WORKS */}
      <Section>
        <Container>
          <SectionHeading eyebrow="How it works" title="From listing to community in 4 simple steps." />
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { n: "01", t: "Sign Up Free", b: "Create your business profile in minutes." },
              { n: "02", t: "List Products", b: "Upload up to 10 products on the free plan." },
              { n: "03", t: "Get Inquiries", b: "Customers reach you via WhatsApp or call." },
              { n: "04", t: "Grow", b: "Upgrade for more visibility when ready." }
            ].map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Card>
                  <div className="font-mono text-sm text-green font-bold mb-2">{s.n}</div>
                  <div className="font-display font-bold mb-1">{s.t}</div>
                  <div className="text-sm text-ink-2">{s.b}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* STATS */}
      <Section className="bg-ink text-white">
        <Container>
          <div className="grid sm:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display font-extrabold text-4xl sm:text-5xl text-yellow">{s.value}</div>
                <div className="mt-1 text-sm uppercase tracking-widest text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container>
          <div className="rounded-3xl bg-gradient-to-br from-green to-green-dark text-white p-10 sm:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0"><StarSpark size={120} className="opacity-30" /></div>
            <div className="relative max-w-2xl">
              <Megaphone className="w-10 h-10 mb-4" />
              <h3 className="font-display font-extrabold text-3xl sm:text-4xl mb-3">Be among the first 50 sellers.</h3>
              <p className="text-white/85 text-lg">Free to join. Easy to grow. Tanzania&apos;s community-powered marketplace is just getting started.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/sellers/apply" size="lg" variant="yellow">Join Now <TrendingUp className="w-4 h-4" /></Button>
                <Button href="/about" size="lg" variant="secondary">Learn More</Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
