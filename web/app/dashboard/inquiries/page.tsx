import { cookies } from "next/headers";
import Link from "next/link";
import { serverClient, supabaseConfigured } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { MessageCircle } from "lucide-react";
import { InquiryActions } from "./InquiryActions";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  channel: string;
  shopper_name: string | null;
  shopper_phone: string | null;
  message: string | null;
  responded: boolean;
  converted: boolean;
  created_at: string;
  listings: { id: string; title: string } | { id: string; title: string }[] | null;
  sellers: { id: string; business_name: string } | { id: string; business_name: string }[] | null;
}

type Filter = "all" | "open" | "responded" | "converted" | "stale";

export default async function InquiriesPage({ searchParams }: { searchParams: { f?: string } }) {
  const f = (searchParams.f ?? "open") as Filter;
  let rows: Row[] = [];
  let error: string | null = null;

  if (!supabaseConfigured) {
    error = "Supabase env vars not set.";
  } else {
    const sb = serverClient(cookies())!;
    let q = sb
      .from("inquiries")
      .select("id, channel, shopper_name, shopper_phone, message, responded, converted, created_at, listings(id, title), sellers(id, business_name)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (f === "open")       q = q.eq("responded", false);
    if (f === "responded")  q = q.eq("responded", true).eq("converted", false);
    if (f === "converted")  q = q.eq("converted", true);
    if (f === "stale")      q = q.eq("responded", false).lt("created_at", new Date(Date.now() - 48*3600*1000).toISOString());
    const { data, error: err } = await q;
    if (err) error = err.message; else rows = (data ?? []) as unknown as Row[];
  }

  return (
    <>
      <PageHeader
        eyebrow="Operate"
        title="Inquiries"
        description="Every WhatsApp/phone/email lead logged by /api/inquiry. Mark responded → drives response_rate. Mark converted → counts toward seller revenue stories."
        right={
          <div className="flex gap-2 flex-wrap">
            <a href="?f=open"      className={f === "open"      ? "" : "opacity-60"}><Badge tone="yellow">open</Badge></a>
            <a href="?f=stale"     className={f === "stale"     ? "" : "opacity-60"}><Badge tone="ink">stale &gt;48h</Badge></a>
            <a href="?f=responded" className={f === "responded" ? "" : "opacity-60"}><Badge>responded</Badge></a>
            <a href="?f=converted" className={f === "converted" ? "" : "opacity-60"}><Badge>converted</Badge></a>
            <a href="?f=all"       className={f === "all"       ? "" : "opacity-60"}><Badge tone="ink">all</Badge></a>
          </div>
        }
      />

      {error && (
        <Card className="mb-6 border-yellow bg-yellow-soft/40">
          <div className="text-sm"><strong>Heads-up:</strong> {error}</div>
        </Card>
      )}

      {rows.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="No inquiries in this view"
          hint={
            f === "open" || f === "stale"
              ? "Nothing to chase — every inquiry has been responded to. 🎉"
              : "Inquiries are recorded automatically when shoppers tap WhatsApp on a public listing. They'll appear here as activity grows."
          }
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg text-ink-2 text-left">
              <tr>
                <th className="p-3 font-semibold">When</th>
                <th className="p-3 font-semibold">Seller</th>
                <th className="p-3 font-semibold">Listing</th>
                <th className="p-3 font-semibold">Shopper</th>
                <th className="p-3 font-semibold">Channel</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => {
                const seller = Array.isArray(r.sellers) ? r.sellers[0] : r.sellers;
                const listing = Array.isArray(r.listings) ? r.listings[0] : r.listings;
                return (
                  <tr key={r.id} className="hover:bg-bg/60">
                    <td className="p-3 text-ink-2 whitespace-nowrap">{new Date(r.created_at).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}</td>
                    <td className="p-3">
                      {seller ? <Link href={`/dashboard/sellers/${seller.id}`} className="font-semibold hover:text-green-dark">{seller.business_name}</Link> : <span className="text-ink-2">—</span>}
                    </td>
                    <td className="p-3 truncate max-w-[16rem]">{listing?.title ?? <span className="text-ink-2">—</span>}</td>
                    <td className="p-3">{r.shopper_name ?? r.shopper_phone ?? <span className="text-ink-2">anonymous</span>}</td>
                    <td className="p-3 capitalize">{r.channel}</td>
                    <td className="p-3">
                      {r.converted ? <Badge>converted</Badge>
                        : r.responded ? <Badge>responded</Badge>
                        : <Badge tone="yellow">open</Badge>}
                    </td>
                    <td className="p-3 text-right">
                      <InquiryActions id={r.id} responded={r.responded} converted={r.converted} />
                    </td>
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
