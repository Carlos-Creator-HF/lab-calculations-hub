import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Page } from "@/components/Layout";
import { EQUIPOS } from "@/lib/equipos";

export const Route = createFileRoute("/horarios/equipo/$id")({
  loader: ({ params }) => {
    const e = EQUIPOS.find((x) => x.id === params.id);
    if (!e) throw notFound();
    return { id: e.id, label: e.label };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.label} — Reservas Lab` : "No encontrado";
    return {
      meta: [
        { title: t },
        { name: "description", content: `Calendario mensual de reservas de ${loaderData?.label ?? "equipo"} (mañana y tarde).` },
        { property: "og:title", content: t },
        { property: "og:description", content: "Calendario mensual de reservas del equipo." },
      ],
    };
  },
  component: EquipoPage,
});

const YEAR = 2026;
const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const WEEK = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const TURNOS = ["Mañana", "Tarde"] as const;
type Entry = { nombre: string; mes: number; dia: number; turno: string };

const daysIn = (m: number) => new Date(YEAR, m + 1, 0).getDate();
const weekday = (m: number, d: number) => (new Date(YEAR, m, d).getDay() + 6) % 7; // 0 = Lunes

function EquipoPage() {
  const { id, label } = Route.useLoaderData();
  const key = `lab-equipo-${id}`;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [nombre, setNombre] = useState("");
  const [mes, setMes] = useState(new Date().getMonth());
  const [dia, setDia] = useState(1);
  const [turno, setTurno] = useState<string>("Mañana");
  const [shown, setShown] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try { setEntries(JSON.parse(localStorage.getItem(key) || "[]")); } catch { /* ignore */ }
  }, [key]);
  const save = (e: Entry[]) => { setEntries(e); localStorage.setItem(key, JSON.stringify(e)); };

  const n = daysIn(mes);
  const d = Math.min(dia, n);
  const same = (e: Entry) => e.nombre === nombre.trim() && e.mes === mes && e.dia === d && e.turno === turno;

  const add = () => {
    if (!nombre.trim()) return setMsg("Escribe tu nombre.");
    if (entries.some(same)) return setMsg("Ese registro ya existe.");
    save([...entries, { nombre: nombre.trim().slice(0, 60), mes, dia: d, turno }]);
    setShown(mes); setMsg("");
  };
  const del = () => {
    if (!entries.some(same)) return setMsg("No se encontró un registro con esos datos.");
    save(entries.filter((e) => !same(e))); setShown(mes); setMsg("");
  };

  const sel = "w-full rounded-md border border-input bg-background px-3 py-2";
  return (
    <Page title={label} back="/horarios/equipos">
      <div className="flex flex-col gap-6">
        <div className="panel grid gap-4 p-5 sm:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm font-semibold">Nombre
            <input className={sel} value={nombre} maxLength={60} onChange={(e) => setNombre(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">Mes
            <select className={sel} value={mes} onChange={(e) => setMes(Number(e.target.value))}>
              {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">Día
            <select className={sel} value={d} onChange={(e) => setDia(Number(e.target.value))}>
              {Array.from({ length: n }, (_, i) => i + 1).map((x) => (
                <option key={x} value={x}>{WEEK[weekday(mes, x)]} {x}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">Horario
            <select className={sel} value={turno} onChange={(e) => setTurno(e.target.value)}>
              {TURNOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <div className="flex gap-4 sm:col-span-4">
            <button onClick={() => setShown(mes)} className="btn-3d flex-1 py-3">Mostrar</button>
            <button onClick={add} className="btn-3d flex-1 py-3">Agregar</button>
            <button onClick={del} className="btn-3d flex-1 py-3">Delete</button>
          </div>
          {msg && <p className="text-sm text-destructive sm:col-span-4">{msg}</p>}
        </div>

        {shown !== null && (
          <div className="panel overflow-x-auto p-3">
            <h2 className="mb-3 text-center text-xl font-bold">{MONTHS[shown]} {YEAR}</h2>
            <div className="grid min-w-[700px] grid-cols-7 gap-1 text-xs">
              {WEEK.map((w) => <div key={w} className="p-1 text-center font-bold">{w}</div>)}
              {Array.from({ length: weekday(shown, 1) }, (_, i) => <div key={`b${i}`} />)}
              {Array.from({ length: daysIn(shown) }, (_, i) => i + 1).map((day) => (
                <div key={day} className="min-h-24 rounded-md border border-border bg-background/60 p-1">
                  <div className="font-bold">{day}</div>
                  {TURNOS.map((t) => {
                    const who = entries.filter((e) => e.mes === shown && e.dia === day && e.turno === t);
                    return (
                      <div key={t} className={`mt-1 rounded px-1 ${who.length ? "bg-pastel text-pastel-foreground" : "bg-muted text-muted-foreground"}`}>
                        <span className="font-semibold">{t}:</span> {who.length ? who.map((e) => e.nombre).join(", ") : "Disponible"}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}
