"use client";

import { EstudianteObjetivosSeguimientoSection } from "@/components/estudiante/EstudianteObjetivosSeguimientoSection";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getApoyosConsolidadosPorObjetivo,
  getResumenBreveApoyosConsolidados,
} from "@/lib/apoyos-consolidados-objetivo";
import {
  formatInsightResumen,
  getEstudianteObjetivosFicha,
  getInsightTemplateLabel,
  getObjetivoPedagogiaDisplay,
  type EstudianteObjetivosFicha,
  type ObjetivoPIEFichaItem,
} from "@/lib/pie-objectives-ficha";
import {
  formatImpactoPromedio,
  type ObjetivoPIEEvidenciaTimelineItem,
} from "@/lib/pie-objectives-storage";
import Link from "next/link";
import { useEffect, useState } from "react";

type EstudianteObjetivosTabProps = {
  estudianteId: string;
  estudiantePrimerNombre: string;
};

export function EstudianteObjetivosTab({
  estudianteId,
  estudiantePrimerNombre,
}: EstudianteObjetivosTabProps) {
  const [ficha, setFicha] = useState<EstudianteObjetivosFicha | null>(null);

  useEffect(() => {
    function refresh() {
      setFicha(getEstudianteObjetivosFicha(estudianteId));
    }

    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [estudianteId]);

  if (!ficha) return null;

  return (
    <div className="space-y-8">
      <EstudianteObjetivosSeguimientoSection estudianteId={estudianteId} />

      <section className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/70 via-white to-teal-50/30 p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
              Seguimiento pedagógico individual
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">
              {GLOSSARY.objetivo.pieDe(estudiantePrimerNombre)}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              {GLOSSARY.intervencion.desdeIntervenciones}
            </p>
          </div>
          <Link
            href={`/objetivos/nuevo?estudianteId=${estudianteId}`}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-violet-700 hover:to-teal-700"
          >
            Nuevo objetivo
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <KpiCard label="Objetivos activos" value={String(ficha.totalObjetivos)} />
          <KpiCard label="Evidencias" value={String(ficha.totalEvidencias)} />
          <KpiCard
            label="Impacto promedio"
            value={
              ficha.impactoPromedioGeneral !== null
                ? `${formatImpactoPromedio(ficha.impactoPromedioGeneral)} niveles`
                : "Sin datos"
            }
          />
          <KpiCard label="Apoyos activos" value={String(ficha.totalApoyosActivos)} />
          <KpiCard
            label="Indicadores listos"
            value={String(ficha.insightsConsolidados.length)}
          />
        </div>
      </section>

      {ficha.insightsConsolidados.length > 0 && (
        <section className="rounded-2xl border border-teal-200/60 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
          <h3 className="text-sm font-semibold text-slate-900">
            Indicadores pedagógicos destacados
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {GLOSSARY.insights.motorAnalitico}
          </p>
          <ul className="mt-4 space-y-3">
            {ficha.insightsConsolidados.slice(0, 6).map((insight, index) => (
              <li
                key={`${insight.templateId}-${index}`}
                className="rounded-xl border border-teal-100 bg-teal-50/30 px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-800">
                    {getInsightTemplateLabel(insight.templateId)}
                  </span>
                  <ConfianzaBadge confianza={insight.confianza} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {formatInsightResumen(insight)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {ficha.objetivos.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-600">
            {GLOSSARY.objetivo.sinRegistrados}
          </p>
          <Link
            href={`/objetivos/nuevo?estudianteId=${estudianteId}`}
            className="mt-4 inline-flex text-sm font-semibold text-violet-700 hover:text-violet-800"
          >
            Crear primer objetivo
          </Link>
        </section>
      ) : (
        <div className="space-y-6">
          {ficha.objetivos.map((item) => (
            <ObjetivoSeguimientoCard key={item.detalle.resumen.objetivo.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function ObjetivoSeguimientoCard({ item }: { item: ObjetivoPIEFichaItem }) {
  const { detalle, insightsListos, indicadoresListos } = item;
  const { resumen, fortalezasMasObservadas, evidenciasTimeline, metaLogroSeguimiento } =
    detalle;
  const { objetivo, estado, cantidadEvidencias, impactoPromedio, ultimaEvidencia } =
    resumen;
  const apoyosConsolidados = getApoyosConsolidadosPorObjetivo(objetivo.id);
  const apoyosResumen = apoyosConsolidados
    ? getResumenBreveApoyosConsolidados(apoyosConsolidados)
    : null;
  const pedagogia = getObjetivoPedagogiaDisplay(objetivo);
  const evidenciasRecientes = evidenciasTimeline.slice(-3).reverse();

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
      <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href={`/objetivos/${objetivo.id}`}
              className="text-xl font-semibold text-slate-900 transition hover:text-violet-800"
            >
              {objetivo.nombre}
            </Link>
            <p className="mt-1 text-sm text-violet-700">{objetivo.dimensionRelacionada}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <EstadoBadge estado={estado} />
            {indicadoresListos > 0 && (
              <span className="rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800">
                {indicadoresListos} indicador{indicadoresListos === 1 ? "" : "es"} listo
                {indicadoresListos === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricChip label="Estado" value={estado} />
          <MetricChip
            label="Impacto"
            value={`${formatImpactoPromedio(impactoPromedio)} niveles`}
          />
          <MetricChip label="Evidencias" value={String(cantidadEvidencias)} />
          <MetricChip label="Última evidencia" value={ultimaEvidencia} />
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-3">
        <PedagogiaBlock
          title={GLOSSARY.barreras.detectada}
          value={pedagogia.barrera}
          accent="border-amber-200/60 bg-amber-50/20"
        />
        <PedagogiaBlock
          title="Línea base"
          value={pedagogia.lineaBase}
          subValue={pedagogia.fechaLineaBase}
          accent="border-sky-200/60 bg-sky-50/20"
        />
        <PedagogiaBlock
          title="Meta de logro"
          value={pedagogia.metaLogro}
          subValue={`${metaLogroSeguimiento.evidenciasAsociadas} evidencias asociadas`}
          accent="border-emerald-200/60 bg-emerald-50/20"
        />
      </div>

      <div className="grid gap-6 border-t border-slate-100 p-6 sm:p-8 lg:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Apoyos de participación
          </h4>
          {apoyosResumen ? (
            <>
              <p className="mt-1 text-xs text-slate-500">{apoyosResumen.texto}</p>
              {apoyosResumen.apoyosFrecuentes.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {apoyosResumen.apoyosFrecuentes.map((apoyo) => (
                    <li
                      key={apoyo.nombre}
                      className="rounded-lg border border-teal-100 bg-teal-50/30 px-3 py-2.5"
                    >
                      <p className="text-sm font-medium text-slate-800">
                        {apoyo.nombre}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {apoyo.intervencionesCount} intervención
                        {apoyo.intervencionesCount === 1 ? "" : "es"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  Sin apoyos documentados en intervenciones vinculadas.
                </p>
              )}
              <Link
                href={`/objetivos/${objetivo.id}#apoyos`}
                className="mt-3 inline-flex text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                Ver detalle de apoyos →
              </Link>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Sin información de apoyos consolidados.
            </p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Fortalezas observadas</h4>
          {fortalezasMasObservadas.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              Sin fortalezas registradas en evidencias.
            </p>
          ) : (
            <ul className="mt-3 flex flex-wrap gap-2">
              {fortalezasMasObservadas.map((fortaleza) => (
                <li
                  key={fortaleza.name}
                  className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-900"
                >
                  {fortaleza.name} ({fortaleza.count})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 p-6 sm:p-8">
        <h4 className="text-sm font-semibold text-slate-900">Evidencias recientes</h4>
        {evidenciasRecientes.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            Todavía no hay evidencias vinculadas a la dimensión del objetivo.
          </p>
        ) : (
          <ol className="mt-4 space-y-3">
            {evidenciasRecientes.map((evidencia) => (
              <EvidenciaItem key={evidencia.id} evidencia={evidencia} />
            ))}
          </ol>
        )}
      </div>

      {insightsListos.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/40 p-6 sm:p-8">
          <h4 className="text-sm font-semibold text-slate-900">Insights del objetivo</h4>
          <ul className="mt-3 space-y-2">
            {insightsListos.map((insight, index) => (
              <li
                key={`${insight.templateId}-${index}`}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                <span>{formatInsightResumen(insight)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3 border-t border-slate-100 bg-white px-6 py-4 sm:px-8">
        <Link
          href={`/objetivos/${objetivo.id}`}
          className="inline-flex items-center justify-center rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-800 transition hover:bg-violet-100"
        >
          Ver detalle completo
        </Link>
        <Link
          href={`/objetivos/${objetivo.id}/editar`}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Editar objetivo
        </Link>
      </div>
    </article>
  );
}

function EvidenciaItem({ evidencia }: { evidencia: ObjetivoPIEEvidenciaTimelineItem }) {
  return (
    <li className="rounded-xl border border-slate-100 bg-white px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500">{evidencia.fecha}</p>
        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
          {evidencia.impactoLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-700">
        {evidencia.estadoInicialEmoji} {evidencia.estadoInicial} →{" "}
        {evidencia.estadoFinalEmoji} {evidencia.estadoFinal}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{evidencia.logro}</p>
      {evidencia.fortalezas.length > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          Fortalezas: {evidencia.fortalezas.join(", ")}
        </p>
      )}
    </li>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white/80 p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function PedagogiaBlock({
  title,
  value,
  subValue,
  accent,
}: {
  title: string;
  value: string;
  subValue?: string;
  accent: string;
}) {
  return (
    <div className={`border-b border-slate-100 p-5 lg:border-b-0 lg:border-r ${accent}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-800">{value}</p>
      {subValue && <p className="mt-2 text-xs text-slate-500">{subValue}</p>}
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const styles =
    estado === "Consolidando aprendizajes"
      ? "bg-emerald-100 text-emerald-800"
      : estado === "Con avance"
        ? "bg-teal-100 text-teal-800"
        : estado === "En desarrollo"
          ? "bg-sky-100 text-sky-800"
          : estado === "Iniciando"
            ? "bg-amber-100 text-amber-800"
            : "bg-slate-100 text-slate-700";

  return (
    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${styles}`}>
      {estado}
    </span>
  );
}

function ConfianzaBadge({
  confianza,
}: {
  confianza: "baja" | "media" | "alta";
}) {
  const styles =
    confianza === "alta"
      ? "bg-emerald-100 text-emerald-800"
      : confianza === "media"
        ? "bg-amber-100 text-amber-800"
        : "bg-slate-100 text-slate-600";

  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${styles}`}>
      Confianza {confianza}
    </span>
  );
}
