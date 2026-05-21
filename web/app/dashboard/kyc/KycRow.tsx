"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, X, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Card";
import { reviewDocument, signedDocUrl } from "./actions";

export function KycRow({
  id,
  kind,
  status,
  uploadedAt,
  sellerId,
  sellerName,
  storagePath
}: {
  id: string;
  kind: string;
  status: "pending" | "approved" | "rejected";
  uploadedAt: string;
  sellerId: string;
  sellerName: string;
  storagePath: string;
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function run(decision: "approved" | "rejected") {
    setMsg(null);
    start(async () => {
      const note = decision === "rejected" ? prompt("Reason for rejection?") ?? undefined : undefined;
      const r = await reviewDocument(id, decision, note);
      if (!r.ok) setMsg(r.error ?? "Failed");
    });
  }

  async function preview() {
    setMsg(null);
    const r = await signedDocUrl(storagePath);
    if (!r.ok) { setMsg(r.error ?? "Failed"); return; }
    window.open(r.url, "_blank", "noopener");
  }

  const tone = status === "approved" ? "green" : status === "rejected" ? "ink" : "yellow";

  return (
    <tr className="hover:bg-bg/60">
      <td className="p-3">
        <Link href={`/dashboard/sellers/${sellerId}`} className="font-semibold hover:text-green-dark">{sellerName}</Link>
      </td>
      <td className="p-3 capitalize">{kind.replace(/_/g, " ")}</td>
      <td className="p-3 text-ink-2">{new Date(uploadedAt).toLocaleDateString("en-GB")}</td>
      <td className="p-3"><Badge tone={tone}>{status}</Badge></td>
      <td className="p-3">
        <div className="flex items-center justify-end gap-2">
          <button onClick={preview} className="p-1.5 rounded-lg hover:bg-bg text-ink-2" title="Preview">
            <Eye className="w-4 h-4" />
          </button>
          {status === "pending" && (
            <>
              <button disabled={pending} onClick={() => run("approved")} className="p-1.5 rounded-lg hover:bg-green-soft text-green-dark" title="Approve">
                <Check className="w-4 h-4" />
              </button>
              <button disabled={pending} onClick={() => run("rejected")} className="p-1.5 rounded-lg hover:bg-yellow-soft text-danger" title="Reject">
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          {msg && <span className="text-xs text-danger ml-1">{msg}</span>}
        </div>
      </td>
    </tr>
  );
}
