"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase";

async function getMySellerId() {
  const sb = serverClient(cookies());
  if (!sb) return { sb: null, sellerId: null as string | null };
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { sb, sellerId: null };
  const { data: seller } = await sb.from("sellers").select("id").eq("user_id", user.id).maybeSingle();
  return { sb, sellerId: seller?.id ?? null };
}

export async function updateOwnListing(id: string, formData: FormData) {
  const { sb, sellerId } = await getMySellerId();
  if (!sb) return { ok: false, error: "Supabase not configured" };
  if (!sellerId) return { ok: false, error: "No seller profile" };

  const title       = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const priceRaw    = String(formData.get("price_tzs") ?? "");
  const price       = priceRaw ? parseInt(priceRaw, 10) : null;
  if (!title) return { ok: false, error: "Title required" };

  // Edits go back to draft so moderation re-checks them. RLS ensures the
  // seller can only update their own row.
  const { error } = await sb.from("listings")
    .update({ title, description, price_tzs: price, status: "draft" })
    .eq("id", id).eq("seller_id", sellerId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/seller/listings");
  revalidatePath(`/seller/listings/${id}`);
  return { ok: true };
}

export async function deleteOwnListing(id: string) {
  const { sb, sellerId } = await getMySellerId();
  if (!sb) return { ok: false, error: "Supabase not configured" };
  if (!sellerId) return { ok: false, error: "No seller profile" };

  // Soft delete: flip status to 'removed' (keeps audit trail).
  const { error } = await sb.from("listings")
    .update({ status: "removed" })
    .eq("id", id).eq("seller_id", sellerId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/seller/listings");
  redirect("/seller/listings");
}
