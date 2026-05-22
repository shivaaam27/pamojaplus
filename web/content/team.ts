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
  { name: "Pulin Malek", role: "Managing Director", dept: "Leadership", initials: "PM",
    bio: "Direction, business model, partnerships, growth." },
  { name: "Shivam Parmar", role: "Business Development & Operations Manager", dept: "Business Dev", initials: "SP",
    bio: "Seller acquisition, partnerships, revenue. Also leads Technology & Product." },
  { name: "Disha Tulsidas", role: "Marketplace Operations Manager", dept: "Operations", initials: "DT",
    bio: "Listings, deals, customer flow, daily quality." },
  { name: "Juned & Disha", role: "Marketing & Community Coordinator", dept: "Marketing", initials: "JD",
    bio: "Brand, content, campaigns, ambassadors." },
  { name: "Shivam Parmar", role: "Product / Technology Lead", dept: "Tech", initials: "SP",
    bio: "Platform, UX, data, features." },
  { name: "Hriday Solanki", role: "Finance & Admin Manager", dept: "Finance", initials: "HS",
    bio: "Payments, records, contracts, compliance." }
];
