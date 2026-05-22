"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { updateMyProfile } from "./actions";
import { CATEGORIES, normalizeTzPhone, isValidTzPhone } from "@/lib/catalog";

interface Init { owner_name: string | null; whatsapp: string | null; phone: string | null; location: string | null; category: string | null; }

export function ProfileForm({ init }: { init: Init }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [whatsapp, setWhatsapp] = useState(init.whatsapp ?? "");
  const waOk = whatsapp.trim() === "" || isValidTzPhone(whatsapp);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    if (whatsapp && !isValidTzPhone(whatsapp)) {
      setMsg({ tone: "err", text: "WhatsApp must be a TZ mobile number (e.g. +255712345678 or 0712345678)" });
      return;
    }
    const fd = new FormData(e.currentTarget);
    // Canonicalise WA to +255 form before submitting
    if (whatsapp) fd.set("whatsapp", `+${normalizeTzPhone(whatsapp)}`);
    start(async () => {
      const r = await updateMyProfile(fd);
      if (!r.ok) setMsg({ tone: "err", text: r.error ?? "Failed" });
      else setMsg({ tone: "ok", text: "Saved." });
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field name="owner_name" label="Owner name" defaultValue={init.owner_name ?? ""} />

      <label className="block">
        <span className="text-sm font-semibold">WhatsApp</span>
        <input name="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="+255 712 345 678"
          className={`mt-1 w-full px-3 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 ${waOk ? "border-line focus:ring-green" : "border-danger focus:ring-danger"}`} />
        <span className={`text-xs ${waOk ? "text-ink-2" : "text-danger"}`}>
          {waOk ? "TZ mobile, with or without country code." : "Not a valid TZ mobile number."}
        </span>
      </label>

      <Field name="phone" label="Phone (alternate)" defaultValue={init.phone ?? ""} />
      <Field name="location" label="Location" defaultValue={init.location ?? ""} />

      <label className="block">
        <span className="text-sm font-semibold">Category</span>
        <select name="category" defaultValue={init.category ?? ""}
          className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green">
          <option value="">— No primary category —</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="text-xs text-ink-2">Used as the default for new listings.</span>
      </label>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>
        {msg && <span className={`text-sm ${msg.tone === "err" ? "text-danger" : "text-green-dark"}`}>{msg.text}</span>}
      </div>
    </form>
  );
}

function Field({ name, label, defaultValue, hint }: { name: string; label: string; defaultValue: string; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input name={name} defaultValue={defaultValue}
        className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green" />
      {hint && <span className="text-xs text-ink-2">{hint}</span>}
    </label>
  );
}
