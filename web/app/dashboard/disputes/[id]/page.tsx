import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { serverClient, supabaseConfigured } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { DisputeThread } from "./DisputeThread";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Msg { id: string; author: string; body: string; at: string; }
interface Dispute {
  id: string; reason: string; status: string; opened_by: string;
  opened_at: string; sla_due_at: string | null; resolution: string | null;
  orders: { id: string; seller_id: string; buyer_name: string | null; buyer_phone: string | null;
           sellers: { id: string; business_name: string } | { id: string; business_name: string }[] | null;
  } | { id: string; seller_id: string; buyer_name: string | null; buyer_phone: string | null;
        sellers: { id: string; business_name: string } | { id: string; business_name: string }[] | null;
  }[] | null;
}

export default async function DisputeDetailPage({ params }: { params: { id: string } }) {
  if (!supabaseConfigured) notFound();
  const sb = serverClient(cookies())!;
  const [{ data: d }, { data: msgs }] = await Promise.all([
    sb.from("disputes")
      .select("id, reason, status, opened_by, opened_at, sla_due_at, resolution, orders(id, seller_id, buyer_name, buyer_phone, sellers(id, business_name))")
      .eq("id", params.id).maybeSingle(),
    sb.from("dispute_messages").select("id, author, body, at").eq("dispute_id", params.id).order("at", { ascending: true })
  ]);
  if (!d) notFound();
  const dispute = d as unknown as Dispute;
  const order = Array.isArray(dispute.orders) ? dispute.orders[0] : dispute.orders;
  const seller = order && (Array.isArray(order.sellers) ? order.sellers[0] : order.sellers);
  const messages = (msgs ?? []) as Msg[];

  return (
    <>
      <Link href="/dashboard/disputes" className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <PageHeader
        eyebrow="Trust · Dispute"
        title={dispute.reason}
        description={`Opened by ${dispute.opened_by} on ${new Date(dispute.opened_at).toLocaleDateString("en-GB")}${seller ? ` · seller ${seller.business_name}` : ""}`}
        right={<Badge tone={dispute.status === "open" || dispute.status === "mediation" ? "yellow" : dispute.status.startsWith("resolved_") ? "green" : "ink"}>{dispute.status}</Badge>}
      />

      {dispute.resolution && (
        <Card className="mb-4 bg-green-soft/40 border-green">
          <div className="text-xs font-bold uppercase tracking-widest text-green-dark mb-1">Resolution</div>
          <div className="text-sm">{dispute.resolution}</div>
        </Card>
      )}

      <Card>
        <DisputeThread id={dispute.id} status={dispute.status} messages={messages} />
      </Card>
    </>
  );
}
