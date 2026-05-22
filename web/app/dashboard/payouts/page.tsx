import { cookies } from "next/headers";
import Link from "next/link";
import { serverClient, supabaseConfigured, type DBPayout } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { tzs } from "@/lib/format";
import { Banknote } from "lucide-react";
import { PayoutButtons } from "./PayoutButtons";
import { NewPayout } from "./NewPayout";

export const dynamic = "force-dynamic";

interface Row extends DBPayout {
  sellers:     { id: string; business_name: string } | { id: string; business_name: string }[] | null;
  ambassadors: { id: string; name: string }          | { id: string; name: string }[]          | null;
}

const STATUS_TONE: Record<string, "green" | "yellow" | "ink"> = {
  scheduled: "yellow", approved: "yellow", paid: "green", failed: "ink", on_hold: "ink"
};

export default async function PayoutsPage({ searchParams }: { searchParams: { f?: string } }) {
  const f = (searchParams.f ?? "open") as "open" | "paid" | "all";
  let rows: Row[] = [];
  let sellers: { id: string; label: string }[] = [];
  let ambassadors: { id: string; label: string }[] = [];
  let error: string | null = null;

  if (!supabaseConfigured) error = "Supabase env vars not set.";
  else {
    const sb = serverClient(cookies())!;
    let q = sb.from("payouts")
      .select("*, sellers(id, business_name), ambassadors(id, name)")
      .order("created_at", { ascending: false }).limit(200);
    if (f === "open") q = q.in("status", ["scheduled", "approved", "on_hold"]);
    if (f === "paid") q = q.eq("status", "paid");
    const r = await q;
    if (r.error) error = r.error.message; else rows = (r.data ?? []) as unknown as Row[];

    const [s, a] = await Promise.all([
      sb.from("sellers").select("id, business_name").order("business_name").limit(500),
      sb.from("ambassadors").select("id, name, referral_code").order("name").limit(500)
    ]);
    sellers     = (s.data ?? []).map((x: { id: string; business_name: string }) => ({ id: x.id, label: x.business_name }));
    ambassadors = (a.data ?? []).map((x: { id: string; name: string; referral_code: string }) => ({ id: x.id, label: `${x.name} (${x.referral_code})` }));
  }

  const totalPending = rows.filter((r) => r.status !== "paid").reduce((s, r) => s + r.net_tzs, 0);

  return (
    <>
      <PageHeader
        eyebrow="Money"
        title="Payouts"
        description="Schedule, approve, and mark paid. WHT 5% is auto-deducted for ambassadors."
        right={
          <div className="flex gap-2">
            <a href="?f=open" className={f === "open" ? "" : "opacity-60"}><Badge tone="yellow">open</Badge></a>
            <a href="?f=paid" className={f === "paid" ? "" : "opacity-60"}><Badge>paid</Badge></a>
            <a href="?f=all"  className={f === "all"  ? "" : "opacity-60"}><Badge tone="ink">all</Badge></a>
          </div>
        }
      />

      <Card className="mb-6">
        <div className="font-display font-extrabold text-lg mb-3">Schedule a payout</div>
        <NewPayout sellers={sellers} ambassadors={ambassadors} />
      </Card>

      {error && <Card className="mb-6 border-yellow bg-yellow-soft/40"><div className="text-sm">{error}</div></Card>}

      {rows.length === 0 ? (
        <EmptyState icon={Banknote} title="No payouts in this view"
          hint="Schedule the first one above. Ambassadors with paid referrals are good candidates for the weekly batch." />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="px-4 py-2 bg-bg text-xs text-ink-2">Pending payouts total: <strong className="text-ink">{tzs(totalPending)}</strong></div>
          <table className="w-full text-sm">
            <thead className="bg-bg text-ink-2 text-left">
              <tr>
                <th className="p-3 font-semibold">Created</th>
                <th className="p-3 font-semibold">Recipient</th>
                <th className="p-3 font-semibold text-right">Gross</th>
                <th className="p-3 font-semibold text-right">WHT</th>
                <th className="p-3 font-semibold text-right">Fees</th>
                <th className="p-3 font-semibold text-right">Net</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Ref</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => {
                const seller = Array.isArray(r.sellers) ? r.sellers[0] : r.sellers;
                const amb    = Array.isArray(r.ambassadors) ? r.ambassadors[0] : r.ambassadors;
                return (
                  <tr key={r.id} className="hover:bg-bg/60">
                    <td className="p-3 text-ink-2 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("en-GB")}</td>
                    <td className="p-3">
                      {seller ? <Link href={`/dashboard/sellers/${seller.id}`} className="font-semibold hover:text-green-dark">{seller.business_name}</Link>
                              : amb ? <span className="font-semibold">{amb.name}</span>
                              : <span className="text-ink-2">—</span>}
                      <div className="text-xs text-ink-2">{seller ? "seller" : amb ? "ambassador" : ""}</div>
                    </td>
                    <td className="p-3 text-right">{tzs(r.gross_tzs)}</td>
                    <td className="p-3 text-right text-ink-2">{tzs(r.wht_tzs)}</td>
                    <td className="p-3 text-right text-ink-2">{tzs(r.fees_tzs)}</td>
                    <td className="p-3 text-right font-bold text-green-dark">{tzs(r.net_tzs)}</td>
                    <td className="p-3"><Badge tone={STATUS_TONE[r.status] ?? "ink"}>{r.status}</Badge></td>
                    <td className="p-3 font-mono text-xs">{r.mmo_ref ?? "—"}</td>
                    <td className="p-3 text-right"><PayoutButtons id={r.id} status={r.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
