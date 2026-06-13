"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getEvaluacionConDetalle,
  getEvaluacionVigente,
} from "@/lib/evaluacion-integral/evaluacion-integral-view";
import { formatMarcoFechaDisplay } from "@/lib/marco-institucional-pie-storage";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.evaluacionIntegral;

type EvaluacionIntegralResumenCardProps = {
  estudianteId: string;
  onVerEvaluacion?: () => void;
};

export function EvaluacionIntegralResumenCard({
  estudianteId,
  onVerEvaluacion,
}: EvaluacionIntegralResumenCardProps) {
  const [resumen, setResumen] = useState(() => {
    if (typeof window === "undefined") return null;
    const vigente = getEvaluacionVigente(estudianteId);
    if (!vigente) return null;
    return getEvaluacionConDetalle(vigente.id)?.resumen ?? null;
  });

  const refresh = useCallback(() => {
    const vigente = getEvaluacionVigente(estudianteId);
    if (!vigente) {
      setResumen(null);
      return;
    }
    setResumen(getEvaluacionConDetalle(vigente.id)?.resumen ?? null);
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
    <section className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/50 via-white to-indigo-50/30 p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-violet-800">
        {COPY.resumenTitulo}
      </p>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs font-medium text-slate-500">{COPY.tipo}</dt>
          <dd className="mt-0.5 text-sm font-semibold text-slate-900">
            {resumen.tipoLabel}
          </dd>
          <dd className="mt-0.5 text-xs text-slate-500">{resumen.estadoLabel}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">
            {COPY.fechaCierre}
          </dt>
          <dd className="mt-0.5 text-sm font-semibold text-slate-900">
            {resumen.fechaCierre
              ? formatMarcoFechaDisplay(resumen.fechaCierre)
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">
            {COPY.responsableProceso}
          </dt>
          <dd className="mt-0.5 text-sm font-semibold text-slate-900">
            {resumen.responsableProceso?.profesionalNombre ?? COPY.sinResponsable}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">
            {COPY.hallazgosConsolidados}
          </dt>
          <dd className="mt-0.5 text-sm font-semibold text-slate-900">
            {resumen.cantidadHallazgosConsolidados}
          </dd>
        </div>
      </dl>
      {onVerEvaluacion ? (
        <button
          type="button"
          onClick={onVerEvaluacion}
          className="mt-5 text-sm font-medium text-violet-700 hover:text-violet-900"
        >
          {COPY.verEvaluacion}
        </button>
      ) : (
        <Link
          href={`/estudiantes/${estudianteId}?tab=evaluacion-integral`}
          className="mt-5 inline-block text-sm font-medium text-violet-700 hover:text-violet-900"
        >
          {COPY.verEvaluacion}
        </Link>
      )}
    </section>
  );
}
