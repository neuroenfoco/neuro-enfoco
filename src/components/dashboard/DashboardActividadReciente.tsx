"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import type { DashboardActividadRecienteItem } from "@/lib/dashboard/dashboard-view";
import Link from "next/link";

const COPY = GLOSSARY.dashboard.actividadReciente;

const TIPO_ACCENT: Record<DashboardActividadRecienteItem["tipo"], string> = {
  evaluacion: "bg-sky-50 text-sky-700",
  intervencion: "bg-teal-50 text-teal-700",
  paci_vigente: "bg-violet-50 text-violet-700",
  paci_cerrado: "bg-slate-100 text-slate-700",
};

type DashboardActividadRecienteProps = {
  items: DashboardActividadRecienteItem[];
};

export function DashboardActividadReciente({
  items,
}: DashboardActividadRecienteProps) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {COPY.titulo}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{COPY.subtitulo}</p>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-sm text-slate-600">
          {COPY.sinActividad}
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50/60 to-transparent px-4 py-3 transition hover:border-teal-100"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TIPO_ACCENT[item.tipo]}`}
                >
                  {item.tipoLabel}
                </span>
                <span className="text-xs text-slate-400">{item.fechaDisplay}</span>
                {item.estudianteId ? (
                  <Link
                    href={`/estudiantes/${item.estudianteId}`}
                    className="ml-auto text-xs font-medium text-teal-700 hover:text-teal-800"
                  >
                    Ver estudiante
                  </Link>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {item.resumen}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
