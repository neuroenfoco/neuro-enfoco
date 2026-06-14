"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import type { DashboardAlertaTipo } from "@/lib/dashboard/dashboard-view";
import type { EstadoSeguimientoObjetivo } from "@/lib/objetivos/objetivo-seguimiento";
import { downloadCsv } from "@/lib/reportes/reportes-csv";
import {
  getReportesInstitucionalesView,
  type ReporteAlertaInstitucionalItem,
  type ReportesInstitucionalesView,
} from "@/lib/reportes/reportes-view";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.reportes;
const INDICADORES_COPY = GLOSSARY.dashboard.indicadores;
const ALERTA_COPY = GLOSSARY.dashboard.alertas;

const ESTADO_INSTITUCIONAL_KEYS = [
  { key: "estudiantesActivos" as const, label: INDICADORES_COPY.estudiantesActivos },
  {
    key: "estudiantesSinEvaluacion" as const,
    label: INDICADORES_COPY.estudiantesSinEvaluacion,
  },
  {
    key: "evaluacionesIntegrales" as const,
    label: INDICADORES_COPY.evaluacionesIntegrales,
  },
  { key: "objetivosActivos" as const, label: INDICADORES_COPY.objetivosActivos },
  { key: "objetivosEnRiesgo" as const, label: INDICADORES_COPY.objetivosEnRiesgo },
  { key: "pacisVigentes" as const, label: INDICADORES_COPY.pacisVigentes },
  { key: "pacisBorrador" as const, label: INDICADORES_COPY.pacisBorrador },
  { key: "apoyosActivos" as const, label: INDICADORES_COPY.apoyosActivos },
  {
    key: "apoyosConEvidencia" as const,
    label: INDICADORES_COPY.apoyosConEvidencia,
  },
] as const;

const SEGUIMIENTO_ESTADO_STYLES: Record<EstadoSeguimientoObjetivo, string> = {
  activo: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  atencion: "bg-amber-50 text-amber-800 ring-amber-100",
  riesgo: "bg-rose-50 text-rose-800 ring-rose-100",
  sin_seguimiento: "bg-slate-100 text-slate-600 ring-slate-200",
};

const ALERTA_TIPO_STYLES: Record<DashboardAlertaTipo, string> = {
  critica: "bg-rose-50 text-rose-800",
  atencion: "bg-amber-50 text-amber-900",
  evaluacion_pendiente: "bg-sky-50 text-sky-800",
  seguimiento_administrativo: "bg-violet-50 text-violet-800",
};

const ALERTA_TIPO_LABELS: Record<DashboardAlertaTipo, string> = {
  critica: ALERTA_COPY.tipoCritica,
  atencion: ALERTA_COPY.tipoAtencion,
  evaluacion_pendiente: ALERTA_COPY.tipoEvaluacionPendiente,
  seguimiento_administrativo: ALERTA_COPY.tipoSeguimientoAdministrativo,
};

