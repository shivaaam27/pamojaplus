import { ScaffoldPage } from "@/components/admin/ScaffoldPage";

export default function AmbassadorsPage() {
  return (
    <ScaffoldPage
      eyebrow="Growth"
      title="Ambassadors"
      description="Leaderboard, attributed referrals, and pending payouts (with WHT) for the part-time street/digital team."
      schema={["ambassadors", "referrals", "ambassador_clicks", "v_ambassador_leaderboard", "payouts"]}
      workflows={[
        "Tracked referral links (/r/<code>) write ambassador_clicks",
        "When a seller approval cites a ref code → referrals row (joined_paid)",
        "Tier promotion (bronze → gold) based on signups + retention",
        "Payout cycle joins referrals → payouts with WHT calc"
      ]}
      next="Leaderboard from v_ambassador_leaderboard. Detail page per ambassador showing clicks-to-signup funnel. Tier promotion action gated on perm 'ambassadors.write'."
    />
  );
}
