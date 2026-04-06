import {
  ScatterChart as RechartsScatter,
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
}

export function ScatterChart({ predictions }: { predictions: Prediction[] }) {
  const maxVal = Math.max(
    ...predictions.map((p) => Math.max(p.actual, p.predicted))
  );

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <ResponsiveContainer width="100%" height={400}>
        <RechartsScatter data={predictions}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="actual"
            type="number"
            name="實際瀏覽數"
            domain={[0, maxVal * 1.1]}
            tick={{ fontSize: 12 }}
          >
            <Label value="實際瀏覽數" position="bottom" offset={-5} />
          </XAxis>
          <YAxis
            dataKey="predicted"
            type="number"
            name="預測瀏覽數"
            domain={[0, maxVal * 1.1]}
            tick={{ fontSize: 12 }}
          >
            <Label value="預測瀏覽數" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip
            content={({ payload }) => {
              if (!payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-card border border-border rounded p-2 shadow text-sm">
                  <p className="font-bold">{d.name}</p>
                  <p>實際：{d.actual.toLocaleString()}</p>
                  <p>預測：{d.predicted.toLocaleString()}</p>
                </div>
              );
            }}
          />
          <ReferenceLine
            segment={[
              { x: 0, y: 0 },
              { x: maxVal, y: maxVal },
            ]}
            stroke="hsl(var(--destructive))"
            strokeDasharray="5 5"
            label="45° 完美預測線"
          />
          <Scatter
            dataKey="predicted"
            fill="hsl(var(--primary))"
            r={6}
          />
        </RechartsScatter>
      </ResponsiveContainer>
      <p className="text-xs text-muted-foreground text-center mt-2">
        資料來源：中正大學企管系 ｜ 點越靠近紅色虛線表示預測越準確
      </p>
    </div>
  );
}
