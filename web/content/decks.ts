export interface Slide {
  title: string;
  bullets?: string[];
  big?: string;
  kicker?: string;
}
export interface Deck {
  slug: string;
  title: string;
  audience: string;
  updated: string;
  slides: Slide[];
}

export const decks: Deck[] = [
  {
    slug: "seller-pitch",
    title: "Seller Pitch",
    audience: "Local businesses",
    updated: "Week 1",
    slides: [
      { kicker: "Pamoja+", title: "Grow Together. Shop Smarter.", big: "Tanzania's community-powered marketplace." },
      { title: "The Problem", bullets: ["Local sellers fight for visibility", "Ads are expensive", "Loyalty is hard to build", "Word-of-mouth doesn't scale"] },
      { title: "Pamoja+ Solves It", bullets: ["Free listing to start", "Built-in community discovery", "Affordable paid visibility", "Brand storytelling and campaigns"] },
      { title: "How It Works", bullets: ["Sign up free", "Publish your products & deals", "Get inquiries via WhatsApp", "Upgrade when you see results"] },
      { title: "Plans", bullets: ["Free – Start Pamoja", "TZS 15,000 – Pamoja Growth", "TZS 35,000 – Pamoja Plus", "TZS 75,000 – Pamoja Partner"] },
      { title: "Why Now", bullets: ["Mobile-first market", "Community-driven shopping is winning", "Small businesses need digital reach", "Be among the first 50 sellers"] },
      { kicker: "Let's grow together", title: "Join Pamoja+", big: "Free to start. Easy to upgrade." }
    ]
  },
  {
    slug: "brand-spotlight",
    title: "Brand Spotlight Package",
    audience: "Partner brands",
    updated: "Week 11",
    slides: [
      { kicker: "Pamoja+", title: "Brand Spotlight", big: "Tell your story. Reach your community." },
      { title: "What You Get", bullets: ["Brand story feature", "Marketplace homepage rotation", "Dedicated social media post", "Deal highlight push", "Ambassador amplification"] },
      { title: "Audience", bullets: ["Local everyday shoppers", "Wellness-conscious community", "Young digital users", "Diaspora customers"] },
      { title: "Investment", bullets: ["TZS 100,000 – Starter Spotlight", "TZS 150,000 – Standard Spotlight", "TZS 200,000 – Premium Spotlight"] },
      { kicker: "Ready?", title: "Let's tell your story.", big: "Contact partnerships@pamojaplus.co.tz" }
    ]
  },
  {
    slug: "internal-q1",
    title: "Q1 Internal Update",
    audience: "Team & founders",
    updated: "Week 12",
    slides: [
      { kicker: "Pamoja+", title: "Q1 Recap", big: "Where we stand at the end of Month 3." },
      { title: "By the Numbers", bullets: ["40–60 verified sellers", "150+ live listings", "5–15 paying sellers", "5+ active ambassadors"] },
      { title: "What Worked", bullets: ["Free entry built supply fast", "WhatsApp inquiry flow felt natural", "Verified badges improved trust"] },
      { title: "What Didn't", bullets: ["Some sellers slow to respond", "Wellness category needs tighter rules", "Manual billing was painful"] },
      { title: "Next Quarter", bullets: ["Expand to Arusha + Mwanza?", "Aggregator integration", "First full-time Content Creator hire", "Brand Spotlight as core revenue"] }
    ]
  }
];
