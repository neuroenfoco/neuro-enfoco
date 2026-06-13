"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import type { ConclusionEvaluativaView } from "@/lib/evaluacion-integral/evaluacion-integral-view";
import type { EvaluacionIntegralEstado } from "@/lib/evaluacion-integral/evaluacion-integral-types";
import { VincularObjetivoExistenteModal } from "@/components/evaluacion-integral/VincularObjetivoExistenteModal";
import { unlinkConclusionFromObjetivo } from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-storage";
import Link from "next/link";
import { useState } from "react";

const COPY = GLOSSARY.conclusionEvaluativa;
const PLAN_COPY = GLOSSARY.planificacionEvaluativa;

function prioridadClass(prioridad: ConclusionEvaluativaView["prioridad"]): string {
  switch (prioridad) {
    case "alta":
      return "bg-rose-50 text-rose-800 ring-rose-100";
    case "media":
      return "bg-amber-50 text-amber-800 ring-amber-100";
    case "baja":
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function coberturaClass(
  cobertura: ConclusionEvaluativaView["coberturaPlanificacion"]
): string {
  return cobertura === "planificada"
    ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
    : "bg-amber-50 text-amber-800 ring-amber-100";
}

type ConclusionEvaluativaCardProps = {
  conclusion: ConclusionEvaluativaView;
  editable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  showPlanificacion?: boolean;
  estudianteId?: string;
  evaluacionEstado?: EvaluacionIntegralEstado;
  onPlanificacionChange?: () => void;
};

export function ConclusionEvaluativaCard({
  conclusion,
  editable = false,
  onEdit,
  onDelete,
  showPlanificacion = false,
  estudianteId,
  evaluacionEstado,
  onPlanificacionChange,
}: ConclusionEvaluativaCardProps) {
  const [showVincularModal, setShowVincularModal] = useState(false);

  const crearObjetivoHref =
    estudianteId &&
    `/objetivos/nuevo?estudianteId=${estudianteId}&conclusionId=${conclusion.id}`;

  function handleDesvincular(objetivoId: string) {
    if (!window.confirm(PLAN_COPY.confirmarDesvincular)) return;
    unlinkConclusionFromObjetivo(conclusion.id, objetivoId);
    onPlanificacionChange?.();
  }

  return (
    <article className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${prioridadClass(conclusion.prioridad)}`}
            >
              {conclusion.prioridadLabel}
            </span>
            {conclusion.dimensionLabel ? (
              <span className="text-xs text-slate-500">
                {conclusion.dimensionLabel}
              </span>
            ) : null}
            {showPlanificacion ? (
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${coberturaClass(conclusion.coberturaPlanificacion)}`}
              >
                {conclusion.coberturaPlanificacion === "planificada"
                  ? PLAN_COPY.estadoPlanificada
                  : PLAN_COPY.estadoSinPlanificacion}
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-800">
            {conclusion.enunciado}
          </p>
          {conclusion.notas ? (
            <p className="mt-2 text-xs text-slate-500">{conclusion.notas}</p>
          ) : null}
        </div>
        {editable ? (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700"
            >
              {COPY.editar}
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm text-rose-700"
            >
              {COPY.eliminar}
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {COPY.hallazgosSustentantes}
        </p>
        {conclusion.sinHallazgosSustentantes ? (
          <p className="mt-1 text-xs text-amber-700">
            Sin hallazgos vinculados disponibles.
          </p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {conclusion.hallazgosSustentantes.map((hallazgo) => (
              <li
                key={hallazgo.id}
                className="inline-flex max-w-full items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs text-violet-900 ring-1 ring-inset ring-violet-100"
              >
                <span className="font-medium">{hallazgo.tipoLabel}:</span>
                <span className="truncate">{hallazgo.nombre}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showPlanificacion && estudianteId ? (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {PLAN_COPY.respondeConclusion}
          </p>
          {evaluacionEstado === "borrador" ? (
            <p className="mt-2 text-xs text-amber-700">{PLAN_COPY.avisoBorrador}</p>
          ) : null}

          {conclusion.objetivosVinculados.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">{PLAN_COPY.sinObjetivosVinculados}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {conclusion.objetivosVinculados.map((objetivo) => (
                <li
                  key={objetivo.objetivoId}
                  className="flex flex-col gap-2 rounded-lg border border-slate-200 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {objetivo.nombre}
                    </p>
                    <p className="text-xs text-slate-500">
                      {objetivo.dimensionRelacionada} · {objetivo.estadoLabel}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/objetivos/${objetivo.objetivoId}`}
                      className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {PLAN_COPY.verObjetivo}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDesvincular(objetivo.objetivoId)}
                      className="rounded-lg border border-rose-200 px-3 py-1 text-xs text-rose-700"
                    >
                      {PLAN_COPY.desvincular}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {crearObjetivoHref ? (
              <Link
                href={crearObjetivoHref}
                className="rounded-lg bg-violet-700 px-3 py-1.5 text-sm font-semibold text-white"
              >
                {PLAN_COPY.crearObjetivo}
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => setShowVincularModal(true)}
              className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-800"
            >
              {PLAN_COPY.vincularExistente}
            </button>
          </div>
        </div>
      ) : null}

      {showVincularModal && estudianteId ? (
        <VincularObjetivoExistenteModal
          conclusion={conclusion}
          estudianteId={estudianteId}
          onClose={() => setShowVincularModal(false)}
          onLinked={() => onPlanificacionChange?.()}
        />
      ) : null}
    </article>
  );
}
