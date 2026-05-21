import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { Card, Badge } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <>
      <Section>
        <Container>
          <Badge tone="yellow">About Pamoja+</Badge>
          <h1 className="mt-4 font-display font-extrabold text-4xl sm:text-6xl leading-[1.05] text-balance">
            More than a marketplace.<br />A <span className="text-green">digital movement.</span>
          </h1>
          <p className="mt-6 text-lg text-ink-2 max-w-2xl">
            The name <em>Pamoja</em>, meaning &ldquo;together&rdquo;, reflects the core belief behind the platform: growth becomes more powerful when businesses, shoppers, creators, and communities rise collectively.
          </p>
        </Container>
      </Section>

      <Section className="bg-white border-y border-line">
        <Container>
          <div className="grid md:grid-cols-2 gap-10">
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
                Give local businesses a dynamic platform to grow, while enabling shoppers to discover meaningful products, exclusive deals, and wellness-driven lifestyle choices.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="What we stand for" title="Brand personality" />
          <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-4">
            {["Community-driven", "Supportive", "Trustworthy", "Vibrant", "Innovative", "Conscious", "Collaborative", "Local-first"].map((p) => (
              <Card key={p} className="text-center">
                <div className="font-display font-bold text-green-dark">{p}</div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-green-soft">
        <Container>
          <SectionHeading eyebrow="Focus areas" title="Where we play." />
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { t: "Local Business Empowerment", b: "Helping Tanzanian SMEs compete in a digital environment where storytelling and community matter." },
              { t: "Smarter Deals & Savings", b: "Curated promotions and limited-time offers that make everyday shopping more rewarding." },
              { t: "Health, Wellness & Lifestyle", b: "Wellness-focused brands and content for healthier, more intentional choices." },
              { t: "Conscious Consumption", b: "Shop with purpose. Support local brands. Consider impact, quality, and value." }
            ].map((f) => (
              <Card key={f.t}>
                <h3 className="font-display font-extrabold text-xl">{f.t}</h3>
                <p className="mt-2 text-ink-2">{f.b}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
