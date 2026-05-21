// /r/<code>?to=<path> — tracked ambassador referral link.
// Logs ambassador_clicks then redirects to `to` (default '/'), carrying ?ref=<code>
// so downstream /api/inquiry can attribute the conversion.

import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createServerClient } from "@supabase/ssr";

const SUPA_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function hashIp(req: NextRequest): string | null {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || null;
  if (!ip) return null;
  return createHash("sha256").update(ip + (process.env.IP_HASH_SALT ?? "pamoja")).digest("hex").slice(0, 32);
}

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code;
  const url = new URL(req.url);
  const to = url.searchParams.get("to") || "/";
  const dest = new URL(to.startsWith("/") ? to : "/", req.url);
  dest.searchParams.set("ref", code);

  if (SUPA_URL && SUPA_ANON) {
    const sb = createServerClient(SUPA_URL, SUPA_ANON, {
      cookies: { get: () => undefined, set: () => {}, remove: () => {} }
    });
    const { data: amb } = await sb.from("ambassadors").select("id, active").eq("referral_code", code).maybeSingle();
    if (amb?.id && amb.active) {
      await sb.from("ambassador_clicks").insert({
        ambassador_id: amb.id,
        ref_code: code,
        path: to,
        ip_hash: hashIp(req),
        user_agent: req.headers.get("user-agent") ?? null
      });
    }
  }

  const res = NextResponse.redirect(dest);
  // 30-day attribution cookie — read by /api/inquiry if no ?ref= present
  res.cookies.set("pamoja_ref", code, { maxAge: 60 * 60 * 24 * 30, path: "/", sameSite: "lax" });
  return res;
}
