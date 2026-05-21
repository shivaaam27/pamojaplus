import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { Card, Badge } from "@/components/ui/Card";
import { team, departments } from "@/content/team";

export default function TeamPage() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeading eyebrow="Our team" title="Lean. Energetic. Community-driven."
            sub="6 to 8 core members plus part-time ambassadors. Clear ownership. Weekly cadence." />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map((m) => (
              <Card key={m.role}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green to-green-dark text-white flex items-center justify-center font-display font-extrabold text-lg">
                    {m.initials}
                  </div>
                  <div>
                    <div className="font-display font-bold">{m.name}</div>
                    <div className="text-sm text-ink-2">{m.role}</div>
                  </div>
                </div>
                {m.bio && <p className="mt-4 text-sm text-ink-2">{m.bio}</p>}
                <div className="mt-4"><Badge>{m.dept}</Badge></div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white border-y border-line">
        <Container>
          <SectionHeading eyebrow="Departments" title="Six functions, one mission." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((d) => (
              <Card key={d.id}>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${d.color}`}>{d.name}</span>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
