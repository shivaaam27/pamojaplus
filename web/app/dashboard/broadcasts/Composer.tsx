"use client";
import { useState, useTransition } from "react";
import { Send, Eye } from "lucide-react";
import { previewSegment, sendBroadcast } from "./actions";

export function Composer({ locations }: { locations: string[] }) {
  const [pending, start] = useTransition();
  const [count, setCount] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  function preview(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setMsg(null);
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const fd = new FormData(form);
    start(async () => {
      const r = await previewSegment(fd);
      if (!r.ok) setMsg({ tone: "err", text: r.error ?? "Failed" });
      else setCount(r.count ?? 0);
    });
  }

  function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (!confirm(`Send to ${count ?? "?"} recipients?`)) return;
    start(async () => {
      const r = await sendBroadcast(fd);
      if (!r.ok) setMsg({ tone: "err", text: r.error ?? "Failed" });
      else { setMsg({ tone: "ok", text: `Queued for ${r.sent} recipients.` }); form.reset(); setCount(null); }
    });
  }

  return (
    <form onSubmit={send} className="grid sm:grid-cols-2 gap-3">
      <input name="name" required placeholder="Broadcast name (internal)" className="sm:col-span-2 px-3 py-2 rounded-xl border border-line bg-white text-sm" />
      <select name="channel" defaultValue="whatsapp" className="px-3 py-2 rounded-xl border border-line bg-white text-sm font-semibold">
        <option value="whatsapp">WhatsApp</option>
        <option value="sms">SMS</option>
        <option value="email">Email</option>
      </select>
      <select name="plan" className="px-3 py-2 rounded-xl border border-line bg-white text-sm">
        <option value="">Any plan</option>
        <option value="free">Free</option>
        <option value="growth">Growth</option>
        <option value="plus">Plus</option>
        <option value="partner">Partner</option>
      </select>
      <select name="tier" className="px-3 py-2 rounded-xl border border-line bg-white text-sm">
        <option value="">Any tier</option>
        <option value="none">None</option>
        <option value="bronze">Bronze</option>
        <option value="silver">Silver</option>
        <option value="gold">Gold</option>
      </select>
      <select name="location" className="px-3 py-2 rounded-xl border border-line bg-white text-sm">
        <option value="">Any location</option>
        {locations.map((l) => <option key={l} value={l}>{l}</option>)}
      </select>
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" name="verified" /> Verified sellers only
      </label>
      <textarea name="body" required rows={4} placeholder="Message (use simple text; emoji ok)"
        className="sm:col-span-2 px-3 py-2 rounded-xl border border-line bg-white text-sm" />

      <div className="sm:col-span-2 flex items-center gap-2 flex-wrap">
        <button type="button" onClick={preview} disabled={pending}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-bg text-ink text-xs font-bold">
          <Eye className="w-4 h-4" /> Preview count
        </button>
        {count != null && <span className="text-sm font-bold">{count} recipient{count === 1 ? "" : "s"}</span>}
        <button type="submit" disabled={pending}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green text-white text-sm font-bold disabled:opacity-60 ml-auto">
          <Send className="w-4 h-4" /> {pending ? "Sending…" : "Send"}
        </button>
      </div>
      {msg && <div className={`sm:col-span-2 text-xs ${msg.tone === "err" ? "text-danger" : "text-green-dark"}`}>{msg.text}</div>}
    </form>
  );
}
