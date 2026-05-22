import Link from "next/link";
import { SellerShell } from "@/components/layout/SellerShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getMySeller } from "../../_lib/getSeller";
import { createOwnListing } from "./actions";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewListingPage() {
  const seller = await getMySeller();
  if (!seller) return <SellerShell><div className="text-sm text-ink-2">No seller profile.</div></SellerShell>;

  return (
    <SellerShell businessName={seller.business_name}>
      <div className="max-w-xl">
        <Link href="/seller/listings" className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink mb-4">
          <ArrowLeft className="w-4 h-4" /> Listings
        </Link>
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-widest text-green">Seller portal</div>
          <h1 className="font-display font-extrabold text-2xl mt-1">New listing</h1>
          <p className="text-sm text-ink-2 mt-1">Drafts are reviewed within 24h. Approved listings go live on the marketplace.</p>
        </div>
        <Card>
          <form action={createOwnListing} className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold">Title</span>
              <input name="title" required placeholder="What are you selling?"
                className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Description</span>
              <textarea name="description" rows={5} placeholder="Materials, sizes, what makes it special…"
                className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green" />
              <span className="text-xs text-ink-2">Avoid medical claims (TMDA flags those automatically).</span>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Price (TZS)</span>
              <input name="price_tzs" type="number" min={0} placeholder="e.g. 25000"
                className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green" />
              <span className="text-xs text-ink-2">Leave blank for &quot;contact for price&quot;.</span>
            </label>
            <Button type="submit">Submit for review</Button>
          </form>
        </Card>
      </div>
    </SellerShell>
  );
}
