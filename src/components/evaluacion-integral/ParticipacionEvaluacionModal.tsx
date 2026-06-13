"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { todayParticipacionDate } from "@/lib/institucional/participacion-vigencia";
import {
  formatProfesionalNombreCompleto,
  getProfesionalesActivos,
} from "@/lib/institucional/profesionales-storage";
import {
  CATALOGO_ROLES_PROFESIONAL,
  type RolProfesionalId,
} from "@/lib/institucional/roles-profesional-catalog";
import type { ParticipacionEvaluacionEnriquecida } from "@/lib/evaluacion-integral/evaluacion-integral-view";
import { useEffect, useState } from "react";

const COPY = GLOSSARY.evaluacionCaptura;

export type ParticipacionEvaluacionFormValues = {
  profesionalId: string;
  rolEnEvaluacionId: RolProfesionalId;
  esResponsableProceso: boolean;
  fechaInicio: string;
  fechaTermino: string;
  notas: string;
};

type ParticipacionEvaluacionModalProps = {
  mode: "create" | "edit";
  participacion?: ParticipacionEvaluacionEnriquecida;
  onSubmit: (values: ParticipacionEvaluacionFormValues) => void;
  onClose: () => void;
  isSaving?: boolean;
  errorMessage?: string | null;
};

function participacionToFormValues(
  participacion: ParticipacionEvaluacionEnriquecida
): ParticipacionEvaluacionFormValues {
  return {
    profesionalId: participacion.profesionalId,
    rolEnEvaluacionId: participacion.rolEnEvaluacionId,
    esResponsableProceso: participacion.esResponsableProceso,
    fechaInicio: participacion.fechaInicio,
    fechaTermino: participacion.fechaTermino ?? "",
    notas: participacion.notas ?? "",
  };
}

export function ParticipacionEvaluacionModal({
  mode,
  participacion,
  onSubmit,
  onClose,
  isSaving = false,
  errorMessage,
}: ParticipacionEvaluacionModalProps) {
  const profesionales = getProfesionalesActivos();
  const [values, setValues] = useState<ParticipacionEvaluacionFormValues>(() => {
    if (participacion) return participacionToFormValues(participacion);
    const defaultProfesional = profesionales[0];
    return {
      profesionalId: defaultProfesional?.id ?? "",
      rolEnEvaluacionId:
        defaultProfesional?.rolPrincipalId ?? "educadora_diferencial",
      esResponsableProceso: false,
      fechaInicio: todayParticipacionDate(),
      fechaTermino: "",
      notas: "",
    };
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="participacion-evaluacion-title"
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <h2
          id="participacion-evaluacion-title"
          className="text-lg font-semibold text-slate-900"
        >
          {mode === "create" ? COPY.agregarParticipante : COPY.editarParticipante}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{COPY.modalParticipanteSubtitulo}</p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              {COPY.campoProfesional}
            </span>
            <select
              required
              value={values.profesionalId}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  profesionalId: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            >
              {profesionales.map((profesional) => (
                <option key={profesional.id} value={profesional.id}>
                  {formatProfesionalNombreCompleto(profesional)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              {COPY.campoRol}
            </span>
            <select
              required
              value={values.rolEnEvaluacionId}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  rolEnEvaluacionId: event.target.value as RolProfesionalId,
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            >
              {CATALOGO_ROLES_PROFESIONAL.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={values.esResponsableProceso}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  esResponsableProceso: event.target.checked,
                }))
              }
              className="rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">{COPY.marcarResponsable}</span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {COPY.campoFechaInicio}
              </span>
              <input
                type="date"
                required
                value={values.fechaInicio}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    fechaInicio: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {COPY.campoFechaTermino}
              </span>
              <input
                type="date"
                value={values.fechaTermino}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    fechaTermino: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              {COPY.campoNotas}
            </span>
            <textarea
              rows={2}
              value={values.notas}
              onChange={(event) =>
                setValues((current) => ({ ...current, notas: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </label>
        </div>

        {errorMessage ? (
          <p className="mt-4 text-sm text-rose-700" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            {COPY.cancelar}
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSaving ? COPY.guardando : COPY.guardar}
          </button>
        </div>
      </form>
    </div>
  );
}
