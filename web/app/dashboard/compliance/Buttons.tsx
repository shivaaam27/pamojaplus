"use client";
import { useState, useTransition } from "react";
import { Check, ShieldAlert } from "lucide-react";
import { resolveFlag, updateDsrStatus } from "./actions";

export function FlagButtons({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-2 justify-end">
      <button disabled={pending} onClick={() => start(async () => { const r = await resolveFlag(id, "cleared"); if (!r.ok) setMsg(r.error ?? "Failed"); })}
        className="p-1.5 rounded-lg hover:bg-green-soft text-green-dark" title="Mark cleared">
        <Check className="w-4 h-4" />
      </button>
      <button disabled={pending} onClick={() => start(async () => { const r = await resolveFlag(id, "action_taken"); if (!r.ok) setMsg(r.error ?? "Failed"); })}
        className="p-1.5 rounded-lg hover:bg-yellow-soft text-ink" title="Action taken">
        <ShieldAlert className="w-4 h-4" />
      </button>
      {msg && <span className="text-xs text-danger ml-1">{msg}</span>}
    </div>
  );
}

export function DsrButtons({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  if (status === "fulfilled" || status === "rejected") return <span className="text-xs text-ink-2">closed</span>;
  return (
    <div className="flex items-center gap-2 justify-end">
      {status !== "in_progress" && (
        <button disabled={pending} onClick={() => start(async () => { const r = await updateDsrStatus(id, "in_progress"); if (!r.ok) setMsg(r.error ?? "Failed"); })}
          className="px-2 py-1 rounded-lg text-xs font-bold bg-yellow-soft text-ink hover:brightness-95">
          Start
        </button>
      )}
      <button disabled={pending} onClick={() => start(async () => { const r = await updateDsrStatus(id, "fulfilled"); if (!r.ok) setMsg(r.error ?? "Failed"); })}
        className="px-2 py-1 rounded-lg text-xs font-bold bg-green-soft text-green-dark hover:brightness-95">
        Fulfil
      </button>
      <button disabled={pending} onClick={() => start(async () => { const r = await updateDsrStatus(id, "rejected"); if (!r.ok) setMsg(r.error ?? "Failed"); })}
        className="px-2 py-1 rounded-lg text-xs font-bold bg-ink text-white hover:opacity-90">
        Reject
      </button>
      {msg && <span className="text-xs text-danger ml-1">{msg}</span>}
    </div>
  );
}
