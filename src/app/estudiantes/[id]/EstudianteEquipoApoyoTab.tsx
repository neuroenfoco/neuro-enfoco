"use client";

import {
  ParticipacionEquipoModal,
  type ParticipacionEquipoFormValues,
} from "@/components/equipo-apoyo/ParticipacionEquipoModal";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getAmbitosConParticipacionesVisibles,
  getEquipoApoyoEstudianteView,
  type EquipoApoyoEstudianteView,
  type ParticipacionEnriquecida,
} from "@/lib/institucional/equipo-apoyo-view";
import { todayParticipacionDate } from "@/lib/institucional/participacion-vigencia";
import {
  finalizarParticipacion,
  saveParticipacionProfesionalEstudiante,
  setResponsableEnAmbito,
  updateParticipacionProfesionalEstudiante,
} from "@/lib/institucional/participaciones-profesional-estudiante-storage";
import { formatMarcoFechaDisplay } from "@/lib/marco-institucional-pie-storage";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { EstadoVigenciaParticipacion } from "@/lib/institucional/participacion-vigencia";

const COPY = GLOSSARY.equipoApoyo;

type EstudianteEquipoApoyoTabProps = {
  estudianteId: string;
};

type ModalState =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; participacion: ParticipacionEnriquecida }
  | { kind: "finalizar"; participacion: ParticipacionEnriquecida };

function estadoVigenciaLabel(estado: EstadoVigenciaParticipacion): string {
  switch (estado) {
    case "vigente":
      return COPY.estadoVigente;
    case "programada":
      return COPY.estadoProgramada;
    case "finalizada":
      return COPY.estadoFinalizada;
  }
}

