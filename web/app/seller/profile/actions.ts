"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase";

export async function updateMyProfile(formData: FormData) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const patch = {
    owner_name: String(formData.get("owner_name") ?? "").trim() || null,
    whatsapp:   String(formData.get("whatsapp")   ?? "").trim() || null,
    phone:      String(formData.get("phone")      ?? "").trim() || null,
    location:   String(formData.get("location")   ?? "").trim() || null,
    category:   String(formData.get("category")   ?? "").trim() || null
  };

  const { error } = await sb.from("sellers").update(patch).eq("user_id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/seller/profile");
  revalidatePath("/seller");
  return { ok: true };
}
