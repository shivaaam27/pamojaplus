// /api/inquiry — record a buyer inquiry, then 302 to WhatsApp.
// Usage: <a href="/api/inquiry?listing=<uuid>&seller=<uuid>"> on a listing card.
//
// Anonymous inserts are allowed via the `inquiries_anon_insert` RLS policy
// (added defensively in this route too — we use the anon client).

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPA_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function waLink(phone: string, message: string) {
  const clean = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const listingId = url.searchParams.get("listing");
  const sellerId  = url.searchParams.get("seller");
  const refCode   = url.searchParams.get("ref") ?? undefined;

  if (!sellerId) {
    return NextResponse.json({ error: "seller required" }, { status: 400 });
  }
  if (!SUPA_URL || !SUPA_ANON) {
    return NextResponse.json({ error: "supabase not configured" }, { status: 500 });
  }

  const sb = createServerClient(SUPA_URL, SUPA_ANON, {
    cookies: { get: () => undefined, set: () => {}, remove: () => {} }
  });

  // Look up seller for the WhatsApp number + listing title for the message
  const [{ data: seller }, { data: listing }] = await Promise.all([
    sb.from("sellers").select("id, business_name, whatsapp, phone").eq("id", sellerId).maybeSingle(),
    listingId
      ? sb.from("listings").select("id, title, seller_id").eq("id", listingId).maybeSingle()
      : Promise.resolve({ data: null })
  ]);

  if (!seller) return NextResponse.json({ error: "seller not found" }, { status: 404 });
  const phone = seller.whatsapp || seller.phone;
  if (!phone) return NextResponse.json({ error: "seller has no whatsapp" }, { status: 422 });

  // Best-effort ambassador attribution via ref code
  let ambassadorId: string | null = null;
  if (refCode) {
    const { data: amb } = await sb.from("ambassadors").select("id").eq("referral_code", refCode).maybeSingle();
    ambassadorId = amb?.id ?? null;
  }

  // Fire-and-log the inquiry; failure here must not block the user redirect.
  await sb.from("inquiries").insert({
    listing_id: listing?.id ?? null,
    seller_id: seller.id,
    channel: "whatsapp",
    ambassador_id: ambassadorId,
    utm: Object.fromEntries(
      ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
        .map((k) => [k, url.searchParams.get(k)])
        .filter(([, v]) => v)
    )
  });

  const msg = listing?.title
    ? `Habari ${seller.business_name}, naomba kuuliza kuhusu: ${listing.title} (kupitia Pamoja+)`
    : `Habari ${seller.business_name}, naomba kuuliza kuhusu bidhaa zako (kupitia Pamoja+)`;

  return NextResponse.redirect(waLink(phone, msg));
}
