"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/about", label: "About" },
  { href: "/journey", label: "Journey" },
  { href: "/pricing", label: "Pricing" },
  { href: "/team", label: "Team" },
  { href: "/seller", label: "Seller portal" },
  { href: "/dashboard", label: "Ops" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" aria-label="Pamoja+ home"><Logo /></Link>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}
              className="px-3 py-2 rounded-full text-sm font-semibold text-ink-2 hover:text-ink hover:bg-green-soft transition">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button href="/sellers/apply" size="sm">Join as Seller</Button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div className={cn("md:hidden overflow-hidden transition-all", open ? "max-h-96" : "max-h-0")}>
        <div className="px-5 pb-4 flex flex-col gap-1 border-t border-line">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-2 font-semibold text-ink-2">{n.label}</Link>
          ))}
          <Button href="/sellers/apply" size="sm" className="mt-2 self-start">Join as Seller</Button>
        </div>
      </div>
    </header>
  );
}
