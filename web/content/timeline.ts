export type Track = "Business" | "Legal" | "Product";
export type Status = "done" | "active" | "upcoming";

export interface TimelineNode {
  week: number;
  month: 1 | 2 | 3;
  title: string;
  summary: string;
  track: Track;
  status: Status;
  actions: string[];
}

export const timeline: TimelineNode[] = [
  { week: 1, month: 1, title: "Internal Setup", summary: "Foundations, team roles, workflows.", track: "Product", status: "done",
    actions: ["Finalize pricing & seller pitch", "Build onboarding form", "Internal dashboard mock", "Invoice & receipt templates"] },
  { week: 2, month: 1, title: "Seller Preparation", summary: "Build pipeline of first 50 leads.", track: "Business", status: "done",
    actions: ["Lead list of 50 businesses", "Pitch messages drafted", "Cold-contact first 10 sellers"] },
  { week: 3, month: 1, title: "First Onboarding", summary: "Onboard 10–15 verified sellers.", track: "Business", status: "active",
    actions: ["Verify business details", "Collect product photos", "Publish first 30–50 listings"] },
  { week: 4, month: 1, title: "Soft Launch", summary: "Announce on IG/TikTok/FB.", track: "Business", status: "upcoming",
    actions: ["Deal of the Day posts", "Brand spotlights", "Collect feedback"] },
  { week: 5, month: 2, title: "Listing Cleanup", summary: "Polish marketplace quality.", track: "Product", status: "upcoming",
    actions: ["Audit descriptions", "Remove weak listings", "Content calendar"] },
  { week: 6, month: 2, title: "Grow Supply", summary: "Add 10–15 sellers in winning categories.", track: "Business", status: "upcoming",
    actions: ["Contact 20–30 leads", "Tag paid-boost candidates"] },
  { week: 7, month: 2, title: "Ambassador Pilot", summary: "Recruit and activate first 5–10 ambassadors.", track: "Business", status: "upcoming",
    actions: ["Sign ambassador agreements", "Referral tracking sheet", "First payout cycle"] },
  { week: 8, month: 2, title: "Paid Boost Pilot", summary: "Test paid visibility & review.", track: "Business", status: "upcoming",
    actions: ["TZS 25k weekly boost", "Featured slot test", "Mid-quarter review"] },
  { week: 9, month: 3, title: "Paid Plans Live", summary: "Launch Growth & Plus subscriptions.", track: "Business", status: "upcoming",
    actions: ["Pitch upgrade to top 10 sellers", "Mobile money billing"] },
  { week: 10, month: 3, title: "Trust System", summary: "Verified badges & testimonials.", track: "Product", status: "upcoming",
    actions: ["Verified Seller badge", "Response-rate stars", "5+ testimonials"] },
  { week: 11, month: 3, title: "Brand Spotlight", summary: "Sign first sponsored campaigns.", track: "Business", status: "upcoming",
    actions: ["Pitch 5 brands", "Aim for 1–2 signed", "Campaign push"] },
  { week: 12, month: 3, title: "Review & Plan Q2", summary: "Decide next-quarter direction.", track: "Legal", status: "upcoming",
    actions: ["Revenue review", "City expansion call", "Hiring plan"] }
];
