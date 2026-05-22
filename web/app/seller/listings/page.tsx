import Link from "next/link";
import { cookies } from "next/headers";
import { serverClient, type DBListing } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { SellerShell } from "@/components/layout/SellerShell";
import { getMySeller } from "../_lib/getSeller";
import { tzs } from "@/lib/format";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, "green" | "yellow" | "ink"> = {
  live: "green",
  draft: "yellow",
  expired: "ink",
  removed: "ink"
};

export default async function SellerListingsPage() {
  const seller = await getMySeller();
  if (!seller) return <SellerShell><div className="text-sm text-ink-2">No seller profile.</div></SellerShell>;

  const sb = serverClient(cookies())!;
  const { data } = await sb.from("listings").select("*").eq("seller_id", seller.id).order("created_at", { ascending: false });
  const ls = (data ?? []) as DBListing[];

  return (
    <SellerShell businessName={seller.business_name}>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-green">Seller portal</div>
          <h1 className="font-display font-extrabold text-2xl mt-1">Your listings</h1>
        </div>
        <Link href="/seller/listings/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green text-white text-sm font-bold">
          <Plus className="w-4 h-4" /> New listing
        </Link>
      </div>

      {ls.length === 0 ? (
        <Card className="text-center py-12">
          <div className="font-display font-extrabold text-lg">No listings yet</div>
          <p className="text-sm text-ink-2 mt-1 max-w-md mx-auto">Create your first listing — we&apos;ll review it within 24h and publish to the marketplace.</p>
          <Link href="/seller/listings/new" className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green text-white text-sm font-bold">
            <Plus className="w-4 h-4" /> Add a listing
          </Link>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg text-ink-2 text-left">
              <tr>
                <th className="p-3 font-semibold">Title</th>
                <th className="p-3 font-semibold">Price</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ls.map((l) => (
                <tr key={l.id} className="hover:bg-bg/60">
                  <td className="p-3 font-semibold">
                    <Link href={`/seller/listings/${l.id}`} className="hover:text-green-dark">{l.title}</Link>
                  </td>
                  <td className="p-3">{l.price_tzs != null ? tzs(l.price_tzs) : "—"}</td>
                  <td className="p-3"><Badge tone={STATUS_TONE[l.status] ?? "ink"}>{l.status}</Badge></td>
                  <td className="p-3 text-ink-2 text-xs">{new Date(l.updated_at).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </SellerShell>
  );
}
