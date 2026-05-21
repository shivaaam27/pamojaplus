import { ScaffoldPage } from "@/components/admin/ScaffoldPage";

export default function RevenuePage() {
  return (
    <ScaffoldPage
      eyebrow="Money"
      title="Revenue ledger"
      description="Every TZS in. Subscriptions, boosts, spotlights, commissions — reconcilable to bank + mobile-money statements."
      schema={["revenue_events", "payment_intents", "boosts", "spotlights", "v_vat_tracker"]}
      workflows={[
        "Auto-write from payment_intents.status='succeeded' webhook",
        "Manual entry form for cash / direct mobile-money payments",
        "Reconciliation view: bank statement CSV ⇄ revenue_events",
        "VAT-threshold meter (TZS 200M rolling 12m) — warns at 80%"
      ]}
      next="Wire the manual entry form (server action → revenue_events insert). Add a Recharts line of monthly revenue + a v_vat_tracker progress bar."
    />
  );
}
