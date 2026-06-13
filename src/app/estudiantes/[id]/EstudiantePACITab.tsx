"use client";

import { PACIVigenteResumenCard } from "@/components/paci/PACIVigenteResumenCard";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import { getPACIsByEstudianteId } from "@/lib/paci/paci-storage";
import type { PACI } from "@/lib/paci/paci-types";
import { getPACIDetalleView, getPACIVigenteView } from "@/lib/paci/paci-view";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.paci;

type EstudiantePACITabProps = {
  estudianteId: string;
};

function getEstadoLabel(estado: PACI["estado"]): string {
  switch (estado) {
    case "borrador":
      return COPY.estadoBorrador;
    case "vigente":
      return COPY.estadoVigente;
    case "cerrado":
      return COPY.estadoCerrado;
    default:
      return estado;
  }
}

function estadoClass(estado: PACI["estado"]): string {
  switch (estado) {
    case "vigente":
      return "bg-indigo-50 text-indigo-800 ring-indigo-100";
    case "borrador":
      return "bg-amber-50 text-amber-800 ring-amber-100";
    case "cerrado":
      return "bg-slate-100 text-slate-600 ring-slate-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}

export function EstudiantePACITab({ estudianteId }: EstudiantePACITabProps) {
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

  void refreshKey;

  const vigenteView = getPACIVigenteView(estudianteId);
  const historial = getPACIsByEstudianteId(estudianteId).sort((a, b) =>
    b.actualizadoEn.localeCompare(a.actualizadoEn)
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{COPY.tituloCorto}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">{COPY.subtitulo}</p>
        </div>
        <Link
          href={ROUTES.paciNuevo(estudianteId)}
          className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          {COPY.crearPaci}
        </Link>
      </header>

      {vigenteView ? (
        <PACIVigenteResumenCard vista={vigenteView} />
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-600">{COPY.sinPaciVigente}</p>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {COPY.historialTitulo}
        </h2>
        {historial.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">{COPY.sinHistorial}</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">{COPY.columnaPeriodo}</th>
                  <th className="px-4 py-3">{COPY.columnaEstado}</th>
                  <th className="px-4 py-3">{COPY.columnaObjetivos}</th>
                  <th className="px-4 py-3">{COPY.columnaAcciones}</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((paci) => {
                  const detalle = getPACIDetalleView(paci.id);
                  return (
                    <tr key={paci.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {paci.periodoLabel}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${estadoClass(paci.estado)}`}
                        >
                          {getEstadoLabel(paci.estado)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {detalle?.metricas.cantidadObjetivos ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={ROUTES.paciDetalle(paci.id)}
                          className="font-medium text-teal-700 hover:text-teal-800"
                        >
                          {COPY.verDetalle}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
