"use client";

import {
  type ApoyoConsolidadoItem,
  type ApoyosConsolidadosObjetivoFicha,
  type VinculoObjetivoSesion,
} from "@/lib/apoyos-consolidados-objetivo";
import { ROUTES } from "@/lib/copy/navigation";
import Link from "next/link";
import { useState } from "react";

type ApoyosConsolidadosSectionProps = {
  consolidados: ApoyosConsolidadosObjetivoFicha;
};

export function ApoyosConsolidadosSection({
  consolidados,
}: ApoyosConsolidadosSectionProps) {
  const { resumen } = consolidados;
  const sinDatos =
    consolidados.items.length === 0 &&
    resumen.totalPlanificados === 0 &&
    resumen.totalDocumentados === 0;

  return (
    <section
      id="apoyos"
      className="mt-8 rounded-2xl border border-teal-200/60 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8"
    >
      <div>
        <h2 className="text-sm font-semibold text-slate-900">
          Apoyos de participación
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Planificación del objetivo y apoyos documentados en intervenciones
          vinculadas.
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          No implica efectividad del apoyo. Refleja planificación y registros del
          equipo.
        </p>
      </div>

      {sinDatos ? (
        <p className="mt-6 text-sm text-slate-500">
          Aún no hay apoyos planificados ni documentados para este objetivo.
        </p>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-600">
            <ResumenChip label="Planificados" value={String(resumen.totalPlanificados)} />
            <ResumenChip label="Documentados" value={String(resumen.totalDocumentados)} />
            <ResumenChip
              label="Intervenciones con apoyos"
              value={String(resumen.totalIntervencionesConApoyos)}
            />
            {resumen.primeraDocumentacionGlobal && (
              <ResumenChip
                label="Primera documentación"
                value={resumen.primeraDocumentacionGlobal}
              />
            )}
            {resumen.ultimaDocumentacionGlobal && (
              <ResumenChip
                label="Última documentación"
                value={resumen.ultimaDocumentacionGlobal}
              />
            )}
          </div>

          <div className="mt-8 space-y-8">
            <GrupoApoyos
              titulo="Planificados y documentados"
              items={consolidados.planificadosYDocumentados}
              vacio="No hay apoyos planificados con documentación en intervenciones."
            />
            <GrupoApoyos
              titulo="Planificados, sin documentación aún"
              items={consolidados.planificadosSinDocumentacion}
              vacio="No hay apoyos planificados pendientes de documentar."
            />
            <GrupoApoyos
              titulo="Documentados sin planificación"
              items={consolidados.documentadosSinPlanificacion}
              vacio="No hay apoyos documentados fuera de la planificación."
            />
          </div>
        </>
      )}
    </section>
  );
}

function ResumenChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1 font-medium text-teal-900">
      <span className="text-teal-700/80">{label}:</span>
      {value}
    </span>
  );
}

function GrupoApoyos({
  titulo,
  items,
  vacio,
}: {
  titulo: string;
  items: ApoyoConsolidadoItem[];
  vacio: string;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-800/80">
        {titulo}
      </h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">{vacio}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((item) => (
            <ApoyoConsolidadoCard key={item.apoyoKey} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ApoyoConsolidadoCard({ item }: { item: ApoyoConsolidadoItem }) {
  const [expandido, setExpandido] = useState(false);

  return (
    <li className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">{item.nombre}</p>
            <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-800">
              {item.estadoLabel}
            </span>
          </div>
          {item.documentado ? (
            <p className="mt-1 text-xs text-slate-500">
              {item.intervencionesCount} intervención
              {item.intervencionesCount === 1 ? "" : "es"}
              {item.primeraDocumentacion && item.ultimaDocumentacion
                ? ` · ${item.primeraDocumentacion} – ${item.ultimaDocumentacion}`
                : ""}
            </p>
          ) : (
            <p className="mt-1 text-xs text-slate-500">
              Planificado en este objetivo; aún sin registro en intervenciones
              vinculadas.
            </p>
          )}
          {item.vinculoPrincipal === "mixto" && item.documentado && (
            <p className="mt-1 text-[11px] text-slate-400">
              Vínculo mixto: intervenciones explícitas e inferidas por dimensión.
            </p>
          )}
        </div>
      </div>

      {item.documentado && item.documentaciones.length > 0 && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setExpandido((prev) => !prev)}
            className="text-xs font-semibold text-teal-700 transition hover:text-teal-800"
          >
            {expandido ? "Ocultar intervenciones" : "Ver intervenciones"}
          </button>
          {expandido && (
            <ul className="mt-2 space-y-2">
              {item.documentaciones.map((doc) => (
                <li
                  key={`${doc.sesionId}-${doc.fecha}`}
                  className="rounded-lg border border-white bg-white px-3 py-2 text-xs text-slate-600"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-slate-800">{doc.fecha}</span>
                    <VinculoBadge vinculo={doc.vinculoObjetivo} />
                  </div>
                  {doc.intervencionId && (
                    <Link
                      href={ROUTES.intervenciones}
                      className="mt-1 inline-block text-teal-700 hover:underline"
                    >
                      Ver intervenciones del estudiante
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}

function VinculoBadge({ vinculo }: { vinculo: VinculoObjetivoSesion }) {
  if (vinculo === "explicito") {
    return (
      <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-800">
        Vínculo explícito
      </span>
    );
  }

  return (
    <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
      Inferido por dimensión
    </span>
  );
}
