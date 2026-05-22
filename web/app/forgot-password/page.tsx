"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { browserClient, supabaseConfigured } from "@/lib/supabase";
import { Container, Section } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      if (!supabaseConfigured) { setMsg("Pamoja+ is not fully configured yet."); return; }
      const sb = browserClient();
      if (!sb) { setMsg("Auth unavailable."); return; }
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/reset-password` });
      if (error) { setMsg(error.message); return; }
      setSent(true);
    });
  }

  return (
    <Section className="py-16">
      <Container className="max-w-md">
        <div className="mb-8 text-center"><Logo /></div>
        <Card>
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green mx-auto mb-3" />
              <h1 className="font-display font-extrabold text-xl">Check your email</h1>
              <p className="text-sm text-ink-2 mt-2">We sent a reset link to <strong>{email}</strong>. Click it to choose a new password.</p>
              <Link href="/login" className="mt-6 inline-block text-sm font-bold text-green-dark hover:underline">Back to sign in</Link>
            </div>
          ) : (
            <>
              <h1 className="font-display font-extrabold text-2xl mb-1">Forgot password?</h1>
              <p className="text-sm text-ink-2 mb-6">Enter the email you signed up with. We&apos;ll email you a reset link.</p>
              <form onSubmit={submit} className="space-y-4">
                <label className="block">
                  <span className="text-sm font-semibold">Email</span>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green" />
                </label>
                {msg && <div className="text-sm text-danger">{msg}</div>}
                <Button type="submit" disabled={pending} className="w-full">{pending ? "Sending…" : "Send reset link"}</Button>
              </form>
              <p className="text-sm text-ink-2 mt-6">
                Remembered it? <Link href="/login" className="font-bold text-green-dark hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </Card>
      </Container>
    </Section>
  );
}
