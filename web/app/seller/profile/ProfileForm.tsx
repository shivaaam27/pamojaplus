"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { updateMyProfile } from "./actions";

interface Init { owner_name: string | null; whatsapp: string | null; phone: string | null; location: string | null; category: string | null; }

export function ProfileForm({ init }: { init: Init }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const r = await updateMyProfile(fd);
      if (!r.ok) setMsg({ tone: "err", text: r.error ?? "Failed" });
      else setMsg({ tone: "ok", text: "Saved." });
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field name="owner_name" label="Owner name"   defaultValue={init.owner_name ?? ""} />
      <Field name="whatsapp"   label="WhatsApp"     defaultValue={init.whatsapp ?? ""}   hint="Include country code, e.g. +255700123456" />
      <Field name="phone"      label="Phone"        defaultValue={init.phone ?? ""} />
      <Field name="location"   label="Location"     defaultValue={init.location ?? ""} />
      <Field name="category"   label="Category"     defaultValue={init.category ?? ""}   hint="Food, Wellness, Beauty, Fashion, Home, Services" />
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
