"use client";
import { useRef, useState, useTransition } from "react";
import { Upload } from "lucide-react";
import { uploadOwnKyc } from "./actions";

const KINDS = [
  { v: "id_front",         label: "ID — front" },
  { v: "id_back",          label: "ID — back" },
  { v: "selfie",           label: "Selfie with ID" },
  { v: "business_licence", label: "Business licence" },
  { v: "tin_certificate",  label: "TIN certificate" },
  { v: "other",            label: "Other" }
];

export function Uploader() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const r = await uploadOwnKyc(fd);
      if (!r.ok) setMsg({ tone: "err", text: r.error ?? "Upload failed" });
      else {
        setMsg({ tone: "ok", text: "Uploaded — pending review (usually 24h)." });
        if (fileRef.current) fileRef.current.value = "";
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <select name="kind" className="px-3 py-2 rounded-xl border border-line bg-white text-sm font-semibold">
          {KINDS.map((k) => <option key={k.v} value={k.v}>{k.label}</option>)}
        </select>
        <input ref={fileRef} name="file" type="file" accept="image/*,application/pdf" required className="text-sm" />
        <button type="submit" disabled={pending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green text-white text-sm font-bold disabled:opacity-60">
          <Upload className="w-4 h-4" /> {pending ? "Uploading…" : "Upload"}
        </button>
      </div>
      {msg && <div className={`text-xs ${msg.tone === "err" ? "text-danger" : "text-green-dark"}`}>{msg.text}</div>}
      <p className="text-xs text-ink-2">Image or PDF, max 10MB. Your docs are private — only the Pamoja+ team can view them.</p>
    </form>
  );
}
