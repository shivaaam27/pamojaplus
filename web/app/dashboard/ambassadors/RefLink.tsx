"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function RefLink({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const link = typeof window !== "undefined"
    ? `${window.location.origin}/r/${code}`
    : `/r/${code}`;

  async function copy() {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  }

  return (
    <button onClick={copy} className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-2 hover:text-ink">
      /r/{code}
      {copied ? <Check className="w-3.5 h-3.5 text-green-dark" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}
