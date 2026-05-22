"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Users, ClipboardList, ShieldCheck, ListChecks, MessageCircle,
  Megaphone, Coins, Banknote, AlertTriangle, FileWarning, Send, ScrollText, FlaskConical,
  Menu, X, Star, LogOut
} from "lucide-react";
import { cn } from "@/lib/cn";
import { browserClient } from "@/lib/supabase";

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; perm?: string };
type Group = { title: string; items: Item[] };

const groups: Group[] = [
  {
    title: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }
    ]
  },
  {
    title: "Operate",
    items: [
      { href: "/dashboard/applications", label: "Onboarding queue", icon: ClipboardList },
      { href: "/dashboard/sellers",      label: "Sellers",           icon: Users },
      { href: "/dashboard/kyc",          label: "KYC review",        icon: ShieldCheck },
      { href: "/dashboard/listings",     label: "Listings moderation", icon: ListChecks },
      { href: "/dashboard/inquiries",    label: "Inquiries",         icon: MessageCircle }
    ]
  },
  {
    title: "Money",
    items: [
      { href: "/dashboard/revenue",  label: "Revenue ledger", icon: Coins },
      { href: "/dashboard/payouts",  label: "Payouts",        icon: Banknote },
      { href: "/dashboard/boosts",   label: "Boosts & spotlights", icon: Star }
    ]
  },
  {
    title: "Trust",
    items: [
      { href: "/dashboard/disputes",   label: "Disputes",        icon: AlertTriangle },
      { href: "/dashboard/compliance", label: "Compliance",      icon: FileWarning }
    ]
  },
  {
    title: "Growth",
    items: [
      { href: "/dashboard/ambassadors", label: "Ambassadors",   icon: Megaphone },
      { href: "/dashboard/broadcasts",  label: "Broadcasts",    icon: Send }
    ]
  },
  {
    title: "System",
    items: [
      { href: "/dashboard/team",        label: "Team & roles",  icon: Users },
      { href: "/dashboard/audit",       label: "Audit log",     icon: ScrollText },
      { href: "/dashboard/experiments", label: "Experiments",   icon: FlaskConical }
    ]
  }
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function signOut() {
    const sb = browserClient();
    if (sb) await sb.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-line",
        "transform md:transform-none transition-transform",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-line md:hidden">
          <span className="font-display font-extrabold">Pamoja+ Ops</span>
          <button onClick={() => setOpen(false)} aria-label="Close"><X /></button>
        </div>
        <nav className="p-4 space-y-6 overflow-y-auto h-full">
          {groups.map((g) => (
            <div key={g.title}>
              <div className="px-2 text-[11px] font-bold uppercase tracking-widest text-ink-2 mb-2">{g.title}</div>
              <ul className="space-y-1">
                {g.items.map((it) => {
                  const active = pathname === it.href || (it.href !== "/dashboard" && pathname.startsWith(it.href));
                  return (
                    <li key={it.href}>
                      <Link href={it.href} onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition",
                          active
                            ? "bg-green-soft text-green-dark"
                            : "text-ink-2 hover:text-ink hover:bg-bg"
                        )}>
                        <it.icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{it.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="pt-4 mt-4 border-t border-line">
            <button onClick={signOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-ink-2 hover:text-danger hover:bg-bg transition">
              <LogOut className="w-4 h-4 shrink-0" /> Sign out
            </button>
          </div>
        </nav>
      </aside>

      {/* Backdrop on mobile */}
      {open && <div className="md:hidden fixed inset-0 bg-ink/40 z-30" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <div className="md:hidden h-12 flex items-center px-4 border-b border-line bg-white">
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-2 -ml-2"><Menu /></button>
          <span className="font-display font-extrabold ml-2">Ops</span>
        </div>
        <div className="px-4 sm:px-8 py-8 max-w-7xl">{children}</div>
      </div>
    </div>
  );
}
