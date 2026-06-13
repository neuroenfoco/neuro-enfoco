"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import type { IngresoPieMarcoInput } from "@/lib/ingreso-pie";

const COPY = GLOSSARY.ingresoPie;

type IngresoPiePasoMarcoProps = {
  estudiante: { nombre: string; curso: string };
  marco: IngresoPieMarcoInput;
  onEstudianteChange: (value: { nombre: string; curso: string }) => void;
  onMarcoChange: (value: IngresoPieMarcoInput) => void;
};

const inputClassName =
  "w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20";

export function IngresoPiePasoMarco({
  estudiante,
  marco,
  onEstudianteChange,
  onMarcoChange,
}: IngresoPiePasoMarcoProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-slate-600">{COPY.precondicion}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Nombre del estudiante
          </span>
          <input
            type="text"
            required
            value={estudiante.nombre}
            onChange={(event) =>
              onEstudianteChange({ ...estudiante, nombre: event.target.value })
            }
            className={inputClassName}
            placeholder="Ej: Tomás Herrera"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Curso
          </span>
          <input
            type="text"
            required
            value={estudiante.curso}
            onChange={(event) =>
              onEstudianteChange({ ...estudiante, curso: event.target.value })
            }
            className={inputClassName}
            placeholder="Ej: 4° Básico"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {COPY.fechaIngreso}
          </span>
          <input
            type="date"
            required
            value={marco.fechaIngresoPIE}
            onChange={(event) =>
              onMarcoChange({ ...marco, fechaIngresoPIE: event.target.value })
            }
            className={inputClassName}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {COPY.proximaReevaluacion}
          </span>
          <input
            type="date"
            value={marco.fechaProximaReevaluacionIntegral ?? ""}
            onChange={(event) =>
              onMarcoChange({
                ...marco,
                fechaProximaReevaluacionIntegral:
                  event.target.value || undefined,
              })
            }
            className={inputClassName}
          />
          <p className="mt-1.5 text-xs text-slate-500">
            {COPY.proximaReevaluacionAyuda}
          </p>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {COPY.tipoNee}
          </span>
          <input
            type="text"
            value={marco.tipoNEE ?? ""}
            onChange={(event) =>
              onMarcoChange({
                ...marco,
                tipoNEE: event.target.value || undefined,
              })
            }
            className={inputClassName}
            placeholder="Ej: TEA, TDAH, DEA…"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {COPY.diagnosticoPrincipal}
          </span>
          <input
            type="text"
            value={marco.diagnosticoPrincipal ?? ""}
            onChange={(event) =>
              onMarcoChange({
                ...marco,
                diagnosticoPrincipal: event.target.value || undefined,
              })
            }
            className={inputClassName}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {COPY.referenciaEvaluacion}
          </span>
          <input
            type="text"
            value={marco.referenciaEvaluacionPrevia ?? ""}
            onChange={(event) =>
              onMarcoChange({
                ...marco,
                referenciaEvaluacionPrevia: event.target.value || undefined,
              })
            }
            className={inputClassName}
            placeholder="Ej: FUDEI 2025, equipo evaluador"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {COPY.observacionesInstitucionales}
          </span>
          <textarea
            value={marco.observacionesInstitucionales ?? ""}
            onChange={(event) =>
              onMarcoChange({
                ...marco,
                observacionesInstitucionales: event.target.value || undefined,
              })
            }
            rows={3}
            className={inputClassName}
          />
        </label>
      </div>
    </div>
  );
}
