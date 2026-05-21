import { Container, Section } from "@/components/ui/Container";

export default function PrivacyPage() {
  return (
    <Section>
      <Container>
        <h1 className="font-display font-extrabold text-4xl mb-3">Privacy Policy</h1>
        <p className="text-ink-2 mb-8">Placeholder — final policy will be filed alongside our PDPC data-controller registration.</p>
        <div className="prose max-w-none text-ink-2">
          <p>Pamoja+ collects personal data from sellers, shoppers, ambassadors, and partners to operate the marketplace. We comply with Tanzania&apos;s Personal Data Protection Act 2022 and Regulations 2023.</p>
          <p>Data principles: collect only what we need, use it for clear business purposes, restrict access internally, and delete or archive information when it is no longer required.</p>
          <p>You may request access, correction, or deletion of your data by contacting privacy@pamojaplus.co.tz.</p>
        </div>
      </Container>
    </Section>
  );
}
