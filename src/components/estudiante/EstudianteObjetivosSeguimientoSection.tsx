"use client";

import { ObjetivoSeguimientoCard } from "@/components/objetivos/ObjetivoSeguimientoCard";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  buildEstudianteSeguimientoResumen,
  getEstudianteObjetivosSeguimiento,
  type EstudianteSeguimientoResumen,
  type ObjetivoSeguimiento,
} from "@/lib/objetivos/objetivo-seguimiento";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.estudiante.seguimientoObjetivos;

type EstudianteObjetivosSeguimientoSectionProps = {
  estudianteId: string;
  onIrIntervenciones?: () => void;
};

const RESUMEN_CONFIG: {
  key: keyof EstudianteSeguimientoResumen;
  label: string;
  accent: string;
}[] = [
  {
    key: "objetivosActivos",
    label: COPY.resumenActivos,
    accent: "text-slate-900",
  },
  {
    key: "objetivosConSeguimiento",
    label: COPY.resumenConSeguimiento,
    accent: "text-teal-800",
  },
  {
    key: "objetivosSeguimientoActivo",
    label: COPY.resumenSeguimientoActivo,
    accent: "text-emerald-800",
  },
  {
    key: "objetivosEnAtencion",
    label: COPY.resumenEnAtencion,
    accent: "text-amber-800",
  },
  {
    key: "objetivosEnRiesgo",
    label: COPY.resumenEnRiesgo,
    accent: "text-rose-800",
  },
];

export function EstudianteObjetivosSeguimientoSection({
  estudianteId,
  onIrIntervenciones,
}: EstudianteObjetivosSeguimientoSectionProps) {
  const [items, setItems] = useState<ObjetivoSeguimiento[]>([]);
  const [resumen, setResumen] = useState<EstudianteSeguimientoResumen | null>(
    null
  );

  const refresh = useCallback(() => {
    const nextItems = getEstudianteObjetivosSeguimiento(estudianteId);
    setItems(nextItems);
    setResumen(buildEstudianteSeguimientoResumen(nextItems));
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            {COPY.titulo}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{COPY.subtitulo}</p>
        </div>
        {onIrIntervenciones ? (
          <button
            type="button"
            onClick={onIrIntervenciones}
            className="text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            {COPY.irIntervenciones}
          </button>
        ) : (
          <Link
            href={`/estudiantes/${estudianteId}?tab=sesiones`}
            className="text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            {COPY.irIntervenciones}
          </Link>
        )}
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {RESUMEN_CONFIG.map((item) => (
          <div
            key={item.key}
            className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
          >
            <dt className="text-xs font-medium text-slate-500">{item.label}</dt>
            <dd className={`mt-1 text-2xl font-semibold tabular-nums ${item.accent}`}>
              {resumen[item.key]}
            </dd>
          </div>
        ))}
      </dl>

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-slate-600">{COPY.sinObjetivos}</p>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <ObjetivoSeguimientoCard
              key={item.objetivoId}
              seguimiento={item}
              estudianteId={estudianteId}
            />
          ))}
        </div>
      )}
    </section>
  );
}
