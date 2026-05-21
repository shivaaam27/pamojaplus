"use client";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { setTeamRole, removeTeamUser } from "./actions";
import type { TeamRole } from "@/lib/supabase";

const ROLES: TeamRole[] = ["founder", "ops", "bd", "marketing", "tech", "finance"];

export function TeamRow({ id, email, role }: { id: string; email: string; role: TeamRole }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [r, setR] = useState<TeamRole>(role);

  return (
    <tr className="hover:bg-bg/60">
      <td className="p-3 font-semibold">{email}</td>
      <td className="p-3">
        <select
          value={r}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.value as TeamRole;
            setR(next);
            setMsg(null);
            start(async () => {
              const res = await setTeamRole(id, next);
              if (!res.ok) setMsg(res.error ?? "Failed");
            });
          }}
          className="px-3 py-1.5 rounded-lg border border-line bg-white text-sm font-semibold capitalize"
        >
          {ROLES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </td>
      <td className="p-3 text-right">
        <button
          disabled={pending}
          onClick={() => {
            if (!confirm(`Remove ${email} from the team?`)) return;
            start(async () => {
              const res = await removeTeamUser(id);
              if (!res.ok) setMsg(res.error ?? "Failed");
            });
          }}
          className="p-1.5 rounded-lg hover:bg-yellow-soft text-danger"
          title="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        {msg && <span className="text-xs text-danger ml-1">{msg}</span>}
      </td>
    </tr>
  );
}
