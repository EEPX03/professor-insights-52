import type { TeacherData } from "@/data/teacherData";

export interface CoefficientDetail {
  key: string;
  label: string;
  coefficient: number;
  standardError: number;
  tStatistic: number;
  pValue: number;
}

export interface AnovaRow {
  source: string;
  df: number;
  ss: number;
  ms: number;
  f: number | null;
  pValue: number | null;
}

export interface RegressionResult {
  coefficients: Record<string, number>;
  intercept: number;
  rSquared: number;
  adjustedRSquared: number;
  predictions: { name: string; actual: number; predicted: number; error: number }[];
  anova: AnovaRow[];
  fStatistic: number;
  fPValue: number;
  coefficientDetails: CoefficientDetail[];
  interceptDetail: CoefficientDetail;
  n: number;
  k: number;
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

export function runRegression(data: TeacherData[]): RegressionResult {
  const n = data.length;
  const k = FEATURE_KEYS.length;

  const X: number[][] = data.map((d) =>
    [1, ...FEATURE_KEYS.map((key) => d[key] as number)]
  );
  const Y = data.map((d) => d.views);

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

  // Sums of squares
  const yMean = Y.reduce((a, b) => a + b, 0) / n;
  const ssTot = Y.reduce((sum, y) => sum + (y - yMean) ** 2, 0);
  const ssRes = predictions.reduce((sum, p) => sum + (p.actual - p.predicted) ** 2, 0);
  const ssReg = ssTot - ssRes;

  const r2 = 1 - ssRes / ssTot;
  const adjR2 = 1 - ((1 - r2) * (n - 1)) / (n - k - 1);

  // ANOVA
  const dfReg = k;
  const dfRes = n - k - 1;
  const dfTot = n - 1;
  const msReg = ssReg / dfReg;
  const msRes = ssRes / dfRes;
  const fStat = msReg / msRes;
  const fPVal = 1 - fisherCDF(fStat, dfReg, dfRes);

  const anova: AnovaRow[] = [
    { source: "迴歸 (Regression)", df: dfReg, ss: ssReg, ms: msReg, f: fStat, pValue: fPVal },
    { source: "殘差 (Residual)", df: dfRes, ss: ssRes, ms: msRes, f: null, pValue: null },
    { source: "總計 (Total)", df: dfTot, ss: ssTot, ms: ssTot / dfTot, f: null, pValue: null },
  ];

  // Coefficient standard errors & t-tests
  const coefficientDetails: CoefficientDetail[] = [];
  const se_intercept = Math.sqrt(msRes * XtXInv[0][0]);
  const t_intercept = intercept / se_intercept;
  const p_intercept = 2 * (1 - studentTCDF(Math.abs(t_intercept), dfRes));

  const interceptDetail: CoefficientDetail = {
    key: "intercept",
    label: "截距 (Intercept)",
    coefficient: intercept,
    standardError: se_intercept,
    tStatistic: t_intercept,
    pValue: p_intercept,
  };

  FEATURE_KEYS.forEach((key, i) => {
    const se = Math.sqrt(msRes * XtXInv[i + 1][i + 1]);
    const t = beta[i + 1] / se;
    const p = 2 * (1 - studentTCDF(Math.abs(t), dfRes));
    coefficientDetails.push({
      key,
      label: FEATURE_LABELS[key],
      coefficient: beta[i + 1],
      standardError: se,
      tStatistic: t,
      pValue: p,
    });
  });

  return {
    coefficients: coeffs,
    intercept,
    rSquared: r2,
    adjustedRSquared: adjR2,
    predictions,
    anova,
    fStatistic: fStat,
    fPValue: fPVal,
    coefficientDetails,
    interceptDetail,
    n,
    k,
  };
}

// --- Matrix utilities ---
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
  const reg = matrix.map((row, i) => row.map((val, j) => val + (i === j ? 0.001 : 0)));
  const aug: number[][] = reg.map((row, i) => [
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
    if (Math.abs(pivot) < 1e-10) aug[col][col] = 1e-10;
    for (let j = 0; j < 2 * n; j++) aug[col][j] /= pivot;
    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = aug[row][col];
      for (let j = 0; j < 2 * n; j++) aug[row][j] -= factor * aug[col][j];
    }
  }
  return aug.map((row) => row.slice(n));
}

// --- Statistical distribution approximations ---

// Regularized incomplete beta function via continued fraction
function betaIncomplete(a: number, b: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const lnBeta = lgamma(a) + lgamma(b) - lgamma(a + b);
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lnBeta);
  if (x < (a + 1) / (a + b + 2)) {
    return front * betaCF(a, b, x) / a;
  }
  return 1 - front * betaCF(b, a, 1 - x) / b;
}

function betaCF(a: number, b: number, x: number): number {
  const maxIter = 200;
  const eps = 1e-14;
  let qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - qab * x / qap;
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= maxIter; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d;
    c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
    h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d;
    c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < eps) break;
  }
  return h;
}

function lgamma(x: number): number {
  const cof = [76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x, tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) ser += cof[j] / ++y;
  return -tmp + Math.log(2.5066282746310005 * ser / x);
}

// F-distribution CDF
function fisherCDF(f: number, d1: number, d2: number): number {
  if (f <= 0) return 0;
  const x = d1 * f / (d1 * f + d2);
  return betaIncomplete(d1 / 2, d2 / 2, x);
}

// Student's t-distribution CDF
function studentTCDF(t: number, df: number): number {
  if (t <= 0) return 0.5;
  const x = df / (df + t * t);
  return 1 - 0.5 * betaIncomplete(df / 2, 0.5, x);
}
