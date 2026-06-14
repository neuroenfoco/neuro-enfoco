"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import type {
  EstadoSeguimientoObjetivo,
  ObjetivoSeguimiento,
} from "@/lib/objetivos/objetivo-seguimiento";
import Link from "next/link";

const COPY = GLOSSARY.objetivo.seguimiento;

type ObjetivoSeguimientoCardProps = {
  seguimiento: ObjetivoSeguimiento;
  estudianteId?: string;
};

const ESTADO_STYLES: Record<
  EstadoSeguimientoObjetivo,
  { badge: string; label: string }
> = {
  activo: {
    badge: "bg-emerald-50 text-emerald-800 ring-emerald-100",
    label: COPY.estadoActivo,
  },
  atencion: {
    badge: "bg-amber-50 text-amber-800 ring-amber-100",
    label: COPY.estadoAtencion,
  },
  riesgo: {
    badge: "bg-rose-50 text-rose-800 ring-rose-100",
    label: COPY.estadoRiesgo,
  },
  sin_seguimiento: {
    badge: "bg-slate-100 text-slate-600 ring-slate-200",
    label: COPY.estadoSinSeguimiento,
  },
};

export function ObjetivoSeguimientoCard({
  seguimiento,
  estudianteId,
}: ObjetivoSeguimientoCardProps) {
  const estado = ESTADO_STYLES[seguimiento.estadoSeguimiento];

  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-900">
            {seguimiento.objetivoNombre}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${estado.badge}`}
        >
          {estado.label}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium text-slate-500">
            {COPY.intervencionesRegistradas}
          </dt>
          <dd className="mt-0.5 text-lg font-semibold tabular-nums text-slate-900">
            {seguimiento.cantidadIntervenciones}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">
            {COPY.evidenciasRegistradas}
          </dt>
          <dd className="mt-0.5 text-lg font-semibold tabular-nums text-slate-900">
            {seguimiento.cantidadEvidencias}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">
            {COPY.ultimaActividad}
          </dt>
          <dd className="mt-0.5 text-sm font-medium text-slate-800">
            {seguimiento.ultimaActividadLabel ?? COPY.sinActividad}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/objetivos/${seguimiento.objetivoId}`}
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          {COPY.verObjetivo}
        </Link>
        {estudianteId ? (
          <Link
            href={`/estudiantes/${estudianteId}?tab=sesiones`}
            className="text-sm font-medium text-slate-600 hover:text-slate-800"
          >
            {COPY.registrarSeguimiento}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
