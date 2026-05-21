import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { serverClient, supabaseConfigured, type DBPublicListing } from "@/lib/supabase";
import { Container, Section } from "@/components/ui/Container";
import { Card, Badge } from "@/components/ui/Card";
import { InquireButton } from "@/components/listing/InquireButton";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { MapPin, ShieldCheck, ArrowLeft, Star } from "lucide-react";
import { tzs } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  if (!supabaseConfigured) return { title: "Listing · Pamoja+" };
  const sb = serverClient(cookies())!;
  const { data } = await sb.from("v_public_listings").select("title, business_name, description").eq("listing_id", params.id).maybeSingle();
  if (!data) return { title: "Listing · Pamoja+" };
  return { title: `${data.title} · ${data.business_name} · Pamoja+`, description: data.description ?? undefined };
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  if (!supabaseConfigured) notFound();
  const sb = serverClient(cookies())!;

  const { data: listing } = await sb.from("v_public_listings").select("*").eq("listing_id", params.id).maybeSingle();
  if (!listing) notFound();
  const l = listing as DBPublicListing;

  const { data: related } = await sb
    .from("v_public_listings")
    .select("*")
    .eq("seller_id", l.seller_id)
    .neq("listing_id", l.listing_id)
    .limit(4);

  return (
    <Section className="py-10">
      <Container>
        <div className="mb-4">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink">
            <ArrowLeft className="w-4 h-4" /> Marketplace
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden bg-green-soft">
              {l.photos?.[0] ? (
                <Image src={l.photos[0]} alt={l.title} fill className="object-cover" unoptimized />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-green-dark/40 text-6xl font-display font-extrabold">
                  {l.business_name.charAt(0)}
                </div>
              )}
            </div>
            {l.photos && l.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {l.photos.slice(1, 5).map((p, i) => (
                  <div key={i} className="aspect-square relative rounded-xl overflow-hidden bg-green-soft">
                    <Image src={p} alt={`${l.title} — ${i + 2}`} fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Link href={`/s/${l.seller_id}`} className="text-xs font-bold uppercase tracking-widest text-green hover:underline">{l.business_name}</Link>
              {l.tier !== "none" && (
                <Badge tone={l.tier === "gold" ? "yellow" : l.tier === "silver" ? "ink" : "green"}>
                  <ShieldCheck className="w-3 h-3" /> {l.tier}
                </Badge>
              )}
              {l.response_rate != null && l.response_rate >= 80 && (
                <Badge tone="green"><Star className="w-3 h-3" /> Responsive</Badge>
              )}
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl">{l.title}</h1>

            <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                {l.price_tzs != null ? (
                  <div className="font-display font-extrabold text-3xl text-ink">{tzs(l.price_tzs)}</div>
                ) : (
                  <div className="text-ink-2">Contact seller for price</div>
                )}
                {l.location && (
                  <div className="mt-1 inline-flex items-center gap-1 text-sm text-ink-2">
                    <MapPin className="w-4 h-4" /> {l.location}
                  </div>
                )}
              </div>
              <InquireButton sellerId={l.seller_id} listingId={l.listing_id} className="px-6 py-3 text-base" />
            </div>

            {l.description && (
              <div className="mt-6">
                <div className="font-display font-extrabold text-base mb-2">Description</div>
                <p className="text-ink whitespace-pre-wrap leading-relaxed">{l.description}</p>
              </div>
            )}

            <Card className="mt-6 bg-green-soft/40 border-green">
              <div className="text-sm text-ink-2">
                <strong className="text-ink">Pamoja+ tip:</strong> Always confirm price, photos and condition over WhatsApp before paying.
                For TZS over 50,000 ask the seller to send a short video of the item.
              </div>
            </Card>
          </div>
        </div>

        {related && related.length > 0 && (
          <div className="mt-12">
            <div className="font-display font-extrabold text-xl mb-4">More from {l.business_name}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {(related as DBPublicListing[]).map((r) => <ListingCard key={r.listing_id} l={r} />)}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
