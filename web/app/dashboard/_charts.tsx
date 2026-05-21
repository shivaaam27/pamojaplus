"use client";
import { Card, Badge } from "@/components/ui/Card";
import { tzs } from "@/lib/format";
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from "recharts";

export function DashboardCharts({ trend }: { trend: { label: string; v: number }[] }) {
  return (
    <div className="grid lg:grid-cols-1 gap-5 mb-8">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="font-display font-extrabold text-lg">Revenue trend</div>
          <Badge>Last 12 weeks</Badge>
        </div>
        <div className="h-64">
          {trend.length === 0 ? (
            <div className="h-full flex items-center justify-center text-ink-2 text-sm">
              No revenue events yet. They appear here as soon as payment_intents resolves to succeeded.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey="label" stroke="#3A4A40" fontSize={12} />
                <Tooltip formatter={(v: number) => tzs(v)} />
                <Line type="monotone" dataKey="v" stroke="#2BB24C" strokeWidth={3} dot={{ fill: "#F5C518", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}
