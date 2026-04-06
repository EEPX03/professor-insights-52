import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";

interface Prediction {
  name: string;
  actual: number;
  predicted: number;
  error: number;
}

function normalQuantile(p: number): number {
  // Rational approximation (Abramowitz & Stegun)
  if (p <= 0) return -4;
  if (p >= 1) return 4;
  if (p === 0.5) return 0;
  const sign = p < 0.5 ? -1 : 1;
  const pp = p < 0.5 ? p : 1 - p;
  const t = Math.sqrt(-2 * Math.log(pp));
  const c0 = 2.515517, c1 = 0.802853, c2 = 0.010328;
  const d1 = 1.432788, d2 = 0.189269, d3 = 0.001308;
  return sign * (t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t));
}

export function ResidualPlots({ predictions }: { predictions: Prediction[] }) {
  const residuals = predictions.map((p) => ({
    name: p.name,
    predicted: p.predicted,
    residual: p.actual - p.predicted,
  }));

  // Standardized residuals for Q-Q
  const resValues = residuals.map((r) => r.residual);
  const mean = resValues.reduce((a, b) => a + b, 0) / resValues.length;
  const sd = Math.sqrt(resValues.reduce((s, v) => s + (v - mean) ** 2, 0) / (resValues.length - 1));

  const sorted = [...residuals]
    .sort((a, b) => a.residual - b.residual)
    .map((r, i, arr) => ({
      name: r.name,
      theoretical: normalQuantile((i + 0.5) / arr.length),
      standardized: sd > 0 ? (r.residual - mean) / sd : 0,
    }));

  const qqMax = Math.max(...sorted.map((s) => Math.max(Math.abs(s.theoretical), Math.abs(s.standardized)))) * 1.2;

  return (
    <div className="space-y-6">
      {/* Residual vs Predicted */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="font-semibold text-foreground mb-3">殘差 vs 預測值（Residual vs Fitted）</h4>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="predicted" type="number" tick={{ fontSize: 12 }}>
              <Label value="預測值" position="bottom" offset={-5} />
            </XAxis>
            <YAxis dataKey="residual" type="number" tick={{ fontSize: 12 }}>
              <Label value="殘差" angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-card border border-border rounded p-2 shadow text-sm">
                    <p className="font-bold">{d.name}</p>
                    <p>預測值：{d.predicted.toLocaleString()}</p>
                    <p>殘差：{d.residual.toLocaleString()}</p>
                  </div>
                );
              }}
            />
            <ReferenceLine y={0} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
            <Scatter data={residuals} fill="hsl(var(--primary))" r={6} />
          </ScatterChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground text-center mt-2">
          殘差應隨機分布在零線附近，若呈現明顯模式則代表模型可能有非線性關係未被捕捉
        </p>
      </div>

      {/* Q-Q Plot */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="font-semibold text-foreground mb-3">常態 Q-Q 圖（Normal Q-Q Plot）</h4>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="theoretical" type="number" domain={[-qqMax, qqMax]} tick={{ fontSize: 12 }}>
              <Label value="理論分位數" position="bottom" offset={-5} />
            </XAxis>
            <YAxis dataKey="standardized" type="number" domain={[-qqMax, qqMax]} tick={{ fontSize: 12 }}>
              <Label value="標準化殘差" angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-card border border-border rounded p-2 shadow text-sm">
                    <p className="font-bold">{d.name}</p>
                    <p>理論：{d.theoretical.toFixed(2)}</p>
                    <p>實際：{d.standardized.toFixed(2)}</p>
                  </div>
                );
              }}
            />
            <ReferenceLine
              segment={[{ x: -qqMax, y: -qqMax }, { x: qqMax, y: qqMax }]}
              stroke="hsl(var(--destructive))"
              strokeDasharray="5 5"
            />
            <Scatter data={sorted} fill="hsl(var(--primary))" r={6} />
          </ScatterChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground text-center mt-2">
          點越靠近紅色虛線（45°線），殘差越接近常態分布，迴歸模型的常態性假設越成立
        </p>
      </div>
    </div>
  );
}
