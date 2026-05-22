"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase";

type MmoProvider = "mpesa" | "mixx_yas" | "airtel_money" | "halopesa" | "azampesa" | "tpesa" | "card" | "bank" | "cash";

export async function createPayout(formData: FormData) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const sellerId    = String(formData.get("seller_id") ?? "").trim() || null;
  const ambassadorId= String(formData.get("ambassador_id") ?? "").trim() || null;
  const grossRaw    = parseInt(String(formData.get("gross_tzs") ?? ""), 10);
  const whtRate     = ambassadorId ? 0.05 : 0;  // 5% WHT on resident service fees (TRA) — adjust per advisor
  const feesRaw     = parseInt(String(formData.get("fees_tzs") ?? "0"), 10) || 0;
  const scheduled   = String(formData.get("scheduled_for") ?? "").trim() || null;
  const note        = String(formData.get("note") ?? "").trim() || null;

  if (!Number.isFinite(grossRaw) || grossRaw <= 0) return { ok: false, error: "Gross amount must be positive" };
  if (!sellerId && !ambassadorId) return { ok: false, error: "Pick a seller or an ambassador" };

  const wht = Math.round(grossRaw * whtRate);
  const net = grossRaw - wht - feesRaw;

  const { error } = await sb.from("payouts").insert({
    seller_id: sellerId,
    ambassador_id: ambassadorId,
    gross_tzs: grossRaw,
    wht_tzs: wht,
    fees_tzs: feesRaw,
    net_tzs: net,
    status: "scheduled",
    scheduled_for: scheduled,
    note
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/payouts");
  return { ok: true };
}

export async function approvePayout(id: string) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };
  const { data: { user } } = await sb.auth.getUser();
  const { error } = await sb.from("payouts")
    .update({ status: "approved", approved_by: user?.id ?? null, approved_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/payouts");
  return { ok: true };
}

export async function markPaid(id: string, mmo: MmoProvider, ref: string) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };
  const { error } = await sb.from("payouts")
    .update({ status: "paid", paid_at: new Date().toISOString(), mmo, mmo_ref: ref })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/payouts");
  return { ok: true };
}

export async function holdPayout(id: string, note: string) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };
  const { error } = await sb.from("payouts").update({ status: "on_hold", note }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/payouts");
  return { ok: true };
}
