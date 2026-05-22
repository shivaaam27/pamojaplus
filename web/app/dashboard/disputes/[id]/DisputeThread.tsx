"use client";
import { useState, useTransition } from "react";
import { Send, Check, X, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/Card";
import { postDisputeMessage, setDisputeStatus } from "../actions";

type DisputeStatus = "open" | "mediation" | "resolved_buyer" | "resolved_seller" | "escalated" | "closed";

interface Msg { id: string; author: string; body: string; at: string; }

export function DisputeThread({ id, status, messages }: { id: string; status: string; messages: Msg[] }) {
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setMsg(null);
    start(async () => {
      const r = await postDisputeMessage(id, body.trim());
      if (!r.ok) setMsg(r.error ?? "Failed");
      else setBody("");
    });
  }

  function setStatus(s: DisputeStatus) {
    const resolution = s.startsWith("resolved_") ? prompt("Resolution note?") ?? undefined : undefined;
    setMsg(null);
    start(async () => { const r = await setDisputeStatus(id, s, resolution); if (!r.ok) setMsg(r.error ?? "Failed"); });
  }

  return (
    <>
      <div className="space-y-3 mb-6">
        {messages.length === 0 ? (
          <div className="text-sm text-ink-2">No messages yet.</div>
        ) : messages.map((m) => (
          <div key={m.id} className={`p-3 rounded-xl ${m.author === "team" ? "bg-green-soft" : m.author === "buyer" ? "bg-yellow-soft" : "bg-bg"}`}>
            <div className="text-xs font-bold uppercase tracking-widest text-ink-2 mb-1">{m.author} · {new Date(m.at).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}</div>
            <div className="text-sm whitespace-pre-wrap">{m.body}</div>
          </div>
        ))}
      </div>

      {!["resolved_buyer", "resolved_seller", "closed"].includes(status) && (
        <>
          <form onSubmit={send} className="space-y-3 mb-6">
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Reply as Pamoja+ ops…"
              className="w-full px-3 py-2 rounded-xl border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green" />
            <div className="flex items-center gap-2 flex-wrap">
              <button type="submit" disabled={pending || !body.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green text-white text-sm font-bold disabled:opacity-60">
                <Send className="w-4 h-4" /> {pending ? "Sending…" : "Post"}
              </button>
              {status === "open" && (
                <button type="button" onClick={() => setStatus("mediation")} className="px-3 py-1.5 rounded-full bg-yellow-soft text-ink text-xs font-bold">Move to mediation</button>
              )}
              <button type="button" onClick={() => setStatus("resolved_buyer")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-soft text-green-dark text-xs font-bold">
                <Check className="w-3 h-3" /> Resolve for buyer
              </button>
              <button type="button" onClick={() => setStatus("resolved_seller")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-soft text-green-dark text-xs font-bold">
                <Check className="w-3 h-3" /> Resolve for seller
              </button>
              <button type="button" onClick={() => setStatus("escalated")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-ink text-white text-xs font-bold">
                <ChevronUp className="w-3 h-3" /> Escalate
              </button>
              <button type="button" onClick={() => setStatus("closed")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-bg text-ink-2 text-xs font-bold">
                <X className="w-3 h-3" /> Close
              </button>
            </div>
          </form>
          {msg && <div className="text-sm text-danger">{msg}</div>}
        </>
      )}

      {["resolved_buyer", "resolved_seller", "closed"].includes(status) && (
        <Badge>This dispute is {status.replace("_", " ")}. No further actions.</Badge>
      )}
    </>
  );
}
