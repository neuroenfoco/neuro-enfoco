"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { readEvaluacionesIntegrales } from "@/lib/evaluacion-integral/evaluacion-integral-persistence";
import {
  getEvaluacionIntegralEstadoLabel,
  getEvaluacionIntegralTipoLabel,
  getFechaReferenciaEvaluacion,
} from "@/lib/evaluacion-integral/evaluacion-integral-view";
import {
  syncPACIObjetivos,
  updatePACIBorrador,
} from "@/lib/paci/paci-storage";
import type { PACI } from "@/lib/paci/paci-types";
import { getObjetivosPIEByEstudianteId } from "@/lib/pie-objectives-storage";
import { useMemo, useState } from "react";

const COPY = GLOSSARY.paci;

type PACIBorradorEditorProps = {
  paci: PACI;
  selectedObjetivoIds: string[];
  onSaved: () => void;
};

export function PACIBorradorEditor({
  paci,
  selectedObjetivoIds,
  onSaved,
}: PACIBorradorEditorProps) {
  const [sintesis, setSintesis] = useState(paci.sintesisInstitucional ?? "");
  const [evaluacionId, setEvaluacionId] = useState(
    paci.evaluacionReferenciaId ?? ""
  );
  const [objetivoIds, setObjetivoIds] = useState<string[]>(selectedObjetivoIds);
  const [periodoInicio, setPeriodoInicio] = useState(paci.periodoInicio ?? "");
  const [periodoFin, setPeriodoFin] = useState(paci.periodoFin ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluaciones = useMemo(
    () =>
      readEvaluacionesIntegrales()
        .filter((item) => item.estudianteId === paci.estudianteId)
        .sort((a, b) =>
          getFechaReferenciaEvaluacion(b).localeCompare(
            getFechaReferenciaEvaluacion(a)
          )
        ),
    [paci.estudianteId]
  );

  const objetivos = useMemo(
    () => getObjetivosPIEByEstudianteId(paci.estudianteId),
    [paci.estudianteId, objetivoIds.length]
  );

  function toggleObjetivo(id: string) {
    setObjetivoIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setError(null);

    const updated = updatePACIBorrador(paci.id, {
      sintesisInstitucional: sintesis,
      evaluacionReferenciaId: evaluacionId || undefined,
      periodoInicio: periodoInicio || undefined,
      periodoFin: periodoFin || undefined,
    });

    if (!updated) {
      setIsSaving(false);
      setError("No se pudieron guardar los cambios del borrador.");
      return;
    }

    const synced = syncPACIObjetivos(paci.id, objetivoIds);
    setIsSaving(false);

    if (!synced) {
      setError("No se pudieron sincronizar los objetivos seleccionados.");
      return;
    }

    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-amber-200/70 bg-amber-50/20 p-6"
    >
      <h2 className="text-sm font-semibold text-slate-900">Edición del borrador</h2>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        {COPY.sintesisInstitucional}
        <textarea
          value={sintesis}
          onChange={(event) => setSintesis(event.target.value)}
          rows={4}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <span className="mt-1 block text-xs text-slate-500">
          {COPY.sintesisInstitucionalAyuda}
        </span>
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          {COPY.periodoInicio}
          <input
            type="date"
            value={periodoInicio}
            onChange={(event) => setPeriodoInicio(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          {COPY.periodoFin}
          <input
            type="date"
            value={periodoFin}
            onChange={(event) => setPeriodoFin(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </label>
      </div>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        {COPY.evaluacionReferencia}
        <select
          value={evaluacionId}
          onChange={(event) => setEvaluacionId(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Sin evaluación de referencia</option>
          {evaluaciones.map((evaluacion) => (
            <option key={evaluacion.id} value={evaluacion.id}>
              {getEvaluacionIntegralTipoLabel(evaluacion.tipo)} ·{" "}
              {getFechaReferenciaEvaluacion(evaluacion)} ·{" "}
              {getEvaluacionIntegralEstadoLabel(evaluacion.estado)}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-6">
        <p className="text-sm font-medium text-slate-700">{COPY.seleccionarObjetivos}</p>
        {objetivos.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">{COPY.sinObjetivosEstudiante}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {objetivos.map((objetivo) => (
              <li key={objetivo.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
                  <input
                    type="checkbox"
                    checked={objetivoIds.includes(objetivo.id)}
                    onChange={() => toggleObjetivo(objetivo.id)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="font-medium text-slate-900">{objetivo.nombre}</span>
                    {objetivo.dimensionRelacionada ? (
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {objetivo.dimensionRelacionada}
                      </span>
                    ) : null}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="mt-6">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSaving ? COPY.guardando : COPY.guardarCambios}
        </button>
      </div>
    </form>
  );
}
