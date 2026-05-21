import Link from "next/link";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { Card, Badge } from "@/components/ui/Card";
import { decks } from "@/content/decks";
import { Play } from "lucide-react";

export default function PresentationsPage() {
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="Presentations" title="Branded decks for partners & team."
          sub="Click any deck to present full-screen. Press arrow keys to navigate." />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {decks.map((d) => (
            <Link key={d.slug} href={`/present/${d.slug}`} className="group">
              <Card className="h-full hover:shadow-lift hover:-translate-y-1 transition-all">
                <div className="aspect-video rounded-xl bg-gradient-to-br from-green to-green-dark text-white p-5 flex flex-col justify-between relative overflow-hidden">
                  <div className="text-xs font-bold uppercase tracking-widest text-white/70">{d.audience}</div>
                  <div className="font-display font-extrabold text-2xl leading-tight">{d.title}</div>
                  <div className="absolute right-4 bottom-4 w-12 h-12 rounded-full bg-yellow text-ink flex items-center justify-center group-hover:scale-110 transition">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="font-display font-bold">{d.slides.length} slides</div>
                  <Badge>{d.updated}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
