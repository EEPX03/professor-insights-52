interface Prediction {
  name: string;
  actual: number;
  predicted: number;
  error: number;
}

export function ErrorAnalysis({ predictions }: { predictions: Prediction[] }) {
  const sorted = [...predictions].sort((a, b) => b.error - a.error);
  const mostOverestimated = sorted[0];
  const mostUnderestimated = sorted[sorted.length - 1];
  const avgAbsError = Math.round(
    predictions.reduce((sum, p) => sum + Math.abs(p.error), 0) / predictions.length
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-5">
        <h3 className="font-semibold text-destructive mb-2">📈 被高估最多</h3>
        <p className="text-2xl font-bold text-foreground">{mostOverestimated.name}</p>
        <p className="text-sm text-muted-foreground mt-1">
          實際：{mostOverestimated.actual.toLocaleString()} ｜
          預測：{mostOverestimated.predicted.toLocaleString()}
        </p>
        <p className="text-sm font-medium text-destructive mt-1">
          高估 +{mostOverestimated.error.toLocaleString()}
        </p>
      </div>
      <div className="bg-success/10 border border-success/20 rounded-lg p-5">
        <h3 className="font-semibold text-success mb-2">📉 被低估最多</h3>
        <p className="text-2xl font-bold text-foreground">{mostUnderestimated.name}</p>
        <p className="text-sm text-muted-foreground mt-1">
          實際：{mostUnderestimated.actual.toLocaleString()} ｜
          預測：{mostUnderestimated.predicted.toLocaleString()}
        </p>
        <p className="text-sm font-medium text-success mt-1">
          低估 {mostUnderestimated.error.toLocaleString()}
        </p>
      </div>
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-5">
        <h3 className="font-semibold text-primary mb-2">📊 平均絕對誤差</h3>
        <p className="text-2xl font-bold text-foreground">{avgAbsError.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground mt-1">
          MAE（Mean Absolute Error）
        </p>
      </div>
    </div>
  );
}
