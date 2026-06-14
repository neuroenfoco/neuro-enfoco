"use client";

import { IntervencionApoyosRelacionadosPanel } from "@/components/apoyos/IntervencionApoyosRelacionadosPanel";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import {
  getEstudianteIntervencionesFicha,
  type EstudianteIntervencionesFicha,
  type EstudianteIntervencionesFiltros,
  type IntervencionFichaItem,
} from "@/lib/estudiante-intervenciones-ficha";
import type { TipoIntervencionId } from "@/lib/intervenciones-catalog";
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";

type EstudianteIntervencionesTabProps = {
  estudianteId: string;
  estudiantePrimerNombre: string;
};

const EMPTY_FILTROS: EstudianteIntervencionesFiltros = {
  fechaDesde: "",
  fechaHasta: "",
  tipoIntervencionId: "",
  espacioId: "",
};

export function EstudianteIntervencionesTab({
  estudianteId,
  estudiantePrimerNombre,
}: EstudianteIntervencionesTabProps) {
  const [filtros, setFiltros] = useState<EstudianteIntervencionesFiltros>(EMPTY_FILTROS);
  const [ficha, setFicha] = useState<EstudianteIntervencionesFicha | null>(() =>
    typeof window === "undefined"
      ? null
      : getEstudianteIntervencionesFicha(estudianteId, EMPTY_FILTROS)
  );

  const refresh = useCallback(() => {
    setFicha(getEstudianteIntervencionesFicha(estudianteId, filtros));
  }, [estudianteId, filtros]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  if (!ficha) return null;

  const hasActiveFilters =
    Boolean(filtros.fechaDesde) ||
    Boolean(filtros.fechaHasta) ||
    Boolean(filtros.tipoIntervencionId) ||
    Boolean(filtros.espacioId);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50/70 via-white to-teal-50/30 p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
              Seguimiento institucional
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">
              {GLOSSARY.intervencion.tabEstudiante} de {estudiantePrimerNombre}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              {GLOSSARY.intervencion.fichaHistorialSubtitulo}
            </p>
          </div>
          <Link
            href={`${ROUTES.intervencionesNueva}?estudianteId=${estudianteId}`}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-sky-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-sky-700 hover:to-teal-700"
          >
            {GLOSSARY.intervencion.registrar}
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Intervenciones registradas"
            value={String(ficha.kpis.totalIntervenciones)}
          />
          <KpiCard label="Horas acumuladas" value={ficha.kpis.horasAcumuladas} />
          <KpiCard
            label="Espacios utilizados"
            value={String(ficha.kpis.espaciosUtilizados)}
          />
          <KpiCard
            label="Objetivos trabajados"
            value={String(ficha.kpis.objetivosTrabajados)}
          />
        </div>
      </section>

      {ficha.totalSinFiltrar > 0 && (
        <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Filtros
              </p>
              {hasActiveFilters && (
                <p className="mt-1 text-xs text-slate-500">
                  Mostrando {ficha.items.length} de {ficha.totalSinFiltrar}{" "}
                  intervenciones
                </p>
              )}
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => setFiltros(EMPTY_FILTROS)}
                className="text-xs font-semibold text-sky-700 transition hover:text-sky-800"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <FilterField label="Desde">
              <input
                type="date"
                value={filtros.fechaDesde ?? ""}
                onChange={(event) =>
                  setFiltros((current) => ({
                    ...current,
                    fechaDesde: event.target.value,
                  }))
                }
                className={filterInputClass}
              />
            </FilterField>
            <FilterField label="Hasta">
              <input
                type="date"
                value={filtros.fechaHasta ?? ""}
                onChange={(event) =>
                  setFiltros((current) => ({
                    ...current,
                    fechaHasta: event.target.value,
                  }))
                }
                className={filterInputClass}
              />
            </FilterField>
            <FilterField label="Tipo de intervención">
              <select
                value={filtros.tipoIntervencionId ?? ""}
                onChange={(event) =>
                  setFiltros((current) => ({
                    ...current,
                    tipoIntervencionId: event.target.value as TipoIntervencionId | "",
                  }))
                }
                className={filterInputClass}
              >
                <option value="">Todos los tipos</option>
                {ficha.filterOptions.tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </FilterField>
            <FilterField label="Espacio utilizado">
              <select
                value={filtros.espacioId ?? ""}
                onChange={(event) =>
                  setFiltros((current) => ({
                    ...current,
                    espacioId: event.target.value,
                  }))
                }
                className={filterInputClass}
              >
                <option value="">Todos los espacios</option>
                {ficha.filterOptions.espacios.map((espacio) => (
                  <option key={espacio.id} value={espacio.id}>
                    {espacio.nombre}
                  </option>
                ))}
              </select>
            </FilterField>
          </div>
        </section>
      )}

      {ficha.totalSinFiltrar === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-600">
            {GLOSSARY.intervencion.vacioFichaEstudiante}
          </p>
          <Link
            href={`${ROUTES.intervencionesNueva}?estudianteId=${estudianteId}`}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-sky-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-sky-700 hover:to-teal-700"
          >
            {GLOSSARY.intervencion.registrar}
          </Link>
        </section>
      ) : ficha.items.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-600">
            No hay intervenciones que coincidan con los filtros seleccionados.
          </p>
          <button
            type="button"
            onClick={() => setFiltros(EMPTY_FILTROS)}
            className="mt-4 text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            Limpiar filtros
          </button>
        </section>
      ) : (
        <div className="space-y-5">
          {ficha.items.map((item) => (
            <IntervencionHistorialCard
              key={item.intervencion.id}
              item={item}
              estudianteId={estudianteId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function IntervencionHistorialCard({
  item,
  estudianteId,
}: {
  item: IntervencionFichaItem;
  estudianteId: string;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
      <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-semibold text-slate-900">{item.fechaDisplay}</p>
              {item.hora && (
                <span className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                  {item.hora}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm font-medium text-sky-800">{item.tipoNombre}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <MetaChip label="Espacio" value={item.espacioNombre} />
            <MetaChip label="Duración" value={item.duracionDisplay} />
            <MetaChip label="Profesional" value={item.profesionalNombre} />
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        <section>
          <h4 className="text-sm font-semibold text-slate-900">Objetivos trabajados</h4>
          {item.objetivos.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Sin objetivos vinculados.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {item.objetivos.map((objetivo) => (
                <li
                  key={objetivo.id}
                  className="flex items-start gap-2 text-sm text-slate-700"
                >
                  <span className="mt-0.5 text-emerald-600" aria-hidden>
                    ✓
                  </span>
                  <span>{objetivo.nombre}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {item.estadoInicial && item.estadoFinal && (
          <section className="rounded-xl border border-teal-100 bg-teal-50/30 px-4 py-4">
            <h4 className="text-sm font-semibold text-slate-900">Resultado observado</h4>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-base text-slate-800">
              <span>
                {item.estadoInicial.emoji} {item.estadoInicial.label}
              </span>
              <span className="text-slate-400" aria-hidden>
                →
              </span>
              <span>
                {item.estadoFinal.emoji} {item.estadoFinal.label}
              </span>
            </p>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <h4 className="text-sm font-semibold text-slate-900">
              Fortalezas observadas
            </h4>
            {item.fortalezas.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">Sin fortalezas registradas.</p>
            ) : (
              <ul className="mt-3 flex flex-wrap gap-2">
                {item.fortalezas.map((fortaleza) => (
                  <li
                    key={fortaleza}
                    className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-900"
                  >
                    {fortaleza}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h4 className="text-sm font-semibold text-slate-900">
              {GLOSSARY.apoyos.deParticipacion}
            </h4>
            {item.apoyos.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">Sin apoyos registrados.</p>
            ) : (
              <ul className="mt-3 space-y-1.5">
                {item.apoyos.map((apoyo) => (
                  <li
                    key={apoyo}
                    className="rounded-lg border border-sky-100 bg-sky-50/40 px-3 py-2 text-sm text-slate-700"
                  >
                    {apoyo}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {item.logro && (
          <section>
            <h4 className="text-sm font-semibold text-slate-900">Logro observado</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.logro}</p>
          </section>
        )}

        {item.barreras.length > 0 && (
          <section className="rounded-xl border border-amber-200/70 bg-amber-50/40 px-4 py-4">
            <h4 className="text-sm font-semibold text-amber-900">
              {GLOSSARY.barreras.observadas}
            </h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {item.barreras.map((barrera) => (
                <li
                  key={barrera}
                  className="rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-medium text-amber-900"
                >
                  {barrera}
                </li>
              ))}
            </ul>
          </section>
        )}

        <IntervencionApoyosRelacionadosPanel
          intervencionId={item.intervencion.id}
          estudianteId={estudianteId}
        />
      </div>
    </article>
  );
}

const filterInputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100";

function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
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

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 text-xs font-medium text-slate-800">{value}</p>
    </div>
  );
}
