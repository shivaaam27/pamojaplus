import { cookies } from "next/headers";
import { serverClient, supabaseConfigured } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";
import { Composer } from "./Composer";

export const dynamic = "force-dynamic";

interface BroadcastRow { id: string; name: string; channel: string; sent_count: number; sent_at: string | null; created_at: string; }

export default async function BroadcastsPage() {
  let recent: BroadcastRow[] = [];
  let locations: string[] = [];

  if (supabaseConfigured) {
    const sb = serverClient(cookies())!;
    const [b, locs] = await Promise.all([
      sb.from("broadcasts").select("id, name, channel, sent_count, sent_at, created_at").order("created_at", { ascending: false }).limit(50),
      sb.from("sellers").select("location").not("location", "is", null).limit(2000)
    ]);
    recent = (b.data ?? []) as BroadcastRow[];
    locations = Array.from(new Set((locs.data ?? []).map((r: { location: string | null }) => r.location).filter(Boolean) as string[])).sort();
  }

  return (
    <>
      <PageHeader
        eyebrow="Growth"
        title="Broadcasts"
        description="Send WhatsApp / SMS / email to a seller segment. Phase 1 queues to notifications; real delivery via Beem + 360dialog + Resend wires in Phase 3."
      />

      <Card className="mb-6">
        <div className="font-display font-extrabold text-lg mb-3">Compose</div>
        <Composer locations={locations} />
      </Card>

      <Card>
        <div className="font-display font-extrabold text-lg mb-3">Recent broadcasts</div>
        {recent.length === 0 ? (
          <div className="text-sm text-ink-2">Nothing sent yet.</div>
        ) : (
          <ul className="divide-y divide-line text-sm">
            {recent.map((b) => (
              <li key={b.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{b.name}</div>
                  <div className="text-xs text-ink-2">{new Date(b.created_at).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge>{b.channel}</Badge>
                  <Badge tone="ink">{b.sent_count} sent</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
