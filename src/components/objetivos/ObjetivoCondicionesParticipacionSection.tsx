"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getObjetivoBarrerasApoyosDetalleView,
  type ObjetivoBarrerasApoyosDetalleView,
} from "@/lib/apoyos/barreras-apoyos-view";
import { getBarreraDetectadaDisplay } from "@/lib/pie-objectives-storage";
import type { ObjetivoPIE } from "@/lib/repositories/objetivos-repository";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.objetivo.detalle;
const BARRERAS = GLOSSARY.barrerasApoyos;

type ObjetivoCondicionesParticipacionSectionProps = {
  objetivo: ObjetivoPIE;
  objetivoId: string;
};

export function ObjetivoCondicionesParticipacionSection({
  objetivo,
  objetivoId,
}: ObjetivoCondicionesParticipacionSectionProps) {
  const [detalle, setDetalle] = useState<ObjetivoBarrerasApoyosDetalleView | null>(
    null
  );

  const refresh = useCallback(() => {
    setDetalle(getObjetivoBarrerasApoyosDetalleView(objetivoId));
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

  const planificacion = getBarreraDetectadaDisplay(objetivo);
  const barrerasEval = detalle?.barreras ?? [];

  return (
    <section className="mt-8 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/30 to-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-900/90">
        {COPY.condicionesTitulo}
      </h2>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            {COPY.condicionesPlanificacion}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-800">
            {planificacion}
          </p>
        </div>

        <div className="border-t border-amber-100/80 pt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            {COPY.condicionesEvaluacion}
          </h3>
          {barrerasEval.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">{BARRERAS.sinBarreras}</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {barrerasEval.map((barrera) => (
                <li
                  key={barrera.id}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                >
                  <span className="mr-2 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 ring-1 ring-inset ring-amber-100">
                    {barrera.origen === "conclusion"
                      ? BARRERAS.origenConclusion
                      : BARRERAS.origenHallazgo}
                  </span>
                  {barrera.descripcion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
