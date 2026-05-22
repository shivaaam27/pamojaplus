import { cookies } from "next/headers";
import Link from "next/link";
import { serverClient, supabaseConfigured, type DBSeller, type DBSellerHealth } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { SellerShell } from "@/components/layout/SellerShell";
import { tzs } from "@/lib/format";
import { ShoppingBag, MessageCircle, Star, ShieldCheck, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SellerOverviewPage() {
  if (!supabaseConfigured) {
    return <SellerShell><div className="text-sm text-ink-2">Supabase not configured.</div></SellerShell>;
  }
  const sb = serverClient(cookies())!;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;

  const { data: sellerRow } = await sb.from("sellers").select("*").eq("user_id", user.id).maybeSingle();
  const s = sellerRow as DBSeller | null;

  if (!s) {
    return (
      <SellerShell>
        <div className="max-w-2xl">
          <Card className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-green-soft text-green-dark mx-auto flex items-center justify-center mb-4">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h1 className="font-display font-extrabold text-2xl">Almost there</h1>
            <p className="text-ink-2 mt-2 max-w-md mx-auto">
              No seller profile is linked to <strong>{user.email}</strong> yet.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-md mx-auto">
              <Link href="/sellers/apply"
                className="block p-4 rounded-xl border border-line hover:border-green hover:bg-green-soft/40 transition text-left">
                <div className="font-bold">Apply to join</div>
                <div className="text-xs text-ink-2 mt-1">Haven&apos;t pitched yet? Submit your business in 2 minutes.</div>
              </Link>
              <a href="https://wa.me/255700000000?text=Hi%2C+I+signed+up+but+can%27t+find+my+seller+profile"
                target="_blank" rel="noopener noreferrer"
                className="block p-4 rounded-xl border border-line hover:border-green hover:bg-green-soft/40 transition text-left">
                <div className="font-bold">Talk to ops</div>
                <div className="text-xs text-ink-2 mt-1">Already applied with a different email? Message us.</div>
              </a>
            </div>
            <p className="text-xs text-ink-2 mt-6">Tip: sign up with the same email you used in your application — the link is automatic.</p>
          </Card>
        </div>
      </SellerShell>
    );
  }

  const { data: health } = await sb.from("v_seller_health").select("*").eq("id", s.id).maybeSingle();
  const h = health as DBSellerHealth | null;
  const responseRate = h && h.inquiries_30d > 0 ? Math.round((h.responded_30d / h.inquiries_30d) * 100) : null;

  return (
    <SellerShell businessName={s.business_name}>
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-green">Seller portal</div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl mt-1">Hi, {s.owner_name ?? s.business_name}</h1>
        <p className="text-ink-2 text-sm mt-1">Here&apos;s your store at a glance.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat icon={ShoppingBag}    label="Live listings"   value={String(h?.live_listings ?? 0)} href="/seller/listings" />
        <Stat icon={MessageCircle}  label="Inquiries (30d)" value={String(h?.inquiries_30d ?? 0)} href="/seller/inquiries" />
        <Stat icon={ShieldCheck}    label="Response rate"   value={responseRate != null ? `${responseRate}%` : "—"} />
        <Stat icon={Star}           label="Avg rating"      value={h?.avg_rating ? h.avg_rating.toFixed(2) : "—"} />
      </div>

      {!s.verified && (
        <Card className="mb-6 border-yellow bg-yellow-soft/40">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-ink shrink-0 mt-0.5" />
            <div>
              <div className="font-display font-extrabold">You&apos;re not verified yet</div>
              <p className="text-sm mt-1 text-ink-2">
                Upload your ID and a selfie in <Link href="/seller/kyc" className="font-bold text-green-dark hover:underline">KYC</Link> to get the Bronze badge.
                Verified sellers get higher placement and a trust badge on every listing.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <div className="font-display font-extrabold text-lg mb-2">Plan & status</div>
          <dl className="text-sm divide-y divide-line">
            <Row k="Business"  v={s.business_name} />
            <Row k="Category"  v={s.category ?? "—"} />
            <Row k="Location"  v={s.location ?? "—"} />
            <Row k="Plan"      v={<span className="capitalize">{s.plan}</span>} />
            <Row k="Tier"      v={<Badge tone={s.tier === "gold" ? "yellow" : s.tier === "silver" ? "ink" : "green"}>{s.tier}</Badge>} />
            <Row k="Verified"  v={s.verified ? <Badge>yes</Badge> : <Badge tone="yellow">no</Badge>} />
          </dl>
        </Card>
        <Card>
          <div className="font-display font-extrabold text-lg mb-2">Quick actions</div>
          <div className="space-y-2 text-sm">
            <Link href="/seller/listings/new" className="block p-3 rounded-xl border border-line hover:border-green hover:bg-green-soft/40 transition">
              <div className="font-bold">+ Add a new listing</div>
              <div className="text-xs text-ink-2">Drafts go to moderation; we review and publish within 24h.</div>
            </Link>
            <Link href="/seller/inquiries?f=open" className="block p-3 rounded-xl border border-line hover:border-green hover:bg-green-soft/40 transition">
              <div className="font-bold">Reply to open inquiries</div>
              <div className="text-xs text-ink-2">Fast replies push your response rate up.</div>
            </Link>
            <Link href="/seller/kyc" className="block p-3 rounded-xl border border-line hover:border-green hover:bg-green-soft/40 transition">
              <div className="font-bold">Upload KYC documents</div>
              <div className="text-xs text-ink-2">Get verified → higher placement.</div>
            </Link>
          </div>
        </Card>
      </div>
    </SellerShell>
  );
}

function Stat({ icon: Icon, label, value, href }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href?: string }) {
  const card = (
    <Card className="h-full">
      <Icon className="w-5 h-5 text-green-dark mb-3" />
      <div className="text-xs text-ink-2">{label}</div>
      <div className="font-display font-extrabold text-2xl mt-1">{value}</div>
    </Card>
  );
  return href ? <Link href={href} className="block">{card}</Link> : card;
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="py-2 flex items-center justify-between gap-3">
      <dt className="text-ink-2">{k}</dt>
      <dd className="font-semibold text-right truncate">{v}</dd>
    </div>
  );
}
