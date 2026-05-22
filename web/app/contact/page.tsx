import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MessageCircle, Mail, MapPin, ShoppingBag, Megaphone, FileText } from "lucide-react";

// Set NEXT_PUBLIC_SUPPORT_WHATSAPP and NEXT_PUBLIC_SUPPORT_EMAIL in Vercel
// for production. Defaults are placeholders.
const WA_NUMBER = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "+255700000000";
const WA_E164 = WA_NUMBER.replace(/[^\d]/g, "");
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@pamojaplus.co.tz";

export const metadata = { title: "Contact · Pamoja+" };

export default function ContactPage() {
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="Contact" title="Talk to us." sub="Fastest is WhatsApp. We reply within a few hours during the workday." />

        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          <Card>
            <MessageCircle className="w-10 h-10 text-green mb-3" />
            <div className="font-display font-bold">WhatsApp</div>
            <div className="text-ink-2 text-sm mt-1">{WA_NUMBER}</div>
            <Button href={`https://wa.me/${WA_E164}`} variant="secondary" size="sm" className="mt-4">Chat now</Button>
          </Card>
          <Card>
            <Mail className="w-10 h-10 text-green mb-3" />
            <div className="font-display font-bold">Email</div>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-ink-2 text-sm mt-1 block hover:text-green-dark">{SUPPORT_EMAIL}</a>
          </Card>
          <Card>
            <MapPin className="w-10 h-10 text-green mb-3" />
            <div className="font-display font-bold">Dar es Salaam</div>
            <div className="text-ink-2 text-sm mt-1">Operating across Kinondoni, Ilala, Ubungo.</div>
          </Card>
        </div>

        <h2 className="font-display font-extrabold text-xl mb-4">Pick your path</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <Card>
            <ShoppingBag className="w-8 h-8 text-green-dark mb-3" />
            <div className="font-display font-bold">I want to sell</div>
            <p className="text-sm text-ink-2 mt-1">Tell us about your business; we onboard within 48h.</p>
            <Button href="/sellers/apply" size="sm" className="mt-3">Apply</Button>
          </Card>
          <Card>
            <Megaphone className="w-8 h-8 text-green-dark mb-3" />
            <div className="font-display font-bold">I want to be an ambassador</div>
            <p className="text-sm text-ink-2 mt-1">Spread the word and earn per signup.</p>
            <Button href={`https://wa.me/${WA_E164}?text=${encodeURIComponent("Hi, I want to be a Pamoja+ ambassador.")}`} size="sm" variant="secondary" className="mt-3">Message ops</Button>
          </Card>
          <Card>
            <FileText className="w-8 h-8 text-green-dark mb-3" />
            <div className="font-display font-bold">Data / legal request</div>
            <p className="text-sm text-ink-2 mt-1">Access, correction, or deletion of your data (PDPC).</p>
            <Button href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("PDPC data-subject request")}`} size="sm" variant="secondary" className="mt-3">Email us</Button>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
