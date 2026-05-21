import { ScaffoldPage } from "@/components/admin/ScaffoldPage";

export default function BoostsPage() {
  return (
    <ScaffoldPage
      eyebrow="Money"
      title="Boosts & spotlights"
      description="What paid placements are running right now, what's due to be delivered, and the revenue pipeline behind them."
      schema={["boosts", "spotlights", "payment_intents", "campaigns"]}
      workflows={[
        "Active calendar view (week grid showing boost windows)",
        "Spotlight deliverables checklist (brand story · 3 socials · homepage)",
        "Auto-expire boosts at ends_at via Inngest job",
        "Revenue attribution → revenue_events on payment success"
      ]}
      next="Calendar component (Recharts or a simple week grid). Detail panel with the deliverables checklist as a JSON-backed task list."
    />
  );
}
