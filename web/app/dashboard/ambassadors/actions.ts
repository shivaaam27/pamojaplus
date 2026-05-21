"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase";

type AmbassadorType = "digital" | "field" | "campus";

function generateCode(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${slug || "amb"}-${rand}`;
}

export async function createAmbassador(formData: FormData) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const name   = String(formData.get("name") ?? "").trim();
  const type   = String(formData.get("type") ?? "digital") as AmbassadorType;
  const phone  = String(formData.get("phone") ?? "").trim() || null;
  const email  = String(formData.get("email") ?? "").trim() || null;
  const region = String(formData.get("region") ?? "").trim() || null;

  if (!name) return { ok: false, error: "Name is required" };

  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateCode(name);
    const { data, error } = await sb
      .from("ambassadors")
      .insert({ name, type, phone, email, region, referral_code: code, active: true, tier: "bronze" })
      .select("id, referral_code")
      .single();
    if (!error) {
      revalidatePath("/dashboard/ambassadors");
      return { ok: true, id: data.id, code: data.referral_code };
    }
    if (!String(error.message).toLowerCase().includes("duplicate")) {
      return { ok: false, error: error.message };
    }
  }
  return { ok: false, error: "Could not allocate a unique referral code" };
}

export async function toggleAmbassador(id: string, active: boolean) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };
  const { error } = await sb.from("ambassadors").update({ active }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/ambassadors");
  return { ok: true };
}
