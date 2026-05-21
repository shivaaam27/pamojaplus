"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase";

export async function reviewDocument(docId: string, decision: "approved" | "rejected", note?: string) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const { data: doc, error: readErr } = await sb
    .from("seller_documents")
    .select("id, seller_id, kind")
    .eq("id", docId)
    .maybeSingle();
  if (readErr || !doc) return { ok: false, error: readErr?.message ?? "Document not found" };

  const { data: { user } } = await sb.auth.getUser();

  const { error: updErr } = await sb
    .from("seller_documents")
    .update({
      status: decision,
      review_note: note ?? null,
      reviewer_id: user?.id ?? null,
      reviewed_at: new Date().toISOString()
    })
    .eq("id", docId);
  if (updErr) return { ok: false, error: updErr.message };

  await sb.from("verification_events").insert({
    seller_id: doc.seller_id,
    actor_id: user?.id ?? null,
    event: decision === "approved" ? "kyc_approved" : "kyc_rejected",
    reason: note ?? `Doc kind: ${doc.kind}`
  });

  // Auto-bump tier based on approved doc set
  await sb.rpc("bump_seller_tier", { p_seller: doc.seller_id });

  revalidatePath("/dashboard/kyc");
  revalidatePath(`/dashboard/sellers/${doc.seller_id}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function signedDocUrl(storagePath: string) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };
  const { data, error } = await sb.storage.from("seller-docs").createSignedUrl(storagePath, 60 * 5);
  if (error) return { ok: false, error: error.message };
  return { ok: true, url: data.signedUrl };
}
