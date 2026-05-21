import { Badge } from "@/components/ui/Card";

export function PageHeader({
  eyebrow = "Internal",
  title,
  description,
  right
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-green">{eyebrow}</div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl mt-1">{title}</h1>
        {description && <div className="text-ink-2 text-sm mt-1 max-w-2xl">{description}</div>}
      </div>
      <div className="flex items-center gap-2">{right ?? <Badge tone="yellow">PHASE 2 · WIRING</Badge>}</div>
    </div>
  );
}
