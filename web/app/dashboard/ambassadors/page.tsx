import { cookies } from "next/headers";
import { serverClient, supabaseConfigured, type DBAmbassadorBoard } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { tzs } from "@/lib/format";
import { Megaphone } from "lucide-react";
import { CreateForm } from "./CreateForm";
import { RefLink } from "./RefLink";

export const dynamic = "force-dynamic";

const TIER_TONE = { gold: "yellow", silver: "ink", bronze: "green", none: "ink" } as const;

export default async function AmbassadorsPage() {
  let rows: DBAmbassadorBoard[] = [];
  let error: string | null = null;

  if (!supabaseConfigured) {
    error = "Supabase env vars not set.";
  } else {
    const sb = serverClient(cookies())!;
    const { data, error: err } = await sb
      .from("v_ambassador_leaderboard")
      .select("*")
      .order("signups", { ascending: false })
      .limit(200);
    if (err) error = err.message; else rows = (data ?? []) as DBAmbassadorBoard[];
  }

  return (
    <>
      <PageHeader
        eyebrow="Growth"
        title="Ambassadors"
        description="Tracked referral links, signups, and payouts. Share /r/<code> on socials; clicks attribute via 30-day cookie."
        right={<Badge>{rows.length} active</Badge>}
      />

      <Card className="mb-6">
        <div className="font-display font-extrabold text-lg mb-3">Add ambassador</div>
        <CreateForm />
      </Card>

      {error && (
        <Card className="mb-6 border-yellow bg-yellow-soft/40">
          <div className="text-sm"><strong>Heads-up:</strong> {error}</div>
        </Card>
      )}

      {rows.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No ambassadors yet"
          hint="Use the form above to add the first one. Their /r/<code> link can be shared immediately."
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg text-ink-2 text-left">
              <tr>
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Tier</th>
                <th className="p-3 font-semibold">Link</th>
                <th className="p-3 font-semibold">Clicks (30d)</th>
                <th className="p-3 font-semibold">Signups</th>
                <th className="p-3 font-semibold">Paid</th>
                <th className="p-3 font-semibold">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((a) => (
                <tr key={a.id} className="hover:bg-bg/60">
                  <td className="p-3 font-semibold">{a.name}</td>
                  <td className="p-3"><Badge tone={TIER_TONE[a.tier ?? "none"]}>{a.tier ?? "none"}</Badge></td>
                  <td className="p-3"><RefLink code={a.referral_code} /></td>
                  <td className="p-3">{a.clicks_30d}</td>
                  <td className="p-3">{a.signups}</td>
                  <td className="p-3">{a.paid_signups}</td>
                  <td className="p-3 font-bold text-green-dark">{tzs(a.paid_total_tzs ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
