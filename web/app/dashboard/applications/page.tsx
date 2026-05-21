import { cookies } from "next/headers";
import { serverClient, supabaseConfigured, type DBSellerApplication } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { ClipboardList } from "lucide-react";
import { ActionRow } from "./ActionRow";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<DBSellerApplication["status"], "green" | "yellow" | "ink"> = {
  new: "yellow",
  reviewing: "yellow",
  approved: "green",
  rejected: "ink"
};

export default async function ApplicationsPage() {
  let apps: DBSellerApplication[] = [];
  let error: string | null = null;

  if (supabaseConfigured) {
    const sb = serverClient(cookies());
    if (sb) {
      const { data, error: err } = await sb
        .from("seller_applications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (err) error = err.message; else apps = (data ?? []) as DBSellerApplication[];
    }
  } else {
    error = "Supabase env vars not set — using empty state.";
  }

  const counts = apps.reduce((acc, a) => { acc[a.status] = (acc[a.status] ?? 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <>
      <PageHeader
        eyebrow="Operate"
        title="Onboarding queue"
        description="Every seller pitch that comes through /sellers/apply. Triage daily — Lead → Reviewing → Approved or Rejected."
        right={
          <div className="flex gap-2">
            <Badge tone="yellow">{counts.new ?? 0} new</Badge>
            <Badge>{counts.reviewing ?? 0} reviewing</Badge>
            <Badge tone="ink">{counts.approved ?? 0} approved</Badge>
          </div>
        }
      />

      {error && (
        <Card className="mb-6 border-yellow bg-yellow-soft/40">
          <div className="text-sm"><strong>Heads-up:</strong> {error}</div>
        </Card>
      )}

      {apps.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          hint="When sellers submit the /sellers/apply form, they appear here. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to see live data."
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg text-ink-2 text-left">
              <tr>
                <th className="p-3 font-semibold">Business</th>
                <th className="p-3 font-semibold">Owner</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Location</th>
                <th className="p-3 font-semibold">Submitted</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {apps.map((a) => (
                <tr key={a.id} className="hover:bg-bg/60">
                  <td className="p-3 font-semibold">{a.business_name}</td>
                  <td className="p-3">{a.owner_name}<div className="text-xs text-ink-2">{a.whatsapp}</div></td>
                  <td className="p-3">{a.category}</td>
                  <td className="p-3">{a.location}</td>
                  <td className="p-3 text-ink-2">{new Date(a.created_at).toLocaleDateString("en-GB")}</td>
                  <td className="p-3"><Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge></td>
                  <td className="p-3 text-right"><ActionRow id={a.id} status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
