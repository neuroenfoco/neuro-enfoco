"use client";

import { ConclusionEvaluativaCard } from "@/components/evaluacion-integral/ConclusionEvaluativaCard";
import { AppShell } from "@/components/layout/app-shell";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import { getPlanificacionDesdeEvaluacionView } from "@/lib/evaluacion-integral/planificacion-evaluativa-view";
import { formatMarcoFechaDisplay } from "@/lib/marco-institucional-pie-storage";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.planificacionEvaluativa;

type PlanificarDesdeEvaluacionPageProps = {
  params: Promise<{ id: string }>;
};

export default function PlanificarDesdeEvaluacionPage({
  params,
}: PlanificarDesdeEvaluacionPageProps) {
  const { id: evaluacionId } = use(params);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  useEffect(() => {
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  const vista = getPlanificacionDesdeEvaluacionView(evaluacionId);
  void refreshKey;

  if (!vista) {
    return (
      <AppShell activeNav="estudiantes">
        <main className="flex flex-1 items-center justify-center px-8 py-10">
          <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-600">{COPY.evaluacionNoEncontrada}</p>
            <Link
              href={ROUTES.estudiantes}
              className="mt-4 inline-flex text-sm font-medium text-teal-700"
            >
              {COPY.volverEstudiantes}
            </Link>
          </div>
        </main>
      </AppShell>
    );
  }

  const { evaluacion, resumen, conclusionesSinPlanificacion, porcentajeCoberturaPlanificacion } =
    vista;

  return (
    <AppShell activeNav="estudiantes">
      <main className="flex-1 px-8 py-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href={ROUTES.evaluacionCaptura(evaluacionId)}
            className="text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            ← {COPY.volverEvaluacion}
          </Link>

          <header className="mt-6">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {COPY.titulo}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{COPY.subtitulo}</p>
          </header>

          <section className="mt-8 rounded-2xl border border-violet-200/60 bg-violet-50/30 p-6">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-slate-500">{COPY.tipoEvaluacion}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                  {resumen.tipoLabel}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">{COPY.fechaReferencia}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                  {formatMarcoFechaDisplay(
                    resumen.fechaCierre ?? resumen.fechaInicio
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">
                  {COPY.coberturaPlanificacion}
                </dt>
                <dd className="mt-0.5 text-2xl font-semibold text-violet-800">
                  {porcentajeCoberturaPlanificacion}%
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">
                  {COPY.conclusionesSinRespuesta}
                </dt>
                <dd className="mt-0.5 text-2xl font-semibold text-amber-700">
                  {conclusionesSinPlanificacion.length}
                </dd>
              </div>
            </dl>
          </section>

          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              {COPY.listaPriorizada}
            </h2>
            {conclusionesSinPlanificacion.length === 0 ? (
              <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-sm text-emerald-900">
                {COPY.todasPlanificadas}
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {conclusionesSinPlanificacion.map((conclusion) => (
                  <li key={conclusion.id}>
                    <ConclusionEvaluativaCard
                      conclusion={conclusion}
                      showPlanificacion
                      estudianteId={evaluacion.estudianteId}
                      evaluacionEstado={evaluacion.estado}
                      onPlanificacionChange={refresh}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {vista.conclusionesPlanificadas.length > 0 ? (
            <section className="mt-10">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                {COPY.yaPlanificadas}
              </h2>
              <ul className="mt-4 space-y-4">
                {vista.conclusionesPlanificadas.map((conclusion) => (
                  <li key={conclusion.id}>
                    <ConclusionEvaluativaCard
                      conclusion={conclusion}
                      showPlanificacion
                      estudianteId={evaluacion.estudianteId}
                      evaluacionEstado={evaluacion.estado}
                      onPlanificacionChange={refresh}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </main>
    </AppShell>
  );
}
