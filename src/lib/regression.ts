import { linearRegression, linearRegressionLine, rSquared } from "simple-statistics";
import type { TeacherData } from "@/data/teacherData";

export interface RegressionResult {
  coefficients: Record<string, number>;
  intercept: number;
  rSquared: number;
  predictions: { name: string; actual: number; predicted: number; error: number }[];
}

const FEATURE_KEYS = [
  "wordCount", "rankScore", "genderScore", "photoClarity",
  "appearance", "researchCount", "infoScore", "smileScore",
  "titleCount", "nameLength",
] as const;

export const FEATURE_LABELS: Record<string, string> = {
  wordCount: "字數",
  rankScore: "職級",
  genderScore: "性別（男=1, 女=2）",
  photoClarity: "照片清晰度",
  appearance: "外在感知",
  researchCount: "研究領域數量",
  infoScore: "資料充足性",
  smileScore: "笑容程度",
  titleCount: "頭銜數量",
  nameLength: "名字長度",
};

// Simple multiple linear regression using normal equations
export function runRegression(data: TeacherData[]): RegressionResult {
  const n = data.length;
  const k = FEATURE_KEYS.length;

  // Build X matrix (with intercept column) and Y vector
  const X: number[][] = data.map((d) =>
    [1, ...FEATURE_KEYS.map((key) => d[key] as number)]
  );
  const Y = data.map((d) => d.views);

  // Normal equation: β = (X^T X)^(-1) X^T Y
  const Xt = transpose(X);
  const XtX = matMul(Xt, X);
  const XtY = matVecMul(Xt, Y);
  const XtXInv = invertMatrix(XtX);
  const beta = matVecMul(XtXInv, XtY);

  const intercept = beta[0];
  const coeffs: Record<string, number> = {};
  FEATURE_KEYS.forEach((key, i) => {
    coeffs[key] = beta[i + 1];
  });

  // Predictions
  const predictions = data.map((d) => {
    const predicted = intercept + FEATURE_KEYS.reduce(
      (sum, key, i) => sum + beta[i + 1] * (d[key] as number), 0
    );
    return {
      name: d.name,
      actual: d.views,
      predicted: Math.round(predicted),
      error: Math.round(predicted - d.views),
    };
  });

  // R-squared
  const yMean = Y.reduce((a, b) => a + b, 0) / n;
  const ssTot = Y.reduce((sum, y) => sum + (y - yMean) ** 2, 0);
  const ssRes = predictions.reduce((sum, p) => sum + (p.actual - p.predicted) ** 2, 0);
  const r2 = 1 - ssRes / ssTot;

  return { coefficients: coeffs, intercept, rSquared: r2, predictions };
}

function transpose(m: number[][]): number[][] {
  return m[0].map((_, i) => m.map((row) => row[i]));
}

function matMul(a: number[][], b: number[][]): number[][] {
  const rows = a.length, cols = b[0].length, inner = b.length;
  const result: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      for (let k = 0; k < inner; k++)
        result[i][j] += a[i][k] * b[k][j];
  return result;
}

function matVecMul(m: number[][], v: number[]): number[] {
  return m.map((row) => row.reduce((sum, val, i) => sum + val * v[i], 0));
}

function invertMatrix(matrix: number[][]): number[][] {
  const n = matrix.length;
  const aug: number[][] = matrix.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  ]);

  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

    const pivot = aug[col][col];
    if (Math.abs(pivot) < 1e-10) {
      // Near-singular, use pseudo value
      aug[col][col] = 1e-10;
    }
    for (let j = 0; j < 2 * n; j++) aug[col][j] /= pivot;

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = aug[row][col];
      for (let j = 0; j < 2 * n; j++) aug[row][j] -= factor * aug[col][j];
    }
  }

  return aug.map((row) => row.slice(n));
}
