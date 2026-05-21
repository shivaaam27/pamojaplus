import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MessageCircle, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="Contact" title="We&apos;d love to hear from you." />
        <div className="grid sm:grid-cols-3 gap-5">
          <Card>
            <MessageCircle className="w-10 h-10 text-green mb-3" />
            <div className="font-display font-bold">WhatsApp</div>
            <div className="text-ink-2 text-sm mt-1">+255 7xx xxx xxx</div>
            <Button href="https://wa.me/255000000000" variant="secondary" size="sm" className="mt-4">Chat</Button>
          </Card>
          <Card>
            <Mail className="w-10 h-10 text-green mb-3" />
            <div className="font-display font-bold">Email</div>
            <div className="text-ink-2 text-sm mt-1">hello@pamojaplus.co.tz</div>
          </Card>
          <Card>
            <MapPin className="w-10 h-10 text-green mb-3" />
            <div className="font-display font-bold">Location</div>
            <div className="text-ink-2 text-sm mt-1">Dar es Salaam, Tanzania</div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
