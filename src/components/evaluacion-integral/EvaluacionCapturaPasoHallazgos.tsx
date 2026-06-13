"use client";

import { HallazgoEntradaHibrida } from "@/components/perfil/HallazgoEntradaHibrida";
import { EVALUACION_CAPTURA_GRUPOS } from "@/components/evaluacion-integral/evaluacion-captura-config";
import { GLOSSARY } from "@/lib/copy/glossary";
import { getHallazgoBusquedaPlaceholder } from "@/lib/hallazgo-catalogo-utils";
import type { HallazgoEvaluativoView } from "@/lib/evaluacion-integral/evaluacion-integral-view";
import { hallazgoEsUnicoSustentoDeConclusion } from "@/lib/evaluacion-integral/conclusion-evaluativa-persistence";
import { deleteHallazgoEvaluativo } from "@/lib/evaluacion-integral/hallazgo-evaluativo-storage";
import type { HallazgoTipo } from "@/lib/perfil-hallazgos-storage";
import { useState } from "react";

const COPY = GLOSSARY.evaluacionCaptura;

type EvaluacionCapturaPasoHallazgosProps = {
  evaluacionId: string;
  estudianteId: string;
  hallazgosPorTipo: Record<HallazgoTipo, HallazgoEvaluativoView[]>;
  onHallazgosChange: () => void;
  onDerivarConclusion?: (hallazgoId: string) => void;
};

export function EvaluacionCapturaPasoHallazgos({
  evaluacionId,
  estudianteId,
  hallazgosPorTipo,
  onHallazgosChange,
  onDerivarConclusion,
}: EvaluacionCapturaPasoHallazgosProps) {
  const [addingTipo, setAddingTipo] = useState<HallazgoTipo | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleDelete(hallazgoId: string) {
    setDeleteError(null);
    if (
      hallazgoEsUnicoSustentoDeConclusion(evaluacionId, hallazgoId) ||
      !deleteHallazgoEvaluativo(hallazgoId)
    ) {
      setDeleteError(COPY.errorEliminarHallazgoSustento);
      return;
    }
    onHallazgosChange();
  }

  return (
    <div className="space-y-4">
      {deleteError ? (
        <p className="text-sm text-rose-700" role="alert">
          {deleteError}
        </p>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-2">
      {EVALUACION_CAPTURA_GRUPOS.map((grupo) => {
        const items = hallazgosPorTipo[grupo.tipo];
        const isAdding = addingTipo === grupo.tipo;

        return (
          <section
            key={grupo.tipo}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 sm:p-6"
          >
            <h3 className="text-sm font-semibold text-slate-900">{grupo.title}</h3>

            {items.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">{grupo.emptyLabel}</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {items.map((hallazgo) => (
                  <li
                    key={hallazgo.id}
                    className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-sm font-medium text-slate-800">
                      {hallazgo.nombre}
                    </span>
                    <div className="flex shrink-0 gap-2">
                      {onDerivarConclusion ? (
                        <button
                          type="button"
                          onClick={() => onDerivarConclusion(hallazgo.id)}
                          className="text-xs font-semibold text-violet-700"
                        >
                          {COPY.derivarConclusion}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleDelete(hallazgo.id)}
                        className="text-xs font-medium text-rose-700"
                      >
                        {COPY.eliminarHallazgo}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {isAdding ? (
              <div className="mt-4">
                <HallazgoEntradaHibrida
                  estudianteId={estudianteId}
                  tipo={grupo.tipo}
                  accent={grupo.accent}
                  modoPersistencia="evaluativo"
                  evaluacionIntegralId={evaluacionId}
                  placeholder={getHallazgoBusquedaPlaceholder(grupo.tipo)}
                  onAdded={() => {
                    setAddingTipo(null);
                    onHallazgosChange();
                  }}
                  onCancel={() => setAddingTipo(null)}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingTipo(grupo.tipo)}
                className="mt-4 text-sm font-semibold text-violet-700 hover:text-violet-900"
              >
                {grupo.addLabel}
              </button>
            )}
          </section>
        );
      })}
      </div>
    </div>
  );
}
