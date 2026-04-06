import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { FEATURE_LABELS } from "@/lib/regression";

export function CoefficientChart({ coefficients }: { coefficients: Record<string, number> }) {
  const chartData = Object.entries(coefficients)
    .map(([key, value]) => ({
      name: FEATURE_LABELS[key] || key,
      value: Math.round(value * 100) / 100,
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={90} />
          <Tooltip
            formatter={(value: number) => [value.toFixed(2), "係數"]}
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
          />
          <ReferenceLine x={0} stroke="hsl(var(--foreground))" />
          <Bar dataKey="value" radius={4}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.value >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-muted-foreground text-center mt-2">
        資料來源：中正大學企管系 ｜ 藍色=正向影響，紅色=負向影響
      </p>
    </div>
  );
}
