import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { serverClient, supabaseConfigured, type DBPublicListing, type DBPublicSeller } from "@/lib/supabase";
import { Container, Section } from "@/components/ui/Container";
import { Card, Badge } from "@/components/ui/Card";
import { InquireButton } from "@/components/listing/InquireButton";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { MapPin, ShieldCheck, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  if (!supabaseConfigured) return { title: "Seller · Pamoja+" };
  const sb = serverClient(cookies())!;
  const { data } = await sb.from("v_public_sellers").select("business_name").eq("id", params.id).maybeSingle();
  return { title: data ? `${data.business_name} · Pamoja+` : "Seller · Pamoja+" };
}

export default async function SellerStorefrontPage({ params }: { params: { id: string } }) {
  if (!supabaseConfigured) notFound();
  const sb = serverClient(cookies())!;

  const [{ data: seller }, { data: listings }] = await Promise.all([
    sb.from("v_public_sellers").select("*").eq("id", params.id).maybeSingle(),
    sb.from("v_public_listings").select("*").eq("seller_id", params.id).order("listed_at", { ascending: false })
  ]);

  if (!seller) notFound();
  const s = seller as DBPublicSeller;
  const ls = (listings ?? []) as DBPublicListing[];

  return (
    <Section className="py-10">
      <Container>
        <div className="mb-4">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink">
            <ArrowLeft className="w-4 h-4" /> Marketplace
          </Link>
        </div>

        <Card className="mb-8">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="w-20 h-20 rounded-2xl bg-green-soft text-green-dark flex items-center justify-center font-display font-extrabold text-3xl shrink-0">
              {s.business_name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl">{s.business_name}</h1>
                {s.tier !== "none" && (
                  <Badge tone={s.tier === "gold" ? "yellow" : s.tier === "silver" ? "ink" : "green"}>
                    <ShieldCheck className="w-3 h-3" /> {s.tier}
                  </Badge>
                )}
              </div>
              <div className="mt-2 flex items-center gap-4 flex-wrap text-sm text-ink-2">
                {s.category && <span>{s.category}</span>}
                {s.location && <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" /> {s.location}</span>}
                <span>{s.live_listings} listing{s.live_listings === 1 ? "" : "s"}</span>
                {s.response_rate != null && <span>Responds {s.response_rate}%</span>}
              </div>
            </div>
            {ls[0] && (
              <InquireButton sellerId={s.id} listingId={ls[0].listing_id} className="px-5 py-2.5">
                Message on WhatsApp
              </InquireButton>
            )}
          </div>
        </Card>

        {ls.length === 0 ? (
          <Card className="text-center py-12">
            <div className="font-display font-extrabold text-lg">No live listings yet</div>
            <p className="text-ink-2 text-sm mt-2 max-w-md mx-auto">This seller is just getting started on Pamoja+. Check back soon.</p>
          </Card>
        ) : (
          <>
            <div className="font-display font-extrabold text-xl mb-4">Listings</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {ls.map((l) => <ListingCard key={l.listing_id} l={l} />)}
            </div>
          </>
        )}
      </Container>
    </Section>
  );
}
