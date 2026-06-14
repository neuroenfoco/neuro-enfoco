"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getEstudianteResumenIntegral,
  type EstudiantePACIEstadoResumen,
  type EstudianteResumenIntegral,
} from "@/lib/estudiante/estudiante-resumen-integral";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.estudiante;

type EstudianteResumenIntegralCardProps = {
  estudianteId: string;
};

const PACI_ESTADO_STYLES: Record<EstudiantePACIEstadoResumen, string> = {
  sin_paci: "bg-slate-100 text-slate-600 ring-slate-200",
  borrador: "bg-amber-50 text-amber-800 ring-amber-100",
  vigente: "bg-indigo-50 text-indigo-800 ring-indigo-100",
  cerrado: "bg-slate-100 text-slate-600 ring-slate-200",
};

const KPI_CONFIG = [
  {
    key: "objetivosPieActivos" as const,
    label: COPY.kpiObjetivosPieActivos,
    accent: "bg-violet-50 text-violet-700 ring-violet-100",
  },
  {
    key: "intervencionesRegistradas" as const,
    label: COPY.kpiIntervencionesRegistradas,
    accent: "bg-sky-50 text-sky-700 ring-sky-100",
  },
  {
    key: "evaluacionesIntegrales" as const,
    label: COPY.kpiEvaluacionesIntegrales,
    accent: "bg-teal-50 text-teal-700 ring-teal-100",
  },
  {
    key: "barrerasIdentificadas" as const,
    label: GLOSSARY.barrerasApoyos.resumenBarreras,
    accent: "bg-amber-50 text-amber-800 ring-amber-100",
  },
  {
    key: "apoyosSugeridos" as const,
    label: GLOSSARY.barrerasApoyos.resumenApoyos,
    accent: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  },
];

export function EstudianteResumenIntegralCard({
  estudianteId,
}: EstudianteResumenIntegralCardProps) {
  const [resumen, setResumen] = useState<EstudianteResumenIntegral | null>(null);

  const refresh = useCallback(() => {
    setResumen(getEstudianteResumenIntegral(estudianteId));
  }, [estudianteId]);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  if (!resumen) return null;

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-xl font-semibold text-white shadow-md shadow-teal-600/20">
            {resumen.iniciales}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700/80">
              {COPY.resumenIntegralTitulo}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {resumen.estudiante.nombre}
            </h1>
            <p className="mt-1 text-base text-slate-600">
              {resumen.estudiante.curso}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <p className="text-xs font-medium text-slate-500">{COPY.kpiPaciEstado}</p>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${PACI_ESTADO_STYLES[resumen.paciEstado]}`}
          >
            {resumen.paciEstadoLabel}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {KPI_CONFIG.map((kpi) => (
          <div
            key={kpi.key}
            className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
          >
            <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
              {resumen[kpi.key]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
