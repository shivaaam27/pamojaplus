"use client";
import { useState } from "react";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle, AlertCircle } from "lucide-react";
import { browserClient, supabaseConfigured } from "@/lib/supabase";

const categories = ["Food & Beverages", "Wellness & Health", "Beauty & Personal Care", "Fashion", "Home Essentials", "Local Services"];

type State = "idle" | "submitting" | "success" | "error";

export default function SellerApplyPage() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting"); setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      business_name: String(fd.get("business_name")),
      owner_name: String(fd.get("owner_name")),
      whatsapp: String(fd.get("whatsapp")),
      email: (fd.get("email") as string) || null,
      category: String(fd.get("category")),
      location: String(fd.get("location")),
      description: String(fd.get("description")),
      socials: (fd.get("socials") as string) || null
    };

    if (!supabaseConfigured) {
      // Offline / pre-Supabase: store locally so submissions aren't lost.
      try {
        const existing = JSON.parse(localStorage.getItem("pamoja_applications") || "[]");
        existing.push({ ...payload, ts: new Date().toISOString() });
        localStorage.setItem("pamoja_applications", JSON.stringify(existing));
        setState("success");
      } catch (err) {
        setError("Could not save your application locally.");
        setState("error");
      }
      return;
    }

    const sb = browserClient();
    if (!sb) { setError("Supabase client unavailable."); setState("error"); return; }
    const { error: dbError } = await sb.from("seller_applications").insert(payload);
    if (dbError) { setError(dbError.message); setState("error"); return; }
    setState("success");
  }

  if (state === "success") {
    return (
      <Section>
        <Container>
          <Card className="max-w-xl mx-auto text-center py-12">
            <CheckCircle className="w-16 h-16 text-green mx-auto mb-4" />
            <h2 className="font-display font-extrabold text-3xl">Karibu Pamoja+!</h2>
            <p className="mt-3 text-ink-2">We&apos;ve received your application. Our team will reach out via WhatsApp within 48 hours.</p>
            <Button href="/" className="mt-6">Back to Home</Button>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="Become a seller" title="Tell us about your business."
          sub="Free to start. Takes 2 minutes. Our team will follow up on WhatsApp." />

        {state === "error" && error && (
          <div className="max-w-xl mb-5 flex items-start gap-2 p-4 rounded-xl bg-yellow-soft border border-yellow text-ink text-sm">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div><strong>Could not submit:</strong> {error}</div>
          </div>
        )}

        <form onSubmit={onSubmit} className="max-w-xl space-y-5">
          <Field label="Business name" required><input name="business_name" className={inp} required /></Field>
          <Field label="Owner / contact person" required><input name="owner_name" className={inp} required /></Field>
          <Field label="WhatsApp number" required><input name="whatsapp" className={inp} placeholder="+255 7xx xxx xxx" required /></Field>
          <Field label="Email"><input name="email" type="email" className={inp} /></Field>
          <Field label="Category" required>
            <select name="category" className={inp} required defaultValue="">
              <option value="" disabled>Select a category</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Location / delivery area" required><input name="location" className={inp} placeholder="Kinondoni, Ilala, Ubungo..." required /></Field>
          <Field label="What do you sell? (short description)" required>
            <textarea name="description" className={inp + " min-h-[120px] py-3"} required />
          </Field>
          <Field label="Instagram / TikTok / FB (optional)"><input name="socials" className={inp} /></Field>

          <label className="flex items-start gap-2 text-sm text-ink-2">
            <input type="checkbox" required className="mt-1 accent-green" />
            <span>I agree to the <a href="/legal/terms" className="text-green-dark font-bold">Seller Terms</a> and <a href="/legal/privacy" className="text-green-dark font-bold">Privacy Policy</a>.</span>
          </label>

          <Button type="submit" size="lg" disabled={state === "submitting"}>
            {state === "submitting" ? "Submitting…" : "Submit application"}
          </Button>
        </form>
      </Container>
    </Section>
  );
}

const inp = "w-full h-11 px-4 rounded-xl bg-white border border-line focus:border-green focus:ring-0 outline-none";
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold mb-1.5">{label}{required && <span className="text-danger"> *</span>}</span>
      {children}
    </label>
  );
}
