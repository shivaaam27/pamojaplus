"use client";
import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createListing } from "./listing-actions";

export function ListingForm({ sellerId }: { sellerId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    start(async () => {
      const r = await createListing(sellerId, fd);
      if (!r.ok) setMsg({ tone: "err", text: r.error ?? "Failed" });
      else { setMsg({ tone: "ok", text: "Created — queued for moderation." }); form.reset(); }
    });
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-green-dark hover:underline">
        <Plus className="w-4 h-4" /> Add a listing
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 border-t border-line pt-4">
      <div className="font-display font-extrabold text-sm">New listing</div>
      <input name="title" required placeholder="Title"
             className="w-full px-3 py-2 rounded-xl border border-line bg-white text-sm" />
      <textarea name="description" placeholder="Description (optional)" rows={3}
                className="w-full px-3 py-2 rounded-xl border border-line bg-white text-sm" />
      <input name="price_tzs" type="number" min={0} placeholder="Price (TZS)"
             className="w-full px-3 py-2 rounded-xl border border-line bg-white text-sm" />
      <div className="flex items-center gap-2">
        <button type="submit" disabled={pending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green text-white text-sm font-bold disabled:opacity-60">
          {pending ? "Saving…" : "Create"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-ink-2 hover:text-ink">Cancel</button>
      </div>
      {msg && <div className={`text-xs ${msg.tone === "err" ? "text-danger" : "text-green-dark"}`}>{msg.text}</div>}
      <p className="text-xs text-ink-2">New listings start as <code>draft</code> and are auto-queued in <code>/dashboard/listings</code> for moderation.</p>
    </form>
  );
}
