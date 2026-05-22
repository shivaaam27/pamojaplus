"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase";

type Channel = "sms" | "whatsapp" | "email" | "push" | "inapp";

interface Segment { plan?: string; location?: string; tier?: string; verified?: boolean; }

async function resolveRecipients(sb: ReturnType<typeof serverClient>, channel: Channel, segment: Segment) {
  if (!sb) return [];
  let q = sb.from("sellers").select("id, whatsapp, phone, email");
  if (segment.plan)     q = q.eq("plan", segment.plan);
  if (segment.location) q = q.eq("location", segment.location);
  if (segment.tier)     q = q.eq("tier", segment.tier);
  if (segment.verified != null) q = q.eq("verified", segment.verified);
  const { data } = await q.limit(2000);
  const rows = (data ?? []) as { whatsapp: string | null; phone: string | null; email: string | null }[];
  const recipients: string[] = [];
  for (const r of rows) {
    let val: string | null = null;
    if (channel === "sms" || channel === "whatsapp") val = r.whatsapp || r.phone;
    else if (channel === "email")                    val = r.email;
    if (val) recipients.push(val);
  }
  return Array.from(new Set(recipients));
}

export async function previewSegment(formData: FormData) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };
  const channel = String(formData.get("channel") ?? "whatsapp") as Channel;
  const segment: Segment = {
    plan: String(formData.get("plan") ?? "") || undefined,
    location: String(formData.get("location") ?? "") || undefined,
    tier: String(formData.get("tier") ?? "") || undefined,
    verified: formData.get("verified") === "on" ? true : undefined
  };
  const recipients = await resolveRecipients(sb, channel, segment);
  return { ok: true, count: recipients.length };
}

export async function sendBroadcast(formData: FormData) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const name    = String(formData.get("name") ?? "").trim();
  const channel = String(formData.get("channel") ?? "whatsapp") as Channel;
  const body    = String(formData.get("body") ?? "").trim();
  if (!name || !body) return { ok: false, error: "Name and message are required" };

  const segment: Segment = {
    plan: String(formData.get("plan") ?? "") || undefined,
    location: String(formData.get("location") ?? "") || undefined,
    tier: String(formData.get("tier") ?? "") || undefined,
    verified: formData.get("verified") === "on" ? true : undefined
  };

  const recipients = await resolveRecipients(sb, channel, segment);
  if (recipients.length === 0) return { ok: false, error: "Segment is empty — nothing to send" };

  const { data: { user } } = await sb.auth.getUser();
  const { data: bc, error: bcErr } = await sb.from("broadcasts").insert({
    name, channel, segment, sent_count: recipients.length, sent_at: new Date().toISOString(),
    created_by: user?.id ?? null
  }).select("id").single();
  if (bcErr) return { ok: false, error: bcErr.message };

  // Queue rows in `notifications`. Actual delivery via Beem / 360dialog /
  // Resend is wired in Phase 3 — for now we log status='queued'.
  const rows = recipients.map((r) => ({
    template_key: name,
    channel,
    recipient: r,
    payload: { body, broadcast_id: bc.id },
    status: "queued" as const
  }));
  for (let i = 0; i < rows.length; i += 500) {
    await sb.from("notifications").insert(rows.slice(i, i + 500));
  }

  revalidatePath("/dashboard/broadcasts");
  return { ok: true, sent: recipients.length };
}
