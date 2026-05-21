import { cookies } from "next/headers";
import { serverClient, supabaseConfigured, type DBSeller } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

const TIER_TONE = { gold: "yellow", silver: "ink", bronze: "green", none: "ink" } as const;

export default async function SellersPage() {
  let sellers: DBSeller[] = [];
  let error: string | null = null;

  if (supabaseConfigured) {
    const sb = serverClient(cookies());
    if (sb) {
      const { data, error: err } = await sb
        .from("sellers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (err) error = err.message; else sellers = (data ?? []) as DBSeller[];
    }
  } else {
    error = "Supabase env vars not set — using empty state.";
  }

  return (
    <>
      <PageHeader
        eyebrow="Operate"
        title="Sellers"
        description="The verified business directory. Manage plan, tier, and verification status."
        right={<Badge>{sellers.length} sellers</Badge>}
      />

      {error && (
        <Card className="mb-6 border-yellow bg-yellow-soft/40">
          <div className="text-sm"><strong>Heads-up:</strong> {error}</div>
        </Card>
      )}

      {sellers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No sellers yet"
          hint="Approve applications from the Onboarding queue to populate this directory."
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg text-ink-2 text-left">
              <tr>
                <th className="p-3 font-semibold">Business</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Plan</th>
                <th className="p-3 font-semibold">Tier</th>
                <th className="p-3 font-semibold">Verified</th>
                <th className="p-3 font-semibold">Response</th>
                <th className="p-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sellers.map((s) => (
                <tr key={s.id} className="hover:bg-bg/60">
                  <td className="p-3 font-semibold">{s.business_name}<div className="text-xs text-ink-2">{s.location}</div></td>
                  <td className="p-3">{s.category ?? "—"}</td>
                  <td className="p-3 capitalize">{s.plan}</td>
                  <td className="p-3"><Badge tone={TIER_TONE[s.tier ?? "none"]}>{s.tier ?? "none"}</Badge></td>
                  <td className="p-3">{s.verified ? <Badge>verified</Badge> : <Badge tone="ink">no</Badge>}</td>
                  <td className="p-3">{s.response_rate != null ? `${s.response_rate}%` : "—"}</td>
                  <td className="p-3 text-ink-2">{new Date(s.created_at).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
