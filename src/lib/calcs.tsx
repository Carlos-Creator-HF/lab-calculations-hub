import type { ReactNode } from "react";

export type Calc = {
  id: string;
  title: ReactNode;
  plain: string;
  formula: ReactNode;
  needsAtm?: boolean;
  z: (y: number, patm: number) => number;
};

export const CALCS: Calc[] = [
  {
    id: "1", plain: "Determinación Volumen", title: "1. Determinación Volumen",
    formula: <>1/P = k<sub>1</sub>·(V) − V<sub>b</sub></>, needsAtm: true,
    z: (y, patm) => 1 / ((9810 * y) / 1000 + patm * 100),
  },
  { id: "2", plain: "Curva de Calibración H2", title: <>2. Curva de Calibración H<sub>2</sub></>, formula: <>Z = 4y − 3</>, z: (y) => 4 * y - 3 },
  { id: "3", plain: "Calibración Termómetro", title: "3. Calibración Termómetro", formula: <>Z = 1.15y<sup>2</sup> + 2.35y + 0.135</>, z: (y) => 1.15 * y * y + 2.35 * y + 0.135 },
  { id: "4", plain: "Curva Calibración CO", title: "4. Curva Calibración CO", formula: <>Z = ln(y)</>, z: (y) => Math.log(y) },
  { id: "5", plain: "Curva calibración de CO2", title: <>5. Curva calibración de CO<sub>2</sub></>, formula: <>Z = 2.35y + 0.135</>, z: (y) => 2.35 * y + 0.135 },
  { id: "6", plain: "Curva de calibración CH4", title: <>6. Curva de calibración CH<sub>4</sub></>, formula: <>Z = (2.35y)·2 + 0.135</>, z: (y) => 2.35 * y * 2 + 0.135 },
];

export function linearFit(pts: { x: number; z: number }[]) {
  const n = pts.length;
  if (n < 2) return null;
  const sx = pts.reduce((a, p) => a + p.x, 0), sz = pts.reduce((a, p) => a + p.z, 0);
  const sxx = pts.reduce((a, p) => a + p.x * p.x, 0), sxz = pts.reduce((a, p) => a + p.x * p.z, 0);
  const d = n * sxx - sx * sx;
  if (d === 0) return null;
  const m = (n * sxz - sx * sz) / d, b = (sz - m * sx) / n;
  const mean = sz / n;
  const ssTot = pts.reduce((a, p) => a + (p.z - mean) ** 2, 0);
  const ssRes = pts.reduce((a, p) => a + (p.z - (m * p.x + b)) ** 2, 0);
  return { m, b, r2: ssTot === 0 ? 1 : 1 - ssRes / ssTot };
}
