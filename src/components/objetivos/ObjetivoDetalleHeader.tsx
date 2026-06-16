"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { getObjetivoApoyosView } from "@/lib/apoyos/apoyos-view";
import { getObjetivoSeguimiento } from "@/lib/objetivos/objetivo-seguimiento";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.objetivo.detalle;
const SEGUIMIENTO = GLOSSARY.objetivo.seguimiento;

type ObjetivoDetalleHeaderProps = {
  objetivoId: string;
  nombre: string;
  metaLogro: string;
  descripcion?: string;
  estudianteNombre: string;
  dimensionRelacionada: string;
};

type HeaderKpis = {
  apoyosActivos: number;
  intervenciones: number;
  evidencias: number;
  ultimaActividad: string;
};

const CADENA_IDS = [
  "perfil-base",
  "objetivo",
  "apoyos",
  "intervenciones",
  "evidencias",
] as const;

export function ObjetivoDetalleHeader({
  objetivoId,
  nombre,
  metaLogro,
  descripcion,
  estudianteNombre,
  dimensionRelacionada,
}: ObjetivoDetalleHeaderProps) {
  const [kpis, setKpis] = useState<HeaderKpis | null>(null);

  const refresh = useCallback(() => {
    const seguimiento = getObjetivoSeguimiento(objetivoId);
    const apoyos = getObjetivoApoyosView(objetivoId);
    if (!seguimiento || !apoyos) {
      setKpis(null);
      return;
    }
    setKpis({
      apoyosActivos: apoyos.cantidadActivos,
      intervenciones: seguimiento.cantidadIntervenciones,
      evidencias: seguimiento.cantidadEvidencias,
      ultimaActividad:
        seguimiento.ultimaActividadLabel ?? SEGUIMIENTO.sinActividad,
    });
  }, [objetivoId]);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return (
    <header className="rounded-2xl border border-violet-200/50 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
        {COPY.eyebrow}
      </p>
      <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {nombre}
        </h1>
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 px-4 py-3 lg:max-w-md lg:shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800/80">
            {COPY.metaEsperada}
          </p>
          <p className="mt-1 text-sm font-medium leading-relaxed text-emerald-950">
            {metaLogro}
          </p>
        </div>
      </div>

      {descripcion ? (
        <p className="mt-4 text-sm leading-relaxed text-slate-600">{descripcion}</p>
      ) : null}

      <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-slate-500">{COPY.estudiante}</dt>
          <dd className="mt-0.5 text-sm font-medium text-slate-800">
            {estudianteNombre}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{COPY.dimension}</dt>
          <dd className="mt-0.5 text-sm font-medium text-slate-800">
            {dimensionRelacionada}
          </dd>
        </div>
      </dl>

      {kpis ? (
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiItem label={COPY.apoyosActivos} value={String(kpis.apoyosActivos)} />
          <KpiItem
            label={SEGUIMIENTO.intervencionesRegistradas}
            value={String(kpis.intervenciones)}
          />
          <KpiItem
            label={SEGUIMIENTO.evidenciasRegistradas}
            value={String(kpis.evidencias)}
          />
          <KpiItem label={SEGUIMIENTO.ultimaActividad} value={kpis.ultimaActividad} />
        </dl>
      ) : null}

      <nav
        className="mt-6 flex flex-wrap items-center justify-center gap-1 border-t border-slate-100 pt-6 text-center"
        aria-label={COPY.cadenaAriaLabel}
      >
        {COPY.cadenaConceptual.map((label, index) => {
          const id = CADENA_IDS[index];
          const isCurrent = id === "objetivo";
          return (
            <span key={id} className="flex items-center gap-1">
              {index > 0 ? (
                <span className="px-1 text-slate-300" aria-hidden>
                  ↓
                </span>
              ) : null}
              <span
                className={
                  isCurrent
                    ? "rounded-lg bg-violet-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-violet-900 ring-1 ring-inset ring-violet-200"
                    : "text-[10px] font-semibold uppercase tracking-wide text-slate-500"
                }
              >
                {label}
              </span>
            </span>
          );
        })}
      </nav>
    </header>
  );
}

function KpiItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">
        {value}
      </dd>
    </div>
  );
}
