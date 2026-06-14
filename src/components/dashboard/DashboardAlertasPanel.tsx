"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import type {
  DashboardAlertaTipo,
  DashboardAlertaView,
} from "@/lib/dashboard/dashboard-view";
import Link from "next/link";

const COPY = GLOSSARY.dashboard.alertas;

const TIPO_STYLES: Record<
  DashboardAlertaTipo,
  { badge: string; border: string; label: string }
> = {
  critica: {
    badge: "bg-rose-50 text-rose-800",
    border: "border-rose-100 bg-rose-50/40",
    label: COPY.tipoCritica,
  },
  atencion: {
    badge: "bg-amber-50 text-amber-900",
    border: "border-amber-100 bg-amber-50/40",
    label: COPY.tipoAtencion,
  },
  evaluacion_pendiente: {
    badge: "bg-sky-50 text-sky-800",
    border: "border-sky-100 bg-sky-50/40",
    label: COPY.tipoEvaluacionPendiente,
  },
  seguimiento_administrativo: {
    badge: "bg-violet-50 text-violet-800",
    border: "border-violet-100 bg-violet-50/40",
    label: COPY.tipoSeguimientoAdministrativo,
  },
};

type DashboardAlertasPanelProps = {
  alertas: DashboardAlertaView[];
};

export function DashboardAlertasPanel({ alertas }: DashboardAlertasPanelProps) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {COPY.titulo}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{COPY.subtitulo}</p>
      </div>

      {alertas.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-sm text-slate-600">
          {COPY.sinAlertas}
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {alertas.map((alerta, index) => {
            const styles = TIPO_STYLES[alerta.tipo];
            return (
              <li
                key={`${alerta.tipo}-${alerta.estudianteId ?? index}-${alerta.titulo}`}
                className={`rounded-xl border p-4 ${styles.border}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {alerta.titulo}
                      </h3>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles.badge}`}
                      >
                        {styles.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                      {alerta.descripcion}
                    </p>
                  </div>
                  {alerta.estudianteId ? (
                    <Link
                      href={`/estudiantes/${alerta.estudianteId}`}
                      className="shrink-0 text-sm font-medium text-teal-700 hover:text-teal-800"
                    >
                      {COPY.verEstudiante}
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
