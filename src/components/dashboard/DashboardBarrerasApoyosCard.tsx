"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import type { DashboardBarrerasApoyosView } from "@/lib/dashboard/dashboard-view";

const COPY = GLOSSARY.dashboard.barrerasApoyos;

const METRICAS: {
  key: keyof DashboardBarrerasApoyosView;
  label: string;
  accent: string;
}[] = [
  {
    key: "barrerasIdentificadas",
    label: COPY.barrerasIdentificadas,
    accent: "text-amber-800",
  },
  {
    key: "apoyosSugeridos",
    label: COPY.apoyosSugeridos,
    accent: "text-teal-800",
  },
  {
    key: "objetivosConSustentoEvaluativo",
    label: COPY.objetivosConSustento,
    accent: "text-violet-800",
  },
  {
    key: "objetivosSinSustentoEvaluativo",
    label: COPY.objetivosSinSustento,
    accent: "text-slate-700",
  },
];

type DashboardBarrerasApoyosCardProps = {
  barrerasApoyos: DashboardBarrerasApoyosView;
};

export function DashboardBarrerasApoyosCard({
  barrerasApoyos,
}: DashboardBarrerasApoyosCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-violet-50/30 via-white to-amber-50/20 p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {COPY.titulo}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{COPY.subtitulo}</p>
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRICAS.map((item) => (
          <div
            key={item.key}
            className="rounded-xl border border-slate-100 bg-white/80 p-4"
          >
            <dt className="text-xs font-medium text-slate-500">{item.label}</dt>
            <dd className={`mt-1 text-2xl font-semibold tabular-nums ${item.accent}`}>
              {barrerasApoyos[item.key]}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
