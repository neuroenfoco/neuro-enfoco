"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import type { ConclusionEvaluativaView } from "@/lib/evaluacion-integral/evaluacion-integral-view";
import { linkConclusionToObjetivo } from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-storage";
import {
  getObjetivosPIEByEstudianteId,
  type ObjetivoPIE,
} from "@/lib/pie-objectives-storage";
import Link from "next/link";
import { useMemo, useState } from "react";

const COPY = GLOSSARY.planificacionEvaluativa;

type VincularObjetivoExistenteModalProps = {
  conclusion: ConclusionEvaluativaView;
  estudianteId: string;
  onClose: () => void;
  onLinked: () => void;
};

export function VincularObjetivoExistenteModal({
  conclusion,
  estudianteId,
  onClose,
  onLinked,
}: VincularObjetivoExistenteModalProps) {
  const [selectedObjetivoId, setSelectedObjetivoId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const objetivosDisponibles = useMemo(() => {
    const vinculados = new Set(
      conclusion.objetivosVinculados.map((item) => item.objetivoId)
    );
    return getObjetivosPIEByEstudianteId(estudianteId).filter(
      (objetivo) => !vinculados.has(objetivo.id)
    );
  }, [conclusion, estudianteId]);

  function handleVincular() {
    if (!selectedObjetivoId || isSaving) return;

    setIsSaving(true);
    setError(null);

    const linked = linkConclusionToObjetivo({
      conclusionEvaluativaId: conclusion.id,
      objetivoPieId: selectedObjetivoId,
    });

    if (!linked) {
      setError(COPY.errorVincular);
      setIsSaving(false);
      return;
    }

    onLinked();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vincular-objetivo-title"
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <h2
          id="vincular-objetivo-title"
          className="text-lg font-semibold text-slate-900"
        >
          {COPY.vincularObjetivoTitulo}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{COPY.vincularObjetivoSub}</p>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-800">
          {conclusion.enunciado}
        </p>

        {objetivosDisponibles.length === 0 ? (
          <p className="mt-4 text-sm text-amber-800">{COPY.sinObjetivosDisponibles}</p>
        ) : (
          <ul className="mt-4 max-h-60 space-y-2 overflow-y-auto">
            {objetivosDisponibles.map((objetivo: ObjetivoPIE) => (
              <li key={objetivo.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm hover:border-violet-200">
                  <input
                    type="radio"
                    name="objetivo-vinculo"
                    value={objetivo.id}
                    checked={selectedObjetivoId === objetivo.id}
                    onChange={() => setSelectedObjetivoId(objetivo.id)}
                    className="mt-0.5 h-4 w-4 border-slate-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span>
                    <span className="font-medium text-slate-900">
                      {objetivo.nombre}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {objetivo.dimensionRelacionada}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}

        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700"
          >
            {COPY.cancelar}
          </button>
          <Link
            href={`/objetivos/nuevo?estudianteId=${estudianteId}&conclusionId=${conclusion.id}`}
            className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-800"
          >
            {COPY.crearObjetivo}
          </Link>
          <button
            type="button"
            disabled={!selectedObjetivoId || isSaving}
            onClick={handleVincular}
            className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSaving ? COPY.vinculando : COPY.confirmarVinculo}
          </button>
        </div>
      </div>
    </div>
  );
}
