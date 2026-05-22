import { cookies } from "next/headers";
import { serverClient, type DBSellerDocument } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { SellerShell } from "@/components/layout/SellerShell";
import { getMySeller } from "../_lib/getSeller";
import { Uploader } from "./Uploader";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SellerKycPage() {
  const seller = await getMySeller();
  if (!seller) return <SellerShell><div className="text-sm text-ink-2">No seller profile.</div></SellerShell>;

  const sb = serverClient(cookies())!;
  const { data } = await sb.from("seller_documents").select("*").eq("seller_id", seller.id).order("uploaded_at", { ascending: false });
  const docs = (data ?? []) as DBSellerDocument[];

  const tierTone = seller.tier === "gold" ? "yellow" : seller.tier === "silver" ? "ink" : "green";

  return (
    <SellerShell businessName={seller.business_name}>
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-green">Seller portal</div>
        <h1 className="font-display font-extrabold text-2xl mt-1">KYC & verification</h1>
        <p className="text-sm text-ink-2 mt-1 max-w-2xl">
          Upload your ID and business documents. Approved sellers earn a tier — <strong>Bronze</strong> (any approved doc),
          <strong> Silver</strong> (ID front + back + selfie), <strong>Gold</strong> (Silver + business licence).
        </p>
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div>
            <div className="font-display font-extrabold text-lg">Your tier</div>
            <div className="text-sm text-ink-2">Auto-updates as we approve more documents.</div>
          </div>
          <Badge tone={tierTone}><ShieldCheck className="w-3 h-3" /> {seller.tier}</Badge>
        </div>
      </Card>

      <Card className="mb-6">
        <div className="font-display font-extrabold text-lg mb-3">Upload a document</div>
        <Uploader />
      </Card>

      <Card>
        <div className="font-display font-extrabold text-lg mb-3">Documents</div>
        {docs.length === 0 ? (
          <div className="text-sm text-ink-2">No documents uploaded yet.</div>
        ) : (
          <ul className="divide-y divide-line text-sm">
            {docs.map((d) => (
              <li key={d.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold capitalize">{d.kind.replace(/_/g, " ")}</div>
                  <div className="text-xs text-ink-2">Uploaded {new Date(d.uploaded_at).toLocaleDateString("en-GB")}{d.review_note ? ` · ${d.review_note}` : ""}</div>
                </div>
                <Badge tone={d.status === "approved" ? "green" : d.status === "rejected" ? "ink" : "yellow"}>{d.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </SellerShell>
  );
}
