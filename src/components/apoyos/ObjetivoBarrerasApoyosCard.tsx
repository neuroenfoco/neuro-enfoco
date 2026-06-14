"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import type { ObjetivoBarrerasApoyosView } from "@/lib/apoyos/barreras-apoyos-view";
import type {
  EstadoSeguimientoObjetivo,
  ObjetivoSeguimiento,
} from "@/lib/objetivos/objetivo-seguimiento";
import Link from "next/link";

const COPY = GLOSSARY.barrerasApoyos;
const SEGUIMIENTO_COPY = GLOSSARY.objetivo.seguimiento;

type ObjetivoBarrerasApoyosCardProps = {
  view: ObjetivoBarrerasApoyosView;
  seguimiento: ObjetivoSeguimiento;
  estudianteId?: string;
};

const ESTADO_STYLES: Record<
  EstadoSeguimientoObjetivo,
  { badge: string; label: string }
> = {
  activo: {
    badge: "bg-emerald-50 text-emerald-800 ring-emerald-100",
    label: SEGUIMIENTO_COPY.estadoActivo,
  },
  atencion: {
    badge: "bg-amber-50 text-amber-800 ring-amber-100",
    label: SEGUIMIENTO_COPY.estadoAtencion,
  },
  riesgo: {
    badge: "bg-rose-50 text-rose-800 ring-rose-100",
    label: SEGUIMIENTO_COPY.estadoRiesgo,
  },
  sin_seguimiento: {
    badge: "bg-slate-100 text-slate-600 ring-slate-200",
    label: SEGUIMIENTO_COPY.estadoSinSeguimiento,
  },
};

export function ObjetivoBarrerasApoyosCard({
  view,
  seguimiento,
  estudianteId,
}: ObjetivoBarrerasApoyosCardProps) {
  const estado = ESTADO_STYLES[seguimiento.estadoSeguimiento];

  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-900">
            {view.objetivoNombre}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${estado.badge}`}
        >
          {estado.label}
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {COPY.barrerasIdentificadas}
          </p>
          {view.barreras.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">{COPY.sinBarreras}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {view.barreras.map((barrera) => (
                <li
                  key={barrera.id}
                  className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 text-sm text-slate-700"
                >
                  {barrera.descripcion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {COPY.apoyosSugeridos}
          </p>
          {view.apoyosSugeridos.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">{COPY.sinApoyos}</p>
          ) : (
            <ul className="mt-2 flex flex-wrap gap-2">
              {view.apoyosSugeridos.map((apoyo) => (
                <li
                  key={apoyo.id}
                  className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800 ring-1 ring-inset ring-teal-100"
                >
                  {apoyo.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <dl className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium text-slate-500">
            {SEGUIMIENTO_COPY.intervencionesRegistradas}
          </dt>
          <dd className="mt-0.5 text-lg font-semibold tabular-nums text-slate-900">
            {seguimiento.cantidadIntervenciones}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">
            {SEGUIMIENTO_COPY.evidenciasRegistradas}
          </dt>
          <dd className="mt-0.5 text-lg font-semibold tabular-nums text-slate-900">
            {seguimiento.cantidadEvidencias}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/objetivos/${view.objetivoId}`}
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          {COPY.verDetalleObjetivo}
        </Link>
        {estudianteId ? (
          <Link
            href={`/estudiantes/${estudianteId}?tab=evaluacion-integral`}
            className="text-sm font-medium text-slate-600 hover:text-slate-800"
          >
            {COPY.verEvaluacion}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
