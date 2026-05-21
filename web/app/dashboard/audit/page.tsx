import { ScaffoldPage } from "@/components/admin/ScaffoldPage";

export default function AuditPage() {
  return (
    <ScaffoldPage
      eyebrow="System"
      title="Audit log"
      description="Who did what, when. Auto-populated by the audit_row_change() trigger on high-value tables. Your evidence base for disputes and PDPC requests."
      schema={["audit_log", "team_users"]}
      workflows={[
        "Filter: by actor, by entity_table, by date range",
        "Diff viewer: before/after jsonb side-by-side",
        "Export CSV for legal/regulator requests",
        "Read access gated by permission 'audit.read'"
      ]}
      next="Searchable, paginated table querying audit_log with the diff viewer drawer. Add an /api/audit/export route for CSV."
    />
  );
}
