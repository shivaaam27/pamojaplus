import { ScaffoldPage } from "@/components/admin/ScaffoldPage";

export default function ListingsPage() {
  return (
    <ScaffoldPage
      eyebrow="Operate"
      title="Listings moderation"
      description="Approve, request changes on, or reject new and edited listings. Auto-prioritised by risk (TMDA terms, new sellers, flags)."
      schema={["listings", "listing_reviews", "listing_flags", "listing_edits", "prohibited_keywords", "compliance_flags"]}
      workflows={[
        "Queue ordered by risk score (auto-flag hits, seller tenure, flag count)",
        "Approve → status='live'; Request changes → notification to seller",
        "Soft-block on prohibited_keywords hit until reviewed",
        "Edit history viewer via listing_edits (jsonb before/after)"
      ]}
      next="Build the queue + a detail panel that diffs the current listing vs. the proposed edit. Wire a server action to write listing_reviews and update listings.status."
    />
  );
}
