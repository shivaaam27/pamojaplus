import { ScaffoldPage } from "@/components/admin/ScaffoldPage";

export default function CompliancePage() {
  return (
    <ScaffoldPage
      eyebrow="Trust"
      title="Compliance"
      description="TMDA-aware listing flags, TBS standards checks, PDPC data-subject requests, and the rolling VAT-threshold meter."
      schema={["prohibited_keywords", "compliance_flags", "data_subject_requests", "consent_log", "v_vat_tracker"]}
      workflows={[
        "Auto-scan listing text on insert/update; create compliance_flags",
        "PDPC DSR queue with 30-day due_by timers",
        "Cookie/marketing consent_log searchable by subject",
        "VAT threshold progress bar (TZS 200M rolling 12m)"
      ]}
      next="Three cards: open compliance_flags by kind · open DSRs by due date · VAT meter. One server action per: 'Clear flag', 'Mark DSR fulfilled'."
    />
  );
}
