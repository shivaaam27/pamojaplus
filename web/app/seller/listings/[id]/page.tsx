import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { serverClient, type DBListing } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { SellerShell } from "@/components/layout/SellerShell";
import { getMySeller } from "../../_lib/getSeller";
import { EditForm } from "./EditForm";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, "green" | "yellow" | "ink"> = {
  live: "green", draft: "yellow", expired: "ink", removed: "ink"
};

export default async function EditListingPage({ params }: { params: { id: string } }) {
  const seller = await getMySeller();
  if (!seller) return <SellerShell><div className="text-sm text-ink-2">No seller profile.</div></SellerShell>;

  const sb = serverClient(cookies())!;
  const { data } = await sb.from("listings").select("*").eq("id", params.id).eq("seller_id", seller.id).maybeSingle();
  if (!data) notFound();
  const l = data as DBListing;

  return (
    <SellerShell businessName={seller.business_name}>
      <div className="max-w-xl">
        <Link href="/seller/listings" className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink mb-4">
          <ArrowLeft className="w-4 h-4" /> Listings
        </Link>
        <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-green">Seller portal</div>
            <h1 className="font-display font-extrabold text-2xl mt-1">Edit listing</h1>
          </div>
          <Badge tone={STATUS_TONE[l.status] ?? "ink"}>{l.status}</Badge>
        </div>
        <Card>
          <EditForm init={{ id: l.id, title: l.title, description: l.description, price_tzs: l.price_tzs }} />
        </Card>
      </div>
    </SellerShell>
  );
}
