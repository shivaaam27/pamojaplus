import { cookies } from "next/headers";
import { serverClient, supabaseConfigured, type DBPublicListing } from "@/lib/supabase";
import { Container, Section } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { Search, MapPin, Tag } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Marketplace · Pamoja+",
  description: "Discover verified local sellers across Dar es Salaam. Inquire instantly on WhatsApp."
};

interface SearchParams { q?: string; category?: string; location?: string; }

export default async function MarketplacePage({ searchParams }: { searchParams: SearchParams }) {
  let listings: DBPublicListing[] = [];
  let categories: string[] = [];
  let locations: string[] = [];

  if (supabaseConfigured) {
    const sb = serverClient(cookies())!;
    let q = sb.from("v_public_listings").select("*").order("listed_at", { ascending: false }).limit(120);
    if (searchParams.q)        q = q.ilike("title", `%${searchParams.q}%`);
    if (searchParams.category) q = q.eq("category", searchParams.category);
    if (searchParams.location) q = q.eq("location", searchParams.location);
    const { data } = await q;
    listings = (data ?? []) as DBPublicListing[];

    const { data: facets } = await sb.from("v_public_listings").select("category, location").limit(2000);
    categories = Array.from(new Set((facets ?? []).map((r: { category: string | null }) => r.category).filter(Boolean) as string[])).sort();
    locations  = Array.from(new Set((facets ?? []).map((r: { location: string | null }) => r.location).filter(Boolean) as string[])).sort();
  }

  return (
    <Section className="py-10">
      <Container>
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-green">Marketplace</div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl mt-1">Discover local brands</h1>
          <p className="text-ink-2 mt-2 max-w-2xl">Verified sellers across Dar es Salaam. Tap a listing to see details and inquire directly on WhatsApp.</p>
        </div>

        <Card className="mb-8 p-4">
          <form className="grid sm:grid-cols-4 gap-3" action="/marketplace" method="get">
            <label className="sm:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-2 pointer-events-none" />
              <input
                name="q"
                defaultValue={searchParams.q ?? ""}
                placeholder="Search products, brands, services…"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green"
              />
            </label>
            <label className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-2 pointer-events-none" />
              <select name="category" defaultValue={searchParams.category ?? ""} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-line bg-white text-sm font-semibold">
                <option value="">All categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-2 pointer-events-none" />
              <select name="location" defaultValue={searchParams.location ?? ""} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-line bg-white text-sm font-semibold">
                <option value="">All locations</option>
                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </label>
            <div className="sm:col-span-4 flex items-center justify-between gap-3">
              <div className="text-xs text-ink-2">{listings.length} result{listings.length === 1 ? "" : "s"}</div>
              <button type="submit" className="px-5 py-2 rounded-full bg-green text-white text-sm font-bold">Filter</button>
            </div>
          </form>
        </Card>

        {listings.length === 0 ? (
          <Card className="text-center py-16">
            <div className="font-display font-extrabold text-lg">No listings match</div>
            <p className="text-ink-2 text-sm mt-2 max-w-md mx-auto">
              {supabaseConfigured
                ? "Try a different search, or clear the filters. New sellers are being onboarded every week."
                : "Marketplace is loading… check back soon."}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {listings.map((l) => <ListingCard key={l.listing_id} l={l} />)}
          </div>
        )}
      </Container>
    </Section>
  );
}
