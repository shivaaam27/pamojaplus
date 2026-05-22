import { cookies } from "next/headers";
import Link from "next/link";
import { serverClient } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { SellerShell } from "@/components/layout/SellerShell";
import { getMySeller } from "../_lib/getSeller";
import { InquiryButtons } from "./InquiryButtons";
import { MessageCircle, Megaphone, ExternalLink } from "lucide-react";

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
  ambassadors: { id: string; name: string } | { id: string; name: string }[] | null;
}

type Filter = "open" | "stale" | "responded" | "converted" | "all";

export default async function SellerInquiriesPage({ searchParams }: { searchParams: { f?: string } }) {
  const seller = await getMySeller();
  if (!seller) return <SellerShell><div className="text-sm text-ink-2">No seller profile.</div></SellerShell>;

  const f = (searchParams.f ?? "open") as Filter;
  const sb = serverClient(cookies())!;

  let q = sb.from("inquiries")
    .select("id, channel, shopper_name, shopper_phone, message, responded, converted, created_at, listings(id, title), ambassadors(id, name)")
    .eq("seller_id", seller.id)
    .order("created_at", { ascending: false })
    .limit(200);
  if (f === "open")      q = q.eq("responded", false);
  if (f === "stale")     q = q.eq("responded", false).lt("created_at", new Date(Date.now() - 48*3600*1000).toISOString());
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
          <a href="?f=stale"     className={f === "stale"     ? "" : "opacity-60"}><Badge tone="ink">stale &gt;48h</Badge></a>
          <a href="?f=responded" className={f === "responded" ? "" : "opacity-60"}><Badge>responded</Badge></a>
          <a href="?f=converted" className={f === "converted" ? "" : "opacity-60"}><Badge>converted</Badge></a>
          <a href="?f=all"       className={f === "all"       ? "" : "opacity-60"}><Badge tone="ink">all</Badge></a>
        </div>
      </div>

      {rows.length === 0 ? (
        <Card className="text-center py-12">
          <MessageCircle className="w-8 h-8 mx-auto text-green-dark mb-3" />
          <div className="font-display font-extrabold text-lg">
            {f === "open" || f === "stale" ? "Inbox zero" : "Nothing here"}
          </div>
          <p className="text-sm text-ink-2 mt-1">
            {f === "open"      ? "Every inquiry is handled. Nice work."
              : f === "stale"  ? "No inquiries are overdue. Keep replying fast."
              : "Switch the filter above to see other states."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const listing = Array.isArray(r.listings) ? r.listings[0] : r.listings;
            const amb     = Array.isArray(r.ambassadors) ? r.ambassadors[0] : r.ambassadors;
            const ageH    = (Date.now() - new Date(r.created_at).getTime()) / 36e5;
            const stale   = !r.responded && ageH > 48;

            return (
              <Card key={r.id} className={stale ? "border-danger" : undefined}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="text-ink-2">{new Date(r.created_at).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}</span>
                      <span className="text-ink-2">·</span>
                      <span className="capitalize text-ink-2">{r.channel}</span>
                      {stale && <Badge tone="ink">stale {Math.floor(ageH)}h</Badge>}
                      {amb && (
                        <span className="inline-flex items-center gap-1 text-green-dark font-bold">
                          <Megaphone className="w-3 h-3" /> via {amb.name}
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 font-semibold">
                      {listing
                        ? <Link href={`/marketplace/${listing.id}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-dark inline-flex items-center gap-1">
                            {listing.title} <ExternalLink className="w-3 h-3" />
                          </Link>
                        : <span className="text-ink-2">No listing context</span>}
                    </div>
                    <div className="mt-2 text-sm text-ink-2">
                      <strong className="text-ink">{r.shopper_name ?? r.shopper_phone ?? "Anonymous shopper"}</strong>
                      {r.shopper_phone && r.shopper_name && <span className="ml-2 text-xs">({r.shopper_phone})</span>}
                    </div>
                    {r.message ? (
                      <div className="mt-2 p-3 rounded-xl bg-bg text-sm whitespace-pre-wrap">{r.message}</div>
                    ) : (
                      <div className="mt-2 text-xs text-ink-2 italic">No message recorded — shopper clicked Inquire and was sent to WhatsApp.</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {r.converted ? <Badge>converted</Badge>
                      : r.responded ? <Badge>responded</Badge>
                      : <Badge tone="yellow">open</Badge>}
                    <InquiryButtons id={r.id} responded={r.responded} converted={r.converted} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </SellerShell>
  );
}
