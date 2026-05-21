"use client";
import { useState, useTransition } from "react";
import { Check, X, Pencil } from "lucide-react";
import { decideListing } from "./actions";

export function ModRow({ reviewId }: { reviewId: string }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function go(d: "approved" | "rejected" | "changes_requested") {
    setMsg(null);
    start(async () => {
      const note = d !== "approved" ? (prompt(d === "rejected" ? "Why reject?" : "What changes?") ?? undefined) : undefined;
      const r = await decideListing(reviewId, d, note);
      if (!r.ok) setMsg(r.error ?? "Failed");
    });
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button disabled={pending} onClick={() => go("approved")} className="p-1.5 rounded-lg hover:bg-green-soft text-green-dark" title="Approve → live">
        <Check className="w-4 h-4" />
      </button>
      <button disabled={pending} onClick={() => go("changes_requested")} className="p-1.5 rounded-lg hover:bg-yellow-soft text-ink" title="Request changes">
        <Pencil className="w-4 h-4" />
      </button>
      <button disabled={pending} onClick={() => go("rejected")} className="p-1.5 rounded-lg hover:bg-yellow-soft text-danger" title="Reject">
        <X className="w-4 h-4" />
      </button>
      {msg && <span className="text-xs text-danger ml-1">{msg}</span>}
    </div>
  );
}
