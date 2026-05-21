import { cookies } from "next/headers";
import { serverClient, supabaseConfigured, type DBSellerApplication } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { ClipboardList } from "lucide-react";
import { ApplicationRow } from "./ApplicationRow";

export const dynamic = "force-dynamic";

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
        description="Every seller pitch that comes through /sellers/apply. Click a row to see the full pitch — description, socials, contact."
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
          hint="Pitches submitted from the public /sellers/apply form land here. Share that link with leads."
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg text-ink-2 text-left">
              <tr>
                <th className="p-3 font-semibold w-8"></th>
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
              {apps.map((a) => <ApplicationRow key={a.id} a={a} />)}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
