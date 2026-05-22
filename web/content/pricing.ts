export interface Plan {
  id: "start" | "growth" | "plus" | "partner";
  name: string;
  price: number;
  per: "week" | "month";
  best: string;
  listings: string;
  highlight?: boolean;
  features: string[];
}

export const plans: Plan[] = [
  { id: "start", name: "Start Pamoja", price: 20000, per: "week", best: "New & small sellers", listings: "1",
    features: ["Basic business profile", "1 product listing", "WhatsApp contact button", "Basic marketplace visibility"] },
  { id: "growth", name: "Pamoja Growth", price: 35000, per: "week", best: "Small active businesses", listings: "3",
    features: ["Up to 3 listings", "Post offers and deals", "Basic analytics (views, clicks, inquiries)", "1 featured category placement / month"] },
  { id: "plus", name: "Pamoja Plus", price: 65000, per: "week", best: "Serious sellers", listings: "5", highlight: true,
    features: ["Up to 5 listings", "Higher marketplace ranking", "2 featured deal placements / week", "Weekly performance report", "Priority support"] },
  { id: "partner", name: "Pamoja Partner", price: 75000, per: "month", best: "Growing brands", listings: "5",
    features: ["Up to 5 listings", "Homepage feature rotation", "3 featured deal placements / month", "Verified badge & brand story", "Advanced analytics"] }
];

export interface Boost { name: string; price: number | null; per: string; note?: string; }
export const boosts: Boost[] = [
  { name: "Daily Deal Boost", price: 10000, per: "day", note: "Flash deals and short offers" },
  { name: "Weekly Deal Boost", price: 40000, per: "week", note: "Sustained deal visibility" },
  { name: "Featured Brand Slot", price: 70000, per: "week", note: "Homepage or category visibility" },
  { name: "Social Media Feature", price: 5000, per: "post", note: "Promotion through Pamoja+ social channels" },
  { name: "Brand Story Package", price: null, per: "campaign", note: "Storytelling, design, campaign push" }
];

export interface PaymentMethod { name: string; type: string; note?: string; }
export const paymentMethods: PaymentMethod[] = [
  { name: "M-Pesa", type: "Mobile money", note: "Vodacom Tanzania" },
  { name: "Mixx by Yas", type: "Mobile money", note: "Yas Tanzania (formerly Tigo Pesa)" },
  { name: "Airtel Money", type: "Mobile money", note: "Airtel Tanzania" },
  { name: "Halopesa", type: "Mobile money", note: "Halotel" },
  { name: "AzamPesa", type: "Mobile money", note: "Azam Group" },
  { name: "T-Pesa", type: "Mobile money", note: "TTCL" },
  { name: "Bank Transfer", type: "Bank", note: "Larger businesses, annual plans, corporates" },
  { name: "Cash on Delivery / Pickup", type: "Cash", note: "Trust-building and early adoption" },
  { name: "Card Payments", type: "Card", note: "Month 3+ — diaspora, corporates, higher-value purchases" }
];

export interface SavingsClubBenefit { title: string; }
export const savingsClub = {
  monthly: 5000,
  yearly: 50000,
  status: "Coming soon",
  benefits: [
    "Early access to selected deals",
    "Member-only discounts",
    "Wellness challenges and reward points",
    "Birthday offers and partner benefits"
  ]
};
