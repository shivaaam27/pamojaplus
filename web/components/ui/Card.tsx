import { cn } from "@/lib/cn";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("bg-white border border-line rounded-2xl shadow-card p-6", className)}>{children}</div>;
}

export function Badge({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "yellow" | "ink" }) {
  const tones = {
    green: "bg-green-soft text-green-dark",
    yellow: "bg-yellow-soft text-ink",
    ink: "bg-ink text-white"
  } as const;
  return <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold", tones[tone])}>{children}</span>;
}
