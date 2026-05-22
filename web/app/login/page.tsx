"use client";
import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { browserClient, supabaseConfigured } from "@/lib/supabase";
import { Container, Section } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      if (!supabaseConfigured) { setMsg("Supabase env vars not set."); return; }
      const sb = browserClient();
      if (!sb) { setMsg("Supabase client unavailable."); return; }
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
          <h1 className="font-display font-extrabold text-2xl mb-1">Team sign in</h1>
          <p className="text-sm text-ink-2 mb-6">Pamoja+ internal ops. Use your team email.</p>
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green"
              />
            </label>
            {msg && <div className="text-sm text-danger">{msg}</div>}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="text-sm text-ink-2 mt-4">
            <a href="/forgot-password" className="font-bold text-green-dark hover:underline">Forgot password?</a>
          </p>
          <p className="text-xs text-ink-2 mt-6">
            Need access? Ask a founder to invite you in Supabase → Authentication → Users, then add a matching row in <code>team_users</code>.
          </p>
        </Card>
      </Container>
    </Section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