function estadoVigenciaClass(estado: EstadoVigenciaParticipacion): string {
  switch (estado) {
    case "vigente":
      return "bg-emerald-50 text-emerald-800 ring-emerald-100";
    case "programada":
      return "bg-sky-50 text-sky-800 ring-sky-100";
    case "finalizada":
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}

export function EstudianteEquipoApoyoTab({
  estudianteId,
}: EstudianteEquipoApoyoTabProps) {
  const [incluirHistorial, setIncluirHistorial] = useState(false);
  const [view, setView] = useState<EquipoApoyoEstudianteView | null>(() =>
    typeof window === "undefined"
      ? null
      : getEquipoApoyoEstudianteView(estudianteId, { incluirHistorial: false })
  );
  const [modal, setModal] = useState<ModalState>({ kind: "closed" });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fechaFinalizar, setFechaFinalizar] = useState(todayParticipacionDate());

  const refresh = useCallback(() => {
    setView(
      getEquipoApoyoEstudianteView(estudianteId, { incluirHistorial })
    );
  }, [estudianteId, incluirHistorial]);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  function closeModal() {
    setModal({ kind: "closed" });
    setErrorMessage(null);
    setIsSaving(false);
  }

  function handleCreateSubmit(values: ParticipacionEquipoFormValues) {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      saveParticipacionProfesionalEstudiante({
        estudianteId,
        profesionalId: values.profesionalId,
        rolId: values.rolId,
        ambito: values.ambito,
        fechaInicio: values.fechaInicio,
        fechaTermino: values.fechaTermino || undefined,
        notas: values.notas || undefined,
        origen: "manual",
      });
      closeModal();
      refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : COPY.errorGuardar
      );
      setIsSaving(false);
    }
  }

  function handleEditSubmit(values: ParticipacionEquipoFormValues) {
    if (modal.kind !== "edit") return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      updateParticipacionProfesionalEstudiante(modal.participacion.id, {
        profesionalId: values.profesionalId,
        rolId: values.rolId,
        ambito: values.ambito,
        fechaInicio: values.fechaInicio,
        fechaTermino: values.fechaTermino || undefined,
        notas: values.notas || undefined,
      });
      closeModal();
      refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : COPY.errorGuardar
      );
      setIsSaving(false);
    }
  }

  function handleFinalizarConfirm() {
    if (modal.kind !== "finalizar") return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      finalizarParticipacion(modal.participacion.id, fechaFinalizar);
      closeModal();
      refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : COPY.errorGuardar
      );
      setIsSaving(false);
    }
  }

  function handleMarcarResponsable(participacionId: string) {
    try {
      setResponsableEnAmbito(estudianteId, participacionId);
      refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : COPY.errorGuardar
      );
    }
  }

  const ambitosVisibles = view ? getAmbitosConParticipacionesVisibles(view) : [];
  const sinRegistros = ambitosVisibles.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{COPY.titulo}</h2>
          <p className="mt-1 text-sm text-slate-600">{COPY.subtitulo}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/profesionales"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            {COPY.gestionarProfesionales}
          </Link>
          <button
            type="button"
            onClick={() => setModal({ kind: "create" })}
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            {COPY.agregar}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl border border-slate-200/70 bg-white px-4 py-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="radio"
            name="filtro-equipo"
            checked={!incluirHistorial}
            onChange={() => setIncluirHistorial(false)}
            className="text-teal-600"
          />
          {COPY.filtroVigentes}
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="radio"
            name="filtro-equipo"
            checked={incluirHistorial}
            onChange={() => setIncluirHistorial(true)}
            className="text-teal-600"
          />
          {COPY.filtroHistorial}
        </label>
      </div>

      {errorMessage && modal.kind === "closed" ? (
        <p className="text-sm text-rose-600" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {sinRegistros ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-600">
            {incluirHistorial ? COPY.sinRegistros : COPY.sinRegistrosVigentes}
          </p>
        </section>
      ) : (
        <div className="space-y-8">
          {ambitosVisibles.map((ambito) => {
            const participaciones = view?.porAmbito[ambito] ?? [];
            const ambitoNombre = participaciones[0]?.ambitoNombre ?? ambito;

            return (
              <section
                key={ambito}
                className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgba(15,60,50,0.06)]"
              >
                <header className="border-b border-slate-100 px-5 py-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-800">
                    {ambitoNombre}
                  </h3>
                </header>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-500">
                        <th className="px-5 py-3">{COPY.columnaProfesional}</th>
                        <th className="px-5 py-3">{COPY.columnaRol}</th>
                        <th className="px-5 py-3">{COPY.columnaEstado}</th>
                        <th className="px-5 py-3">{COPY.columnaInicio}</th>
                        <th className="px-5 py-3">{COPY.columnaTermino}</th>
                        <th className="px-5 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participaciones.map((participacion) => (
                        <tr
                          key={participacion.id}
                          className="border-b border-slate-50 last:border-0"
                        >
                          <td className="px-5 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium text-slate-900">
                                {participacion.profesionalNombre}
                              </span>
                              {participacion.esResponsable ? (
                                <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-amber-100">
                                  {COPY.responsableBadge}
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-slate-700">
                            {participacion.rolNombre}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${estadoVigenciaClass(participacion.estadoVigencia)}`}
                            >
                              {estadoVigenciaLabel(participacion.estadoVigencia)}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-slate-700">
                            {formatMarcoFechaDisplay(participacion.fechaInicio)}
                          </td>
                          <td className="px-5 py-3 text-slate-700">
                            {participacion.fechaTermino
                              ? formatMarcoFechaDisplay(participacion.fechaTermino)
                              : "—"}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex flex-wrap justify-end gap-2">
                              {participacion.estadoVigencia !== "finalizada" ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setModal({
                                        kind: "edit",
                                        participacion,
                                      })
                                    }
                                    className="text-xs font-medium text-teal-700 hover:text-teal-900"
                                  >
                                    {COPY.editar}
                                  </button>
                                  {!participacion.esResponsable ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleMarcarResponsable(participacion.id)
                                      }
                                      className="text-xs font-medium text-amber-700 hover:text-amber-900"
                                    >
                                      {COPY.marcarResponsable}
                                    </button>
                                  ) : null}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFechaFinalizar(todayParticipacionDate());
                                      setModal({
                                        kind: "finalizar",
                                        participacion,
                                      });
                                    }}
                                    className="text-xs font-medium text-slate-600 hover:text-slate-900"
                                  >
                                    {COPY.finalizar}
                                  </button>
                                </>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {modal.kind === "create" ? (
        <ParticipacionEquipoModal
          mode="create"
          estudianteId={estudianteId}
          onSubmit={handleCreateSubmit}
          onClose={closeModal}
          isSaving={isSaving}
          errorMessage={errorMessage}
        />
      ) : null}

      {modal.kind === "edit" ? (
        <ParticipacionEquipoModal
          mode="edit"
          estudianteId={estudianteId}
          participacion={modal.participacion}
          onSubmit={handleEditSubmit}
          onClose={closeModal}
          isSaving={isSaving}
          errorMessage={errorMessage}
        />
      ) : null}

      {modal.kind === "finalizar" ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
          <div
            className="w-full max-w-md rounded-t-2xl border border-slate-200/80 bg-white p-6 shadow-xl sm:rounded-2xl"
            role="dialog"
            aria-modal="true"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {COPY.finalizarTitulo}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {COPY.finalizarDescripcion}
            </p>
            <p className="mt-3 text-sm font-medium text-slate-800">
              {modal.participacion.profesionalNombre} ·{" "}
              {modal.participacion.ambitoNombre}
            </p>
            <label
              htmlFor="fecha-finalizar"
              className="mt-4 block text-sm font-medium text-slate-700"
            >
              {COPY.finalizarFecha}
            </label>
            <input
              id="fecha-finalizar"
              type="date"
              value={fechaFinalizar}
              onChange={(event) => setFechaFinalizar(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            {errorMessage ? (
              <p className="mt-3 text-sm text-rose-600" role="alert">
                {errorMessage}
              </p>
            ) : null}
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                {COPY.cancelar}
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleFinalizarConfirm}
                className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
              >
                {COPY.finalizarConfirmar}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
