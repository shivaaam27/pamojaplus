"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { serverClient, type TeamRole } from "@/lib/supabase";

const ROLES: readonly TeamRole[] = ["founder", "ops", "bd", "marketing", "tech", "finance"] as const;

export async function setTeamRole(userId: string, role: TeamRole) {
  if (!ROLES.includes(role)) return { ok: false, error: "Invalid role" };
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };
  const { error } = await sb.from("team_users").update({ role }).eq("id", userId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/team");
  return { ok: true };
}

export async function removeTeamUser(userId: string) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };
  const { error } = await sb.from("team_users").delete().eq("id", userId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/team");
  return { ok: true };
}
