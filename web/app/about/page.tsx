import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Store, ShoppingBag, Heart, Leaf, MessageCircle,
  Users, Sparkles, Globe2, Handshake, ShieldCheck
} from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <Section>
        <Container>
          <Badge tone="yellow">About Pamoja+</Badge>
          <h1 className="mt-4 font-display font-extrabold text-4xl sm:text-6xl leading-[1.05] text-balance">
            More than a marketplace.<br />A <span className="text-green">digital movement.</span>
          </h1>
          <p className="mt-6 text-lg text-ink-2 max-w-2xl">
            The name <em>Pamoja</em>, meaning &ldquo;together&rdquo;, reflects the core belief behind the platform:
            growth becomes more powerful when businesses, shoppers, creators, and communities rise collectively.
          </p>
          <p className="mt-4 text-ink-2 max-w-2xl">
            Pamoja+ is a community-powered digital marketplace connecting people, brands, and opportunities across Tanzania —
            built on commerce, storytelling, local discovery, wellness, and shared value.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/marketplace" variant="primary">Explore the marketplace</Button>
            <Button href="/sellers/apply" variant="ghost">Join as a seller</Button>
          </div>
        </Container>
      </Section>

      {/* VISION / MISSION */}
      <Section className="bg-white border-y border-line">
        <Container>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <Badge>Vision</Badge>
              <h3 className="mt-3 font-display font-extrabold text-2xl">Tanzania&apos;s leading community-powered marketplace.</h3>
              <p className="mt-3 text-ink-2">
                Where people, brands, and opportunities connect to create shared growth, smarter shopping, and stronger local economies.
              </p>
            </Card>
            <Card>
              <Badge tone="yellow">Mission</Badge>
              <h3 className="mt-3 font-display font-extrabold text-2xl">Empower local businesses. Delight conscious shoppers.</h3>
              <p className="mt-3 text-ink-2">
                Give local businesses a dynamic platform to grow, while enabling shoppers to discover meaningful products,
                exclusive deals, and wellness-driven lifestyle choices.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* CORE PURPOSE */}
      <Section>
        <Container>
          <SectionHeading eyebrow="Core purpose" title="Why Pamoja+ exists."
            sub="Six commitments that guide every decision, from product design to partnerships." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Store, t: "Support local businesses", b: "Give Tanzanian entrepreneurs and SMEs a real digital home." },
              { icon: ShoppingBag, t: "Discovery for shoppers", b: "Help people find unique, affordable, and meaningful products." },
              { icon: Users, t: "Community-driven culture", b: "Build a shopping culture that runs on sharing and trust." },
              { icon: Leaf, t: "Wellness & conscious consumption", b: "Promote healthier habits and responsible buying." },
              { icon: Handshake, t: "Collaboration", b: "Connect brands, consumers, and partners around shared goals." },
              { icon: Sparkles, t: "An ecosystem that pays back", b: "Design a platform where both businesses and customers benefit." }
            ].map((c) => (
              <Card key={c.t}>
                <div className="w-10 h-10 rounded-xl bg-green-soft text-green-dark flex items-center justify-center">
                  <c.icon className="w-5 h-5" />
                </div>
                <div className="mt-3 font-display font-bold">{c.t}</div>
                <p className="mt-1 text-sm text-ink-2">{c.b}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* WHAT WE OFFER — businesses vs shoppers */}
      <Section className="bg-white border-y border-line">
        <Container>
          <SectionHeading eyebrow="What Pamoja+ offers" title="Two sides of one community." />
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-green text-white flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="font-display font-extrabold text-xl">For Businesses</h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-ink-2">
                <li>• Showcase products and services to a Tanzania-wide audience.</li>
                <li>• Share brand stories that build trust and loyalty.</li>
                <li>• Promote special offers, deals, and limited-time campaigns.</li>
                <li>• Build direct customer relationships via WhatsApp and inquiries.</li>
                <li>• Gain repeat buyers and loyal followers.</li>
                <li>• Collaborate with complementary brands and partners.</li>
                <li>• Strengthen credibility through community engagement.</li>
              </ul>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-yellow text-ink flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-display font-extrabold text-xl">For Shoppers</h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-ink-2">
                <li>• Discover unique local products you won&apos;t find on big platforms.</li>
                <li>• Access exclusive deals and curated promotions.</li>
                <li>• Support Tanzanian businesses and entrepreneurs.</li>
                <li>• Find affordable everyday essentials.</li>
                <li>• Explore lifestyle and wellness brands.</li>
                <li>• Share recommendations and tag friends.</li>
                <li>• Join community challenges, points, and rewards.</li>
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      {/* BRAND PERSONALITY */}
      <Section>
        <Container>
          <SectionHeading eyebrow="What we stand for" title="Brand personality"
            sub="Eight traits that show up in how we build, write, and partner." />
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { t: "Community-driven", b: "Built around people and shared value." },
              { t: "Supportive", b: "Helping businesses and shoppers grow together." },
              { t: "Trustworthy", b: "Authentic brands and real recommendations." },
              { t: "Vibrant", b: "Energetic, inclusive, and connected." },
              { t: "Innovative", b: "Modernising local commerce with digital tools." },
              { t: "Conscious", b: "Wellness, positive habits, responsible buying." },
              { t: "Collaborative", b: "Partnerships, referrals, shared success." },
              { t: "Local-first", b: "Tanzanian context shapes every choice." }
            ].map((p) => (
              <Card key={p.t} className="text-center">
                <div className="font-display font-bold text-green-dark">{p.t}</div>
                <div className="mt-1 text-xs text-ink-2">{p.b}</div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* FOCUS AREAS */}
      <Section className="bg-green-soft">
        <Container>
          <SectionHeading eyebrow="Focus areas" title="Where we play." />
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Store, t: "Local Business Empowerment", b: "Helping Tanzanian SMEs compete in a digital environment where storytelling and community matter." },
              { icon: ShoppingBag, t: "Smarter Deals & Savings", b: "Curated promotions and limited-time offers that make everyday shopping more rewarding." },
              { icon: Heart, t: "Health, Wellness & Lifestyle", b: "Wellness brands and lifestyle content. Listings follow TMDA guidance — educational only, no medical claims unless fully TMDA-compliant." },
              { icon: Leaf, t: "Conscious Consumption", b: "Shop with purpose. Support local brands. Consider impact, quality, and value beyond price." },
              { icon: MessageCircle, t: "Storytelling & Engagement", b: "Brand stories, ambassadors, and social campaigns that humanise businesses and connect them with buyers." },
              { icon: ShieldCheck, t: "Trust & Compliance", b: "TMDA / TBS guidance for wellness and food sellers. PDPC-registered data handling. EFD/VFD-ready invoicing as we scale." }
            ].map((f) => (
              <Card key={f.t}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-green-dark flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-lg">{f.t}</h3>
                    <p className="mt-1 text-ink-2 text-sm">{f.b}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* AUDIENCE */}
      <Section className="bg-white border-y border-line">
        <Container>
          <SectionHeading eyebrow="Who Pamoja+ is for" title="The community we serve." />
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <Badge>Business audience</Badge>
              <ul className="mt-4 grid sm:grid-cols-2 gap-1 text-sm text-ink-2">
                <li>• Local entrepreneurs</li>
                <li>• Small and medium businesses</li>
                <li>• Retailers and boutiques</li>
                <li>• Wellness brands (TMDA-compliant)</li>
                <li>• Lifestyle brands</li>
                <li>• Food &amp; beverage (TBS where applicable)</li>
                <li>• Homegrown product creators</li>
                <li>• Service providers</li>
              </ul>
            </Card>
            <Card>
              <Badge tone="yellow">Consumer audience</Badge>
              <ul className="mt-4 grid sm:grid-cols-2 gap-1 text-sm text-ink-2">
                <li>• Everyday deal-seekers</li>
                <li>• Local-product enthusiasts</li>
                <li>• Wellness-conscious shoppers</li>
                <li>• Lifestyle-focused buyers</li>
                <li>• Young digital users</li>
                <li>• Families seeking essentials</li>
                <li>• Community-minded shoppers</li>
                <li>• Diaspora (UK, US, UAE, SA, Gulf)</li>
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      {/* BRAND POSITIONING */}
      <Section>
        <Container>
          <div className="rounded-3xl bg-ink text-white p-8 sm:p-12">
            <Badge tone="yellow">Brand positioning</Badge>
            <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl leading-tight max-w-3xl">
              Tanzania&apos;s community-powered marketplace for local discovery, smarter deals, and collective growth.
            </h2>
            <p className="mt-4 text-white/70 max-w-3xl">
              We sit at the intersection of digital commerce, local business empowerment, community engagement,
              lifestyle discovery, wellness, and exclusive offers.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-white/50">Key message</div>
                <div className="mt-1 font-display font-bold">Pamoja+ is where Tanzania shops, saves, discovers, and grows together.</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-white/50">Tagline</div>
                <div className="mt-1 font-display font-bold text-yellow">Grow Together. Shop Smarter.</div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-green-soft">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-green-dark">
                <Globe2 className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-bold">Join the movement</span>
              </div>
              <h2 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl">Be part of how Tanzania shops next.</h2>
              <p className="mt-3 text-ink-2">Whether you sell, shop, or build community — there&apos;s a place for you here.</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button href="/sellers/apply" variant="primary">Join as a seller</Button>
              <Button href="/contact" variant="ghost">Talk to us</Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
