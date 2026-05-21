"use client";
import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createAmbassador } from "./actions";

export function CreateForm() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    start(async () => {
      const r = await createAmbassador(fd);
      if (!r.ok) setMsg({ tone: "err", text: r.error ?? "Failed" });
      else {
        setMsg({ tone: "ok", text: `Created — code ${r.code}` });
        form.reset();
      }
    });
  }

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
      <input name="name"   required placeholder="Name"            className="px-3 py-2 rounded-xl border border-line bg-white text-sm sm:col-span-2" />
      <select name="type"  className="px-3 py-2 rounded-xl border border-line bg-white text-sm font-semibold">
        <option value="digital">Digital</option>
        <option value="field">Field</option>
        <option value="campus">Campus</option>
      </select>
      <input name="phone"  placeholder="Phone"   className="px-3 py-2 rounded-xl border border-line bg-white text-sm" />
      <input name="email"  type="email" placeholder="Email"   className="px-3 py-2 rounded-xl border border-line bg-white text-sm" />
      <input name="region" placeholder="Region (Dar zone)" className="px-3 py-2 rounded-xl border border-line bg-white text-sm" />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green text-white text-sm font-bold sm:col-span-2 disabled:opacity-60"
      >
        <Plus className="w-4 h-4" /> {pending ? "Adding…" : "Add ambassador"}
      </button>
      {msg && (
        <div className={`text-xs sm:col-span-6 ${msg.tone === "err" ? "text-danger" : "text-green-dark"}`}>{msg.text}</div>
      )}
    </form>
  );
}
