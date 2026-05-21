import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid sm:grid-cols-4 gap-8">
        <div className="sm:col-span-2">
          <Logo />
          <p className="mt-4 text-ink-2 max-w-xs">Tanzania&apos;s community-powered marketplace. Grow Together. Shop Smarter.</p>
        </div>
        <div>
          <div className="font-display font-bold mb-3">Explore</div>
          <ul className="space-y-2 text-sm text-ink-2">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/journey">Journey</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/team">Team</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-display font-bold mb-3">Legal</div>
          <ul className="space-y-2 text-sm text-ink-2">
            <li><Link href="/legal/terms">Terms</Link></li>
            <li><Link href="/legal/privacy">Privacy</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-ink-2">
        © {new Date().getFullYear()} Pamoja+ Tanzania. All rights reserved.
      </div>
    </footer>
  );
}
