"use client";

import {
  deleteApoyoImplementado,
  formatApoyoFechaDisplay,
  inputValueToApoyoFecha,
  saveApoyoImplementado,
  type ApoyoImplementado,
  type ApoyosPorObjetivo,
} from "@/lib/pie-apoyos-storage";
import { GLOSSARY } from "@/lib/copy/glossary";
import { useState } from "react";

type ApoyoImplementadoOpcionalSectionProps = {
  objetivoId: string;
  apoyos: ApoyosPorObjetivo;
  onRefresh: () => void;
};

export function ApoyoImplementadoOpcionalSection({
  objetivoId,
  apoyos,
  onRefresh,
}: ApoyoImplementadoOpcionalSectionProps) {
  const [apoyoNombre, setApoyoNombre] = useState("");
  const [apoyoDescripcion, setApoyoDescripcion] = useState("");
  const [apoyoFechaInicio, setApoyoFechaInicio] = useState("");
  const [apoyoFechaTermino, setApoyoFechaTermino] = useState("");
  const [isSavingApoyo, setIsSavingApoyo] = useState(false);
  const [pendingDeleteApoyoId, setPendingDeleteApoyoId] = useState<string | null>(
    null
  );

  function handleAddApoyo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      isSavingApoyo ||
      !apoyoNombre.trim() ||
      !apoyoDescripcion.trim() ||
      !apoyoFechaInicio.trim()
    ) {
      return;
    }

    setIsSavingApoyo(true);
    saveApoyoImplementado({
      objetivoId,
      nombre: apoyoNombre,
      descripcion: apoyoDescripcion,
      fechaInicio: inputValueToApoyoFecha(apoyoFechaInicio),
      fechaTermino: apoyoFechaTermino.trim()
        ? inputValueToApoyoFecha(apoyoFechaTermino)
        : undefined,
    });
    setApoyoNombre("");
    setApoyoDescripcion("");
    setApoyoFechaInicio("");
    setApoyoFechaTermino("");
    setIsSavingApoyo(false);
    onRefresh();
  }

  function handleConfirmDeleteApoyo() {
    if (!pendingDeleteApoyoId) return;
    deleteApoyoImplementado(pendingDeleteApoyoId);
    setPendingDeleteApoyoId(null);
    onRefresh();
  }

  return (
    <>
      <details className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50/30">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-700">
          Período declarado por el equipo (opcional)
          <span className="ml-2 text-xs font-normal text-slate-500">
            {apoyos.totalImplementados} registro
            {apoyos.totalImplementados === 1 ? "" : "s"}
          </span>
        </summary>

        <div className="border-t border-slate-200/80 px-4 py-4">
          <p className="text-xs text-slate-500">
            Registro opcional de períodos que el equipo declara formalmente. No
            reemplaza la documentación en intervenciones ni el resumen principal.
          </p>

          <div className="mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Períodos activos
            </h4>
            {apoyos.activos.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">Sin períodos activos.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {apoyos.activos.map((apoyo) => (
                  <ApoyoCard
                    key={apoyo.id}
                    apoyo={apoyo}
                    activo
                    onDelete={() => setPendingDeleteApoyoId(apoyo.id)}
                  />
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Histórico
            </h4>
            {apoyos.historico.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">Sin períodos finalizados.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {apoyos.historico.map((apoyo) => (
                  <ApoyoCard
                    key={apoyo.id}
                    apoyo={apoyo}
                    onDelete={() => setPendingDeleteApoyoId(apoyo.id)}
                  />
                ))}
              </ul>
            )}
          </div>

          <form
            onSubmit={handleAddApoyo}
            className="mt-6 rounded-xl border border-teal-100 bg-white p-4"
          >
            <p className="text-sm font-medium text-slate-800">
              Declarar período de apoyo
            </p>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-700">
                  Nombre del apoyo
                </span>
                <input
                  type="text"
                  value={apoyoNombre}
                  onChange={(event) => setApoyoNombre(event.target.value)}
                  required
                  list="apoyo-sugerencias-opcional"
                  className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Ej: Agenda visual"
                />
                <datalist id="apoyo-sugerencias-opcional">
                  <option value="Agenda visual" />
                  <option value="Pictogramas" />
                  <option value="Temporizador visual" />
                  <option value="Compañero tutor" />
                </datalist>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-700">
                  Descripción
                </span>
                <textarea
                  value={apoyoDescripcion}
                  onChange={(event) => setApoyoDescripcion(event.target.value)}
                  required
                  rows={2}
                  className="w-full resize-y rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Contexto de la declaración del equipo"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-700">
                    Fecha de inicio
                  </span>
                  <input
                    type="date"
                    value={apoyoFechaInicio}
                    onChange={(event) => setApoyoFechaInicio(event.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-700">
                    Fecha de término{" "}
                    <span className="font-normal text-slate-400">(opcional)</span>
                  </span>
                  <input
                    type="date"
                    value={apoyoFechaTermino}
                    onChange={(event) => setApoyoFechaTermino(event.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={
                  isSavingApoyo ||
                  !apoyoNombre.trim() ||
                  !apoyoDescripcion.trim() ||
                  !apoyoFechaInicio.trim()
                }
                className="inline-flex items-center justify-center rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Guardar declaración
              </button>
            </div>
          </form>
        </div>
      </details>

      {pendingDeleteApoyoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              ¿Eliminar esta declaración?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {GLOSSARY.intervencion.apoyosNoModifican}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPendingDeleteApoyoId(null)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteApoyo}
                className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ApoyoCard({
  apoyo,
  activo = false,
  onDelete,
}: {
  apoyo: ApoyoImplementado;
  activo?: boolean;
  onDelete: () => void;
}) {
  return (
    <li className="rounded-xl border border-slate-100 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">{apoyo.nombre}</p>
            {activo && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                Activo
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-600">{apoyo.descripcion}</p>
          <p className="mt-1 text-xs text-slate-500">
            Inicio: {formatApoyoFechaDisplay(apoyo.fechaInicio)}
            {apoyo.fechaTermino
              ? ` · Término: ${formatApoyoFechaDisplay(apoyo.fechaTermino)}`
              : " · Sin fecha de término"}
          </p>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="shrink-0 text-xs font-medium text-slate-500 hover:text-rose-700"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}
