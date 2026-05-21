import { ScaffoldPage } from "@/components/admin/ScaffoldPage";

export default function PayoutsPage() {
  return (
    <ScaffoldPage
      eyebrow="Money"
      title="Payouts"
      description="Weekly batch of seller settlements and ambassador rewards. Includes withholding-tax (WHT) calculation per TRA rules."
      schema={["payouts (gross/wht/fees/net)", "v_ambassador_leaderboard"]}
      workflows={[
        "Inngest job builds the scheduled payout batch every Thursday",
        "Finance reviews, approves (RLS: payouts.approve only)",
        "WHT auto-computed for ambassadors (5% on resident service fees)",
        "On 'paid', stores mmo_ref for reconciliation"
      ]}
      next="Build the approval queue (scheduled → approved → paid). One-click 'Generate this week's batch' action that runs the SQL aggregation."
    />
  );
}
