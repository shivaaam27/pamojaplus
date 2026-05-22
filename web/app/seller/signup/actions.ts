"use server";
import { cookies } from "next/headers";
import { serverClient } from "@/lib/supabase";

// Best-effort link: after signup, attach this auth.uid to the sellers row
// that shares the same email (if it exists). Idempotent.
export async function claimSellerProfile() {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Auth unavailable" };
  const { data: { user } } = await sb.auth.getUser();
  if (!user?.email) return { ok: false, error: "Not signed in" };

  const { data: existing } = await sb.from("sellers").select("id, user_id").eq("email", user.email).maybeSingle();
  if (!existing) return { ok: true, linked: false };
  if (existing.user_id) return { ok: true, linked: true };

  const { error } = await sb.from("sellers").update({ user_id: user.id }).eq("id", existing.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, linked: true };
}
