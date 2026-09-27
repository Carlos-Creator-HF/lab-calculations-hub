import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/Layout";
import { EQUIPOS } from "@/lib/equipos";

export const Route = createFileRoute("/horarios/equipos")({
  head: () => ({
    meta: [
      { title: "Horario de Equipos — Lab" },
      { name: "description", content: "Elige un equipo del laboratorio para reservarlo." },
      { property: "og:title", content: "Horario de Equipos — Lab" },
      { property: "og:description", content: "Reserva de equipos del laboratorio." },
    ],
  }),
  component: () => (
    <Page title="Equipos" back="/horarios">
      <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
        {EQUIPOS.map((e, i) => (
          <Link key={e.id} to="/horarios/equipo/$id" params={{ id: e.id }} className="btn-3d px-4 py-5 text-lg">
            {i + 1}. {e.label}
          </Link>
        ))}
      </div>
    </Page>
  ),
});
