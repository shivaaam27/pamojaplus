import { cookies } from "next/headers";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { milestones as fallbackMilestones } from "@/content/milestones";
import { serverClient, supabaseConfigured, type DBMilestone } from "@/lib/supabase";
import { AchievementsGrid } from "./AchievementsGrid";

export const revalidate = 60; // refresh from DB every 60s

async function loadMilestones() {
  const staticRows = fallbackMilestones.map((m) => ({
    date: m.date, title: m.title, description: m.description, icon: m.icon, featured: m.featured ?? false
  }));
  if (!supabaseConfigured) return { rows: staticRows, live: false };
  const supabase = serverClient(cookies());
  if (!supabase) return { rows: staticRows, live: false };
  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .eq("public", true)
    .order("date", { ascending: true });
  if (error || !data) return { rows: staticRows, live: false };
  const rows = (data as DBMilestone[]).map((m) => ({
    date: m.date,
    title: m.title,
    description: m.description ?? "",
    icon: m.icon,
    featured: m.featured
  }));
  return { rows, live: true };
}

export default async function AchievementsPage() {
  const { rows } = await loadMilestones();
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="Milestones" title="What we&apos;ve built so far."
          sub="A growing wall of wins. Updated as the team ships." />
        <AchievementsGrid milestones={rows} />
      </Container>
    </Section>
  );
}
