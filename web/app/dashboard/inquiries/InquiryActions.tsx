"use client";
import { useState, useTransition } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { markInquiryResponded, markInquiryConverted } from "./actions";

export function InquiryActions({ id, responded, converted }: { id: string; responded: boolean; converted: boolean }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  if (converted) return <span className="text-xs text-green-dark font-bold">converted</span>;

  return (
    <div className="flex items-center justify-end gap-2">
      {!responded && (
        <button disabled={pending} onClick={() => start(async () => { const r = await markInquiryResponded(id); if (!r.ok) setMsg(r.error ?? "Failed"); })}
          className="p-1.5 rounded-lg hover:bg-green-soft text-green-dark" title="Mark responded">
          <Check className="w-4 h-4" />
        </button>
      )}
      <button disabled={pending} onClick={() => start(async () => { const r = await markInquiryConverted(id); if (!r.ok) setMsg(r.error ?? "Failed"); })}
        className="p-1.5 rounded-lg hover:bg-yellow-soft text-ink" title="Mark converted (sold)">
        <ShoppingCart className="w-4 h-4" />
      </button>
      {msg && <span className="text-xs text-danger ml-1">{msg}</span>}
    </div>
  );
}
