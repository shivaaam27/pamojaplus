"use client";
import { useState, useTransition } from "react";
import { Check, X, Eye } from "lucide-react";
import { approveApplication, rejectApplication, setApplicationReviewing } from "./actions";

export function ActionRow({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setMsg(null);
    start(async () => {
      const r = await fn();
      if (!r.ok) setMsg(r.error ?? "Failed");
    });
  }

  if (status === "approved" || status === "rejected") {
    return <span className="text-xs text-ink-2">—</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {status === "new" && (
        <button
          disabled={pending}
          onClick={() => run(() => setApplicationReviewing(id))}
          className="p-1.5 rounded-lg hover:bg-bg text-ink-2"
          title="Mark reviewing"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
      <button
        disabled={pending}
        onClick={() => run(() => approveApplication(id))}
        className="p-1.5 rounded-lg hover:bg-green-soft text-green-dark"
        title="Approve → create seller"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        disabled={pending}
        onClick={() => run(() => rejectApplication(id))}
        className="p-1.5 rounded-lg hover:bg-yellow-soft text-danger"
        title="Reject"
      >
        <X className="w-4 h-4" />
      </button>
      {msg && <span className="text-xs text-danger ml-1">{msg}</span>}
    </div>
  );
}
