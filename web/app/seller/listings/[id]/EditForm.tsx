"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { updateOwnListing, deleteOwnListing } from "./actions";
import { CATEGORIES } from "@/lib/catalog";

interface Init { id: string; title: string; description: string | null; price_tzs: number | null; category: string | null; }

export function EditForm({ init }: { init: Init }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const r = await updateOwnListing(init.id, fd);
      if (!r.ok) setMsg({ tone: "err", text: r.error ?? "Failed" });
      else { setMsg({ tone: "ok", text: "Saved — back to moderation for review." }); router.refresh(); }
    });
  }

  function remove() {
    if (!confirm("Delete this listing? It will be removed from the marketplace.")) return;
    start(async () => {
      const r = await deleteOwnListing(init.id);
      if (r && !r.ok) setMsg({ tone: "err", text: r.error ?? "Failed" });
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-semibold">Title</span>
        <input name="title" required defaultValue={init.title}
          className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Description</span>
        <textarea name="description" rows={5} defaultValue={init.description ?? ""}
          className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Category</span>
        <select name="category" defaultValue={init.category ?? ""}
          className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green">
          <option value="">— Use my profile category —</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Price (TZS)</span>
        <input name="price_tzs" type="number" min={0} defaultValue={init.price_tzs ?? ""}
          className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green" />
      </label>
      <div className="flex items-center justify-between gap-3">
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>
        <button type="button" onClick={remove} disabled={pending}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold text-danger hover:bg-yellow-soft disabled:opacity-60">
          <Trash2 className="w-4 h-4" /> Delete listing
        </button>
      </div>
      {msg && <div className={`text-sm ${msg.tone === "err" ? "text-danger" : "text-green-dark"}`}>{msg.text}</div>}
      <p className="text-xs text-ink-2">Edits send the listing back to <strong>draft</strong> for moderation re-review (usually under 24h).</p>
    </form>
  );
}
