import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/Layout";
import { Schedule } from "@/components/Schedule";

export const Route = createFileRoute("/horarios/equipos")({
  head: () => ({
    meta: [
      { title: "Horario de Equipos — Lab" },
      { name: "description", content: "Reserva de equipos del laboratorio por día y hora." },
      { property: "og:title", content: "Horario de Equipos — Lab" },
      { property: "og:description", content: "Reserva de equipos del laboratorio por día y hora." },
    ],
  }),
  component: () => (
    <Page title="Equipos" back="/horarios">
      <Schedule storageKey="lab-equipos" nameLabel="Nombre" />
    </Page>
  ),
});
