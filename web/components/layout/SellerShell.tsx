"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, ShoppingBag, ShieldCheck, MessageCircle, User, Menu, X, LogOut } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";
import { browserClient } from "@/lib/supabase";

const nav = [
  { href: "/seller",          label: "Overview",  icon: LayoutDashboard },
  { href: "/seller/listings", label: "Listings",  icon: ShoppingBag },
  { href: "/seller/inquiries",label: "Inquiries", icon: MessageCircle },
  { href: "/seller/kyc",      label: "KYC",       icon: ShieldCheck },
  { href: "/seller/profile",  label: "Profile",   icon: User }
];

export function SellerShell({ children, businessName }: { children: React.ReactNode; businessName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function signOut() {
    const sb = browserClient();
    if (sb) await sb.auth.signOut();
    window.location.href = "/seller/login";
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="bg-white border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 -ml-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <X /> : <Menu />}
            </button>
            <Link href="/seller" aria-label="Home"><Logo /></Link>
            {businessName && <span className="hidden sm:inline ml-3 text-sm text-ink-2 font-semibold">· {businessName}</span>}
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <aside className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-64 bg-white md:bg-transparent border-r border-line md:border-r-0",
          "transform md:transform-none transition-transform pt-16 md:pt-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <nav className="p-4 space-y-1">
            {nav.map((n) => {
              const active = pathname === n.href || (n.href !== "/seller" && pathname.startsWith(n.href));
              return (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition",
                    active ? "bg-green-soft text-green-dark" : "text-ink-2 hover:text-ink hover:bg-bg"
                  )}>
                  <n.icon className="w-4 h-4 shrink-0" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        {open && <div className="md:hidden fixed inset-0 bg-ink/40 z-30" onClick={() => setOpen(false)} />}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
