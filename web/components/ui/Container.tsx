import { cn } from "@/lib/cn";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("max-w-6xl mx-auto px-5 sm:px-8", className)}>{children}</div>;
}

export function Section({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return <section id={id} className={cn("py-16 sm:py-24", className)}>{children}</section>;
}

export function SectionHeading({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl mb-12">
      {eyebrow && <div className="text-sm font-bold tracking-widest uppercase text-green mb-3">{eyebrow}</div>}
      <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-balance">{title}</h2>
      {sub && <p className="mt-4 text-ink-2 text-lg">{sub}</p>}
    </div>
  );
}
