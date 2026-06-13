"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import type { PACIVigenteView } from "@/lib/paci/paci-view";
import { formatMarcoFechaDisplay } from "@/lib/marco-institucional-pie-storage";
import Link from "next/link";

const COPY = GLOSSARY.paci;

type PACIVigenteResumenCardProps = {
  vista: PACIVigenteView;
  onVerPaci?: () => void;
};

export function PACIVigenteResumenCard({
  vista,
  onVerPaci,
}: PACIVigenteResumenCardProps) {
  return (
    <section className="rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
            {COPY.vigenteResumenTitulo}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {COPY.tituloCorto} · {vista.periodoLabel}
          </h2>
          {vista.evaluacionTipoLabel ? (
            <p className="mt-1 text-sm text-slate-600">
              {vista.evaluacionTipoLabel}
              {vista.evaluacionFechaReferencia
                ? ` · ${formatMarcoFechaDisplay(vista.evaluacionFechaReferencia)}`
                : ""}
            </p>
          ) : null}
        </div>
        {onVerPaci ? (
          <button
            type="button"
            onClick={onVerPaci}
            className="text-sm font-medium text-indigo-700 hover:text-indigo-800"
          >
            Ver PACI →
          </button>
        ) : (
          <Link
            href={ROUTES.paciDetalle(vista.paci.id)}
            className="text-sm font-medium text-indigo-700 hover:text-indigo-800"
          >
            Ver detalle →
          </Link>
        )}
      </div>

      {vista.sintesisInstitucional ? (
        <p className="mt-4 line-clamp-3 text-sm text-slate-700">
          {vista.sintesisInstitucional}
        </p>
      ) : (
        <p className="mt-4 text-sm text-slate-500">{COPY.sintesisVacia}</p>
      )}

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-slate-500">{COPY.cantidadObjetivos}</dt>
          <dd className="text-lg font-semibold text-slate-900">
            {vista.indicadores.cantidadObjetivos}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{COPY.porcentajeTrazabilidad}</dt>
          <dd className="text-lg font-semibold text-indigo-800">
            {vista.indicadores.porcentajeTrazabilidad}%
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{COPY.conclusionesCubiertas}</dt>
          <dd className="text-lg font-semibold text-violet-800">
            {vista.indicadores.cantidadConclusionesCubiertas}
          </dd>
        </div>
      </dl>
    </section>
  );
}
