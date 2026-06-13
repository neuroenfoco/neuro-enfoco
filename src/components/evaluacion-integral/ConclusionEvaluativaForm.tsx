"use client";

import { EVALUACION_CAPTURA_GRUPOS } from "@/components/evaluacion-integral/evaluacion-captura-config";
import { GLOSSARY } from "@/lib/copy/glossary";
import { CATALOGO_CONCLUSION_EVALUATIVA_DIMENSIONES } from "@/lib/evaluacion-integral/conclusion-evaluativa-dimensiones";
import { PRIORIDAD_ALTA_ADVISO_UMBRAL } from "@/lib/evaluacion-integral/conclusion-evaluativa-validacion";
import type {
  ConclusionEvaluativa,
  ConclusionEvaluativaPrioridad,
  SaveConclusionEvaluativaInput,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";
import type { HallazgoEvaluativoView } from "@/lib/evaluacion-integral/evaluacion-integral-view";
import type { HallazgoTipo } from "@/lib/perfil-hallazgos-storage";
import { useEffect, useMemo, useState } from "react";

const COPY = GLOSSARY.conclusionEvaluativa;

export type ConclusionEvaluativaFormValues = {
  enunciado: string;
  prioridad: ConclusionEvaluativaPrioridad;
  hallazgosSustentantesIds: string[];
  dimensionId: SaveConclusionEvaluativaInput["dimensionId"] | "";
  dimensionDetalle: string;
  notas: string;
};

type ConclusionEvaluativaFormProps = {
  evaluacionId: string;
  estudianteId: string;
  hallazgos: HallazgoEvaluativoView[];
  hallazgosPorTipo: Record<HallazgoTipo, HallazgoEvaluativoView[]>;
  initial?: ConclusionEvaluativa;
  preselectedHallazgoId?: string;
  prioridadAltaExistentes: number;
  onSubmit: (values: ConclusionEvaluativaFormValues) => void;
  onCancel: () => void;
  isSaving?: boolean;
  errorMessage?: string | null;
};

function conclusionToFormValues(
  conclusion: ConclusionEvaluativa
): ConclusionEvaluativaFormValues {
  return {
    enunciado: conclusion.enunciado,
    prioridad: conclusion.prioridad,
    hallazgosSustentantesIds: [...conclusion.hallazgosSustentantesIds],
    dimensionId: conclusion.dimensionId ?? "",
    dimensionDetalle: conclusion.dimensionDetalle ?? "",
    notas: conclusion.notas ?? "",
  };
}

export function ConclusionEvaluativaForm({
  hallazgos,
  hallazgosPorTipo,
  initial,
  preselectedHallazgoId,
  prioridadAltaExistentes,
  onSubmit,
  onCancel,
  isSaving = false,
  errorMessage,
}: ConclusionEvaluativaFormProps) {
  const [values, setValues] = useState<ConclusionEvaluativaFormValues>(() => {
    if (initial) return conclusionToFormValues(initial);
    const preselected =
      preselectedHallazgoId &&
      hallazgos.some((item) => item.id === preselectedHallazgoId)
        ? [preselectedHallazgoId]
        : [];
    return {
      enunciado: "",
      prioridad: "media",
      hallazgosSustentantesIds: preselected,
      dimensionId: "",
      dimensionDetalle: "",
      notas: "",
    };
  });

  useEffect(() => {
    if (!preselectedHallazgoId || initial) return;
    if (!hallazgos.some((item) => item.id === preselectedHallazgoId)) return;
    setValues((current) => ({
      ...current,
      hallazgosSustentantesIds: current.hallazgosSustentantesIds.includes(
        preselectedHallazgoId
      )
        ? current.hallazgosSustentantesIds
        : [...current.hallazgosSustentantesIds, preselectedHallazgoId],
    }));
  }, [preselectedHallazgoId, hallazgos, initial]);

  const showPrioridadAltaAviso = useMemo(() => {
    const altaNueva =
      values.prioridad === "alta" && initial?.prioridad !== "alta" ? 1 : 0;
    return prioridadAltaExistentes + altaNueva > PRIORIDAD_ALTA_ADVISO_UMBRAL;
  }, [prioridadAltaExistentes, values.prioridad, initial]);

  function toggleHallazgo(hallazgoId: string) {
    setValues((current) => {
      const selected = new Set(current.hallazgosSustentantesIds);
      if (selected.has(hallazgoId)) selected.delete(hallazgoId);
      else selected.add(hallazgoId);
      return {
        ...current,
        hallazgosSustentantesIds: [...selected],
      };
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-violet-200/60 bg-violet-50/20 p-5 sm:p-6"
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          {COPY.campoEnunciado}
        </span>
        <textarea
          required
          rows={4}
          value={values.enunciado}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              enunciado: event.target.value,
            }))
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed"
          placeholder={COPY.enunciadoAyuda}
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {COPY.campoPrioridad}
          </span>
          <select
            value={values.prioridad}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                prioridad: event.target.value as ConclusionEvaluativaPrioridad,
              }))
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
          >
            <option value="alta">{COPY.prioridadAlta}</option>
            <option value="media">{COPY.prioridadMedia}</option>
            <option value="baja">{COPY.prioridadBaja}</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {COPY.campoDimension}
          </span>
          <select
            value={values.dimensionId}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                dimensionId: event.target
                  .value as ConclusionEvaluativaFormValues["dimensionId"],
                dimensionDetalle:
                  event.target.value === "aprendizaje_curricular"
                    ? current.dimensionDetalle
                    : "",
              }))
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
          >
            <option value="">{COPY.sinDimension}</option>
            {CATALOGO_CONCLUSION_EVALUATIVA_DIMENSIONES.map((dimension) => (
              <option key={dimension.id} value={dimension.id}>
                {dimension.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      {values.dimensionId === "aprendizaje_curricular" ? (
        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {COPY.campoDimensionDetalle}
          </span>
          <input
            type="text"
            value={values.dimensionDetalle}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                dimensionDetalle: event.target.value,
              }))
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
          />
        </label>
      ) : null}

      {showPrioridadAltaAviso ? (
        <p className="mt-4 text-sm text-amber-800">{COPY.prioridadAltaAviso}</p>
      ) : null}

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-slate-700">
          {COPY.hallazgosSustentantes}
        </legend>
        <p className="mt-1 text-xs text-slate-500">{COPY.seleccionarHallazgos}</p>
        {hallazgos.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            {COPY.sinHallazgosParaConclusion}
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            {EVALUACION_CAPTURA_GRUPOS.map((grupo) => {
              const items = hallazgosPorTipo[grupo.tipo];
              if (items.length === 0) return null;
              return (
                <div key={grupo.tipo}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {grupo.title}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {items.map((hallazgo) => (
                      <li key={hallazgo.id}>
                        <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                          <input
                            type="checkbox"
                            checked={values.hallazgosSustentantesIds.includes(
                              hallazgo.id
                            )}
                            onChange={() => toggleHallazgo(hallazgo.id)}
                            className="mt-1 rounded border-slate-300"
                          />
                          <span className="text-sm text-slate-800">
                            {hallazgo.nombre}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </fieldset>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          {COPY.campoNotas}
        </span>
        <textarea
          rows={2}
          value={values.notas}
          onChange={(event) =>
            setValues((current) => ({ ...current, notas: event.target.value }))
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
        />
      </label>

      {errorMessage ? (
        <p className="mt-4 text-sm text-rose-700" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
        >
          {COPY.cancelar}
        </button>
        <button
          type="submit"
          disabled={isSaving || hallazgos.length === 0}
          className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSaving ? COPY.guardando : COPY.guardar}
        </button>
      </div>
    </form>
  );
}
