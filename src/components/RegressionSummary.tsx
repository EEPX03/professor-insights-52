import type { RegressionResult } from "@/lib/regression";
import { FEATURE_LABELS } from "@/lib/regression";

export function RegressionSummary({ result }: { result: RegressionResult }) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">R²（判定係數）</p>
          <p className="text-3xl font-bold text-primary">{result.rSquared.toFixed(4)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {result.rSquared > 0.8 ? "模型解釋力很強" : result.rSquared > 0.5 ? "模型解釋力中等" : "模型解釋力較弱"}
          </p>
        </div>
        <div className="bg-accent/10 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">截距（Intercept）</p>
          <p className="text-3xl font-bold text-accent">{Math.round(result.intercept).toLocaleString()}</p>
        </div>
        <div className="bg-success/10 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">自變數數量</p>
          <p className="text-3xl font-bold text-success">{Object.keys(result.coefficients).length}</p>
        </div>
      </div>

      <h3 className="font-semibold text-foreground">迴歸方程式</h3>
      <div className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
        <p>Y = {Math.round(result.intercept)}</p>
        {Object.entries(result.coefficients).map(([key, val]) => (
          <p key={key} className="ml-4">
            {val >= 0 ? "+" : ""} {val.toFixed(4)} × {FEATURE_LABELS[key]}
          </p>
        ))}
      </div>

      <h3 className="font-semibold text-foreground">各變數係數表</h3>
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">變數</th>
              <th className="px-4 py-2 text-right">係數</th>
              <th className="px-4 py-2 text-left">影響方向</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(result.coefficients)
              .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
              .map(([key, val], i) => (
                <tr key={key} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                  <td className="px-4 py-2">{FEATURE_LABELS[key]}</td>
                  <td className="px-4 py-2 text-right font-mono">{val.toFixed(4)}</td>
                  <td className={`px-4 py-2 font-medium ${val >= 0 ? "text-success" : "text-destructive"}`}>
                    {val >= 0 ? "↑ 正向" : "↓ 負向"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
