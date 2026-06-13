"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import {
  formatMarcoFechaDisplay,
  getMarcoInstitucionalPIEByEstudianteId,
  type MarcoInstitucionalPIE,
} from "@/lib/marco-institucional-pie-storage";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.ingresoPie;

type MarcoInstitucionalResumenProps = {
  estudianteId: string;
};

export function MarcoInstitucionalResumen({
  estudianteId,
}: MarcoInstitucionalResumenProps) {
  const [marco, setMarco] = useState<MarcoInstitucionalPIE | null>(null);

  const refresh = useCallback(() => {
    setMarco(getMarcoInstitucionalPIEByEstudianteId(estudianteId));
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

  if (!marco) return null;

  return (
    <section className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/40 via-white to-indigo-50/20 p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-violet-800">
        {COPY.marcoResumenTitulo}
      </p>
      <p className="mt-1 text-sm text-slate-600">{COPY.marcoResumenSubtitulo}</p>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium text-slate-500">{COPY.fechaIngreso}</dt>
          <dd className="mt-0.5 text-sm font-semibold text-slate-900">
            {formatMarcoFechaDisplay(marco.fechaIngresoPIE)}
          </dd>
        </div>
        {marco.fechaProximaReevaluacionIntegral ? (
          <div>
            <dt className="text-xs font-medium text-slate-500">
              {COPY.proximaReevaluacion}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-900">
              {formatMarcoFechaDisplay(marco.fechaProximaReevaluacionIntegral)}
            </dd>
          </div>
        ) : null}
        {marco.tipoNEE ? (
          <div>
            <dt className="text-xs font-medium text-slate-500">{COPY.tipoNee}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-900">
              {marco.tipoNEE}
            </dd>
          </div>
        ) : null}
        {marco.diagnosticoPrincipal ? (
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-slate-500">
              {COPY.diagnosticoPrincipal}
            </dt>
            <dd className="mt-0.5 text-sm text-slate-800">
              {marco.diagnosticoPrincipal}
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
