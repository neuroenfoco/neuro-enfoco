"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import type { PACIObjetivoEnriquecido } from "@/lib/paci/paci-view";
import Link from "next/link";

const COPY = GLOSSARY.paci;

type PACIObjetivoTrazabilidadBlockProps = {
  item: PACIObjetivoEnriquecido;
};

export function PACIObjetivoTrazabilidadBlock({
  item,
}: PACIObjetivoTrazabilidadBlockProps) {
  const { trazabilidad, dimensionProyectada, paciObjetivo } = item;
  const { objetivo } = trazabilidad;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500">
            Objetivo #{paciObjetivo.orden + 1}
          </p>
          <h3 className="mt-0.5 text-base font-semibold text-slate-900">
            {objetivo.nombre}
          </h3>
          {objetivo.metaLogro ? (
            <p className="mt-1 text-sm text-slate-600">{objetivo.metaLogro}</p>
          ) : null}
        </div>
        <Link
          href={`/objetivos/${objetivo.id}`}
          className="shrink-0 text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          Ver objetivo →
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {dimensionProyectada ? (
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-800 ring-1 ring-inset ring-indigo-100">
            {COPY.dimensionProyectada}: {dimensionProyectada.nombre}
          </span>
        ) : null}
        <span
          className={
            trazabilidad.tieneSustentoEvaluativo
              ? "rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-100"
              : "rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-100"
          }
        >
          {trazabilidad.tieneSustentoEvaluativo
            ? COPY.conSustentoEvaluativo
            : COPY.sinSustentoEvaluativo}
        </span>
      </div>

      {trazabilidad.conclusiones.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">{COPY.sinSustentoEvaluativo}</p>
      ) : (
        <div className="mt-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {COPY.trazabilidadTitulo}
          </p>
          {trazabilidad.conclusiones.map((conclusion) => (
            <div
              key={conclusion.id}
              className="rounded-xl border border-violet-100 bg-violet-50/40 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-violet-900">
                  {conclusion.prioridadLabel}
                </span>
                {conclusion.dimensionLabel ? (
                  <span className="text-xs text-violet-700">{conclusion.dimensionLabel}</span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-slate-800">{conclusion.enunciado}</p>

              {conclusion.hallazgosSustentantes.length > 0 ? (
                <div className="mt-3">
                  <p className="text-xs font-medium text-slate-500">
                    {COPY.hallazgosSustentantes}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {conclusion.hallazgosSustentantes.map((hallazgo) => (
                      <li
                        key={hallazgo.id}
                        className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-700"
                      >
                        <span className="font-medium text-slate-900">
                          {hallazgo.tipoLabel}
                        </span>
                        {hallazgo.nombre ? (
                          <span className="text-slate-600"> · {hallazgo.nombre}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
