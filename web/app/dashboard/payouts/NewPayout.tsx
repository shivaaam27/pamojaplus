"use client";
import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createPayout } from "./actions";

interface Opt { id: string; label: string; }

export function NewPayout({ sellers, ambassadors }: { sellers: Opt[]; ambassadors: Opt[] }) {
  const [target, setTarget] = useState<"seller" | "ambassador">("seller");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (target === "seller")     fd.delete("ambassador_id");
    else                          fd.delete("seller_id");
    start(async () => {
      const r = await createPayout(fd);
      if (!r.ok) setMsg({ tone: "err", text: r.error ?? "Failed" });
      else { setMsg({ tone: "ok", text: "Scheduled." }); form.reset(); }
    });
  }

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
      <div className="sm:col-span-2">
        <div className="text-xs font-semibold text-ink-2 mb-1">Recipient</div>
        <div className="flex gap-2 mb-2">
          <button type="button" onClick={() => setTarget("seller")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${target === "seller" ? "bg-green text-white" : "bg-bg text-ink-2"}`}>
            Seller
          </button>
          <button type="button" onClick={() => setTarget("ambassador")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${target === "ambassador" ? "bg-green text-white" : "bg-bg text-ink-2"}`}>
            Ambassador (5% WHT)
          </button>
        </div>
        {target === "seller" ? (
          <select name="seller_id" required className="w-full px-3 py-2 rounded-xl border border-line bg-white text-sm">
            <option value="">— Pick a seller —</option>
            {sellers.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        ) : (
          <select name="ambassador_id" required className="w-full px-3 py-2 rounded-xl border border-line bg-white text-sm">
            <option value="">— Pick an ambassador —</option>
            {ambassadors.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        )}
      </div>
      <input name="gross_tzs" type="number" min={1} required placeholder="Gross (TZS)"
        className="px-3 py-2 rounded-xl border border-line bg-white text-sm" />
      <input name="fees_tzs" type="number" min={0} defaultValue={0} placeholder="Fees (TZS)"
        className="px-3 py-2 rounded-xl border border-line bg-white text-sm" />
      <input name="scheduled_for" type="date" className="px-3 py-2 rounded-xl border border-line bg-white text-sm" />
      <input name="note" placeholder="Note" className="px-3 py-2 rounded-xl border border-line bg-white text-sm" />
      <button type="submit" disabled={pending}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green text-white text-sm font-bold sm:col-span-2 disabled:opacity-60">
        <Plus className="w-4 h-4" /> {pending ? "Scheduling…" : "Schedule payout"}
      </button>
      {msg && <div className={`text-xs sm:col-span-6 ${msg.tone === "err" ? "text-danger" : "text-green-dark"}`}>{msg.text}</div>}
    </form>
  );
}
