"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import type { IngresoPieMarcoInput } from "@/lib/ingreso-pie";
import type { Estudiante } from "@/lib/students-storage";
import Link from "next/link";

const COPY = GLOSSARY.ingresoPie;

type IngresoPiePasoMarcoProps = {
  estudiantes: Estudiante[];
  estudianteId: string;
  marco: IngresoPieMarcoInput;
  onEstudianteIdChange: (estudianteId: string) => void;
  onMarcoChange: (value: IngresoPieMarcoInput) => void;
};

const inputClassName =
  "w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20";

export function IngresoPiePasoMarco({
  estudiantes,
  estudianteId,
  marco,
  onEstudianteIdChange,
  onMarcoChange,
}: IngresoPiePasoMarcoProps) {
  const estudianteSeleccionado =
    estudiantes.find((item) => item.id === estudianteId) ?? null;

  if (estudiantes.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-slate-600">{COPY.precondicion}</p>
        <div className="rounded-2xl border border-dashed border-amber-200/80 bg-amber-50/40 p-6 text-center">
          <p className="text-sm text-amber-900">{COPY.sinEstudiantes}</p>
          <Link
            href={ROUTES.estudiantesNuevo}
            className="mt-4 inline-flex rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            {COPY.crearEstudianteCta}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-slate-600">{COPY.precondicion}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {COPY.seleccionaEstudiante} *
          </span>
          <select
            required
            value={estudianteId}
            onChange={(event) => onEstudianteIdChange(event.target.value)}
            className={inputClassName}
          >
            <option value="">{COPY.selectorEstudiantePlaceholder}</option>
            {estudiantes.map((estudiante) => (
              <option key={estudiante.id} value={estudiante.id}>
                {estudiante.nombre}
              </option>
            ))}
          </select>
        </label>

        {estudianteSeleccionado ? (
          <div className="sm:col-span-2 rounded-xl border border-slate-200/80 bg-slate-50/60 px-4 py-3">
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">{COPY.estudianteNombreLabel}</dt>
                <dd className="mt-0.5 font-medium text-slate-900">
                  {estudianteSeleccionado.nombre}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">{COPY.estudianteCursoLabel}</dt>
                <dd className="mt-0.5 font-medium text-slate-900">
                  {estudianteSeleccionado.curso}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}

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
