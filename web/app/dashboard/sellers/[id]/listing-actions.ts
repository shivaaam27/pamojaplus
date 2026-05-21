"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase";

export async function createListing(sellerId: string, formData: FormData) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const priceRaw = String(formData.get("price_tzs") ?? "");
  const price = priceRaw ? parseInt(priceRaw, 10) : null;

  if (!title) return { ok: false, error: "Title required" };
  if (price != null && (!Number.isFinite(price) || price < 0)) return { ok: false, error: "Bad price" };

  // status='draft' — the moderation trigger queues it for review
  const { error } = await sb.from("listings").insert({
    seller_id: sellerId,
    title,
    description,
    price_tzs: price,
    status: "draft"
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/dashboard/sellers/${sellerId}`);
  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard");
  return { ok: true };
}
