import Link from "next/link";
import { cookies } from "next/headers";
import { serverClient, supabaseConfigured } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/admin/PageHeader";
import { openDispute } from "./actions";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewDisputePage() {
  let sellers: { id: string; business_name: string }[] = [];
  if (supabaseConfigured) {
    const sb = serverClient(cookies())!;
    const { data } = await sb.from("sellers").select("id, business_name").order("business_name").limit(500);
    sellers = (data ?? []) as typeof sellers;
  }

  return (
    <>
      <Link href="/dashboard/disputes" className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <PageHeader
        eyebrow="Trust · Dispute"
        title="Open a dispute"
        description="Log a buyer or seller complaint. A placeholder order is created so the dispute has somewhere to attach. SLA: 72h."
      />
      <Card className="max-w-xl">
        <form action={openDispute} className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">Seller</span>
            <select name="seller_id" required className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white">
              <option value="">— Pick a seller —</option>
              {sellers.map((s) => <option key={s.id} value={s.id}>{s.business_name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Reason</span>
            <input name="reason" required placeholder="Short summary"
              className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Opened by</span>
            <select name="opened_by" defaultValue="buyer" className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white">
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="team">Team (proactive)</option>
            </select>
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-semibold">Buyer name (optional)</span>
              <input name="buyer_name" className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Buyer phone (optional)</span>
              <input name="buyer_phone" className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white" />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-semibold">First message</span>
            <textarea name="body" rows={4} placeholder="What happened? Quote both sides if you have screenshots."
              className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white" />
          </label>
          <Button type="submit">Open dispute</Button>
        </form>
      </Card>
    </>
  );
}
