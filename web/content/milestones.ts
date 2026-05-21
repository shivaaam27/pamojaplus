export interface Milestone {
  date: string;
  title: string;
  description: string;
  icon: "star" | "check" | "trophy" | "rocket" | "users" | "money";
  featured?: boolean;
}

export const milestones: Milestone[] = [
  { date: "2026-01-15", title: "Pamoja+ Concept Locked", description: "Brand, mission, and 3-month plan signed off.", icon: "star", featured: true },
  { date: "2026-02-01", title: "Company Registered", description: "BRELA incorporation + TIN obtained.", icon: "check" },
  { date: "2026-02-10", title: "Mobile Money Live", description: "M-Pesa, Mixx by Yas, Airtel Money merchant accounts active.", icon: "money" },
  { date: "2026-02-20", title: "First 10 Sellers", description: "First verified businesses onboarded in Dar es Salaam.", icon: "users", featured: true },
  { date: "2026-03-05", title: "Soft Launch on Social", description: "First Deal of the Day series live.", icon: "rocket" },
  { date: "2026-03-20", title: "5 Ambassadors Active", description: "Referral pilot generating first leads.", icon: "users" },
  { date: "2026-04-10", title: "First Paid Subscription", description: "Pamoja Growth plan activated.", icon: "money", featured: true },
  { date: "2026-04-25", title: "First Brand Spotlight", description: "Sponsored campaign signed with a wellness brand.", icon: "trophy", featured: true }
];
