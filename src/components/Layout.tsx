import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import ccBadge from "@/assets/cc-by-nc-badge.png";

export function Footer() {
  return (
    <footer className="mt-12 flex flex-col items-center gap-3 px-4 pb-8 text-center text-sm text-foreground/80">
      <p className="max-w-xl">
        This project was founded by PAPIT-UNAM, PAPIME-UNAM and SECIHTI. We thank DGAPA for postdoctoral fellowship.
      </p>
        <img src={ccBadge} alt="CC BY-NC 4.0" width={1584} height={672} loading="lazy" className="h-14 w-auto" />
      <p className="max-w-xl">
        This work is licensed under{" "}
        <a
          href="https://creativecommons.org/licenses/by-nc/4.0/"
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-full border border-foreground/30 px-3 py-0.5 font-medium text-foreground transition-colors hover:border-foreground/60 hover:bg-foreground/5"
        >
          CC BY-NC 4.0
        </a>
      </p>
    </footer>
  );
}

export function Page({ title, back, children }: { title: ReactNode; back?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-8">
        {back && (
          <Link to={back} className="text-sm font-semibold text-primary hover:underline">
            ← Volver
          </Link>
        )}
        <h1 className="mt-4 mb-6 text-center text-3xl font-bold text-foreground md:text-4xl">{title}</h1>
        {children}
      </main>
      <Footer />
    </div>
  );
}
