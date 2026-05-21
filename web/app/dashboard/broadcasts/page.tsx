import { ScaffoldPage } from "@/components/admin/ScaffoldPage";

export default function BroadcastsPage() {
  return (
    <ScaffoldPage
      eyebrow="Growth"
      title="Broadcasts"
      description="Send targeted SMS, WhatsApp, or email to a seller/shopper segment. Every send is logged in notifications for delivery audit."
      schema={["broadcasts", "notification_templates", "notifications", "consent_log"]}
      workflows={[
        "Compose: pick template (en/sw) + segment (plan/city/tier) + channel",
        "Preview recipient count from segment JSON filter",
        "Send via Beem (SMS) / 360dialog (WA) / Resend (email)",
        "Respect consent_log opt-outs automatically"
      ]}
      next="Segment-builder UI (a JSON form that compiles to a Supabase query). Template library page (CRUD). Send-and-confirm modal with recipient count."
    />
  );
}
