import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/Layout";

export const Route = createFileRoute("/horarios/")({
  head: () => ({
    meta: [
      { title: "Horarios — Lab" },
      { name: "description", content: "Horarios de clases y equipos del laboratorio." },
      { property: "og:title", content: "Horarios — Lab" },
      { property: "og:description", content: "Horarios de clases y equipos del laboratorio." },
    ],
  }),
  component: () => (
    <Page title="Horarios" back="/">
      <div className="mx-auto flex max-w-md flex-col gap-6 sm:flex-row">
        <Link to="/horarios/clases" className="btn-3d flex-1 py-6 text-2xl">Clases</Link>
        <Link to="/horarios/equipos" className="btn-3d flex-1 py-6 text-2xl">Equipos</Link>
      </div>
    </Page>
  ),
});
