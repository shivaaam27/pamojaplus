"use client";
import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { recordRevenueEvent } from "./actions";

interface SellerOption { id: string; business_name: string; }

export function RecordForm({ sellers }: { sellers: SellerOption[] }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    start(async () => {
      const r = await recordRevenueEvent(fd);
      if (!r.ok) setMsg({ tone: "err", text: r.error ?? "Failed" });
      else { setMsg({ tone: "ok", text: "Recorded." }); form.reset(); }
    });
  }

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
      <select name="seller_id" className="px-3 py-2 rounded-xl border border-line bg-white text-sm sm:col-span-2">
        <option value="">— No seller (platform fee) —</option>
        {sellers.map((s) => <option key={s.id} value={s.id}>{s.business_name}</option>)}
      </select>
      <select name="type" className="px-3 py-2 rounded-xl border border-line bg-white text-sm font-semibold">
        <option value="subscription">Subscription</option>
        <option value="boost">Boost</option>
        <option value="spotlight">Spotlight</option>
        <option value="commission">Commission</option>
      </select>
      <input name="amount_tzs" type="number" required min={1} placeholder="Amount (TZS)"
             className="px-3 py-2 rounded-xl border border-line bg-white text-sm" />
      <input name="mobile_money_ref" placeholder="MM ref (optional)"
             className="px-3 py-2 rounded-xl border border-line bg-white text-sm" />
      <button type="submit" disabled={pending}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green text-white text-sm font-bold disabled:opacity-60">
        <Plus className="w-4 h-4" /> {pending ? "Recording…" : "Record"}
      </button>
      <input name="period_start" type="date" className="px-3 py-2 rounded-xl border border-line bg-white text-sm" />
      <input name="period_end"   type="date" className="px-3 py-2 rounded-xl border border-line bg-white text-sm" />
      {msg && <div className={`text-xs sm:col-span-6 ${msg.tone === "err" ? "text-danger" : "text-green-dark"}`}>{msg.text}</div>}
    </form>
  );
}
