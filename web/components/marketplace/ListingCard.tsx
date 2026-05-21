import Link from "next/link";
import Image from "next/image";
import { MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Card";
import { tzs } from "@/lib/format";
import type { DBPublicListing, VerifyTier } from "@/lib/supabase";

const TIER_TONE: Record<VerifyTier, "green" | "yellow" | "ink"> = {
  gold: "yellow",
  silver: "ink",
  bronze: "green",
  none: "ink"
};

export function ListingCard({ l }: { l: DBPublicListing }) {
  const photo = l.photos?.[0];
  return (
    <Link
      href={`/marketplace/${l.listing_id}`}
      className="group block bg-white border border-line rounded-2xl shadow-card overflow-hidden hover:shadow-lift hover:border-green transition"
    >
      <div className="aspect-[4/3] bg-green-soft relative overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={l.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-green-dark/40 text-4xl font-display font-extrabold">
            {l.business_name.charAt(0)}
          </div>
        )}
        {l.tier !== "none" && (
          <div className="absolute top-3 left-3">
            <Badge tone={TIER_TONE[l.tier]}>
              <ShieldCheck className="w-3 h-3" /> {l.tier}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs font-bold uppercase tracking-widest text-green truncate">{l.business_name}</div>
        <div className="font-display font-extrabold text-base mt-1 line-clamp-2 min-h-[3rem]">{l.title}</div>
        <div className="mt-3 flex items-center justify-between gap-2">
          {l.price_tzs != null ? (
            <div className="font-display font-extrabold text-lg text-ink">{tzs(l.price_tzs)}</div>
          ) : (
            <div className="text-sm text-ink-2">Inquire for price</div>
          )}
          {l.location && (
            <div className="flex items-center gap-1 text-xs text-ink-2 shrink-0">
              <MapPin className="w-3 h-3" /> {l.location}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
