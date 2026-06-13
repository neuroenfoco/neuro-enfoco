"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { CATALOGO_AMBITOS_EQUIPO } from "@/lib/institucional/ambitos-equipo";
import type { ParticipacionEnriquecida } from "@/lib/institucional/equipo-apoyo-view";
import { todayParticipacionDate } from "@/lib/institucional/participacion-vigencia";
import {
  CATALOGO_ROLES_PROFESIONAL,
  type RolProfesionalId,
} from "@/lib/institucional/roles-profesional-catalog";
import {
  formatProfesionalNombreCompleto,
  getProfesionalesActivos,
} from "@/lib/institucional/profesionales-storage";
import type { AmbitoEquipo } from "@/lib/institucional/ambitos-equipo";
import { useEffect, useState } from "react";

const COPY = GLOSSARY.equipoApoyo;

export type ParticipacionEquipoFormValues = {
  profesionalId: string;
  rolId: RolProfesionalId;
  ambito: AmbitoEquipo;
  fechaInicio: string;
  fechaTermino: string;
  notas: string;
};

type ParticipacionEquipoModalProps = {
  mode: "create" | "edit";
  estudianteId: string;
  participacion?: ParticipacionEnriquecida;
  onSubmit: (values: ParticipacionEquipoFormValues) => void;
  onClose: () => void;
  isSaving?: boolean;
  errorMessage?: string | null;
};

function participacionToFormValues(
  participacion: ParticipacionEnriquecida
): ParticipacionEquipoFormValues {
  return {
    profesionalId: participacion.profesionalId,
    rolId: participacion.rolId,
    ambito: participacion.ambito,
    fechaInicio: participacion.fechaInicio,
    fechaTermino: participacion.fechaTermino ?? "",
    notas: participacion.notas ?? "",
  };
}

export function ParticipacionEquipoModal({
  mode,
  participacion,
  onSubmit,
  onClose,
  isSaving = false,
  errorMessage,
}: ParticipacionEquipoModalProps) {
  const profesionales = getProfesionalesActivos();
  const [values, setValues] = useState<ParticipacionEquipoFormValues>(() => {
    if (participacion) return participacionToFormValues(participacion);
    const defaultProfesional = profesionales[0];
    return {
      profesionalId: defaultProfesional?.id ?? "",
      rolId: defaultProfesional?.rolPrincipalId ?? "educadora_diferencial",
      ambito: "pie",
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
    if (!values.profesionalId) return;
    onSubmit(values);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
      <div
        className="flex max-h-[min(90vh,720px)] w-full max-w-lg flex-col overflow-y-auto rounded-t-2xl border border-slate-200/80 bg-white shadow-xl sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            {mode === "create" ? COPY.modalAgregarTitulo : COPY.modalEditarTitulo}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{COPY.modalSubtitulo}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label
              htmlFor="participacion-profesional"
              className="block text-sm font-medium text-slate-700"
            >
              {COPY.campoProfesional}
            </label>
            <select
              id="participacion-profesional"
              required
              value={values.profesionalId}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  profesionalId: event.target.value,
                }))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
            >
              {profesionales.length === 0 ? (
                <option value="">{GLOSSARY.profesional.selectorVacio}</option>
              ) : (
                profesionales.map((item) => (
                  <option key={item.id} value={item.id}>
                    {formatProfesionalNombreCompleto(item)}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="participacion-rol"
              className="block text-sm font-medium text-slate-700"
            >
              {COPY.campoRol}
            </label>
            <select
              id="participacion-rol"
              required
              value={values.rolId}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  rolId: event.target.value as RolProfesionalId,
                }))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
            >
              {CATALOGO_ROLES_PROFESIONAL.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="participacion-ambito"
              className="block text-sm font-medium text-slate-700"
            >
              {COPY.campoAmbito}
            </label>
            <select
              id="participacion-ambito"
              required
              value={values.ambito}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  ambito: event.target.value as AmbitoEquipo,
                }))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
            >
              {CATALOGO_AMBITOS_EQUIPO.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="participacion-inicio"
                className="block text-sm font-medium text-slate-700"
              >
                {COPY.campoFechaInicio}
              </label>
              <input
                id="participacion-inicio"
                type="date"
                required
                value={values.fechaInicio}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    fechaInicio: event.target.value,
                  }))
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
              />
            </div>
            <div>
              <label
                htmlFor="participacion-termino"
                className="block text-sm font-medium text-slate-700"
              >
                {COPY.campoFechaTermino}
              </label>
              <input
                id="participacion-termino"
                type="date"
                value={values.fechaTermino}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    fechaTermino: event.target.value,
                  }))
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="participacion-notas"
              className="block text-sm font-medium text-slate-700"
            >
              {COPY.campoNotas}
            </label>
            <textarea
              id="participacion-notas"
              rows={3}
              value={values.notas}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  notas: event.target.value,
                }))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
            />
          </div>

          {errorMessage ? (
            <p className="text-sm text-rose-600" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              {COPY.cancelar}
            </button>
            <button
              type="submit"
              disabled={isSaving || profesionales.length === 0}
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {COPY.guardar}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
