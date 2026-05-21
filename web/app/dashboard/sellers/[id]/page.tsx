import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { serverClient, supabaseConfigured, type DBSeller, type DBSellerHealth, type DBListing, type DBSellerDocument, type DBInquiry } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { tzs } from "@/lib/format";
import { ArrowLeft, ShoppingBag, MessageCircle, Star, Coins, ShieldCheck } from "lucide-react";
import { KycUploader } from "./KycUploader";

export const dynamic = "force-dynamic";

const TIER_TONE = { gold: "yellow", silver: "ink", bronze: "green", none: "ink" } as const;

export default async function SellerDetailPage({ params }: { params: { id: string } }) {
  if (!supabaseConfigured) {
    return (
      <>
        <PageHeader eyebrow="Operate · Seller" title="Seller detail" description="Supabase not configured." />
      </>
    );
  }
  const sb = serverClient(cookies())!;

  const [{ data: seller }, { data: health }, { data: listings }, { data: docs }, { data: inquiries }] = await Promise.all([
    sb.from("sellers").select("*").eq("id", params.id).maybeSingle(),
    sb.from("v_seller_health").select("*").eq("id", params.id).maybeSingle(),
    sb.from("listings").select("*").eq("seller_id", params.id).order("created_at", { ascending: false }).limit(50),
    sb.from("seller_documents").select("*").eq("seller_id", params.id).order("uploaded_at", { ascending: false }),
    sb.from("inquiries").select("*").eq("seller_id", params.id).order("created_at", { ascending: false }).limit(20)
  ]);

  if (!seller) notFound();
  const s = seller as DBSeller;
  const h = health as DBSellerHealth | null;
  const ls = (listings ?? []) as DBListing[];
  const ds = (docs ?? []) as DBSellerDocument[];
  const inq = (inquiries ?? []) as DBInquiry[];

  const responseRate = h && h.inquiries_30d > 0 ? Math.round((h.responded_30d / h.inquiries_30d) * 100) : null;

  return (
    <>
      <div className="mb-4">
        <Link href="/dashboard/sellers" className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink">
          <ArrowLeft className="w-4 h-4" /> Back to sellers
        </Link>
      </div>
      <PageHeader
        eyebrow="Operate · Seller"
        title={s.business_name}
        description={`${s.category ?? "—"} · ${s.location ?? "—"}`}
        right={
          <div className="flex items-center gap-2">
            {s.verified && <Badge>verified</Badge>}
            <Badge tone={TIER_TONE[s.tier ?? "none"]}>{s.tier ?? "none"}</Badge>
            <Badge tone="ink">{s.plan}</Badge>
          </div>
        }
      />

      {/* Health KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <KPI icon={ShoppingBag}    label="Live listings"    value={String(h?.live_listings ?? 0)} />
        <KPI icon={MessageCircle}  label="Inquiries (30d)"  value={String(h?.inquiries_30d ?? 0)} />
        <KPI icon={ShieldCheck}    label="Response rate"    value={responseRate != null ? `${responseRate}%` : "—"} />
        <KPI icon={Star}           label="Avg rating"       value={h?.avg_rating ? h.avg_rating.toFixed(2) : "—"} />
        <KPI icon={Coins}          label="Revenue (90d)"    value={tzs(h?.revenue_90d_tzs ?? 0)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <Card>
          <div className="font-display font-extrabold text-lg mb-3">Contact</div>
          <dl className="text-sm divide-y divide-line">
            <Row k="Owner"    v={s.owner_name ?? "—"} />
            <Row k="WhatsApp" v={s.whatsapp ?? "—"} />
            <Row k="Phone"    v={s.phone ?? "—"} />
            <Row k="Email"    v={s.email ?? "—"} />
            <Row k="Joined"   v={new Date(s.created_at).toLocaleDateString("en-GB")} />
          </dl>
        </Card>
        <Card>
          <div className="font-display font-extrabold text-lg mb-3">KYC documents</div>
          {ds.length === 0 ? (
            <div className="text-sm text-ink-2">No documents uploaded yet.</div>
          ) : (
            <ul className="text-sm space-y-2">
              {ds.map((d) => (
                <li key={d.id} className="flex items-center justify-between">
                  <span className="font-semibold">{d.kind.replace(/_/g, " ")}</span>
                  <Badge tone={d.status === "approved" ? "green" : d.status === "rejected" ? "ink" : "yellow"}>{d.status}</Badge>
                </li>
              ))}
            </ul>
          )}
          <KycUploader sellerId={s.id} />
        </Card>
      </div>

      <Card className="mb-5">
        <div className="font-display font-extrabold text-lg mb-3">Listings ({ls.length})</div>
        {ls.length === 0 ? (
          <div className="text-sm text-ink-2">No listings yet.</div>
        ) : (
          <ul className="divide-y divide-line text-sm">
            {ls.slice(0, 12).map((l) => (
              <li key={l.id} className="py-2 flex items-center justify-between gap-3">
                <span className="font-semibold truncate">{l.title}</span>
                <div className="flex items-center gap-2 shrink-0">
                  {l.price_tzs != null && <span className="text-ink-2">{tzs(l.price_tzs)}</span>}
                  <Badge tone={l.status === "live" ? "green" : "ink"}>{l.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <div className="font-display font-extrabold text-lg mb-3">Recent inquiries</div>
        {inq.length === 0 ? (
          <div className="text-sm text-ink-2">No inquiries recorded yet.</div>
        ) : (
          <ul className="divide-y divide-line text-sm">
            {inq.map((i) => (
              <li key={i.id} className="py-2 flex items-center justify-between gap-3">
                <span className="truncate">{i.shopper_name ?? i.shopper_phone ?? "anonymous"} <span className="text-ink-2">· {i.channel}</span></span>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge tone={i.responded ? "green" : "yellow"}>{i.responded ? "responded" : "open"}</Badge>
                  <span className="text-xs text-ink-2">{new Date(i.created_at).toLocaleDateString("en-GB")}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

function KPI({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card>
      <Icon className="w-5 h-5 text-green-dark mb-3" />
      <div className="text-xs text-ink-2">{label}</div>
      <div className="font-display font-extrabold text-xl mt-1">{value}</div>
    </Card>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="py-2 flex items-center justify-between gap-3">
      <dt className="text-ink-2">{k}</dt>
      <dd className="font-semibold text-right truncate">{v}</dd>
    </div>
  );
}
