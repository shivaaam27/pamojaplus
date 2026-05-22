"use client";
import { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { browserClient, supabaseConfigured } from "@/lib/supabase";
import { Container, Section } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";

function Form() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/seller";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      if (!supabaseConfigured) { setMsg("Pamoja+ is not fully configured yet."); return; }
      const sb = browserClient();
      if (!sb) { setMsg("Auth unavailable."); return; }
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) { setMsg(error.message); return; }
      router.push(next);
      router.refresh();
    });
  }

  return (
    <Section className="py-16">
      <Container className="max-w-md">
        <div className="mb-8 text-center"><Logo /></div>
        <Card>
          <h1 className="font-display font-extrabold text-2xl mb-1">Seller sign in</h1>
          <p className="text-sm text-ink-2 mb-6">Sign in to manage your listings, KYC, and inquiries.</p>
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold">Email</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Password</span>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green" />
            </label>
            {msg && <div className="text-sm text-danger">{msg}</div>}
            <Button type="submit" disabled={pending} className="w-full">{pending ? "Signing in…" : "Sign in"}</Button>
          </form>
          <p className="text-sm text-ink-2 mt-6">
            No account? <Link href="/seller/signup" className="font-bold text-green-dark hover:underline">Create one</Link>
            {" · "}
            Want to apply first? <Link href="/sellers/apply" className="font-bold text-green-dark hover:underline">Apply to join</Link>
          </p>
        </Card>
      </Container>
    </Section>
  );
}

export default function SellerLoginPage() {
  return <Suspense fallback={null}><Form /></Suspense>;
}
