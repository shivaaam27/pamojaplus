import { cookies } from "next/headers";
import { serverClient, type DBSeller } from "@/lib/supabase";

/** Returns the seller row owned by the signed-in user, or null. */
export async function getMySeller(): Promise<DBSeller | null> {
  const sb = serverClient(cookies());
  if (!sb) return null;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from("sellers").select("*").eq("user_id", user.id).maybeSingle();
  return (data ?? null) as DBSeller | null;
}
