import { cookies } from "next/headers";
import { serverClient, supabaseConfigured, type DBAuditLog } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { ScrollText } from "lucide-react";

export const dynamic = "force-dynamic";

const ACTION_TONE: Record<string, "green" | "yellow" | "ink"> = {
  insert: "green",
  update: "yellow",
  delete: "ink"
};

interface SearchParams { table?: string; action?: string; actor?: string; page?: string; }

export default async function AuditPage({ searchParams }: { searchParams: SearchParams }) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const pageSize = 50;
  let rows: DBAuditLog[] = [];
  let tables: string[] = [];
  let error: string | null = null;

  if (!supabaseConfigured) {
    error = "Supabase env vars not set.";
  } else {
    const sb = serverClient(cookies())!;
    let q = sb
      .from("audit_log")
      .select("*")
      .order("at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
    if (searchParams.table)  q = q.eq("entity_table", searchParams.table);
    if (searchParams.action) q = q.eq("action", searchParams.action);
    if (searchParams.actor)  q = q.ilike("actor_email", `%${searchParams.actor}%`);
    const { data, error: err } = await q;
    if (err) error = err.message; else rows = (data ?? []) as DBAuditLog[];

    // Distinct tables for the filter chip
    const { data: t } = await sb.from("audit_log").select("entity_table").limit(2000);
    tables = Array.from(new Set((t ?? []).map((r: { entity_table: string }) => r.entity_table))).sort();
  }

  return (
    <>
      <PageHeader
        eyebrow="System"
        title="Audit log"
        description="Every state change on high-value tables. Required reading when a regulator (TRA, PDPC) or a disputing seller asks 'who changed what, when?'"
        right={<Badge>page {page}</Badge>}
      />

      <Card className="mb-6">
        <form className="grid sm:grid-cols-4 gap-3" action="" method="get">
          <select name="table" defaultValue={searchParams.table ?? ""} className="px-3 py-2 rounded-xl border border-line bg-white text-sm">
            <option value="">All tables</option>
            {tables.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select name="action" defaultValue={searchParams.action ?? ""} className="px-3 py-2 rounded-xl border border-line bg-white text-sm">
            <option value="">All actions</option>
            <option value="insert">insert</option>
            <option value="update">update</option>
            <option value="delete">delete</option>
          </select>
          <input name="actor" defaultValue={searchParams.actor ?? ""} placeholder="actor email contains…"
                 className="px-3 py-2 rounded-xl border border-line bg-white text-sm" />
          <button type="submit" className="px-4 py-2 rounded-full bg-green text-white text-sm font-bold">Filter</button>
        </form>
      </Card>

      {error && (
        <Card className="mb-6 border-yellow bg-yellow-soft/40">
          <div className="text-sm"><strong>Heads-up:</strong> {error}</div>
        </Card>
      )}

      {rows.length === 0 ? (
        <EmptyState icon={ScrollText} title="No entries match" hint="As soon as ops touches sellers/listings/payouts/etc, rows appear here automatically via the audit_row_change() trigger." />
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg text-ink-2 text-left">
              <tr>
                <th className="p-3 font-semibold">When</th>
                <th className="p-3 font-semibold">Actor</th>
                <th className="p-3 font-semibold">Action</th>
                <th className="p-3 font-semibold">Table</th>
                <th className="p-3 font-semibold">Entity</th>
                <th className="p-3 font-semibold">Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-bg/60 align-top">
                  <td className="p-3 text-ink-2 whitespace-nowrap">{new Date(r.at).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}</td>
                  <td className="p-3">{r.actor_email ?? <span className="text-ink-2">system</span>}</td>
                  <td className="p-3"><Badge tone={ACTION_TONE[r.action] ?? "ink"}>{r.action}</Badge></td>
                  <td className="p-3 font-mono text-xs">{r.entity_table}</td>
                  <td className="p-3 font-mono text-xs truncate max-w-[10rem]">{r.entity_id ?? "—"}</td>
                  <td className="p-3">
                    <details>
                      <summary className="cursor-pointer text-xs text-ink-2 hover:text-ink">show</summary>
                      <div className="mt-2 grid sm:grid-cols-2 gap-2 text-xs">
                        <pre className="p-2 rounded-lg bg-bg overflow-x-auto max-h-48 max-w-md">{JSON.stringify(r.before ?? null, null, 2)}</pre>
                        <pre className="p-2 rounded-lg bg-green-soft overflow-x-auto max-h-48 max-w-md">{JSON.stringify(r.after ?? null, null, 2)}</pre>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <div className="flex items-center justify-between mt-4">
        <a href={`?${new URLSearchParams({ ...searchParams, page: String(Math.max(1, page - 1)) } as Record<string, string>).toString()}`}
           className={`text-sm font-bold ${page === 1 ? "opacity-40 pointer-events-none" : "text-green-dark hover:underline"}`}>
          ← Newer
        </a>
        <a href={`?${new URLSearchParams({ ...searchParams, page: String(page + 1) } as Record<string, string>).toString()}`}
           className={`text-sm font-bold ${rows.length < 50 ? "opacity-40 pointer-events-none" : "text-green-dark hover:underline"}`}>
          Older →
        </a>
      </div>
    </>
  );
}
