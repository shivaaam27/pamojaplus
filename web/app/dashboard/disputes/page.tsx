import { cookies } from "next/headers";
import Link from "next/link";
import { serverClient, supabaseConfigured, type DBDispute } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { AlertTriangle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

interface Row extends DBDispute {
  orders: { id: string; seller_id: string; sellers: { id: string; business_name: string } | { id: string; business_name: string }[] | null } | { id: string; seller_id: string; sellers: { id: string; business_name: string } | { id: string; business_name: string }[] | null }[] | null;
}

const TONE: Record<string, "green" | "yellow" | "ink"> = {
  open: "yellow", mediation: "yellow", escalated: "ink",
  resolved_buyer: "green", resolved_seller: "green", closed: "ink"
};

export default async function DisputesPage({ searchParams }: { searchParams: { f?: string } }) {
  const f = (searchParams.f ?? "open") as "open" | "closed" | "all";
  let rows: Row[] = [];
  let error: string | null = null;

  if (!supabaseConfigured) error = "Supabase env vars not set.";
  else {
    const sb = serverClient(cookies())!;
    let q = sb.from("disputes")
      .select("*, orders(id, seller_id, sellers(id, business_name))")
      .order("opened_at", { ascending: true }).limit(200);
    if (f === "open")   q = q.in("status", ["open", "mediation", "escalated"]);
    if (f === "closed") q = q.in("status", ["resolved_buyer", "resolved_seller", "closed"]);
    const r = await q;
    if (r.error) error = r.error.message; else rows = (r.data ?? []) as unknown as Row[];
  }

  return (
    <>
      <PageHeader
        eyebrow="Trust"
        title="Disputes"
        description="Open conflicts on orders. SLA: 24h first reply, 72h decision."
        right={
          <div className="flex gap-2">
            <a href="?f=open"   className={f === "open"   ? "" : "opacity-60"}><Badge tone="yellow">open</Badge></a>
            <a href="?f=closed" className={f === "closed" ? "" : "opacity-60"}><Badge>closed</Badge></a>
            <a href="?f=all"    className={f === "all"    ? "" : "opacity-60"}><Badge tone="ink">all</Badge></a>
          </div>
        }
      />

      {error && <Card className="mb-6 border-yellow bg-yellow-soft/40"><div className="text-sm">{error}</div></Card>}

      {rows.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="No disputes in this view"
          hint="Disputes are opened from order details (Q2 when checkout goes live). Until then, log buyer complaints here manually with a placeholder order." />
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const order = Array.isArray(r.orders) ? r.orders[0] : r.orders;
            const seller = order && (Array.isArray(order.sellers) ? order.sellers[0] : order.sellers);
            const overdue = r.sla_due_at && new Date(r.sla_due_at) < new Date() && ["open", "mediation"].includes(r.status);
            return (
              <Link key={r.id} href={`/dashboard/disputes/${r.id}`} className="block">
                <Card className="hover:border-green hover:shadow-lift transition">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge tone={TONE[r.status] ?? "ink"}>{r.status}</Badge>
                        {seller && <span className="text-xs font-bold uppercase tracking-widest text-green">{seller.business_name}</span>}
                        {overdue && <span className="inline-flex items-center gap-1 text-xs font-bold text-danger"><Clock className="w-3 h-3" /> SLA breach</span>}
                      </div>
                      <div className="font-display font-extrabold">{r.reason}</div>
                      <div className="text-xs text-ink-2 mt-1">Opened by {r.opened_by} · {new Date(r.opened_at).toLocaleDateString("en-GB")}</div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
