import { ScaffoldPage } from "@/components/admin/ScaffoldPage";

export default function DisputesPage() {
  return (
    <ScaffoldPage
      eyebrow="Trust"
      title="Disputes"
      description="Buyer/seller conflicts with SLA timers. Even pre-checkout, log direct WhatsApp complaints here so you build a real record."
      schema={["disputes", "dispute_messages", "orders"]}
      workflows={[
        "Open → mediation → resolved (buyer/seller) or escalated",
        "SLA: 24h initial response, 72h decision (sla_due_at)",
        "Mediator-only resolution actions (RLS: disputes.mediate)",
        "Closed disputes feed buyer-protection guarantee payouts"
      ]}
      next="List view sorted by sla_due_at ascending. Thread view with dispute_messages. Buyer-protection cap config in admin settings."
    />
  );
}
