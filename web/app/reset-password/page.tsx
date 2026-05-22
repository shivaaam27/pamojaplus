"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { browserClient, supabaseConfigured } from "@/lib/supabase";
import { Container, Section } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";

// Supabase appends `?code=...` (or hash tokens) — `@supabase/ssr` exchanges
// them automatically on first auth client call. We just need a form.
export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!supabaseConfigured) { setHasSession(false); return; }
    const sb = browserClient();
    if (!sb) { setHasSession(false); return; }
    sb.auth.getUser().then(({ data }) => setHasSession(Boolean(data.user)));
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (password.length < 8) { setMsg("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setMsg("Passwords don't match."); return; }
    start(async () => {
      const sb = browserClient();
      if (!sb) { setMsg("Auth unavailable."); return; }
      const { error } = await sb.auth.updateUser({ password });
      if (error) { setMsg(error.message); return; }
      router.push("/login");
    });
  }

  return (
    <Section className="py-16">
      <Container className="max-w-md">
        <div className="mb-8 text-center"><Logo /></div>
        <Card>
          <h1 className="font-display font-extrabold text-2xl mb-1">Choose a new password</h1>
          {hasSession === false && (
            <p className="text-sm text-danger mt-2">
              This reset link is expired or invalid. Request a new one from <a href="/forgot-password" className="font-bold underline">/forgot-password</a>.
            </p>
          )}
          <form onSubmit={submit} className="space-y-4 mt-4">
            <label className="block">
              <span className="text-sm font-semibold">New password</span>
              <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green" />
              <span className="text-xs text-ink-2">8+ characters.</span>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Confirm</span>
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-white focus:outline-none focus:ring-2 focus:ring-green" />
            </label>
            {msg && <div className="text-sm text-danger">{msg}</div>}
            <Button type="submit" disabled={pending || hasSession === false} className="w-full">
              {pending ? "Saving…" : "Save new password"}
            </Button>
          </form>
        </Card>
      </Container>
    </Section>
  );
}
