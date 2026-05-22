"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase";

type DisputeStatus = "open" | "mediation" | "resolved_buyer" | "resolved_seller" | "escalated" | "closed";

export async function postDisputeMessage(disputeId: string, body: string) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };
  const { data: { user } } = await sb.auth.getUser();
  const { error } = await sb.from("dispute_messages").insert({
    dispute_id: disputeId, author: "team", author_id: user?.id ?? null, body
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/disputes/${disputeId}`);
  return { ok: true };
}

export async function setDisputeStatus(disputeId: string, status: DisputeStatus, resolution?: string) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };
  const { data: { user } } = await sb.auth.getUser();
  const patch: Record<string, unknown> = { status, mediator_id: user?.id ?? null };
  if (status === "resolved_buyer" || status === "resolved_seller" || status === "closed") {
    patch.resolved_at = new Date().toISOString();
    if (resolution) patch.resolution = resolution;
  }
  const { error } = await sb.from("disputes").update(patch).eq("id", disputeId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/disputes");
  revalidatePath(`/dashboard/disputes/${disputeId}`);
  return { ok: true };
}
