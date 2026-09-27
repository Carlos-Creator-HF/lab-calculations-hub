import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis } from "recharts";
import { Page } from "@/components/Layout";
import { CALCS, linearFit } from "@/lib/calcs";

export const Route = createFileRoute("/calc/$id")({
  loader: ({ params }) => {
    const c = CALCS.find((c) => c.id === params.id);
    if (!c) throw notFound();
    return { id: c.id, plain: c.plain };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.plain} — Lab` : "No encontrado";
    return {
      meta: [
        { title: t },
        { name: "description", content: `${loaderData?.plain ?? ""}: captura datos, ajuste lineal y gráfica.` },
        { property: "og:title", content: t },
        { property: "og:description", content: "Ajuste lineal y gráfica de calibración." },
      ],
    };
  },
  component: CalcPage,
});

type Row = { x: string; y: string };
const num = (s: string) => {
  const t = s.trim().replace(",", ".");
  if (t === "" || t === "-" || t === ".") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};
const clean = (s: string) => s.replace(/[^0-9.,\-eE]/g, "");
const flip = (s: string) => (s.startsWith("-") ? s.slice(1) : "-" + s);
const fmt = (n: number) => (Math.abs(n) < 1e-3 && n !== 0) || Math.abs(n) >= 1e5 ? n.toExponential(4) : n.toFixed(5);

function NumInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex">
      <button type="button" aria-label={`Cambiar signo ${label}`} onClick={() => onChange(flip(value))}
        className="rounded-l-md border border-input bg-muted px-2 font-bold">±</button>
      <input aria-label={label} type="text" inputMode="decimal" value={value} placeholder="—"
        onChange={(e) => onChange(clean(e.target.value))}
        className="w-full min-w-0 rounded-r-md border border-l-0 border-input bg-background px-2 py-1.5" />
    </div>
  );
}

function CalcPage() {
  const { id } = Route.useLoaderData();
  const calc = CALCS.find((c) => c.id === id)!;
  const [rows, setRows] = useState<Row[]>(Array.from({ length: 6 }, () => ({ x: "", y: "" })));
  const [patm, setPatm] = useState("");
  const [temp, setTemp] = useState("");
  const [showFit, setShowFit] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const p = num(patm) ?? 0;
  const pts = rows.flatMap((r) => {
    const x = num(r.x), y = num(r.y);
    if (x === null || y === null) return [];
    const z = calc.z(y, p);
    return Number.isFinite(z) ? [{ x, y, z }] : [];
  });
  const atmMissing = calc.needsAtm && num(patm) === null;
  const fit = atmMissing ? null : linearFit(pts);
  const sorted = [...pts].sort((a, b) => a.x - b.x);
  const fitLine = fit && sorted.length ? [sorted[0], sorted[sorted.length - 1]].map((q) => ({ x: q.x, fit: fit.m * q.x + fit.b })) : [];

  const setRow = (i: number, k: keyof Row, v: string) => {
    setRows((r) => r.map((row, j) => (j === i ? { ...row, [k]: v } : row)));
    setShowFit(false); setShowGraph(false);
  };

  return (
    <Page title={calc.title} back="/calculos">
      <p className="mx-auto mb-4 max-w-2xl text-center text-foreground/80">
        The determination of volume of any flask is based on ideal gas approximation in a closed system at constant atmospheric pressure and temperature.
      </p>
      <div className="title-box mx-auto mb-8 w-fit px-6 py-3 text-lg font-semibold">{calc.formula}</div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="panel p-4">
          <h2 className="mb-3 font-bold">Datos</h2>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-sm">
            <span className="font-semibold">X (volumen, mL)</span>
            <span className="font-semibold">y (presión, mm H₂O)</span><span />
            {rows.map((r, i) => (
              <div key={i} className="contents">
                <NumInput label={`x ${i + 1}`} value={r.x} onChange={(v) => setRow(i, "x", v)} />
                <NumInput label={`y ${i + 1}`} value={r.y} onChange={(v) => setRow(i, "y", v)} />
                <button aria-label="Quitar fila" className="px-2 text-muted-foreground" onClick={() => setRows(rows.filter((_, j) => j !== i))}>✕</button>
              </div>
            ))}
          </div>
          <button className="mt-3 text-sm font-semibold text-primary" onClick={() => setRows([...rows, { x: "", y: "" }])}>+ Agregar fila</button>
          <p className="mt-2 text-xs text-muted-foreground">Las celdas vacías no se usan. Usa ± para números negativos.</p>
        </div>

        <div className="flex flex-col gap-6">
          {calc.needsAtm && (
            <div className="panel grid grid-cols-2 gap-3 p-4 text-sm">
              <h2 className="col-span-2 font-bold">Condiciones</h2>
              <label className="font-semibold">P<sub>atm</sub> (hPa)<NumInput label="Patm" value={patm} onChange={(v) => { setPatm(v); setShowFit(false); setShowGraph(false); }} /></label>
              <label className="font-semibold">Temperatura (°C)<NumInput label="Temperatura" value={temp} onChange={setTemp} /></label>
            </div>
          )}
          <div className="flex gap-4">
            <button className="btn-3d flex-1 py-3" onClick={() => setShowFit(true)}>Calculate</button>
            <button className="btn-3d flex-1 py-3" onClick={() => { setShowFit(true); setShowGraph(true); }}>Generate</button>
          </div>
          {showFit && (
            <div className="panel p-4 text-sm">
              {atmMissing ? <p className="text-destructive">Ingresa la presión atmosférica.</p>
                : !fit ? <p className="text-destructive">Se necesitan al menos 2 puntos válidos con X distintos.</p>
                : (
                  <div className="space-y-1">
                    <p><b>Pendiente:</b> {fmt(fit.m)} ams</p>
                    <p><b>Ordenada al origen:</b> {fmt(fit.b)} bms</p>
                    <p><b>R²:</b> {fit.r2.toFixed(5)}</p>
                    <p className="text-muted-foreground">Z = ({fmt(fit.m)})·x + ({fmt(fit.b)}) · n = {pts.length}</p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      {showGraph && fit && (
        <div className="panel mt-6 p-4">
          <h2 className="mb-2 font-bold">Z vs X</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <ComposedChart margin={{ top: 10, right: 20, bottom: 25, left: 20 }}>
                <CartesianGrid stroke="var(--border)" />
                <XAxis type="number" dataKey="x" domain={["auto", "auto"]} label={{ value: "X (mL)", position: "bottom" }} />
                <YAxis type="number" domain={["auto", "auto"]} tickFormatter={(v) => Number(v).toPrecision(3)} width={70} />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Scatter name="Z" data={pts} dataKey="z" fill="var(--primary)" />
                <Line name="Ajuste" data={fitLine} dataKey="fit" stroke="var(--pastel-foreground)" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Page>
  );
}
