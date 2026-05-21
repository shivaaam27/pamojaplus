import { Card } from "@/components/ui/Card";
import { Inbox } from "lucide-react";

export function EmptyState({
  title = "Nothing here yet",
  hint,
  icon: Icon = Inbox
}: {
  title?: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="text-center py-14">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-green-soft text-green-dark flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <div className="font-display font-extrabold text-lg">{title}</div>
      {hint && <div className="text-ink-2 text-sm mt-1 max-w-md mx-auto">{hint}</div>}
    </Card>
  );
}
