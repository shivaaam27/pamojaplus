import { cookies } from "next/headers";
import { serverClient, supabaseConfigured, type TeamRole } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Users } from "lucide-react";
import { TeamRow } from "./TeamRow";

export const dynamic = "force-dynamic";

interface Row { id: string; email: string; role: TeamRole; created_at: string; }

export default async function TeamPage() {
  let rows: Row[] = [];
  let error: string | null = null;

  if (!supabaseConfigured) {
    error = "Supabase env vars not set.";
  } else {
    const sb = serverClient(cookies())!;
    const { data, error: err } = await sb
      .from("team_users")
      .select("id, email, role, created_at")
      .order("created_at", { ascending: true });
    if (err) error = err.message; else rows = (data ?? []) as Row[];
  }

  const byRole = rows.reduce((acc, r) => { acc[r.role] = (acc[r.role] ?? 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <>
      <PageHeader
        eyebrow="System"
        title="Team"
        description="Who can sign in to /dashboard. Roles map to permission bundles in role_permissions. Only founders can edit (per RLS)."
        right={
          <div className="flex gap-2 flex-wrap">
            {Object.entries(byRole).map(([k, v]) => <Badge key={k} tone={k === "founder" ? "yellow" : "green"}>{k}: {v}</Badge>)}
          </div>
        }
      />

      {error && (
        <Card className="mb-6 border-yellow bg-yellow-soft/40">
          <div className="text-sm"><strong>Heads-up:</strong> {error}</div>
        </Card>
      )}

      <Card className="mb-6 bg-green-soft/40 border-green">
        <div className="font-display font-extrabold mb-2">Inviting a new team member</div>
        <ol className="text-sm space-y-1.5 list-decimal list-inside text-ink-2">
          <li>Supabase → Authentication → Users → <strong>Add user</strong> with email + temporary password.</li>
          <li>Run this in SQL editor (replace email):
            <pre className="mt-2 p-3 rounded-lg bg-white text-xs font-mono overflow-x-auto">{`insert into team_users (id, email, role)
select id, email, 'ops'
from auth.users
where email = 'new.member@pamojaplus.co.tz';`}</pre>
          </li>
          <li>They sign in at <code>/login</code> with their temporary password and reset.</li>
        </ol>
      </Card>

      {rows.length === 0 ? (
        <EmptyState icon={Users} title="No team members yet" hint="See the steps above to invite the first member." />
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg text-ink-2 text-left">
              <tr>
                <th className="p-3 font-semibold">Email</th>
                <th className="p-3 font-semibold">Role</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => <TeamRow key={r.id} id={r.id} email={r.email} role={r.role} />)}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
