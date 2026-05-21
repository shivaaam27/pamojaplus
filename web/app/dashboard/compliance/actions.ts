"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { serverClient } from "@/lib/supabase";

type FlagResolution = "cleared" | "action_taken";

export async function resolveFlag(flagId: string, status: FlagResolution) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };
  const { data: { user } } = await sb.auth.getUser();
  const { error } = await sb.from("compliance_flags").update({
    status,
    reviewer_id: user?.id ?? null,
    resolved_at: new Date().toISOString()
  }).eq("id", flagId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/compliance");
  revalidatePath("/dashboard");
  return { ok: true };
}

type DsrStatus = "in_progress" | "fulfilled" | "rejected";

export async function updateDsrStatus(id: string, status: DsrStatus) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };
  const { data: { user } } = await sb.auth.getUser();
  const patch: Record<string, unknown> = { status, handled_by: user?.id ?? null };
  if (status === "fulfilled" || status === "rejected") patch.closed_at = new Date().toISOString();
  const { error } = await sb.from("data_subject_requests").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/compliance");
  return { ok: true };
}
