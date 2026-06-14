"use client";

import { ObjetivoBarrerasApoyosCard } from "@/components/apoyos/ObjetivoBarrerasApoyosCard";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getEstudianteBarrerasApoyosResumen,
  getEstudianteObjetivosBarrerasApoyos,
  type EstudianteBarrerasApoyosResumen,
  type ObjetivoBarrerasApoyosView,
} from "@/lib/apoyos/barreras-apoyos-view";
import { getEstudianteObjetivosSeguimiento } from "@/lib/objetivos/objetivo-seguimiento";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.barrerasApoyos;

type EstudianteBarrerasApoyosSectionProps = {
  estudianteId: string;
};

const RESUMEN_CONFIG: {
  key: keyof EstudianteBarrerasApoyosResumen;
  label: string;
  accent: string;
}[] = [
  {
    key: "cantidadBarrerasIdentificadas",
    label: COPY.resumenBarreras,
    accent: "text-amber-800",
  },
  {
    key: "cantidadApoyosSugeridos",
    label: COPY.resumenApoyos,
    accent: "text-teal-800",
  },
  {
    key: "objetivosConSustentoEvaluativo",
    label: COPY.resumenConSustento,
    accent: "text-violet-800",
  },
  {
    key: "objetivosSinSustentoEvaluativo",
    label: COPY.resumenSinSustento,
    accent: "text-slate-700",
  },
];

export function EstudianteBarrerasApoyosSection({
  estudianteId,
}: EstudianteBarrerasApoyosSectionProps) {
  const [items, setItems] = useState<ObjetivoBarrerasApoyosView[]>([]);
  const [resumen, setResumen] = useState<EstudianteBarrerasApoyosResumen | null>(
    null
  );
  const [seguimientoByObjetivo, setSeguimientoByObjetivo] = useState<
    Map<string, ReturnType<typeof getEstudianteObjetivosSeguimiento>[number]>
  >(new Map());

  const refresh = useCallback(() => {
    setItems(getEstudianteObjetivosBarrerasApoyos(estudianteId));
    setResumen(getEstudianteBarrerasApoyosResumen(estudianteId));
    const seguimiento = getEstudianteObjetivosSeguimiento(estudianteId);
    setSeguimientoByObjetivo(
      new Map(seguimiento.map((item) => [item.objetivoId, item]))
    );
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
        <Link
          href={`/estudiantes/${estudianteId}?tab=evaluacion-integral`}
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          {COPY.irEvaluacion}
        </Link>
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          {items.map((item) => {
            const seguimiento = seguimientoByObjetivo.get(item.objetivoId);
            if (!seguimiento) return null;
            return (
              <ObjetivoBarrerasApoyosCard
                key={item.objetivoId}
                view={item}
                seguimiento={seguimiento}
                estudianteId={estudianteId}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
