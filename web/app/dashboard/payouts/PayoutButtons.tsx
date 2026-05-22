"use client";
import { useState, useTransition } from "react";
import { Check, Banknote, Pause } from "lucide-react";
import { approvePayout, markPaid, holdPayout } from "./actions";

type MmoProvider = "mpesa" | "mixx_yas" | "airtel_money" | "halopesa" | "azampesa" | "tpesa" | "card" | "bank" | "cash";

export function PayoutButtons({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function approve() {
    setMsg(null);
    start(async () => { const r = await approvePayout(id); if (!r.ok) setMsg(r.error ?? "Failed"); });
  }
  function pay() {
    const mmo = prompt("Provider? (mpesa / mixx_yas / airtel_money / bank / cash)") as MmoProvider | null;
    if (!mmo) return;
    const ref = prompt("Transaction reference?");
    if (!ref) return;
    setMsg(null);
    start(async () => { const r = await markPaid(id, mmo, ref); if (!r.ok) setMsg(r.error ?? "Failed"); });
  }
  function hold() {
    const note = prompt("Reason for hold?");
    if (!note) return;
    setMsg(null);
    start(async () => { const r = await holdPayout(id, note); if (!r.ok) setMsg(r.error ?? "Failed"); });
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {status === "scheduled" && (
        <button disabled={pending} onClick={approve}
          className="p-1.5 rounded-lg hover:bg-green-soft text-green-dark" title="Approve">
          <Check className="w-4 h-4" />
        </button>
      )}
      {(status === "scheduled" || status === "approved") && (
        <>
          <button disabled={pending} onClick={pay}
            className="p-1.5 rounded-lg hover:bg-yellow-soft text-ink" title="Mark paid">
            <Banknote className="w-4 h-4" />
          </button>
          <button disabled={pending} onClick={hold}
            className="p-1.5 rounded-lg hover:bg-bg text-ink-2" title="Put on hold">
            <Pause className="w-4 h-4" />
          </button>
        </>
      )}
      {msg && <span className="text-xs text-danger ml-1">{msg}</span>}
    </div>
  );
}
