import { cookies } from "next/headers";
import Link from "next/link";
import { serverClient, supabaseConfigured } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { tzs } from "@/lib/format";
import { ListChecks, AlertTriangle } from "lucide-react";
import { ModRow } from "./ModRow";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  status: "pending" | "approved" | "changes_requested" | "rejected";
  created_at: string;
  listings: {
    id: string;
    title: string;
    description: string | null;
    price_tzs: number | null;
    status: string;
    seller_id: string;
    sellers: { id: string; business_name: string; tier: string; verified: boolean } | { id: string; business_name: string; tier: string; verified: boolean }[] | null;
  } | null;
}

export default async function ListingsPage({ searchParams }: { searchParams: { status?: string } }) {
  const filter = (searchParams.status ?? "pending") as "pending" | "approved" | "changes_requested" | "rejected" | "all";
  let rows: Row[] = [];
  let flagCounts: Record<string, number> = {};
  let error: string | null = null;

  if (!supabaseConfigured) {
    error = "Supabase env vars not set.";
  } else {
    const sb = serverClient(cookies())!;
    let q = sb
      .from("listing_reviews")
      .select("id, status, created_at, listings(id, title, description, price_tzs, status, seller_id, sellers(id, business_name, tier, verified))")
      .order("created_at", { ascending: true })
      .limit(200);
    if (filter !== "all") q = q.eq("status", filter);
    const { data, error: err } = await q;
    if (err) error = err.message; else rows = (data ?? []) as unknown as Row[];

    // Open compliance flags grouped by listing
    if (rows.length) {
      const ids = rows.map((r) => r.listings?.id).filter(Boolean) as string[];
      if (ids.length) {
        const { data: flags } = await sb
          .from("compliance_flags")
          .select("entity_id")
          .eq("entity_table", "listings")
          .eq("status", "open")
          .in("entity_id", ids);
        for (const f of flags ?? []) flagCounts[f.entity_id] = (flagCounts[f.entity_id] ?? 0) + 1;
      }
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Operate"
        title="Listings moderation"
        description="Auto-queued on insert/update via trigger. Auto-flagged against prohibited_keywords. Sort: oldest pending first."
        right={
          <div className="flex gap-2">
            <a href="?status=pending"           className={filter === "pending"           ? "" : "opacity-60"}><Badge tone="yellow">pending</Badge></a>
            <a href="?status=changes_requested" className={filter === "changes_requested" ? "" : "opacity-60"}><Badge>changes</Badge></a>
            <a href="?status=approved"          className={filter === "approved"          ? "" : "opacity-60"}><Badge>approved</Badge></a>
            <a href="?status=rejected"          className={filter === "rejected"          ? "" : "opacity-60"}><Badge tone="ink">rejected</Badge></a>
          </div>
        }
      />

      {error && (
        <Card className="mb-6 border-yellow bg-yellow-soft/40">
          <div className="text-sm"><strong>Heads-up:</strong> {error}</div>
        </Card>
      )}

      {rows.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Queue is clear"
          hint={filter === "pending"
            ? "Nothing pending review. New or edited listings will queue here automatically — add one from a seller's detail page to test."
            : "Switch the filter above to see other states."}
        />
      ) : (
        <div className="space-y-4">
          {rows.map((r) => {
            const l = r.listings;
            if (!l) return null;
            const seller = Array.isArray(l.sellers) ? l.sellers[0] : l.sellers;
            const flags = flagCounts[l.id] ?? 0;
            return (
              <Card key={r.id}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Link href={`/dashboard/sellers/${l.seller_id}`} className="text-xs font-bold uppercase tracking-widest text-green hover:underline">
                        {seller?.business_name ?? "Unknown seller"}
                      </Link>
                      {seller?.verified && <Badge>verified</Badge>}
                      {flags > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-danger">
                          <AlertTriangle className="w-3.5 h-3.5" /> {flags} flag{flags > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <div className="font-display font-extrabold text-lg">{l.title}</div>
                    {l.description && <p className="text-sm text-ink-2 mt-1 line-clamp-3">{l.description}</p>}
                    <div className="text-sm mt-2">
                      {l.price_tzs != null && <span className="font-bold text-green-dark">{tzs(l.price_tzs)}</span>}
                      <span className="text-xs text-ink-2 ml-3">Queued {new Date(r.created_at).toLocaleDateString("en-GB")}</span>
                    </div>
                  </div>
                  {r.status === "pending" ? (
                    <ModRow reviewId={r.id} />
                  ) : (
                    <Badge tone={r.status === "approved" ? "green" : r.status === "rejected" ? "ink" : "yellow"}>{r.status}</Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
