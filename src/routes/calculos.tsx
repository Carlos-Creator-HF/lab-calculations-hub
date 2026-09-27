import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/Layout";
import { CALCS } from "@/lib/calcs";

export const Route = createFileRoute("/calculos")({
  head: () => ({
    meta: [
      { title: "Cálculos — Lab" },
      { name: "description", content: "Determinación de volumen y curvas de calibración de H2, CO, CO2, CH4 y termómetro." },
      { property: "og:title", content: "Cálculos — Lab" },
      { property: "og:description", content: "Curvas de calibración con ajuste lineal y gráfica." },
    ],
  }),
  component: () => (
    <Page title="Cálculos" back="/">
      <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
        {CALCS.map((c) => (
          <Link key={c.id} to="/calc/$id" params={{ id: c.id }} className="btn-3d px-4 py-5 text-lg">{c.title}</Link>
        ))}
      </div>
    </Page>
  ),
});
