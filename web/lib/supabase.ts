// Supabase clients for Pamoja+.
// - browserClient(): for use in Client Components / browser
// - serverClient():  for use in Server Components / route handlers
// Both gracefully no-op if env vars are missing (so the site works offline / pre-Supabase).

import { createBrowserClient, createServerClient, type CookieOptions } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anon);

export function browserClient() {
  if (!supabaseConfigured) return null;
  return createBrowserClient(url!, anon!);
}

// Server-side client — pass `cookies()` from a Server Component/route.
export function serverClient(cookieStore: {
  get: (n: string) => { value: string } | undefined;
  set?: (n: string, v: string, o?: CookieOptions) => void;
}) {
  if (!supabaseConfigured) return null;
  return createServerClient(url!, anon!, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set: (name, value, options) => { cookieStore.set?.(name, value, options); },
      remove: (name, options) => { cookieStore.set?.(name, "", { ...options, maxAge: 0 }); }
    }
  });
}

// Convenience types
export interface DBMilestone {
  id: string;
  date: string;
  title: string;
  description: string | null;
  icon: "star" | "check" | "trophy" | "rocket" | "users" | "money";
  featured: boolean;
  public: boolean;
}

export interface SellerApplicationInsert {
  business_name: string;
  owner_name: string;
  whatsapp: string;
  email?: string | null;
  category: string;
  location: string;
  description: string;
  socials?: string | null;
}

// ---------- Control-plane types (migration 0002) ----------
export type TeamRole = "founder" | "ops" | "bd" | "marketing" | "tech" | "finance";
export type VerifyTier = "none" | "bronze" | "silver" | "gold";
export type ModStatus = "pending" | "approved" | "changes_requested" | "rejected";
export type KycDocStatus = "pending" | "approved" | "rejected";
export type KycDocKind = "id_front" | "id_back" | "business_licence" | "selfie" | "tin_certificate" | "other";
export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled" | "refunded" | "disputed";
export type PayoutStatus = "scheduled" | "approved" | "paid" | "failed" | "on_hold";
export type DisputeStatus = "open" | "mediation" | "resolved_buyer" | "resolved_seller" | "escalated" | "closed";
export type NotifChannel = "sms" | "whatsapp" | "email" | "push" | "inapp";
export type NotifStatus = "queued" | "sent" | "delivered" | "failed" | "read";
export type MmoProvider = "mpesa" | "mixx_yas" | "airtel_money" | "halopesa" | "azampesa" | "tpesa" | "card" | "bank" | "cash";
export type DsrKind = "access" | "correction" | "deletion" | "portability" | "objection";

export interface DBSeller {
  id: string;
  business_name: string;
  owner_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  location: string | null;
  category: string | null;
  plan: "free" | "growth" | "plus" | "partner";
  verified: boolean;
  tier: VerifyTier;
  response_rate: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBSellerApplication {
  id: string;
  business_name: string;
  owner_name: string;
  whatsapp: string;
  email: string | null;
  category: string;
  location: string;
  description: string;
  socials: string | null;
  status: "new" | "reviewing" | "approved" | "rejected";
  created_at: string;
}

export interface DBListing {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  category: string | null;
  price_tzs: number | null;
  photos: string[];
  deal_type: string;
  deal_expires_at: string | null;
  status: "draft" | "live" | "expired" | "removed";
  created_at: string;
  updated_at: string;
}

export interface DBSellerDocument {
  id: string;
  seller_id: string;
  kind: KycDocKind;
  storage_path: string;
  status: KycDocStatus;
  reviewer_id: string | null;
  review_note: string | null;
  uploaded_at: string;
  reviewed_at: string | null;
}

export interface DBListingReview {
  id: string;
  listing_id: string;
  status: ModStatus;
  reviewer_id: string | null;
  note: string | null;
  created_at: string;
  decided_at: string | null;
}

export interface DBInquiry {
  id: string;
  listing_id: string | null;
  seller_id: string | null;
  channel: "whatsapp" | "phone" | "email" | "onsite";
  shopper_phone: string | null;
  shopper_name: string | null;
  message: string | null;
  responded: boolean;
  responded_at: string | null;
  converted: boolean;
  converted_at: string | null;
  ambassador_id: string | null;
  created_at: string;
}

export interface DBPayout {
  id: string;
  seller_id: string | null;
  ambassador_id: string | null;
  gross_tzs: number;
  wht_tzs: number;
  fees_tzs: number;
  net_tzs: number;
  status: PayoutStatus;
  scheduled_for: string | null;
  approved_by: string | null;
  approved_at: string | null;
  paid_at: string | null;
  mmo: MmoProvider | null;
  mmo_ref: string | null;
  note: string | null;
  created_at: string;
}

export interface DBDispute {
  id: string;
  order_id: string;
  opened_by: "buyer" | "seller" | "team";
  reason: string;
  status: DisputeStatus;
  mediator_id: string | null;
  resolution: string | null;
  opened_at: string;
  resolved_at: string | null;
  sla_due_at: string | null;
}

export interface DBAuditLog {
  id: number;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  entity_table: string;
  entity_id: string | null;
  before: unknown;
  after: unknown;
  at: string;
}

export interface DBAttentionItem {
  kind: "kyc" | "listing_mod" | "flag" | "dispute" | "compliance" | "unresponsive";
  ref: string;
  seller_id: string | null;
  at: string;
  label: string;
}

export interface DBSellerHealth {
  id: string;
  business_name: string;
  plan: DBSeller["plan"];
  verified: boolean;
  tier: VerifyTier;
  live_listings: number;
  inquiries_30d: number;
  responded_30d: number;
  avg_rating: number | null;
  revenue_90d_tzs: number;
}

export interface DBPublicListing {
  listing_id: string;
  title: string;
  description: string | null;
  price_tzs: number | null;
  photos: string[];
  deal_type: string;
  deal_expires_at: string | null;
  listed_at: string;
  seller_id: string;
  business_name: string;
  category: string | null;
  location: string | null;
  tier: VerifyTier;
  verified: boolean;
  whatsapp: string | null;
  response_rate: number | null;
}

export interface DBPublicSeller {
  id: string;
  business_name: string;
  category: string | null;
  location: string | null;
  tier: VerifyTier;
  verified: boolean;
  response_rate: number | null;
  created_at: string;
  live_listings: number;
}

export interface DBAmbassadorBoard {
  id: string;
  name: string;
  tier: VerifyTier;
  referral_code: string;
  signups: number;
  paid_signups: number;
  clicks_30d: number;
  paid_total_tzs: number;
}
