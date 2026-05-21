import { ScaffoldPage } from "@/components/admin/ScaffoldPage";

export default function KycPage() {
  return (
    <ScaffoldPage
      eyebrow="Operate · Trust"
      title="KYC review"
      description="Approve seller identity & business documents. Drives the Verified badge and tier (Bronze → Silver → Gold)."
      schema={["seller_documents", "verification_events", "sellers.tier"]}
      workflows={[
        "Side-by-side doc viewer (image + extracted fields)",
        "Approve / reject with reason → writes verification_events",
        "Tier auto-suggests based on doc set + tenure + response rate",
        "Optional: Smile ID auto-verification webhook"
      ]}
      next="UI: queue list filtered by status='pending', detail drawer with image preview, approve/reject actions calling a server action that updates seller_documents + creates verification_events row."
    />
  );
}
