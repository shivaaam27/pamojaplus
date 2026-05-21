"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase";

export async function approveApplication(applicationId: string) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const { data: app, error: readErr } = await sb
    .from("seller_applications")
    .select("*")
    .eq("id", applicationId)
    .maybeSingle();
  if (readErr || !app) return { ok: false, error: readErr?.message ?? "Application not found" };
  if (app.status === "approved") return { ok: false, error: "Already approved" };

  const { data: seller, error: insErr } = await sb
    .from("sellers")
    .insert({
      business_name: app.business_name,
      owner_name: app.owner_name,
      whatsapp: app.whatsapp,
      email: app.email,
      location: app.location,
      category: app.category,
      notes: app.description,
      plan: "free",
      verified: false,
      tier: "none"
    })
    .select("id")
    .single();
  if (insErr) return { ok: false, error: insErr.message };

  const { error: updErr } = await sb
    .from("seller_applications")
    .update({ status: "approved" })
    .eq("id", applicationId);
  if (updErr) return { ok: false, error: updErr.message };

  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard/sellers");
  revalidatePath("/dashboard");
  return { ok: true, sellerId: seller.id };
}

export async function rejectApplication(applicationId: string) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const { error } = await sb
    .from("seller_applications")
    .update({ status: "rejected" })
    .eq("id", applicationId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/applications");
  return { ok: true };
}

export async function setApplicationReviewing(applicationId: string) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };
  const { error } = await sb
    .from("seller_applications")
    .update({ status: "reviewing" })
    .eq("id", applicationId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/applications");
  return { ok: true };
}
