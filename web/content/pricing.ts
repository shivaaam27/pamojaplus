export interface Plan {
  id: "free" | "growth" | "plus" | "partner";
  name: string;
  price: number;
  best: string;
  listings: string;
  highlight?: boolean;
  features: string[];
}

export const plans: Plan[] = [
  { id: "free", name: "Start Pamoja", price: 0, best: "New & small sellers", listings: "10",
    features: ["Basic business profile", "Up to 10 product listings", "WhatsApp contact button", "Basic marketplace visibility"] },
  { id: "growth", name: "Pamoja Growth", price: 15000, best: "Small active businesses", listings: "50",
    features: ["Up to 50 listings", "Post offers and deals", "Basic analytics", "1 featured placement / month"] },
  { id: "plus", name: "Pamoja Plus", price: 35000, best: "Serious sellers", listings: "150", highlight: true,
    features: ["Up to 150 listings", "Higher marketplace ranking", "2 featured placements / month", "Priority support", "Monthly performance report"] },
  { id: "partner", name: "Pamoja Partner", price: 75000, best: "Growing brands", listings: "Unlimited",
    features: ["Unlimited listings", "Homepage feature rotation", "4 featured placements / month", "Verified badge & brand story", "Advanced analytics"] }
];

export interface Boost { name: string; price: number; per: string; }
export const boosts: Boost[] = [
  { name: "Deal Boost", price: 5000, per: "day" },
  { name: "Weekly Deal Boost", price: 25000, per: "week" },
  { name: "Featured Brand Slot", price: 50000, per: "week" },
  { name: "Social Media Feature", price: 30000, per: "post" },
  { name: "Brand Story Package", price: 150000, per: "campaign" }
];
