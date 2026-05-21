// Supabase clients for Pamoja+.
// - browserClient(): for use in Client Components / browser
// - serverClient():  for use in Server Components / route handlers
// Both gracefully no-op if env vars are missing (so the site works offline / pre-Supabase).

import { createBrowserClient, createServerClient, type CookieOptions } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anon);

export function browserClient() {
  if (!supabaseConfigured) return null;
  return createBrowserClient(url!, anon!);
}

// Server-side client — pass `cookies()` from a Server Component/route.
export function serverClient(cookieStore: {
  get: (n: string) => { value: string } | undefined;
  set?: (n: string, v: string, o?: CookieOptions) => void;
}) {
  if (!supabaseConfigured) return null;
  return createServerClient(url!, anon!, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set: (name, value, options) => { cookieStore.set?.(name, value, options); },
      remove: (name, options) => { cookieStore.set?.(name, "", { ...options, maxAge: 0 }); }
    }
  });
}

// Convenience types
export interface DBMilestone {
  id: string;
  date: string;
  title: string;
  description: string | null;
  icon: "star" | "check" | "trophy" | "rocket" | "users" | "money";
  featured: boolean;
  public: boolean;
}

export interface SellerApplicationInsert {
  business_name: string;
  owner_name: string;
  whatsapp: string;
  email?: string | null;
  category: string;
  location: string;
  description: string;
  socials?: string | null;
}
