import { Container, Section } from "@/components/ui/Container";

export default function TermsPage() {
  return (
    <Section>
      <Container>
        <h1 className="font-display font-extrabold text-4xl mb-3">Terms &amp; Conditions</h1>
        <p className="text-ink-2 mb-8">Placeholder — to be replaced with counsel-reviewed final version.</p>
        <div className="prose max-w-none text-ink-2">
          <p>These Terms govern your use of the Pamoja+ platform operated by Pamoja Plus Tanzania Limited. By using the platform you agree to these Terms.</p>
          <p>The platform connects buyers and sellers; transaction responsibilities rest with the seller during Phase 1 launch.</p>
          <p>Full Terms will be published before public launch and reviewed against BRELA, TRA, PDPC, FCC, TCRA, TMDA, and TBS guidance where applicable.</p>
        </div>
      </Container>
    </Section>
  );
}
