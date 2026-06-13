"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { readEvaluacionesIntegrales } from "@/lib/evaluacion-integral/evaluacion-integral-persistence";
import {
  getConclusionesEvaluativasViewByEvaluacionId,
  getEvaluacionIntegralEstadoLabel,
  getEvaluacionIntegralTipoLabel,
  getFechaReferenciaEvaluacion,
} from "@/lib/evaluacion-integral/evaluacion-integral-view";
import {
  getUltimaEvaluacionCerradaId,
  mapConclusionDimensionToObjetivoDimension,
} from "@/lib/evaluacion-integral/planificacion-evaluativa-view";
import { useEffect, useMemo } from "react";

const COPY = GLOSSARY.planificacionEvaluativa;

type ObjetivoSustentadoEnEvaluacionBlockProps = {
  estudianteId: string;
  evaluacionOrigenId: string;
  conclusionEvaluativaIds: string[];
  onEvaluacionOrigenChange: (evaluacionId: string) => void;
  onConclusionesChange: (ids: string[]) => void;
  onDimensionSugerida?: (dimension: string) => void;
};

export function ObjetivoSustentadoEnEvaluacionBlock({
  estudianteId,
  evaluacionOrigenId,
  conclusionEvaluativaIds,
  onEvaluacionOrigenChange,
  onConclusionesChange,
  onDimensionSugerida,
}: ObjetivoSustentadoEnEvaluacionBlockProps) {
  const evaluaciones = useMemo(() => {
    if (!estudianteId) return [];
    return readEvaluacionesIntegrales()
      .filter((item) => item.estudianteId === estudianteId)
      .sort((a, b) =>
        getFechaReferenciaEvaluacion(b).localeCompare(
          getFechaReferenciaEvaluacion(a)
        )
      );
  }, [estudianteId]);

  const conclusiones = useMemo(() => {
    if (!evaluacionOrigenId) return [];
    return getConclusionesEvaluativasViewByEvaluacionId(evaluacionOrigenId);
  }, [evaluacionOrigenId, conclusionEvaluativaIds.join(",")]);

  useEffect(() => {
    if (!estudianteId || evaluacionOrigenId) return;
    const ultimaCerrada = getUltimaEvaluacionCerradaId(estudianteId);
    if (ultimaCerrada) {
      onEvaluacionOrigenChange(ultimaCerrada);
    } else if (evaluaciones[0]) {
      onEvaluacionOrigenChange(evaluaciones[0].id);
    }
  }, [estudianteId, evaluacionOrigenId, evaluaciones, onEvaluacionOrigenChange]);

  function toggleConclusion(id: string) {
    const next = conclusionEvaluativaIds.includes(id)
      ? conclusionEvaluativaIds.filter((item) => item !== id)
      : [...conclusionEvaluativaIds, id];
    onConclusionesChange(next);

    if (next.length === 1) {
      const conclusion = conclusiones.find((item) => item.id === next[0]);
      const dimension = mapConclusionDimensionToObjetivoDimension(
        conclusion?.dimensionId
      );
      if (dimension && onDimensionSugerida) {
        onDimensionSugerida(dimension);
      }
    }
  }

  if (!estudianteId) return null;

  return (
    <div className="rounded-xl border border-violet-200/70 bg-violet-50/30 p-4 sm:p-5">
      <p className="text-sm font-semibold text-violet-900">{COPY.sustentadoTitulo}</p>
      <p className="mt-1 text-xs text-violet-800/80">{COPY.sustentadoSubtitulo}</p>

      {evaluaciones.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">{COPY.sinEvaluaciones}</p>
      ) : (
        <>
          <label className="mt-4 block text-sm font-medium text-slate-700">
            {COPY.evaluacionOrigen}
            <select
              value={evaluacionOrigenId}
              onChange={(event) => {
                onEvaluacionOrigenChange(event.target.value);
                onConclusionesChange([]);
              }}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
            >
              <option value="">{COPY.seleccionarEvaluacion}</option>
              {evaluaciones.map((evaluacion) => (
                <option key={evaluacion.id} value={evaluacion.id}>
                  {getEvaluacionIntegralTipoLabel(evaluacion.tipo)} ·{" "}
                  {getFechaReferenciaEvaluacion(evaluacion)} ·{" "}
                  {getEvaluacionIntegralEstadoLabel(evaluacion.estado)}
                </option>
              ))}
            </select>
          </label>

          {evaluacionOrigenId ? (
            conclusiones.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">{COPY.sinConclusiones}</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {conclusiones.map((conclusion) => (
                  <li key={conclusion.id}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
                      <input
                        type="checkbox"
                        checked={conclusionEvaluativaIds.includes(conclusion.id)}
                        onChange={() => toggleConclusion(conclusion.id)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-slate-900">
                            {conclusion.prioridadLabel}
                          </span>
                          {conclusion.coberturaPlanificacion ===
                          "sin_planificacion" ? (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-800 ring-1 ring-inset ring-amber-100">
                              {COPY.sinPlanificacion}
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-1 block text-slate-700">
                          {conclusion.enunciado}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )
          ) : null}
        </>
      )}
    </div>
  );
}
