import { cookies } from "next/headers";
import { serverClient, supabaseConfigured } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { ShieldCheck } from "lucide-react";
import { KycRow } from "./KycRow";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  kind: string;
  status: "pending" | "approved" | "rejected";
  uploaded_at: string;
  storage_path: string;
  seller_id: string;
  sellers: { id: string; business_name: string } | { id: string; business_name: string }[] | null;
}

export default async function KycPage({ searchParams }: { searchParams: { status?: string } }) {
  const filter = (searchParams.status ?? "pending") as "pending" | "approved" | "rejected" | "all";
  let rows: Row[] = [];
  let error: string | null = null;

  if (!supabaseConfigured) {
    error = "Supabase env vars not set.";
  } else {
    const sb = serverClient(cookies())!;
    let q = sb
      .from("seller_documents")
      .select("id, kind, status, uploaded_at, storage_path, seller_id, sellers(id, business_name)")
      .order("uploaded_at", { ascending: false })
      .limit(200);
    if (filter !== "all") q = q.eq("status", filter);
    const { data, error: err } = await q;
    if (err) error = err.message; else rows = (data ?? []) as unknown as Row[];
  }

  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.status] = (counts[r.status] ?? 0) + 1;

  return (
    <>
      <PageHeader
        eyebrow="Operate · Trust"
        title="KYC review"
        description="Approve seller identity and business documents. Approvals auto-bump verified tier (Bronze → Silver → Gold)."
        right={
          <div className="flex gap-2">
            <a href="?status=pending"  className={`text-xs font-bold ${filter === "pending"  ? "" : "opacity-60"}`}><Badge tone="yellow">{counts.pending ?? 0} pending</Badge></a>
            <a href="?status=approved" className={`text-xs font-bold ${filter === "approved" ? "" : "opacity-60"}`}><Badge>{counts.approved ?? 0} approved</Badge></a>
            <a href="?status=rejected" className={`text-xs font-bold ${filter === "rejected" ? "" : "opacity-60"}`}><Badge tone="ink">{counts.rejected ?? 0} rejected</Badge></a>
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
          icon={ShieldCheck}
          title={filter === "pending" ? "No documents waiting for review" : `No ${filter} documents`}
          hint={filter === "pending"
            ? "Upload KYC documents from a seller's detail page (Sellers → click a seller → KYC documents → Upload). They'll appear here for approval."
            : "Switch the filter above to see other states."}
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg text-ink-2 text-left">
              <tr>
                <th className="p-3 font-semibold">Seller</th>
                <th className="p-3 font-semibold">Kind</th>
                <th className="p-3 font-semibold">Uploaded</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => {
                const seller = Array.isArray(r.sellers) ? r.sellers[0] : r.sellers;
                return (
                  <KycRow
                    key={r.id}
                    id={r.id}
                    kind={r.kind}
                    status={r.status}
                    uploadedAt={r.uploaded_at}
                    sellerId={seller?.id ?? r.seller_id}
                    sellerName={seller?.business_name ?? "Unknown"}
                    storagePath={r.storage_path}
                  />
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
