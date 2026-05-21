import { cookies } from "next/headers";
import Link from "next/link";
import { serverClient, supabaseConfigured } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { tzs } from "@/lib/format";
import { Coins } from "lucide-react";
import { RecordForm } from "./RecordForm";

export const dynamic = "force-dynamic";

interface RevenueRow {
  id: string;
  type: string;
  amount_tzs: number;
  mobile_money_ref: string | null;
  recorded_at: string;
  period_start: string | null;
  period_end: string | null;
  sellers: { id: string; business_name: string } | { id: string; business_name: string }[] | null;
}

interface VatRow { last_12m_tzs: number; threshold_tzs: number; }

export default async function RevenuePage() {
  let rows: RevenueRow[] = [];
  let sellers: { id: string; business_name: string }[] = [];
  let vat: VatRow | null = null;
  let error: string | null = null;

  if (!supabaseConfigured) {
    error = "Supabase env vars not set.";
  } else {
    const sb = serverClient(cookies())!;
    const [r, s, v] = await Promise.all([
      sb.from("revenue_events")
        .select("id, type, amount_tzs, mobile_money_ref, recorded_at, period_start, period_end, sellers(id, business_name)")
        .order("recorded_at", { ascending: false })
        .limit(200),
      sb.from("sellers").select("id, business_name").order("business_name").limit(500),
      sb.from("v_vat_tracker").select("*").maybeSingle()
    ]);
    if (r.error) error = r.error.message; else rows = (r.data ?? []) as unknown as RevenueRow[];
    sellers = (s.data ?? []) as typeof sellers;
    vat = (v.data ?? null) as VatRow | null;
  }

  const pct = vat ? Math.min(100, Math.round((Number(vat.last_12m_tzs) / Number(vat.threshold_tzs)) * 100)) : 0;
  const total30 = rows
    .filter((r) => new Date(r.recorded_at) > new Date(Date.now() - 30 * 864e5))
    .reduce((s, r) => s + r.amount_tzs, 0);

  return (
    <>
      <PageHeader
        eyebrow="Money"
        title="Revenue ledger"
        description="Every TZS in. Manual entry for now; the Selcom/Clickpesa webhook will auto-write here in Q2."
        right={<Badge>{tzs(total30)} · last 30d</Badge>}
      />

      <Card className="mb-6">
        <div className="font-display font-extrabold text-lg mb-3">Record a revenue event</div>
        <RecordForm sellers={sellers} />
      </Card>

      {vat && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-display font-extrabold text-lg">VAT threshold tracker</div>
              <div className="text-xs text-ink-2">Rolling 12 months · register at {tzs(Number(vat.threshold_tzs))}</div>
            </div>
            <Badge tone={pct >= 80 ? "yellow" : "green"}>{pct}%</Badge>
          </div>
          <div className="w-full h-3 bg-bg rounded-full overflow-hidden">
            <div className={`h-full ${pct >= 80 ? "bg-yellow" : "bg-green"}`} style={{ width: `${pct}%` }} />
          </div>
          <div className="text-sm mt-2 text-ink-2">{tzs(Number(vat.last_12m_tzs))} of {tzs(Number(vat.threshold_tzs))}</div>
        </Card>
      )}

      {error && (
        <Card className="mb-6 border-yellow bg-yellow-soft/40">
          <div className="text-sm"><strong>Heads-up:</strong> {error}</div>
        </Card>
      )}

      {rows.length === 0 ? (
        <EmptyState icon={Coins} title="No revenue events yet" hint="Use the form above to log the first one (Pamoja Growth subscription, boost, etc)." />
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg text-ink-2 text-left">
              <tr>
                <th className="p-3 font-semibold">When</th>
                <th className="p-3 font-semibold">Seller</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Period</th>
                <th className="p-3 font-semibold">MM ref</th>
                <th className="p-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => {
                const seller = Array.isArray(r.sellers) ? r.sellers[0] : r.sellers;
                return (
                  <tr key={r.id} className="hover:bg-bg/60">
                    <td className="p-3 text-ink-2 whitespace-nowrap">{new Date(r.recorded_at).toLocaleDateString("en-GB")}</td>
                    <td className="p-3">{seller ? <Link href={`/dashboard/sellers/${seller.id}`} className="font-semibold hover:text-green-dark">{seller.business_name}</Link> : <span className="text-ink-2">—</span>}</td>
                    <td className="p-3 capitalize">{r.type}</td>
                    <td className="p-3 text-ink-2 whitespace-nowrap">{r.period_start ? `${r.period_start} → ${r.period_end ?? ""}` : "—"}</td>
                    <td className="p-3 font-mono text-xs">{r.mobile_money_ref ?? "—"}</td>
                    <td className="p-3 text-right font-bold text-green-dark">{tzs(r.amount_tzs)}</td>
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
