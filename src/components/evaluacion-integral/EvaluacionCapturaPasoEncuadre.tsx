"use client";

import {
  ParticipacionEvaluacionModal,
  type ParticipacionEvaluacionFormValues,
} from "@/components/evaluacion-integral/ParticipacionEvaluacionModal";
import { EVALUACION_TIPOS_CAPTURA } from "@/components/evaluacion-integral/evaluacion-captura-config";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  evaluacionFechaToDateInput,
  todayEvaluacionDateInput,
} from "@/lib/evaluacion-integral/evaluacion-integral-fechas";
import type { EvaluacionIntegralTipo } from "@/lib/evaluacion-integral/evaluacion-integral-types";
import type { ParticipacionEvaluacionEnriquecida } from "@/lib/evaluacion-integral/evaluacion-integral-view";
import { getEvaluacionIngresoCerradaByEstudianteId } from "@/lib/evaluacion-integral/evaluacion-integral-storage";
import {
  deleteParticipacionEvaluacionIntegral,
  saveParticipacionEvaluacionIntegral,
  updateParticipacionEvaluacionIntegral,
} from "@/lib/evaluacion-integral/participacion-evaluacion-integral-storage";
import { useState } from "react";

const COPY = GLOSSARY.evaluacionCaptura;

type EvaluacionCapturaPasoEncuadreProps = {
  evaluacionId: string;
  estudianteId: string;
  tipo: EvaluacionIntegralTipo;
  fechaInicio: string;
  fechaTermino?: string;
  participantes: ParticipacionEvaluacionEnriquecida[];
  onEncuadreChange: (values: {
    tipo: EvaluacionIntegralTipo;
    fechaInicio: string;
    fechaTermino: string;
  }) => void;
  onParticipantesChange: () => void;
};

export function EvaluacionCapturaPasoEncuadre({
  evaluacionId,
  estudianteId,
  tipo,
  fechaInicio,
  fechaTermino,
  participantes,
  onEncuadreChange,
  onParticipantesChange,
}: EvaluacionCapturaPasoEncuadreProps) {
  const ingresoCerrada = Boolean(
    getEvaluacionIngresoCerradaByEstudianteId(estudianteId)
  );
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingParticipacion, setEditingParticipacion] =
    useState<ParticipacionEvaluacionEnriquecida | null>(null);
  const [participacionError, setParticipacionError] = useState<string | null>(
    null
  );
  const [isSavingParticipacion, setIsSavingParticipacion] = useState(false);

  function handleEncuadreFieldChange(
    field: "tipo" | "fechaInicio" | "fechaTermino",
    value: string
  ) {
    onEncuadreChange({
      tipo: field === "tipo" ? (value as EvaluacionIntegralTipo) : tipo,
      fechaInicio: field === "fechaInicio" ? value : fechaInicio,
      fechaTermino: field === "fechaTermino" ? value : fechaTermino ?? "",
    });
  }

  function openCreateModal() {
    setEditingParticipacion(null);
    setParticipacionError(null);
    setModalMode("create");
  }

  function openEditModal(participacion: ParticipacionEvaluacionEnriquecida) {
    setEditingParticipacion(participacion);
    setParticipacionError(null);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setEditingParticipacion(null);
    setParticipacionError(null);
  }

  function handleParticipacionSubmit(values: ParticipacionEvaluacionFormValues) {
    setIsSavingParticipacion(true);
    setParticipacionError(null);

    const payload = {
      evaluacionIntegralId: evaluacionId,
      estudianteId,
      profesionalId: values.profesionalId,
      rolEnEvaluacionId: values.rolEnEvaluacionId,
      esResponsableProceso: values.esResponsableProceso,
      fechaInicio: values.fechaInicio,
      fechaTermino: values.fechaTermino || undefined,
      notas: values.notas || undefined,
    };

    const saved =
      modalMode === "edit" && editingParticipacion
        ? updateParticipacionEvaluacionIntegral(editingParticipacion.id, payload)
        : saveParticipacionEvaluacionIntegral(payload);

    setIsSavingParticipacion(false);

    if (!saved) {
      setParticipacionError(COPY.errorParticipante);
      return;
    }

    closeModal();
    onParticipantesChange();
  }

  function handleDeleteParticipacion(id: string) {
    if (!deleteParticipacionEvaluacionIntegral(id)) return;
    onParticipantesChange();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {COPY.pasoEncuadre}
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              {COPY.campoTipo}
            </span>
            <select
              value={tipo}
              onChange={(event) =>
                handleEncuadreFieldChange("tipo", event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            >
              {EVALUACION_TIPOS_CAPTURA.map((option) => (
                <option
                  key={option.id}
                  value={option.id}
                  disabled={option.id === "ingreso" && ingresoCerrada}
                >
                  {option.label}
                  {option.id === "ingreso" && ingresoCerrada
                    ? ` (${COPY.ingresoYaRegistrado})`
                    : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              {COPY.campoFechaInicio}
            </span>
            <input
              type="date"
              required
              value={evaluacionFechaToDateInput(fechaInicio)}
              onChange={(event) =>
                handleEncuadreFieldChange("fechaInicio", event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              {COPY.campoFechaCierrePrevista}
            </span>
            <input
              type="date"
              value={fechaTermino ? evaluacionFechaToDateInput(fechaTermino) : ""}
              onChange={(event) =>
                handleEncuadreFieldChange("fechaTermino", event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            {COPY.equipoEvaluador}
          </h3>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white"
          >
            {COPY.agregarParticipante}
          </button>
        </div>

        {participantes.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{COPY.sinParticipantes}</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {participantes.map((participacion) => (
              <li
                key={participacion.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {participacion.profesionalNombre}
                  </p>
                  <p className="text-sm text-slate-600">{participacion.rolNombre}</p>
                  {participacion.esResponsableProceso ? (
                    <span className="mt-1 inline-flex rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-800 ring-1 ring-inset ring-violet-100">
                      {COPY.marcarResponsable}
                    </span>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(participacion)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700"
                  >
                    {COPY.editarParticipante}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteParticipacion(participacion.id)}
                    className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm text-rose-700"
                  >
                    {COPY.eliminarParticipante}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {modalMode ? (
        <ParticipacionEvaluacionModal
          mode={modalMode}
          participacion={editingParticipacion ?? undefined}
          onSubmit={handleParticipacionSubmit}
          onClose={closeModal}
          isSaving={isSavingParticipacion}
          errorMessage={participacionError}
        />
      ) : null}
    </div>
  );
}
