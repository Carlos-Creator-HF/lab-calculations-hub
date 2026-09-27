import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lab — Horarios y Cálculos" },
      { name: "description", content: "Laboratorio: horarios de clases y equipos, y cálculos de curvas de calibración." },
      { property: "og:title", content: "Lab — Horarios y Cálculos" },
      { property: "og:description", content: "Horarios de laboratorio y curvas de calibración con ajuste lineal." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-4 pt-10">
        <h1 className="title-box px-16 py-8 text-6xl font-bold md:text-7xl">Lab</h1>
        <div className="flex w-full max-w-md flex-col gap-6 sm:flex-row">
          <Link to="/horarios" className="btn-3d flex-1 py-6 text-2xl">Horarios</Link>
          <Link to="/calculos" className="btn-3d flex-1 py-6 text-2xl">Cálculos</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
