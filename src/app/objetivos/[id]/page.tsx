"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import { ApoyoImplementadoOpcionalSection } from "@/components/objetivos/ApoyoImplementadoOpcionalSection";
import { ApoyosConsolidadosSection } from "@/components/objetivos/ApoyosConsolidadosSection";
import { getApoyosConsolidadosPorObjetivo } from "@/lib/apoyos-consolidados-objetivo";
import {
  formatImpactoPromedio,
  getBarreraDetectadaDisplay,
  getFechaLineaBaseDisplay,
  getLineaBaseDisplay,
  getObjetivoPIEDetalle,
  type ObjetivoPIEDetalle,
} from "@/lib/pie-objectives-storage";
import { enrichObjetivoPIEResumen } from "@/lib/evaluacion-integral/planificacion-evaluativa-view";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ObjetivoPIEDetallePage() {
  const params = useParams<{ id: string }>();
  const objetivoId = params.id;
  const [detalle, setDetalle] = useState<ObjetivoPIEDetalle | null>(() => {
    if (typeof window === "undefined") return null;
    const base = getObjetivoPIEDetalle(objetivoId);
    if (!base) return null;
    return { ...base, resumen: enrichObjetivoPIEResumen(base.resumen) };
  });
  const [consolidados, setConsolidados] = useState(() =>
    typeof window === "undefined"
      ? null
      : getApoyosConsolidadosPorObjetivo(objetivoId)
  );

  function refreshDetalle() {
    const base = getObjetivoPIEDetalle(objetivoId);
    if (base) {
      setDetalle({
        ...base,
        resumen: enrichObjetivoPIEResumen(base.resumen),
      });
    } else {
      setDetalle(null);
    }
    setConsolidados(getApoyosConsolidadosPorObjetivo(objetivoId));
  }

  useEffect(() => {
    refreshDetalle();
    window.addEventListener("focus", refreshDetalle);
    window.addEventListener("storage", refreshDetalle);

    return () => {
      window.removeEventListener("focus", refreshDetalle);
      window.removeEventListener("storage", refreshDetalle);
    };
  }, [objetivoId]);

  if (!detalle || !consolidados) {
    return (
      <AppShell activeNav="objetivos">
        <main className="flex flex-1 items-center justify-center px-8 py-10 text-slate-600">
          <div className="max-w-md rounded-2xl border border-slate-200/70 bg-white p-8 text-center shadow-sm">
            <p className="text-sm">Objetivo PIE no encontrado.</p>
            <Link
              href={ROUTES.objetivos}
              className="mt-4 inline-flex text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              Volver a objetivos
            </Link>
          </div>
        </main>
      </AppShell>
    );
  }

  const {
    resumen,
    estudianteNombre,
    metaLogroSeguimiento,
    apoyos,
    fortalezasMasObservadas,
    evidenciasTimeline,
  } = detalle;
  const { objetivo, estado, cantidadEvidencias, impactoPromedio, ultimaEvidencia } =
    resumen;

  return (
    <AppShell activeNav="objetivos">
      <main className="flex-1 px-8 py-10">
        <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={ROUTES.objetivos}
            className="text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            ← Volver a objetivos
          </Link>
          <Link
            href={`/objetivos/${objetivoId}/editar`}
            className="inline-flex items-center justify-center rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-800 transition hover:bg-violet-100"
          >
            Editar objetivo
          </Link>
        </div>

        <section className="mt-6 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/40 to-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800/80">
            {GLOSSARY.barreras.detectada}
          </p>
          <p className="mt-3 text-base leading-relaxed text-slate-800">
            {getBarreraDetectadaDisplay(objetivo)}
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/30 to-white p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-800/80">
            {GLOSSARY.planificacionEvaluativa.trazabilidadTitulo}
          </p>
          {!resumen.tieneTrazabilidadEvaluativa ? (
            <p className="mt-3 text-sm text-slate-600">
              {GLOSSARY.planificacionEvaluativa.sinTrazabilidad}
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {resumen.conclusionesSustentantes.map((conclusion) => (
                <li
                  key={conclusion.id}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <p className="font-medium text-slate-900">
                    {conclusion.prioridadLabel}
                  </p>
                  <p className="mt-1 text-slate-700">{conclusion.enunciado}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {conclusion.evaluacionTipoLabel} ·{" "}
                    {conclusion.evaluacionFechaReferencia}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <header className="mt-8 rounded-2xl border border-violet-200/50 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
            Objetivo
          </p>
          <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {objetivo.nombre}
            </h1>
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 px-4 py-3 lg:max-w-md lg:shrink-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800/80">
                Meta esperada
              </p>
              <p className="mt-1 text-sm font-medium leading-relaxed text-emerald-950">
                {metaLogroSeguimiento.metaLogro}
              </p>
            </div>
          </div>
          {objetivo.descripcion && (
            <p className="mt-4 text-sm text-slate-600">{objetivo.descripcion}</p>
          )}

          <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            <HeaderMetric label="Estudiante" value={estudianteNombre} />
            <HeaderMetric
              label="Dimensión relacionada"
              value={objetivo.dimensionRelacionada}
            />
            <HeaderMetric label="Estado" value={estado} />
            <HeaderMetric
              label="Impacto promedio"
              value={`${formatImpactoPromedio(impactoPromedio)} niveles`}
            />
            <HeaderMetric
              label="Cantidad de evidencias"
              value={String(cantidadEvidencias)}
            />
          </div>
        </header>

        <section className="mt-8 rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 to-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800/80">
            Meta Esperada
          </p>
          <p className="mt-3 text-base leading-relaxed font-medium text-slate-800">
            {metaLogroSeguimiento.metaLogro}
          </p>
          {metaLogroSeguimiento.porcentajeAvance === null && (
            <p className="mt-3 text-xs text-slate-500">
              Avance respecto de la meta: pendiente de cálculo automático (
              {metaLogroSeguimiento.evidenciasAsociadas} evidencias asociadas).
            </p>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50/40 to-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-800/80">
            Situación Inicial
          </p>
          <p className="mt-4 text-xs font-medium text-slate-500">Línea base</p>
          <p className="mt-1 text-base leading-relaxed text-slate-800">
            {getLineaBaseDisplay(objetivo)}
          </p>
          <p className="mt-4 text-xs font-medium text-slate-500">
            Fecha de línea base
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {getFechaLineaBaseDisplay(objetivo)}
          </p>
        </section>

        <ApoyosConsolidadosSection consolidados={consolidados} />

        <ApoyoImplementadoOpcionalSection
          objetivoId={objetivoId}
          apoyos={apoyos}
          onRefresh={refreshDetalle}
        />

        <section className="mt-8 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
          <h2 className="text-sm font-semibold text-slate-900">
            Evidencias de avance
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {GLOSSARY.intervencion.sintesisEvidencias}
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Impacto promedio"
              value={`${formatImpactoPromedio(impactoPromedio)} niveles`}
            />
            <SummaryCard label="Última evidencia" value={ultimaEvidencia} />
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <p className="text-xs text-slate-500">
                Fortalezas más observadas en las evidencias
              </p>
              {fortalezasMasObservadas.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">Sin fortalezas registradas</p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {fortalezasMasObservadas.map((item) => (
                    <li
                      key={item.name}
                      className="text-sm font-medium text-slate-800"
                    >
                      {item.name} ({item.count})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-8">
          <h3 className="text-sm font-semibold text-slate-900">
            Línea de tiempo de evidencias
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {GLOSSARY.intervencion.historiaProgreso}
          </p>

          {evidenciasTimeline.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">
              {GLOSSARY.intervencion.sinAsociadasObjetivo}
            </p>
          ) : (
            <ol className="relative mt-8 space-y-0">
              {evidenciasTimeline.map((evidencia, index) => (
                <li
                  key={evidencia.id}
                  className="relative flex gap-4 pb-10 last:pb-0"
                >
                  {index < evidenciasTimeline.length - 1 && (
                    <span
                      className="absolute left-[15px] top-10 h-[calc(100%-1.5rem)] w-px bg-violet-100"
                      aria-hidden
                    />
                  )}
                  <span className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 ring-4 ring-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-violet-600" />
                  </span>
                  <article className="min-w-0 flex-1 rounded-xl border border-violet-100/80 bg-gradient-to-br from-violet-50/30 to-white px-5 py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-violet-700/80">
                      {evidencia.fecha}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <EmotionPill
                        label="Estado inicial"
                        emoji={evidencia.estadoInicialEmoji}
                        value={evidencia.estadoInicial}
                      />
                      <span className="self-center text-slate-300" aria-hidden>
                        →
                      </span>
                      <EmotionPill
                        label="Estado final"
                        emoji={evidencia.estadoFinalEmoji}
                        value={evidencia.estadoFinal}
                      />
                    </div>
                    <p className="mt-3 text-sm text-slate-700">
                      <span className="font-medium text-slate-800">Impacto:</span>{" "}
                      {evidencia.impactoLabel}
                    </p>
                    <div className="mt-3">
                      <p className="text-xs font-medium text-slate-500">
                        Fortalezas observadas
                      </p>
                      {evidencia.fortalezas.length === 0 ? (
                        <p className="mt-1 text-sm text-slate-500">Ninguna</p>
                      ) : (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {evidencia.fortalezas.map((fortaleza) => (
                            <span
                              key={fortaleza}
                              className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-800"
                            >
                              {fortaleza}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                      <span className="font-medium text-slate-800">
                        Logro observado:
                      </span>{" "}
                      {evidencia.logro}
                    </p>
                  </article>
                </li>
              ))}
            </ol>
          )}
          </div>
        </section>
        </div>
      </main>

    </AppShell>
  );
}

function HeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function EmotionPill({
  label,
  emoji,
  value,
}: {
  label: string;
  emoji: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2">
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
        <span aria-hidden>{emoji}</span>
        {value}
      </p>
    </div>
  );
}
