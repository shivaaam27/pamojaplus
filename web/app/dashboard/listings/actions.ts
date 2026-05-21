"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase";

type Decision = "approved" | "changes_requested" | "rejected";

export async function decideListing(reviewId: string, decision: Decision, note?: string) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const { data: review, error: readErr } = await sb
    .from("listing_reviews")
    .select("id, listing_id")
    .eq("id", reviewId)
    .maybeSingle();
  if (readErr || !review) return { ok: false, error: readErr?.message ?? "Review not found" };

  const { data: { user } } = await sb.auth.getUser();

  const { error: updErr } = await sb
    .from("listing_reviews")
    .update({
      status: decision,
      note: note ?? null,
      reviewer_id: user?.id ?? null,
      decided_at: new Date().toISOString()
    })
    .eq("id", reviewId);
  if (updErr) return { ok: false, error: updErr.message };

  // Propagate decision to the listing.status
  const nextStatus =
    decision === "approved"          ? "live"
    : decision === "rejected"        ? "removed"
    : /* changes_requested */          "draft";

  await sb.from("listings").update({ status: nextStatus }).eq("id", review.listing_id);

  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard");
  return { ok: true };
}
