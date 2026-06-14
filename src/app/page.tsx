import { DashboardInstitucional } from "@/components/dashboard/DashboardInstitucional";
import { AppShell } from "@/components/layout/app-shell";
import { CalendarIcon } from "@/components/layout/nav-icons";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import Link from "next/link";

export default function Home() {
  return (
    <AppShell activeNav="dashboard">
      <header className="sticky top-0 z-20 border-b border-teal-900/5 bg-[#f4f7f6]/90 px-8 py-5 backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-teal-200/60 bg-teal-50/80 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-teal-800">
              <LeafIcon className="h-3 w-3" />
              Gestión PIE
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {GLOSSARY.dashboard.titulo}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
              {GLOSSARY.dashboard.subtitulo}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/30"
            >
              <CalendarIcon className="h-4 w-4 text-teal-600/70" />
              Junio 2026
            </button>
            <Link
              href={ROUTES.intervencionesNueva}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700"
            >
              {GLOSSARY.intervencion.registrarCta}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-8 py-8">
        <DashboardInstitucional />
      </main>
    </AppShell>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 18 2c1 2 2 4.5 2 8 0 5.5-4.5 10-9 10Z" />
      <path d="M2 21c0-3 1.5-5 5-5" />
    </svg>
  );
}
