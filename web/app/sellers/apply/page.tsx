"use client";
import { useState } from "react";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

const categories = ["Food & Beverages", "Wellness & Health", "Beauty & Personal Care", "Fashion", "Home Essentials", "Local Services"];

export default function SellerApplyPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
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

        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          className="max-w-xl space-y-5">
          <Field label="Business name" required><input className={inp} required /></Field>
          <Field label="Owner / contact person" required><input className={inp} required /></Field>
          <Field label="WhatsApp number" required><input className={inp} placeholder="+255 7xx xxx xxx" required /></Field>
          <Field label="Email"><input type="email" className={inp} /></Field>
          <Field label="Category" required>
            <select className={inp} required defaultValue="">
              <option value="" disabled>Select a category</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Location / delivery area" required><input className={inp} placeholder="Kinondoni, Ilala, Ubungo..." required /></Field>
          <Field label="What do you sell? (short description)" required>
            <textarea className={inp + " min-h-[120px] py-3"} required />
          </Field>
          <Field label="Instagram / TikTok / FB (optional)"><input className={inp} /></Field>

          <label className="flex items-start gap-2 text-sm text-ink-2">
            <input type="checkbox" required className="mt-1 accent-green" />
            <span>I agree to the <a href="/legal/terms" className="text-green-dark font-bold">Seller Terms</a> and <a href="/legal/privacy" className="text-green-dark font-bold">Privacy Policy</a>.</span>
          </label>

          <Button type="submit" size="lg">Submit application</Button>
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
