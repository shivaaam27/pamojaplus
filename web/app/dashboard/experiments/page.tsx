import { ScaffoldPage } from "@/components/admin/ScaffoldPage";

export default function ExperimentsPage() {
  return (
    <ScaffoldPage
      eyebrow="System"
      title="Experiments"
      description="Feature flags + A/B tests. Roll out group-buy, live shopping, or new pricing to a slice of users before going all-in."
      schema={["analytics_events", "GrowthBook or PostHog (external)"]}
      workflows={[
        "Define a flag (key, % rollout, audience filter)",
        "Server checks flag on render; client emits analytics_events",
        "Compare conversion across cohorts in Metabase",
        "Promote winners → remove flag"
      ]}
      next="Pick GrowthBook (open-source) or PostHog. Wire a serverFlag(key, user) helper. This page just lists active flags + their current allocation."
    />
  );
}
