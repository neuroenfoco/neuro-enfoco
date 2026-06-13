"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import type { PACIEvaluacionReferenciaView } from "@/lib/paci/paci-view";
import { formatMarcoFechaDisplay } from "@/lib/marco-institucional-pie-storage";
import Link from "next/link";

const COPY = GLOSSARY.paci;

type PACIEvaluacionReferenciaPanelProps = {
  evaluacionReferencia?: PACIEvaluacionReferenciaView;
};

export function PACIEvaluacionReferenciaPanel({
  evaluacionReferencia,
}: PACIEvaluacionReferenciaPanelProps) {
  if (!evaluacionReferencia) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">
          {COPY.evaluacionReferencia}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{COPY.sinEvaluacionReferencia}</p>
      </section>
    );
  }

  const { evaluacion, tipoLabel, estadoLabel, fechaReferencia, observacionesEvaluacion } =
    evaluacionReferencia;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">
          {COPY.evaluacionReferencia}
        </h2>
        <Link
          href={ROUTES.evaluacionCaptura(evaluacion.id)}
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          Ver evaluación →
        </Link>
      </div>

      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium text-slate-500">Tipo</dt>
          <dd className="mt-0.5 text-sm font-semibold text-slate-900">{tipoLabel}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Estado</dt>
          <dd className="mt-0.5 text-sm font-semibold text-slate-900">{estadoLabel}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Fecha de referencia</dt>
          <dd className="mt-0.5 text-sm font-semibold text-slate-900">
            {formatMarcoFechaDisplay(fechaReferencia)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Conclusiones / Hallazgos</dt>
          <dd className="mt-0.5 text-sm font-semibold text-slate-900">
            {evaluacionReferencia.cantidadConclusiones} /{" "}
            {evaluacionReferencia.cantidadHallazgos}
          </dd>
        </div>
      </dl>

      {evaluacionReferencia.sinConclusiones ? (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
          {COPY.sinConclusionesEvaluacion}
        </p>
      ) : null}

      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {COPY.observacionesEvaluacion}
        </p>
        <p className="mt-1 text-xs text-slate-500">{COPY.observacionesEvaluacionAyuda}</p>
        <p className="mt-2 text-sm text-slate-800 whitespace-pre-wrap">
          {observacionesEvaluacion ?? "—"}
        </p>
      </div>
    </section>
  );
}
