"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase";

// Pre-checkout: we log every complaint as a dispute attached to a
// placeholder zero-total order against a seller. When real orders exist,
// disputes will be opened from order details instead.
export async function openDispute(formData: FormData) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const sellerId   = String(formData.get("seller_id") ?? "").trim();
  const reason     = String(formData.get("reason") ?? "").trim();
  const openedBy   = String(formData.get("opened_by") ?? "buyer") as "buyer" | "seller" | "team";
  const buyerName  = String(formData.get("buyer_name") ?? "").trim() || null;
  const buyerPhone = String(formData.get("buyer_phone") ?? "").trim() || null;
  const initial    = String(formData.get("body") ?? "").trim();

  if (!sellerId || !reason) return { ok: false, error: "Seller and reason are required" };

  // Create a placeholder order so the dispute has somewhere to attach
  const { data: order, error: orderErr } = await sb.from("orders").insert({
    seller_id: sellerId,
    buyer_name: buyerName,
    buyer_phone: buyerPhone,
    subtotal_tzs: 0, fees_tzs: 0, total_tzs: 0,
    status: "disputed"
  }).select("id").single();
  if (orderErr) return { ok: false, error: orderErr.message };

  const slaDue = new Date(Date.now() + 72 * 3600 * 1000); // 72h SLA
  const { data: dispute, error: disputeErr } = await sb.from("disputes").insert({
    order_id: order.id, reason, opened_by: openedBy, sla_due_at: slaDue.toISOString()
  }).select("id").single();
  if (disputeErr) return { ok: false, error: disputeErr.message };

  if (initial) {
    await sb.from("dispute_messages").insert({
      dispute_id: dispute.id, author: openedBy, body: initial
    });
  }

  revalidatePath("/dashboard/disputes");
  revalidatePath(`/dashboard/disputes/${dispute.id}`);
  redirect(`/dashboard/disputes/${dispute.id}`);
}
