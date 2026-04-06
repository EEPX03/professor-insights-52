import { useMemo } from "react";
import { teacherData } from "@/data/teacherData";
import { runRegression } from "@/lib/regression";
import { VariableTable } from "@/components/VariableTable";
import { PredictionTable } from "@/components/PredictionTable";
import { ScatterChart } from "@/components/ScatterChart";
import { CoefficientChart } from "@/components/CoefficientChart";
import { RegressionSummary } from "@/components/RegressionSummary";
import { ErrorAnalysis } from "@/components/ErrorAnalysis";
import { CreativeRankings } from "@/components/CreativeRankings";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const result = useMemo(() => runRegression(teacherData), []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">
            中正大學企管系教師頁面瀏覽數預測模型
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            資料來源：
            <a
              href="https://busadm.ccu.edu.tw/p/412-1248-3236.php?Lang=zh-tw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              中正大學企管系專任教師
            </a>
            <span className="ml-3 text-accent font-medium">
              ⚠ 部分資料為 AI 預估（照片清晰度、外在感知、笑容程度、瀏覽數）
            </span>
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* 1. Variable Table */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            📊 所有變數詳細表格
          </h2>
          <VariableTable data={teacherData} />
        </section>

        {/* 2. Prediction Table */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            🎯 實際瀏覽數 vs 預測瀏覽數
          </h2>
          <PredictionTable predictions={result.predictions} />
        </section>

        {/* 3. Scatter Plot */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            📈 實際 vs 預測散佈圖
          </h2>
          <ScatterChart predictions={result.predictions} />
        </section>

        {/* 4. Coefficient Bar Chart */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            📊 各變數影響力（迴歸係數）
          </h2>
          <CoefficientChart coefficients={result.coefficients} />
        </section>

        {/* 5. Regression Summary */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            📋 迴歸模型摘要
          </h2>
          <RegressionSummary result={result} />
        </section>

        {/* 6. Error Analysis */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            🔍 誤差分析
          </h2>
          <ErrorAnalysis predictions={result.predictions} />
        </section>

        {/* 7. Creative Rankings */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            🏆 創意變數排名
          </h2>
          <CreativeRankings data={teacherData} />
        </section>

        <footer className="text-center text-sm text-muted-foreground py-8 border-t border-border">
          資料來源：中正大學企管系 ｜ 迴歸模型於瀏覽器端以 JavaScript 計算
        </footer>
      </main>
    </div>
  );
};

export default Index;
