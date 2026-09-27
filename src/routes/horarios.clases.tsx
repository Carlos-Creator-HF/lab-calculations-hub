import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/Layout";
import { Schedule } from "@/components/Schedule";

export const Route = createFileRoute("/horarios/clases")({
  head: () => ({
    meta: [
      { title: "Horario de Clases — Lab" },
      { name: "description", content: "Agrega y elimina clases en el horario semanal del laboratorio." },
      { property: "og:title", content: "Horario de Clases — Lab" },
      { property: "og:description", content: "Agrega y elimina clases en el horario semanal." },
    ],
  }),
  component: () => (
    <Page title="Clases" back="/horarios">
      <Schedule storageKey="lab-clases" nameLabel="Nombre" />
    </Page>
  ),
});
