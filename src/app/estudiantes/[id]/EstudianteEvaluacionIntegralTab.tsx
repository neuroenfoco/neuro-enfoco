"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import {
  getEvaluacionConDetalle,
  getEvaluacionVigente,
  getHistorialEvaluaciones,
  type EvaluacionIntegralDetalleView,
  type HallazgoEvaluativoView,
  type HistorialEvaluacionItem,
} from "@/lib/evaluacion-integral/evaluacion-integral-view";
import { formatMarcoFechaDisplay } from "@/lib/marco-institucional-pie-storage";
import type { HallazgoTipo } from "@/lib/perfil-hallazgos-storage";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ConclusionEvaluativaCard } from "@/components/evaluacion-integral/ConclusionEvaluativaCard";
import { getCoberturaEvaluativaEstudianteView } from "@/lib/evaluacion-integral/planificacion-evaluativa-view";

const COPY = GLOSSARY.evaluacionIntegral;

type EstudianteEvaluacionIntegralTabProps = {
  estudianteId: string;
};

const HALLAZGO_GRUPOS: {
  tipo: HallazgoTipo;
  title: string;
}[] = [
  { tipo: "fortaleza", title: COPY.grupoFortalezas },
  { tipo: "interes", title: COPY.grupoIntereses },
  { tipo: "barrera", title: COPY.grupoBarreras },
  { tipo: "contexto_exito", title: COPY.grupoContextos },
];

