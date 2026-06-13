"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import type { ResumenEvaluacion } from "@/lib/evaluacion-integral/evaluacion-integral-view";
import { formatMarcoFechaDisplay } from "@/lib/marco-institucional-pie-storage";

const COPY = GLOSSARY.evaluacionCaptura;

type EvaluacionCapturaPasoCierreProps = {
  resumen: ResumenEvaluacion;
  fechaTermino?: string;
  sintesis: string;
  onSintesisChange: (value: string) => void;
};

export function EvaluacionCapturaPasoCierre({
  resumen,
  fechaTermino,
  sintesis,
  onSintesisChange,
}: EvaluacionCapturaPasoCierreProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {COPY.campoSintesis}
        </h3>
        <p className="mt-2 text-sm text-slate-600">{COPY.sintesisAyuda}</p>
        <textarea
          rows={8}
          value={sintesis}
          onChange={(event) => onSintesisChange(event.target.value)}
          className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-relaxed"
          placeholder={COPY.sintesisAyuda}
        />
      </section>

      <section className="rounded-2xl border border-violet-200/60 bg-violet-50/30 p-6 sm:p-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-violet-900">
          {COPY.revisionTitulo}
        </h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-slate-500">
              {COPY.revisionParticipantes}
            </dt>
            <dd className="mt-0.5 text-2xl font-semibold text-slate-900">
              {resumen.cantidadParticipantes}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">
              {COPY.revisionHallazgos}
            </dt>
            <dd className="mt-0.5 text-2xl font-semibold text-slate-900">
              {resumen.cantidadHallazgosEvaluativos}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">
              {COPY.revisionResponsable}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-900">
              {resumen.responsableProceso
                ? resumen.responsableProceso.profesionalNombre
                : COPY.revisionResponsableNo}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">
              {COPY.revisionFechas}
            </dt>
            <dd className="mt-0.5 text-sm text-slate-800">
              Inicio: {formatMarcoFechaDisplay(resumen.fechaInicio)}
              {fechaTermino?.trim() ? (
                <>
                  {" "}
                  · Cierre previsto:{" "}
                  {formatMarcoFechaDisplay(fechaTermino)}
                </>
              ) : null}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