export function ReportesInstitucionales() {
  const [view, setView] = useState<ReportesInstitucionalesView | null>(null);

  const refresh = useCallback(() => {
    setView(getReportesInstitucionalesView());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  if (!view) {
    return null;
  }

  if (!view.tieneEstudiantes) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          {COPY.estadoVacio.titulo}
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          {COPY.estadoVacio.descripcion}
        </p>
        <Link
          href={ROUTES.estudiantes}
          className="mt-6 inline-flex rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
        >
          {COPY.estadoVacio.irEstudiantes}
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <EstadoInstitucionalSection estado={view.estadoInstitucional} />
      <SeguimientoObjetivosSection items={view.seguimientoObjetivos} />
      <ApoyosImplementadosSection items={view.apoyosImplementados} />
      <AlertasSection alertas={view.alertas} />
    </div>
  );
}

function EstadoInstitucionalSection({
  estado,
}: {
  estado: ReportesInstitucionalesView["estadoInstitucional"];
}) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {COPY.estadoInstitucional.titulo}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {COPY.estadoInstitucional.subtitulo}
        </p>
      </div>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ESTADO_INSTITUCIONAL_KEYS.map((item) => (
          <div
            key={item.key}
            className="rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-4"
          >
            <dt className="text-xs font-medium text-slate-500">{item.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
              {estado[item.key]}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function SeguimientoObjetivosSection({
  items,
}: {
  items: ReportesInstitucionalesView["seguimientoObjetivos"];
}) {
  const COPY_SEC = COPY.seguimientoObjetivos;

  function handleExport() {
    downloadCsv(
      "seguimiento-objetivos.csv",
      [
        COPY_SEC.columnaEstudiante,
        COPY_SEC.columnaObjetivo,
        COPY_SEC.columnaEstado,
        COPY_SEC.columnaUltimaActividad,
        COPY_SEC.columnaIntervenciones,
        COPY_SEC.columnaEvidencias,
      ],
      items.map((item) => [
        item.estudiante,
        item.objetivo,
        item.estadoSeguimientoLabel,
        item.ultimaActividadLabel ?? "—",
        item.intervenciones,
        item.evidencias,
      ])
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            {COPY_SEC.titulo}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{COPY_SEC.subtitulo}</p>
        </div>
        {items.length > 0 ? (
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/30"
          >
            {COPY_SEC.exportarCsv}
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-sm text-slate-600">
          {COPY_SEC.sinRegistros}
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2.5">{COPY_SEC.columnaEstudiante}</th>
                <th className="px-3 py-2.5">{COPY_SEC.columnaObjetivo}</th>
                <th className="px-3 py-2.5">{COPY_SEC.columnaEstado}</th>
                <th className="px-3 py-2.5">{COPY_SEC.columnaUltimaActividad}</th>
                <th className="px-3 py-2.5 text-right">
                  {COPY_SEC.columnaIntervenciones}
                </th>
                <th className="px-3 py-2.5 text-right">
                  {COPY_SEC.columnaEvidencias}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.objetivoId} className="hover:bg-slate-50/60">
                  <td className="px-3 py-3 font-medium text-slate-900">
                    <Link
                      href={`/estudiantes/${item.estudianteId}`}
                      className="text-teal-700 hover:text-teal-800"
                    >
                      {item.estudiante}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-slate-800">
                    <Link
                      href={`/objetivos/${item.objetivoId}`}
                      className="hover:text-teal-800"
                    >
                      {item.objetivo}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${SEGUIMIENTO_ESTADO_STYLES[item.estadoSeguimiento]}`}
                    >
                      {item.estadoSeguimientoLabel}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {item.ultimaActividadLabel}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-900">
                    {item.intervenciones}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-900">
                    {item.evidencias}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ApoyosImplementadosSection({
  items,
}: {
  items: ReportesInstitucionalesView["apoyosImplementados"];
}) {
  const COPY_SEC = COPY.apoyosImplementados;

  function handleExport() {
    downloadCsv(
      "apoyos-implementados.csv",
      [
        COPY_SEC.columnaEstudiante,
        COPY_SEC.columnaApoyo,
        COPY_SEC.columnaResponsable,
        COPY_SEC.columnaFrecuencia,
        COPY_SEC.columnaEstado,
        COPY_SEC.columnaIntervenciones,
        COPY_SEC.columnaEvidencias,
        COPY_SEC.columnaEstadoOperacional,
      ],
      items.map((item) => [
        item.estudiante,
        item.apoyo,
        item.responsable,
        item.frecuencia,
        item.estado,
        item.intervenciones,
        item.evidencias,
        item.estadoOperacional,
      ])
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            {COPY_SEC.titulo}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{COPY_SEC.subtitulo}</p>
        </div>
        {items.length > 0 ? (
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/30"
          >
            {COPY_SEC.exportarCsv}
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-sm text-slate-600">
          {COPY_SEC.sinRegistros}
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2.5">{COPY_SEC.columnaEstudiante}</th>
                <th className="px-3 py-2.5">{COPY_SEC.columnaApoyo}</th>
                <th className="px-3 py-2.5">{COPY_SEC.columnaResponsable}</th>
                <th className="px-3 py-2.5">{COPY_SEC.columnaFrecuencia}</th>
                <th className="px-3 py-2.5">{COPY_SEC.columnaEstado}</th>
                <th className="px-3 py-2.5 text-right">
                  {COPY_SEC.columnaIntervenciones}
                </th>
                <th className="px-3 py-2.5 text-right">
                  {COPY_SEC.columnaEvidencias}
                </th>
                <th className="px-3 py-2.5">{COPY_SEC.columnaEstadoOperacional}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.apoyoId} className="hover:bg-slate-50/60">
                  <td className="px-3 py-3 font-medium text-slate-900">
                    <Link
                      href={`/estudiantes/${item.estudianteId}`}
                      className="text-teal-700 hover:text-teal-800"
                    >
                      {item.estudiante}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-slate-800">{item.apoyo}</td>
                  <td className="px-3 py-3 text-slate-700">{item.responsable}</td>
                  <td className="px-3 py-3 text-slate-700">{item.frecuencia}</td>
                  <td className="px-3 py-3 text-slate-700">{item.estado}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-900">
                    {item.intervenciones}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-slate-900">
                    {item.evidencias}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {item.estadoOperacional}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function AlertasSection({
  alertas,
}: {
  alertas: ReportesInstitucionalesView["alertas"];
}) {
  const COPY_SEC = COPY.alertas;
  const grupos = [
    {
      key: "evaluacionPendiente" as const,
      label: COPY_SEC.grupoEvaluacionPendiente,
      items: alertas.evaluacionPendiente,
    },
    {
      key: "seguimiento" as const,
      label: COPY_SEC.grupoSeguimiento,
      items: alertas.seguimiento,
    },
    { key: "apoyos" as const, label: COPY_SEC.grupoApoyos, items: alertas.apoyos },
    { key: "paci" as const, label: COPY_SEC.grupoPaci, items: alertas.paci },
  ];

  const totalAlertas = grupos.reduce((sum, grupo) => sum + grupo.items.length, 0);

  function getGrupoLabel(grupo: ReporteAlertaInstitucionalItem["grupo"]): string {
    switch (grupo) {
      case "evaluacion_pendiente":
        return COPY_SEC.grupoEvaluacionPendiente;
      case "seguimiento":
        return COPY_SEC.grupoSeguimiento;
      case "apoyos":
        return COPY_SEC.grupoApoyos;
      case "paci":
        return COPY_SEC.grupoPaci;
    }
  }

  function handleExport() {
    const allItems: ReporteAlertaInstitucionalItem[] = [
      ...alertas.evaluacionPendiente,
      ...alertas.seguimiento,
      ...alertas.apoyos,
      ...alertas.paci,
    ];

    downloadCsv(
      "alertas-institucionales.csv",
      [
        COPY_SEC.columnaGrupo,
        COPY_SEC.columnaTipo,
        COPY_SEC.columnaTitulo,
        COPY_SEC.columnaDescripcion,
        COPY_SEC.columnaEstudiante,
      ],
      allItems.map((item) => [
        getGrupoLabel(item.grupo),
        ALERTA_TIPO_LABELS[item.tipo],
        item.titulo,
        item.descripcion,
        item.estudiante,
      ])
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            {COPY_SEC.titulo}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{COPY_SEC.subtitulo}</p>
        </div>
        {totalAlertas > 0 ? (
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/30"
          >
            {COPY_SEC.exportarCsv}
          </button>
        ) : null}
      </div>

      {totalAlertas === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-sm text-slate-600">
          {COPY_SEC.sinAlertas}
        </p>
      ) : (
        <div className="mt-5 space-y-6">
          {grupos.map((grupo) =>
            grupo.items.length === 0 ? null : (
              <div key={grupo.key}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {grupo.label}
                  <span className="ml-2 font-normal text-slate-400">
                    ({grupo.items.length})
                  </span>
                </h3>
                <ul className="mt-3 space-y-2">
                  {grupo.items.map((alerta, index) => (
                    <li
                      key={`${grupo.key}-${alerta.estudianteId ?? index}-${alerta.titulo}`}
                      className="rounded-xl border border-slate-100 bg-slate-50/40 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-semibold text-slate-900">
                              {alerta.titulo}
                            </h4>
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${ALERTA_TIPO_STYLES[alerta.tipo]}`}
                            >
                              {ALERTA_TIPO_LABELS[alerta.tipo]}
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                            {alerta.descripcion}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {alerta.estudiante}
                          </p>
                        </div>
                        {alerta.estudianteId ? (
                          <Link
                            href={`/estudiantes/${alerta.estudianteId}`}
                            className="shrink-0 text-sm font-medium text-teal-700 hover:text-teal-800"
                          >
                            {ALERTA_COPY.verEstudiante}
                          </Link>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}
