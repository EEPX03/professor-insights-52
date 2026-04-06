import type { RegressionResult } from "@/lib/regression";

function formatP(p: number): string {
  if (p < 0.001) return "< 0.001 ***";
  if (p < 0.01) return `${p.toFixed(4)} **`;
  if (p < 0.05) return `${p.toFixed(4)} *`;
  if (p < 0.1) return `${p.toFixed(4)} .`;
  return p.toFixed(4);
}

function sigLabel(p: number): string {
  if (p < 0.001) return "***";
  if (p < 0.01) return "**";
  if (p < 0.05) return "*";
  if (p < 0.1) return ".";
  return "";
}

export function StatisticalAnalysis({ result }: { result: RegressionResult }) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      {/* Model Summary */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">模型整體解釋力</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">R²</p>
            <p className="text-xl font-bold text-primary">{result.rSquared.toFixed(4)}</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">Adjusted R²</p>
            <p className="text-xl font-bold text-primary">{result.adjustedRSquared.toFixed(4)}</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">F 統計量</p>
            <p className="text-xl font-bold text-primary">{result.fStatistic.toFixed(4)}</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">F 檢定 p-value</p>
            <p className={`text-xl font-bold ${result.fPValue < 0.05 ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
              {result.fPValue < 0.001 ? "< 0.001" : result.fPValue.toFixed(4)}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          樣本數 n = {result.n}，自變數數量 k = {result.k}，殘差自由度 = {result.n - result.k - 1}
        </p>
        <p className="text-sm mt-1">
          {result.fPValue < 0.05
            ? <span className="text-green-600 dark:text-green-400 font-medium">✅ 模型整體達統計顯著水準（p &lt; 0.05），迴歸模型具有解釋力</span>
            : <span className="text-destructive font-medium">⚠ 模型整體未達統計顯著水準（p ≥ 0.05）</span>
          }
        </p>
      </div>

      {/* ANOVA Table */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">ANOVA 變異數分析表</h3>
        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left">變異來源</th>
                <th className="px-4 py-2 text-right">自由度 (df)</th>
                <th className="px-4 py-2 text-right">平方和 (SS)</th>
                <th className="px-4 py-2 text-right">均方 (MS)</th>
                <th className="px-4 py-2 text-right">F 值</th>
                <th className="px-4 py-2 text-right">p-value</th>
              </tr>
            </thead>
            <tbody>
              {result.anova.map((row, i) => (
                <tr key={row.source} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                  <td className="px-4 py-2 font-medium">{row.source}</td>
                  <td className="px-4 py-2 text-right font-mono">{row.df}</td>
                  <td className="px-4 py-2 text-right font-mono">{Math.round(row.ss).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right font-mono">{Math.round(row.ms).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right font-mono">{row.f !== null ? row.f.toFixed(4) : "—"}</td>
                  <td className="px-4 py-2 text-right font-mono">
                    {row.pValue !== null ? formatP(row.pValue) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coefficient Table with significance */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">係數表（含顯著性檢定）</h3>
        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left">變數</th>
                <th className="px-4 py-2 text-right">係數 (B)</th>
                <th className="px-4 py-2 text-right">標準誤 (SE)</th>
                <th className="px-4 py-2 text-right">t 統計量</th>
                <th className="px-4 py-2 text-right">p-value</th>
                <th className="px-4 py-2 text-center">顯著性</th>
              </tr>
            </thead>
            <tbody>
              {/* Intercept */}
              <tr className="bg-card border-b border-border">
                <td className="px-4 py-2 font-medium">{result.interceptDetail.label}</td>
                <td className="px-4 py-2 text-right font-mono">{result.interceptDetail.coefficient.toFixed(4)}</td>
                <td className="px-4 py-2 text-right font-mono">{result.interceptDetail.standardError.toFixed(4)}</td>
                <td className="px-4 py-2 text-right font-mono">{result.interceptDetail.tStatistic.toFixed(4)}</td>
                <td className="px-4 py-2 text-right font-mono">{formatP(result.interceptDetail.pValue)}</td>
                <td className="px-4 py-2 text-center font-bold text-primary">{sigLabel(result.interceptDetail.pValue)}</td>
              </tr>
              {/* Variables sorted by |t| */}
              {[...result.coefficientDetails]
                .sort((a, b) => Math.abs(b.tStatistic) - Math.abs(a.tStatistic))
                .map((detail, i) => (
                  <tr key={detail.key} className={i % 2 === 0 ? "bg-muted/30" : "bg-card"}>
                    <td className="px-4 py-2">{detail.label}</td>
                    <td className={`px-4 py-2 text-right font-mono ${detail.coefficient >= 0 ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                      {detail.coefficient.toFixed(4)}
                    </td>
                    <td className="px-4 py-2 text-right font-mono">{detail.standardError.toFixed(4)}</td>
                    <td className="px-4 py-2 text-right font-mono">{detail.tStatistic.toFixed(4)}</td>
                    <td className="px-4 py-2 text-right font-mono">{formatP(detail.pValue)}</td>
                    <td className="px-4 py-2 text-center font-bold text-primary">{sigLabel(detail.pValue)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          顯著性代碼：*** p &lt; 0.001 &nbsp; ** p &lt; 0.01 &nbsp; * p &lt; 0.05 &nbsp; . p &lt; 0.1
        </p>
      </div>
    </div>
  );
}