function estadoEvaluacionClass(estado: string): string {
  switch (estado) {
    case "cerrada":
      return "bg-emerald-50 text-emerald-800 ring-emerald-100";
    case "borrador":
      return "bg-amber-50 text-amber-800 ring-amber-100";
    case "anulada":
      return "bg-slate-100 text-slate-600 ring-slate-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}

function consolidacionClass(estado: HallazgoEvaluativoView["consolidacionEstado"]): string {
  return estado === "consolidado"
    ? "bg-teal-50 text-teal-800 ring-teal-100"
    : "bg-amber-50 text-amber-800 ring-amber-100";
}

function consolidacionLabel(
  estado: HallazgoEvaluativoView["consolidacionEstado"]
): string {
  return estado === "consolidado"
    ? COPY.consolidado
    : COPY.pendienteConsolidacion;
}

function HistorialTable({ items }: { items: HistorialEvaluacionItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">{COPY.sinHistorial}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2">{COPY.columnaFecha}</th>
            <th className="px-3 py-2">{COPY.columnaTipo}</th>
            <th className="px-3 py-2">{COPY.columnaEstado}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-slate-100 last:border-0"
            >
              <td className="px-3 py-3 text-slate-700">
                {formatMarcoFechaDisplay(item.fechaReferencia)}
              </td>
              <td className="px-3 py-3 font-medium text-slate-900">
                {item.tipoLabel}
              </td>
              <td className="px-3 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${estadoEvaluacionClass(item.estado)}`}
                >
                  {item.estadoLabel}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HallazgosPorCategoria({
  detalle,
}: {
  detalle: EvaluacionIntegralDetalleView;
}) {
  const total = detalle.hallazgos.length;
  if (total === 0) {
    return <p className="text-sm text-slate-500">{COPY.sinHallazgos}</p>;
  }

  return (
    <div className="space-y-6">
      {HALLAZGO_GRUPOS.map((grupo) => {
        const items = detalle.hallazgosPorTipo[grupo.tipo];
        if (items.length === 0) return null;

        return (
          <div key={grupo.tipo}>
            <h4 className="text-sm font-semibold text-slate-900">{grupo.title}</h4>
            <ul className="mt-3 space-y-2">
              {items.map((hallazgo) => (
                <li
                  key={hallazgo.id}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-sm font-medium text-slate-800">
                    {hallazgo.nombre}
                  </span>
                  <span
                    className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${consolidacionClass(hallazgo.consolidacionEstado)}`}
                  >
                    {consolidacionLabel(hallazgo.consolidacionEstado)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export function EstudianteEvaluacionIntegralTab({
  estudianteId,
}: EstudianteEvaluacionIntegralTabProps) {
  const [detalleVigente, setDetalleVigente] =
    useState<EvaluacionIntegralDetalleView | null>(null);
  const [historial, setHistorial] = useState<HistorialEvaluacionItem[]>([]);

  const refresh = useCallback(() => {
    const vigente = getEvaluacionVigente(estudianteId);
    setDetalleVigente(
      vigente ? getEvaluacionConDetalle(vigente.id) : null
    );
    setHistorial(getHistorialEvaluaciones(estudianteId));
  }, [estudianteId]);

  const borradorActivo = useMemo(() => {
    const vigente = getEvaluacionVigente(estudianteId);
    return vigente?.estado === "borrador" ? vigente : null;
  }, [estudianteId, detalleVigente]);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  if (!detalleVigente) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-slate-900">{COPY.titulo}</h2>
        <p className="mt-3 text-sm text-slate-600">{COPY.sinEvaluacion}</p>
        <p className="mt-2 text-sm text-slate-500">{COPY.sinEvaluacionDetalle}</p>
        <Link
          href={`${ROUTES.evaluacionesNueva}?estudianteId=${estudianteId}`}
          className="mt-6 inline-flex rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white"
        >
          {COPY.nuevaEvaluacion}
        </Link>
      </section>
    );
  }

  const { resumen, participantes, evaluacion } = detalleVigente;
  const cobertura = getCoberturaEvaluativaEstudianteView(estudianteId);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{COPY.titulo}</h2>
          <p className="mt-1 text-sm text-slate-600">{COPY.subtitulo}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {detalleVigente.conclusiones.length > 0 ? (
            <Link
              href={ROUTES.evaluacionPlanificar(evaluacion.id)}
              className="inline-flex shrink-0 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-800"
            >
              {COPY.planificarDesdeEvaluacion}
            </Link>
          ) : null}
          {borradorActivo ? (
          <Link
            href={ROUTES.evaluacionCaptura(borradorActivo.id)}
            className="inline-flex shrink-0 rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white"
          >
            {COPY.continuarEvaluacion}
          </Link>
        ) : (
          <Link
            href={`${ROUTES.evaluacionesNueva}?estudianteId=${estudianteId}`}
            className="inline-flex shrink-0 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-800"
          >
            {COPY.nuevaEvaluacion}
          </Link>
        )}
        </div>
      </header>

      {cobertura.cantidadConclusiones > 0 ? (
        <section className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            {COPY.coberturaPlanificacion}
          </h3>
          <dl className="mt-4 grid gap-4 sm:grid-cols-4">
            <div>
              <dt className="text-xs font-medium text-slate-500">
                {COPY.conclusionesEvaluativas}
              </dt>
              <dd className="mt-0.5 text-2xl font-semibold text-slate-900">
                {cobertura.cantidadConclusiones}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">
                {COPY.conclusionesPlanificadas}
              </dt>
              <dd className="mt-0.5 text-2xl font-semibold text-emerald-700">
                {cobertura.cantidadPlanificadas}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">
                {COPY.conclusionesSinPlanificacion}
              </dt>
              <dd className="mt-0.5 text-2xl font-semibold text-amber-700">
                {cobertura.cantidadSinPlanificacion}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">
                {GLOSSARY.planificacionEvaluativa.coberturaPlanificacion}
              </dt>
              <dd className="mt-0.5 text-2xl font-semibold text-violet-800">
                {cobertura.porcentajeCobertura}%
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      <section className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/40 via-white to-white p-6 sm:p-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-violet-800">
          {COPY.evaluacionVigente}
        </h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-medium text-slate-500">{COPY.tipo}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-900">
              {resumen.tipoLabel}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">{COPY.estado}</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${estadoEvaluacionClass(resumen.estado)}`}
              >
                {resumen.estadoLabel}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">
              {COPY.fechaInicio}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-900">
              {formatMarcoFechaDisplay(resumen.fechaInicio)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">
              {COPY.fechaCierre}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-900">
              {resumen.fechaCierre
                ? formatMarcoFechaDisplay(resumen.fechaCierre)
                : "—"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-slate-500">
              {COPY.responsableProceso}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-900">
              {resumen.responsableProceso?.profesionalNombre ??
                COPY.sinResponsable}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {COPY.resumenEvaluativo}
        </h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium text-slate-500">
              {COPY.hallazgosTotales}
            </dt>
            <dd className="mt-0.5 text-2xl font-semibold text-slate-900">
              {resumen.cantidadHallazgosEvaluativos}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">
              {COPY.hallazgosConsolidados}
            </dt>
            <dd className="mt-0.5 text-2xl font-semibold text-teal-700">
              {resumen.cantidadHallazgosConsolidados}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">
              {COPY.hallazgosPendientes}
            </dt>
            <dd className="mt-0.5 text-2xl font-semibold text-amber-700">
              {resumen.cantidadHallazgosPendientesConsolidacion}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {COPY.equipoEvaluador}
        </h3>
        {participantes.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{COPY.sinParticipantes}</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {participantes.map((participacion) => (
              <li
                key={participacion.id}
                className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {participacion.profesionalNombre}
                  </p>
                  <p className="text-sm text-slate-600">
                    {participacion.rolNombre}
                  </p>
                </div>
                {participacion.esResponsableProceso ? (
                  <span className="inline-flex w-fit rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-800 ring-1 ring-inset ring-violet-100">
                    {COPY.responsableBadge}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {COPY.hallazgosEvaluativos}
        </h3>
        <div className="mt-4">
          <HallazgosPorCategoria detalle={detalleVigente} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {COPY.conclusionesEvaluativas}
        </h3>
        <div className="mt-4">
          {detalleVigente.conclusiones.length === 0 ? (
            <p className="text-sm text-slate-500">{COPY.sinConclusiones}</p>
          ) : (
            <ul className="space-y-4">
              {detalleVigente.conclusiones.map((conclusion) => (
                <li key={conclusion.id}>
                  <ConclusionEvaluativaCard
                    conclusion={conclusion}
                    showPlanificacion
                    estudianteId={estudianteId}
                    evaluacionEstado={evaluacion.estado}
                    onPlanificacionChange={refresh}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {COPY.historial}
        </h3>
        <div className="mt-4">
          <HistorialTable items={historial} />
        </div>
      </section>
    </div>
  );
}
