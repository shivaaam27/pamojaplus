import { Card, Badge } from "@/components/ui/Card";
import { PageHeader } from "@/components/admin/PageHeader";

export function ScaffoldPage({
  eyebrow,
  title,
  description,
  schema,
  workflows,
  next
}: {
  eyebrow: string;
  title: string;
  description: string;
  schema: string[];
  workflows: string[];
  next: string;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} right={<Badge tone="yellow">SCAFFOLD</Badge>} />
      <div className="grid lg:grid-cols-3 gap-5">
        <Card>
          <div className="font-display font-extrabold text-lg mb-2">Data backing this page</div>
          <ul className="text-sm space-y-1.5 text-ink-2">
            {schema.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <code className="px-2 py-0.5 rounded bg-green-soft text-green-dark text-xs font-mono">{t}</code>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="font-display font-extrabold text-lg mb-2">Workflows</div>
          <ul className="text-sm space-y-1.5 list-disc list-inside text-ink-2">
            {workflows.map((w) => <li key={w}>{w}</li>)}
          </ul>
        </Card>
        <Card className="bg-green-soft/60 border-green">
          <div className="font-display font-extrabold text-lg mb-2">Next to build</div>
          <div className="text-sm text-ink-2">{next}</div>
        </Card>
      </div>
    </>
  );
}
