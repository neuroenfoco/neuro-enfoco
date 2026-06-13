"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import type { PACIIndicadoresView } from "@/lib/paci/paci-view";

const COPY = GLOSSARY.paci;

type PACIIndicadoresCardProps = {
  indicadores: PACIIndicadoresView;
};

export function PACIIndicadoresCard({ indicadores }: PACIIndicadoresCardProps) {
  return (
    <section className="rounded-2xl border border-indigo-200/60 bg-indigo-50/30 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-900">
        {COPY.indicadoresTitulo}
      </h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <dt className="text-xs font-medium text-slate-500">{COPY.cantidadObjetivos}</dt>
          <dd className="mt-0.5 text-2xl font-semibold text-slate-900">
            {indicadores.cantidadObjetivos}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">
            {COPY.objetivosConSustento}
          </dt>
          <dd className="mt-0.5 text-2xl font-semibold text-emerald-800">
            {indicadores.cantidadObjetivosConSustento}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">
            {COPY.objetivosSinSustento}
          </dt>
          <dd className="mt-0.5 text-2xl font-semibold text-amber-700">
            {indicadores.cantidadObjetivosSinSustento}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">
            {COPY.porcentajeTrazabilidad}
          </dt>
          <dd className="mt-0.5 text-2xl font-semibold text-indigo-800">
            {indicadores.porcentajeTrazabilidad}%
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">
            {COPY.conclusionesCubiertas}
          </dt>
          <dd className="mt-0.5 text-2xl font-semibold text-violet-800">
            {indicadores.cantidadConclusionesCubiertas}
          </dd>
        </div>
      </dl>
    </section>
  );
}
