import { cookies } from "next/headers";
import Link from "next/link";
import { serverClient, supabaseConfigured } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { FileWarning, ShieldCheck } from "lucide-react";
import { FlagButtons, DsrButtons } from "./Buttons";

export const dynamic = "force-dynamic";

interface FlagRow {
  id: string;
  entity_table: string;
  entity_id: string;
  kind: string;
  detail: string | null;
  source: string;
  status: string;
  created_at: string;
}

interface DsrRow {
  id: string;
  requester_email: string;
  kind: string;
  status: string;
  due_by: string | null;
  created_at: string;
}

export default async function CompliancePage() {
  let flags: FlagRow[] = [];
  let dsrs: DsrRow[] = [];
  let error: string | null = null;

  if (!supabaseConfigured) {
    error = "Supabase env vars not set.";
  } else {
    const sb = serverClient(cookies())!;
    const [f, d] = await Promise.all([
      sb.from("compliance_flags").select("*").eq("status", "open").order("created_at", { ascending: true }).limit(200),
      sb.from("data_subject_requests").select("*").order("created_at", { ascending: false }).limit(100)
    ]);
    if (f.error) error = f.error.message; else flags = (f.data ?? []) as FlagRow[];
    dsrs = (d.data ?? []) as DsrRow[];
  }

  const openDsrCount = dsrs.filter((r) => r.status !== "fulfilled" && r.status !== "rejected").length;

  return (
    <>
      <PageHeader
        eyebrow="Trust"
        title="Compliance"
        description="Open compliance flags (auto-detected on listings) and PDPC data-subject requests. 30-day SLA on DSRs."
        right={<div className="flex gap-2"><Badge tone="yellow">{flags.length} flags</Badge><Badge tone="ink">{openDsrCount} DSRs open</Badge></div>}
      />

      {error && (
        <Card className="mb-6 border-yellow bg-yellow-soft/40">
          <div className="text-sm"><strong>Heads-up:</strong> {error}</div>
        </Card>
      )}

      <h2 className="font-display font-extrabold text-lg mb-3 mt-4 flex items-center gap-2"><FileWarning className="w-5 h-5" /> Open compliance flags</h2>
      {flags.length === 0 ? (
        <Card className="text-center py-10 mb-8 text-sm text-ink-2">No open flags. Listings get auto-scanned against <code>prohibited_keywords</code> on insert/update.</Card>
      ) : (
        <Card className="p-0 overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-bg text-ink-2 text-left">
              <tr>
                <th className="p-3 font-semibold">When</th>
                <th className="p-3 font-semibold">Entity</th>
                <th className="p-3 font-semibold">Kind</th>
                <th className="p-3 font-semibold">Detail</th>
                <th className="p-3 font-semibold">Source</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {flags.map((f) => (
                <tr key={f.id} className="hover:bg-bg/60">
                  <td className="p-3 text-ink-2 whitespace-nowrap">{new Date(f.created_at).toLocaleDateString("en-GB")}</td>
                  <td className="p-3">
                    {f.entity_table === "listings"
                      ? <Link href={`/dashboard/listings`} className="font-semibold hover:text-green-dark">listing</Link>
                      : <span className="font-mono text-xs">{f.entity_table}</span>}
                  </td>
                  <td className="p-3"><Badge tone="yellow">{f.kind}</Badge></td>
                  <td className="p-3 truncate max-w-[18rem]">{f.detail ?? "—"}</td>
                  <td className="p-3 text-ink-2 capitalize">{f.source}</td>
                  <td className="p-3 text-right"><FlagButtons id={f.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <h2 className="font-display font-extrabold text-lg mb-3 mt-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Data-subject requests (PDPC)</h2>
      {dsrs.length === 0 ? (
        <Card className="text-center py-10 text-sm text-ink-2">
          No DSRs yet. When sellers/shoppers exercise their PDPC rights (access, deletion, correction), they land here.
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg text-ink-2 text-left">
              <tr>
                <th className="p-3 font-semibold">Received</th>
                <th className="p-3 font-semibold">Requester</th>
                <th className="p-3 font-semibold">Kind</th>
                <th className="p-3 font-semibold">Due by</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {dsrs.map((d) => (
                <tr key={d.id} className="hover:bg-bg/60">
                  <td className="p-3 text-ink-2 whitespace-nowrap">{new Date(d.created_at).toLocaleDateString("en-GB")}</td>
                  <td className="p-3">{d.requester_email}</td>
                  <td className="p-3"><Badge>{d.kind}</Badge></td>
                  <td className="p-3 text-ink-2">{d.due_by ?? "—"}</td>
                  <td className="p-3"><Badge tone={d.status === "fulfilled" ? "green" : d.status === "rejected" ? "ink" : "yellow"}>{d.status}</Badge></td>
                  <td className="p-3 text-right"><DsrButtons id={d.id} status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
