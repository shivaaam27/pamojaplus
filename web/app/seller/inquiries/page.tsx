import { cookies } from "next/headers";
import { serverClient } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { SellerShell } from "@/components/layout/SellerShell";
import { getMySeller } from "../_lib/getSeller";
import { InquiryButtons } from "./InquiryButtons";
import { MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  channel: string;
  shopper_name: string | null;
  shopper_phone: string | null;
  responded: boolean;
  converted: boolean;
  created_at: string;
  listings: { id: string; title: string } | { id: string; title: string }[] | null;
}

type Filter = "open" | "responded" | "converted" | "all";

export default async function SellerInquiriesPage({ searchParams }: { searchParams: { f?: string } }) {
  const seller = await getMySeller();
  if (!seller) return <SellerShell><div className="text-sm text-ink-2">No seller profile.</div></SellerShell>;

  const f = (searchParams.f ?? "open") as Filter;
  const sb = serverClient(cookies())!;

  let q = sb.from("inquiries")
    .select("id, channel, shopper_name, shopper_phone, responded, converted, created_at, listings(id, title)")
    .eq("seller_id", seller.id)
    .order("created_at", { ascending: false })
    .limit(200);
  if (f === "open")      q = q.eq("responded", false);
  if (f === "responded") q = q.eq("responded", true).eq("converted", false);
  if (f === "converted") q = q.eq("converted", true);

  const { data } = await q;
  const rows = (data ?? []) as unknown as Row[];

  return (
    <SellerShell businessName={seller.business_name}>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-green">Seller portal</div>
          <h1 className="font-display font-extrabold text-2xl mt-1">Inquiries</h1>
          <p className="text-sm text-ink-2 mt-1">Reply fast on WhatsApp, then mark each lead here. Response speed boosts your rank.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="?f=open"      className={f === "open"      ? "" : "opacity-60"}><Badge tone="yellow">open</Badge></a>
          <a href="?f=responded" className={f === "responded" ? "" : "opacity-60"}><Badge>responded</Badge></a>
          <a href="?f=converted" className={f === "converted" ? "" : "opacity-60"}><Badge>converted</Badge></a>
          <a href="?f=all"       className={f === "all"       ? "" : "opacity-60"}><Badge tone="ink">all</Badge></a>
        </div>
      </div>

      {rows.length === 0 ? (
        <Card className="text-center py-12">
          <MessageCircle className="w-8 h-8 mx-auto text-green-dark mb-3" />
          <div className="font-display font-extrabold text-lg">{f === "open" ? "Inbox zero" : "Nothing here"}</div>
          <p className="text-sm text-ink-2 mt-1">{f === "open" ? "Every inquiry is handled. Nice work." : "Switch the filter above to see other states."}</p>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg text-ink-2 text-left">
              <tr>
                <th className="p-3 font-semibold">When</th>
                <th className="p-3 font-semibold">Listing</th>
                <th className="p-3 font-semibold">Shopper</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => {
                const listing = Array.isArray(r.listings) ? r.listings[0] : r.listings;
                return (
                  <tr key={r.id} className="hover:bg-bg/60">
                    <td className="p-3 text-ink-2 whitespace-nowrap">{new Date(r.created_at).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}</td>
                    <td className="p-3 truncate max-w-[18rem]">{listing?.title ?? <span className="text-ink-2">—</span>}</td>
                    <td className="p-3">{r.shopper_name ?? r.shopper_phone ?? <span className="text-ink-2">anonymous</span>}</td>
                    <td className="p-3">
                      {r.converted ? <Badge>converted</Badge>
                        : r.responded ? <Badge>responded</Badge>
                        : <Badge tone="yellow">open</Badge>}
                    </td>
                    <td className="p-3 text-right">
                      <InquiryButtons id={r.id} responded={r.responded} converted={r.converted} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </SellerShell>
  );
}
