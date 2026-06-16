"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import { ApoyoImplementadoOpcionalSection } from "@/components/objetivos/ApoyoImplementadoOpcionalSection";
import { ApoyosConsolidadosSection } from "@/components/objetivos/ApoyosConsolidadosSection";
import { ApoyosObjetivoPanel } from "@/components/apoyos/ApoyosObjetivoPanel";
import { ObjetivoBarrerasApoyosPanel } from "@/components/apoyos/ObjetivoBarrerasApoyosPanel";
import { ObjetivoCondicionesParticipacionSection } from "@/components/objetivos/ObjetivoCondicionesParticipacionSection";
import { ObjetivoFacilitadoresParticipacionSection } from "@/components/objetivos/ObjetivoFacilitadoresParticipacionSection";
import { ObjetivoDetalleHeader } from "@/components/objetivos/ObjetivoDetalleHeader";
import type { ApoyoPIETipo } from "@/lib/apoyos/apoyos-types";
import { getApoyosConsolidadosPorObjetivo } from "@/lib/apoyos-consolidados-objetivo";
import {
  formatImpactoPromedio,
  getFechaLineaBaseDisplay,
  getLineaBaseDisplay,
  getObjetivoPIEDetalle,
  type ObjetivoPIEDetalle,
} from "@/lib/pie-objectives-storage";
import { enrichObjetivoPIEResumen } from "@/lib/evaluacion-integral/planificacion-evaluativa-view";
import { getEstudiantesRepositoryAsync } from "@/lib/repositories/repository-factory";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const DETALLE_COPY = GLOSSARY.objetivo.detalle;

export default function ObjetivoPIEDetallePage() {
  const params = useParams<{ id: string }>();
  const objetivoId = params.id;
  const [detalle, setDetalle] = useState<ObjetivoPIEDetalle | null>(null);
  const [consolidados, setConsolidados] = useState<ReturnType<
    typeof getApoyosConsolidadosPorObjetivo
  > | null>(null);
  const [prefilledApoyo, setPrefilledApoyo] = useState<{
    nombre: string;
    tipo: ApoyoPIETipo;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshDetalle = useCallback(async () => {
    const base = getObjetivoPIEDetalle(objetivoId);
    if (!base) {
      setDetalle(null);
      setConsolidados(getApoyosConsolidadosPorObjetivo(objetivoId));
      return;
    }

    let estudianteNombre = base.estudianteNombre;
    try {
      const estudiante = await getEstudiantesRepositoryAsync().getById(
        base.resumen.objetivo.estudianteId
      );
      if (estudiante) estudianteNombre = estudiante.nombre;
    } catch {
      // Conserva el nombre de respaldo del storage.
    }

    setDetalle({
      ...base,
      estudianteNombre,
      resumen: enrichObjetivoPIEResumen(base.resumen),
    });
    setConsolidados(getApoyosConsolidadosPorObjetivo(objetivoId));
  }, [objetivoId]);

  useEffect(() => {
    setIsLoading(true);
    void refreshDetalle().finally(() => setIsLoading(false));
    const onRefresh = () => {
      setIsLoading(true);
      void refreshDetalle().finally(() => setIsLoading(false));
    };
    window.addEventListener("focus", onRefresh);
    window.addEventListener("storage", onRefresh);

    return () => {
      window.removeEventListener("focus", onRefresh);
      window.removeEventListener("storage", onRefresh);
    };
  }, [refreshDetalle]);

  if (isLoading) {
    return (
      <AppShell activeNav="objetivos">
        <main className="flex flex-1 items-center justify-center px-8 py-10 text-slate-500">
          <p className="text-sm">Cargando objetivo…</p>
        </main>
      </AppShell>
    );
  }

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
  const { objetivo, cantidadEvidencias, impactoPromedio, ultimaEvidencia } =
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

          <div className="mt-6">
            <ObjetivoDetalleHeader
              objetivoId={objetivoId}
              nombre={objetivo.nombre}
              metaLogro={metaLogroSeguimiento.metaLogro}
              descripcion={objetivo.descripcion}
              estudianteNombre={estudianteNombre}
              dimensionRelacionada={objetivo.dimensionRelacionada}
            />
          </div>

          <ObjetivoBarrerasApoyosPanel
            objetivoId={objetivoId}
            sections={["fundamento"]}
          />

          <ObjetivoCondicionesParticipacionSection
            objetivo={objetivo}
            objetivoId={objetivoId}
          />

          <ObjetivoFacilitadoresParticipacionSection
            estudianteId={objetivo.estudianteId}
          />

          <section className="mt-8 rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50/40 to-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-800/80">
              {DETALLE_COPY.situacionInicial}
            </h2>
            <p className="mt-4 text-xs font-medium text-slate-500">
              {DETALLE_COPY.lineaBase}
            </p>
            <p className="mt-1 text-base leading-relaxed text-slate-800">
              {getLineaBaseDisplay(objetivo)}
            </p>
            <p className="mt-4 text-xs font-medium text-slate-500">
              {DETALLE_COPY.fechaLineaBase}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800">
              {getFechaLineaBaseDisplay(objetivo)}
            </p>
          </section>

          <ApoyosObjetivoPanel
            objetivoId={objetivoId}
            estudianteId={objetivo.estudianteId}
            prefilled={prefilledApoyo}
            onPrefilledConsumed={() => setPrefilledApoyo(null)}
            onVinculosChanged={refreshDetalle}
            primary
          />

          <ObjetivoBarrerasApoyosPanel
            objetivoId={objetivoId}
            sections={["apoyosSugeridos"]}
            onCrearApoyoDesdeSugerido={(apoyo) =>
              setPrefilledApoyo({ nombre: apoyo.nombre, tipo: apoyo.tipo })
            }
          />

          <ApoyosConsolidadosSection consolidados={consolidados} />

          <section className="mt-8 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
            <h2 className="text-sm font-semibold text-slate-900">
              {DETALLE_COPY.evidenciasTitulo}
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
              <SummaryCard
                label="Evidencias registradas"
                value={String(cantidadEvidencias)}
              />
            </div>

            {fortalezasMasObservadas.length > 0 ? (
              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <p className="text-xs text-slate-500">
                  Fortalezas más observadas en las evidencias
                </p>
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
              </div>
            ) : null}

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

          <ApoyoImplementadoOpcionalSection
            objetivoId={objetivoId}
            apoyos={apoyos}
            onRefresh={refreshDetalle}
          />
        </div>
      </main>
    </AppShell>
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
