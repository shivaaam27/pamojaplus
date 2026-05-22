// Gate /dashboard/* behind a Supabase Auth session.
// - If env vars are missing (Phase 1 / local without Supabase), gate is disabled.
// - If session is missing, redirect to /login?next=<path>.
//
// Team membership (team_users row) is enforced by RLS, so an authenticated
// non-team user can sign in but won't see any data.

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.next();

  const res = NextResponse.next();
  const sb = createServerClient(url, anon, {
    cookies: {
      get: (n) => req.cookies.get(n)?.value,
      set: (n, v, o) => { res.cookies.set({ name: n, value: v, ...o }); },
      remove: (n, o) => { res.cookies.set({ name: n, value: "", ...o, maxAge: 0 }); }
    }
  });

  const { data: { user } } = await sb.auth.getUser();
  const isSellerArea = req.nextUrl.pathname.startsWith("/seller");
  if (!user) {
    const loginPath = isSellerArea ? "/seller/login" : "/login";
    const login = new URL(loginPath, req.url);
    login.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/seller/((?!login|signup).*)"]
};
