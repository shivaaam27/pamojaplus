"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { serverClient, type KycDocKind } from "@/lib/supabase";

const VALID_KINDS: KycDocKind[] = ["id_front", "id_back", "business_licence", "selfie", "tin_certificate", "other"];

export async function uploadKycDocument(sellerId: string, formData: FormData) {
  const sb = serverClient(cookies());
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const kindRaw = String(formData.get("kind") ?? "");
  const file = formData.get("file");
  if (!VALID_KINDS.includes(kindRaw as KycDocKind)) return { ok: false, error: "Invalid kind" };
  if (!(file instanceof File) || file.size === 0)   return { ok: false, error: "No file selected" };
  if (file.size > 10 * 1024 * 1024)                 return { ok: false, error: "File too large (max 10MB)" };

  const kind = kindRaw as KycDocKind;
  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${sellerId}/${kind}-${Date.now()}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: upErr } = await sb.storage
    .from("seller-docs")
    .upload(path, bytes, { contentType: file.type || "application/octet-stream", upsert: false });
  if (upErr) return { ok: false, error: upErr.message };

  const { error: insErr } = await sb
    .from("seller_documents")
    .insert({ seller_id: sellerId, kind, storage_path: path, status: "pending" });
  if (insErr) {
    // best-effort cleanup
    await sb.storage.from("seller-docs").remove([path]);
    return { ok: false, error: insErr.message };
  }

  revalidatePath(`/dashboard/sellers/${sellerId}`);
  revalidatePath("/dashboard/kyc");
  revalidatePath("/dashboard");
  return { ok: true };
}
