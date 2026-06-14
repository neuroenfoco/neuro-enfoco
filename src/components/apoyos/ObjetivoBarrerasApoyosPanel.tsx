"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import type { ApoyoResumen } from "@/lib/apoyos/barreras-apoyos-view";
import {
  getObjetivoBarrerasApoyosDetalleView,
  type ObjetivoBarrerasApoyosDetalleView,
} from "@/lib/apoyos/barreras-apoyos-view";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.barrerasApoyos;

type ObjetivoBarrerasApoyosPanelProps = {
  objetivoId: string;
  onCrearApoyoDesdeSugerido?: (apoyo: ApoyoResumen) => void;
};

export function ObjetivoBarrerasApoyosPanel({
  objetivoId,
  onCrearApoyoDesdeSugerido,
}: ObjetivoBarrerasApoyosPanelProps) {
  const [detalle, setDetalle] = useState<ObjetivoBarrerasApoyosDetalleView | null>(
    null
  );

  const refresh = useCallback(() => {
    setDetalle(getObjetivoBarrerasApoyosDetalleView(objetivoId));
  }, [objetivoId]);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  if (!detalle) return null;

  return (
    <section className="mt-6 space-y-6">
      <div className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/30 to-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-800/80">
          {COPY.porQueEsteObjetivo}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          {detalle.sustentoNarrativo}
        </p>
        {!detalle.tieneSustentoEvaluativo ? (
          <p className="mt-3 text-xs text-slate-500">{COPY.sinSustentoEvaluativo}</p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/40 to-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800/80">
          {COPY.barrerasRelacionadas}
        </p>
        {detalle.barreras.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">{COPY.sinBarreras}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {detalle.barreras.map((barrera) => (
              <li
                key={barrera.id}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
              >
                <span className="mr-2 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 ring-1 ring-inset ring-amber-100">
                  {barrera.origen === "conclusion"
                    ? COPY.origenConclusion
                    : COPY.origenHallazgo}
                </span>
                {barrera.descripcion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-teal-200/60 bg-gradient-to-br from-teal-50/30 to-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800/80">
          {COPY.apoyosRecomendados}
        </p>
        <p className="mt-1 text-xs text-slate-500">{COPY.apoyosRecomendadosAyuda}</p>
        {detalle.apoyosSugeridos.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">{COPY.sinApoyos}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {detalle.apoyosSugeridos.map((apoyo) => (
              <li
                key={apoyo.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <span className="font-medium text-slate-800">{apoyo.nombre}</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800 ring-1 ring-inset ring-teal-100">
                    {COPY.tipoApoyo(apoyo.tipo)}
                  </span>
                  {onCrearApoyoDesdeSugerido ? (
                    <button
                      type="button"
                      onClick={() => onCrearApoyoDesdeSugerido(apoyo)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      {GLOSSARY.apoyosImplementados.crearDesdeSugerido}
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
          {COPY.conclusionesRelacionadas}
        </p>
        <p className="mt-1 text-xs text-slate-500">{GLOSSARY.barrerasApoyos.trazabilidad}</p>
        {detalle.conclusionesRelacionadas.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            {GLOSSARY.planificacionEvaluativa.sinTrazabilidad}
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {detalle.conclusionesRelacionadas.map((conclusion) => (
              <li
                key={conclusion.id}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm"
              >
                <p className="font-medium text-slate-900">
                  {conclusion.prioridadLabel}
                </p>
                <p className="mt-1 text-slate-700">{conclusion.enunciado}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {conclusion.evaluacionTipoLabel} ·{" "}
                  {conclusion.evaluacionFechaReferencia}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
