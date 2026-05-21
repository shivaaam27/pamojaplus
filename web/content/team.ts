export interface Member {
  name: string;
  role: string;
  dept: "Leadership" | "Business Dev" | "Operations" | "Marketing" | "Tech" | "Finance";
  initials: string;
  bio?: string;
}

export const departments = [
  { id: "leadership", name: "Leadership & Strategy", color: "bg-green-soft text-green-dark" },
  { id: "bd",         name: "Business Development",  color: "bg-yellow-soft text-ink" },
  { id: "ops",        name: "Operations",            color: "bg-green-soft text-green-dark" },
  { id: "marketing",  name: "Marketing & Community", color: "bg-yellow-soft text-ink" },
  { id: "tech",       name: "Technology & Product",  color: "bg-green-soft text-green-dark" },
  { id: "finance",    name: "Finance & Admin",       color: "bg-yellow-soft text-ink" }
] as const;

export const team: Member[] = [
  { name: "TBD", role: "Managing Director", dept: "Leadership", initials: "MD",
    bio: "Direction, partnerships, revenue, accountability." },
  { name: "TBD", role: "Business Development Manager", dept: "Business Dev", initials: "BD",
    bio: "Onboard businesses, convert to paid packages." },
  { name: "TBD", role: "Operations Manager", dept: "Operations", initials: "OM",
    bio: "Keep listings, deals, and inquiries organized." },
  { name: "TBD", role: "Marketing & Community Manager", dept: "Marketing", initials: "MC",
    bio: "Brand, content, ambassadors, campaigns." },
  { name: "TBD", role: "Product & Technology Lead", dept: "Tech", initials: "PT",
    bio: "Platform, UX, analytics, integrations." },
  { name: "TBD", role: "Finance & Admin Officer", dept: "Finance", initials: "FA",
    bio: "Payments, invoices, expenses, records." }
];
