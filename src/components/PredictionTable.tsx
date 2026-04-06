interface Prediction {
  name: string;
  actual: number;
  predicted: number;
  error: number;
}

export function PredictionTable({ predictions }: { predictions: Prediction[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-primary text-primary-foreground">
          <tr>
            <th className="px-4 py-2 text-left">姓名</th>
            <th className="px-4 py-2 text-right">實際瀏覽數</th>
            <th className="px-4 py-2 text-right">預測瀏覽數</th>
            <th className="px-4 py-2 text-right">誤差</th>
            <th className="px-4 py-2 text-right">誤差率</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((p, i) => {
            const errorRate = ((p.error / p.actual) * 100).toFixed(1);
            return (
              <tr key={p.name} className={i % 2 === 0 ? "bg-card" : "bg-muted/50"}>
                <td className="px-4 py-2 font-medium">{p.name}</td>
                <td className="px-4 py-2 text-right">{p.actual.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{p.predicted.toLocaleString()}</td>
                <td className={`px-4 py-2 text-right font-medium ${p.error > 0 ? "text-destructive" : "text-success"}`}>
                  {p.error > 0 ? "+" : ""}{p.error.toLocaleString()}
                </td>
                <td className={`px-4 py-2 text-right ${p.error > 0 ? "text-destructive" : "text-success"}`}>
                  {p.error > 0 ? "+" : ""}{errorRate}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
