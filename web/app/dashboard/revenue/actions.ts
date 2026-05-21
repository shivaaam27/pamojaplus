"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase";

type RevenueType = "subscription" | "boost" | "spotlight" | "commission";

export async function recordRevenueEvent(formData: FormData) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const sellerIdRaw = String(formData.get("seller_id") ?? "").trim();
  const type        = String(formData.get("type") ?? "subscription") as RevenueType;
  const amountRaw   = String(formData.get("amount_tzs") ?? "");
  const ref         = String(formData.get("mobile_money_ref") ?? "").trim() || null;
  const periodStart = String(formData.get("period_start") ?? "").trim() || null;
  const periodEnd   = String(formData.get("period_end") ?? "").trim() || null;

  const amount = parseInt(amountRaw, 10);
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, error: "Amount must be a positive integer (TZS)" };

  const { error } = await sb.from("revenue_events").insert({
    seller_id: sellerIdRaw || null,
    type,
    amount_tzs: amount,
    mobile_money_ref: ref,
    period_start: periodStart,
    period_end: periodEnd
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/revenue");
  revalidatePath("/dashboard");
  return { ok: true };
}
