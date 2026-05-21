import { cookies } from "next/headers";
import { serverClient, supabaseConfigured, type DBAttentionItem } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { tzs, num } from "@/lib/format";
import { PageHeader } from "@/components/admin/PageHeader";
import { TrendingUp, Users, ShoppingBag, Coins, Megaphone, AlertCircle, MessageCircle } from "lucide-react";
import { DashboardCharts } from "./_charts";

export const dynamic = "force-dynamic";

interface Counts {
  sellers: number;
  listings_live: number;
  revenue_month_tzs: number;
  ambassadors_active: number;
  applications_new: number;
  inquiries_30d: number;
}

async function loadCounts(): Promise<{ counts: Counts | null; attention: DBAttentionItem[]; trend: { label: string; v: number }[]; error?: string }> {
  if (!supabaseConfigured) return { counts: null, attention: [], trend: [], error: "Supabase env vars not set — showing zeros." };
  const sb = serverClient(cookies());
  if (!sb) return { counts: null, attention: [], trend: [] };

  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);

  const [
    sellersRes, listingsRes, revenueRes, ambRes, appsRes, inqRes, attentionRes, trendRes
  ] = await Promise.all([
    sb.from("sellers").select("id", { count: "exact", head: true }),
    sb.from("listings").select("id", { count: "exact", head: true }).eq("status", "live"),
    sb.from("revenue_events").select("amount_tzs").gte("recorded_at", monthStart.toISOString()),
    sb.from("ambassadors").select("id", { count: "exact", head: true }).eq("active", true),
    sb.from("seller_applications").select("id", { count: "exact", head: true }).eq("status", "new"),
    sb.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 30*864e5).toISOString()),
    sb.from("v_attention_queue").select("*").order("at", { ascending: true }).limit(20),
    sb.from("revenue_events").select("amount_tzs, recorded_at").gte("recorded_at", new Date(Date.now() - 84*864e5).toISOString())
  ]);

  const revenue_month_tzs = (revenueRes.data ?? []).reduce((s: number, r: { amount_tzs: number }) => s + (r.amount_tzs ?? 0), 0);

  // Bucket trend into weeks
  const buckets: Record<string, number> = {};
  for (const r of (trendRes.data ?? []) as { amount_tzs: number; recorded_at: string }[]) {
    const d = new Date(r.recorded_at);
    const wk = `${d.getUTCFullYear()}-W${Math.ceil((d.getUTCDate() + 6 - d.getUTCDay()) / 7)}`;
    buckets[wk] = (buckets[wk] ?? 0) + r.amount_tzs;
  }
  const trend = Object.entries(buckets).slice(-12).map(([label, v]) => ({ label, v }));

  return {
    counts: {
      sellers: sellersRes.count ?? 0,
      listings_live: listingsRes.count ?? 0,
      revenue_month_tzs,
      ambassadors_active: ambRes.count ?? 0,
      applications_new: appsRes.count ?? 0,
      inquiries_30d: inqRes.count ?? 0
    },
    attention: (attentionRes.data ?? []) as DBAttentionItem[],
    trend
  };
}

const ATTENTION_LABEL: Record<DBAttentionItem["kind"], string> = {
  kyc: "KYC",
  listing_mod: "Listing",
  flag: "Flag",
  dispute: "Dispute",
  compliance: "Compliance",
  unresponsive: "Inquiry"
};

const ATTENTION_TONE: Record<DBAttentionItem["kind"], "green" | "yellow" | "ink"> = {
  kyc: "yellow",
  listing_mod: "green",
  flag: "ink",
  dispute: "ink",
  compliance: "ink",
  unresponsive: "yellow"
};

export default async function DashboardPage() {
  const { counts, attention, trend, error } = await loadCounts();
  const c = counts ?? { sellers: 0, listings_live: 0, revenue_month_tzs: 0, ambassadors_active: 0, applications_new: 0, inquiries_30d: 0 };

  const kpis = [
    { label: "Total Sellers",       value: c.sellers,             icon: Users,         tone: "green",  isCurrency: false },
    { label: "Active Listings",     value: c.listings_live,       icon: ShoppingBag,   tone: "green",  isCurrency: false },
    { label: "Revenue (Month)",     value: c.revenue_month_tzs,   icon: Coins,         tone: "yellow", isCurrency: true  },
    { label: "Active Ambassadors",  value: c.ambassadors_active,  icon: Megaphone,     tone: "green",  isCurrency: false },
    { label: "New Applications",    value: c.applications_new,    icon: TrendingUp,    tone: "yellow", isCurrency: false },
    { label: "Inquiries (30d)",     value: c.inquiries_30d,       icon: MessageCircle, tone: "green",  isCurrency: false }
  ] as const;

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Live numbers from Supabase. Update cadence: Monday review."
        right={<Badge tone={error ? "yellow" : "green"}>{error ? "ZEROS" : "LIVE"}</Badge>}
      />

      {error && (
        <Card className="mb-6 border-yellow bg-yellow-soft/40">
          <div className="text-sm">{error}</div>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {kpis.map((k) => (
          <Card key={k.label}>
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.tone === "yellow" ? "bg-yellow-soft text-ink" : "bg-green-soft text-green-dark"}`}>
                <k.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 text-sm text-ink-2">{k.label}</div>
            <div className="font-display font-extrabold text-3xl mt-1">
              {k.isCurrency ? tzs(k.value) : num(k.value)}
            </div>
          </Card>
        ))}
      </div>

      <DashboardCharts trend={trend} />

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="font-display font-extrabold text-lg">Needs attention</div>
          <Badge tone="ink">{attention.length} open</Badge>
        </div>
        {attention.length === 0 ? (
          <div className="text-sm text-ink-2 py-6 text-center">Inbox zero — nothing pending across KYC, moderation, disputes, compliance, or stale inquiries. 🎉</div>
        ) : (
          <ul className="divide-y divide-line">
            {attention.map((a) => (
              <li key={`${a.kind}-${a.ref}`} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <AlertCircle className="w-5 h-5 text-ink-2 shrink-0" />
                  <span className="font-medium truncate">{a.label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge tone={ATTENTION_TONE[a.kind]}>{ATTENTION_LABEL[a.kind]}</Badge>
                  <span className="text-xs text-ink-2 hidden sm:inline">{new Date(a.at).toLocaleDateString("en-GB")}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
