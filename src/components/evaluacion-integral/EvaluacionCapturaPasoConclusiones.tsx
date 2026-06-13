"use client";

import { ConclusionEvaluativaCard } from "@/components/evaluacion-integral/ConclusionEvaluativaCard";
import {
  ConclusionEvaluativaForm,
  type ConclusionEvaluativaFormValues,
} from "@/components/evaluacion-integral/ConclusionEvaluativaForm";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  deleteConclusionEvaluativa,
  saveConclusionEvaluativa,
  updateConclusionEvaluativa,
} from "@/lib/evaluacion-integral/conclusion-evaluativa-storage";
import type {
  ConclusionEvaluativaView,
  HallazgoEvaluativoView,
} from "@/lib/evaluacion-integral/evaluacion-integral-view";
import type { HallazgoTipo } from "@/lib/perfil-hallazgos-storage";
import { useState } from "react";

const COPY = GLOSSARY.conclusionEvaluativa;

type EvaluacionCapturaPasoConclusionesProps = {
  evaluacionId: string;
  estudianteId: string;
  hallazgos: HallazgoEvaluativoView[];
  hallazgosPorTipo: Record<HallazgoTipo, HallazgoEvaluativoView[]>;
  conclusiones: ConclusionEvaluativaView[];
  preselectedHallazgoId?: string;
  onConclusionesChange: () => void;
  onPreselectedHallazgoConsumed?: () => void;
};

export function EvaluacionCapturaPasoConclusiones({
  evaluacionId,
  estudianteId,
  hallazgos,
  hallazgosPorTipo,
  conclusiones,
  preselectedHallazgoId,
  onConclusionesChange,
  onPreselectedHallazgoConsumed,
}: EvaluacionCapturaPasoConclusionesProps) {
  const [mode, setMode] = useState<"list" | "create" | "edit">(
    preselectedHallazgoId && hallazgos.length > 0 ? "create" : "list"
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const editingConclusion =
    editingId != null
      ? conclusiones.find((item) => item.id === editingId) ?? null
      : null;

  const prioridadAltaExistentes = conclusiones.filter(
    (item) => item.prioridad === "alta" && item.id !== editingId
  ).length;

  function handleCancelForm() {
    setMode("list");
    setEditingId(null);
    setError(null);
    onPreselectedHallazgoConsumed?.();
  }

  function buildPayload(values: ConclusionEvaluativaFormValues) {
    return {
      evaluacionIntegralId: evaluacionId,
      estudianteId,
      enunciado: values.enunciado,
      prioridad: values.prioridad,
      hallazgosSustentantesIds: values.hallazgosSustentantesIds,
      dimensionId: values.dimensionId || undefined,
      dimensionDetalle:
        values.dimensionId === "aprendizaje_curricular"
          ? values.dimensionDetalle || undefined
          : undefined,
      notas: values.notas || undefined,
    };
  }

  function handleSubmit(values: ConclusionEvaluativaFormValues) {
    setIsSaving(true);
    setError(null);

    const payload = buildPayload(values);
    const saved =
      mode === "edit" && editingId
        ? updateConclusionEvaluativa(editingId, payload)
        : saveConclusionEvaluativa(payload);

    setIsSaving(false);

    if (!saved) {
      setError(COPY.errorGuardar);
      return;
    }

    handleCancelForm();
    onConclusionesChange();
  }

  function handleDelete(id: string) {
    if (!window.confirm(COPY.confirmarEliminar)) return;
    if (!deleteConclusionEvaluativa(id)) return;
    onConclusionesChange();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            {COPY.titulo}
          </h3>
          <p className="mt-1 text-sm text-slate-600">{COPY.subtitulo}</p>
        </div>
        {mode === "list" ? (
          <button
            type="button"
            onClick={() => {
              setMode("create");
              setEditingId(null);
              setError(null);
            }}
            disabled={hallazgos.length === 0}
            className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {COPY.agregar}
          </button>
        ) : null}
      </header>

      {hallazgos.length === 0 ? (
        <p className="text-sm text-amber-800">{COPY.sinHallazgosParaConclusion}</p>
      ) : null}

      {mode === "create" || mode === "edit" ? (
        <ConclusionEvaluativaForm
          evaluacionId={evaluacionId}
          estudianteId={estudianteId}
          hallazgos={hallazgos}
          hallazgosPorTipo={hallazgosPorTipo}
          initial={editingConclusion ?? undefined}
          preselectedHallazgoId={
            mode === "create" ? preselectedHallazgoId : undefined
          }
          prioridadAltaExistentes={prioridadAltaExistentes}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          isSaving={isSaving}
          errorMessage={error}
        />
      ) : null}

      {mode === "list" ? (
        conclusiones.length === 0 ? (
          <p className="text-sm text-slate-500">{COPY.sinConclusiones}</p>
        ) : (
          <ul className="space-y-4">
            {conclusiones.map((conclusion) => (
              <li key={conclusion.id}>
                <ConclusionEvaluativaCard
                  conclusion={conclusion}
                  editable
                  onEdit={() => {
                    setMode("edit");
                    setEditingId(conclusion.id);
                    setError(null);
                  }}
                  onDelete={() => handleDelete(conclusion.id)}
                />
              </li>
            ))}
          </ul>
        )
      ) : null}
    </div>
  );
}
