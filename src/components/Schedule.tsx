import { useEffect, useState } from "react";

const DAYS: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const HOURS: string[] = [];
for (let h = 7; h <= 22; h++) {
  HOURS.push(`${h}:00`);
  if (h < 22) HOURS.push(`${h}:30`);
}
type Entry = { nombre: string; dia: string; inicio: string; fin: string };
const toMin = (t: string) => { const [h = 0, m = 0] = t.split(":").map(Number); return h * 60 + m; };

export function Schedule({ storageKey, nameLabel }: { storageKey: string; nameLabel: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [nombre, setNombre] = useState("");
  const [dia, setDia] = useState<string>(DAYS[0]!);
  const [inicio, setInicio] = useState<string>(HOURS[0]!);
  const [fin, setFin] = useState<string>(HOURS[2]!);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try { setEntries(JSON.parse(localStorage.getItem(storageKey) || "[]")); } catch { /* ignore */ }
  }, [storageKey]);
  const save = (e: Entry[]) => { setEntries(e); localStorage.setItem(storageKey, JSON.stringify(e)); };

  const same = (e: Entry) => e.nombre === nombre.trim() && e.dia === dia && e.inicio === inicio && e.fin === fin;
  const add = () => {
    if (!nombre.trim()) return setMsg("Escribe un nombre.");
    if (toMin(fin) <= toMin(inicio)) return setMsg("La hora de término debe ser posterior a la de inicio.");
    if (entries.some(same)) return setMsg("Ese registro ya existe.");
    save([...entries, { nombre: nombre.trim().slice(0, 60), dia, inicio, fin }]); setMsg("");
  };
  const del = () => {
    if (!entries.some(same)) return setMsg("No se encontró un registro con esos datos.");
    save(entries.filter((e) => !same(e))); setMsg("");
  };

  const sel = "w-full rounded-md border border-input bg-background px-3 py-2";
  return (
    <div className="flex flex-col gap-6">
      <div className="panel grid gap-4 p-5 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm font-semibold">{nameLabel}
          <input className={sel} value={nombre} maxLength={60} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">Día
          <select className={sel} value={dia} onChange={(e) => setDia(e.target.value)}>{DAYS.map((d) => <option key={d}>{d}</option>)}</select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">Hora inicio
          <select className={sel} value={inicio} onChange={(e) => setInicio(e.target.value)}>{HOURS.map((d) => <option key={d}>{d}</option>)}</select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">Hora término
          <select className={sel} value={fin} onChange={(e) => setFin(e.target.value)}>{HOURS.map((d) => <option key={d}>{d}</option>)}</select>
        </label>
        <div className="flex gap-4 sm:col-span-4">
          <button onClick={add} className="btn-3d flex-1 py-3">Add</button>
          <button onClick={del} className="btn-3d flex-1 py-3">Delete</button>
        </div>
        {msg && <p className="text-sm text-destructive sm:col-span-4">{msg}</p>}
      </div>

      <div className="panel overflow-x-auto p-3">
        <table className="w-full min-w-[600px] table-fixed border-collapse text-sm">
          <thead><tr><th className="w-16 p-2">Hora</th>{DAYS.map((d) => <th key={d} className="p-2">{d}</th>)}</tr></thead>
          <tbody>
            {HOURS.slice(0, -1).map((h) => (
              <tr key={h} className="border-t border-border">
                <td className="p-1 text-muted-foreground">{h}</td>
                {DAYS.map((d) => {
                  const here = entries.filter((e) => e.dia === d && toMin(e.inicio) <= toMin(h) && toMin(e.fin) > toMin(h));
                  return (
                    <td key={d} className="p-0.5 align-top">
                      {here.map((e, i) => (
                        <div key={i} className="mb-0.5 truncate rounded bg-pastel px-1 text-xs text-pastel-foreground" title={`${e.nombre} ${e.inicio}-${e.fin}`}>{e.nombre}</div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
