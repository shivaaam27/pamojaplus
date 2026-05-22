"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase";

export async function createOwnListing(formData: FormData) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const { data: seller } = await sb.from("sellers").select("id").eq("user_id", user.id).maybeSingle();
  if (!seller) return { ok: false, error: "No seller profile linked to this account" };

  const title       = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const category    = String(formData.get("category") ?? "").trim() || null;
  const priceRaw    = String(formData.get("price_tzs") ?? "");
  const price       = priceRaw ? parseInt(priceRaw, 10) : null;
  if (!title) return { ok: false, error: "Title required" };

  const { error } = await sb.from("listings").insert({
    seller_id: seller.id,
    title,
    description,
    category,
    price_tzs: price,
    status: "draft"
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/seller/listings");
  redirect("/seller/listings");
}
