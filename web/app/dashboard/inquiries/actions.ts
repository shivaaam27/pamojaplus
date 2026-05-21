"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase";

export async function markInquiryResponded(id: string) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };
  const { error } = await sb
    .from("inquiries")
    .update({ responded: true, responded_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/inquiries");
  return { ok: true };
}

export async function markInquiryConverted(id: string) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };
  const { error } = await sb
    .from("inquiries")
    .update({ responded: true, responded_at: new Date().toISOString(), converted: true, converted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/inquiries");
  return { ok: true };
}
