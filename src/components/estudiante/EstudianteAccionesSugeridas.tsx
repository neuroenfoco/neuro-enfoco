"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import {
  getEstudianteAccionesSugeridas,
  type AccionSugerida,
  type AccionSugeridaId,
} from "@/lib/estudiante/estudiante-acciones-sugeridas";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.estudiante;

type EstudianteAccionesSugeridasProps = {
  estudianteId: string;
  onIrEvaluacion?: () => void;
  onIrObjetivos?: () => void;
  onIrPaci?: () => void;
  onIrIntervenciones?: () => void;
};

function getAccionCta(
  id: AccionSugeridaId,
  estudianteId: string,
  handlers: Pick<
    EstudianteAccionesSugeridasProps,
    "onIrEvaluacion" | "onIrObjetivos" | "onIrPaci" | "onIrIntervenciones"
  >
): { label: string; href?: string; onClick?: () => void } {
  switch (id) {
    case "evaluacion_integral":
      return handlers.onIrEvaluacion
        ? { label: COPY.accionEvaluacionCta, onClick: handlers.onIrEvaluacion }
        : {
            label: COPY.accionEvaluacionCta,
            href: `${ROUTES.evaluacionesNueva}?estudianteId=${encodeURIComponent(estudianteId)}`,
          };
    case "objetivos_pie":
      return handlers.onIrObjetivos
        ? { label: COPY.accionObjetivosCta, onClick: handlers.onIrObjetivos }
        : {
            label: COPY.accionObjetivosCta,
            href: `/estudiantes/${estudianteId}?tab=objetivos`,
          };
    case "crear_paci":
      return handlers.onIrPaci
        ? { label: COPY.accionPaciCta, onClick: handlers.onIrPaci }
        : {
            label: COPY.accionPaciCta,
            href: ROUTES.paciNuevo(estudianteId),
          };
    case "seguimiento_intervenciones":
      return handlers.onIrIntervenciones
        ? {
            label: COPY.accionSeguimientoCta,
            onClick: handlers.onIrIntervenciones,
          }
        : {
            label: COPY.accionSeguimientoCta,
            href: `/estudiantes/${estudianteId}?tab=sesiones`,
          };
    case "objetivo_riesgo":
      return handlers.onIrIntervenciones
        ? {
            label: COPY.accionObjetivoRiesgoCta,
            onClick: handlers.onIrIntervenciones,
          }
        : {
            label: COPY.accionObjetivoRiesgoCta,
            href: `/estudiantes/${estudianteId}?tab=sesiones`,
          };
    case "objetivo_sin_seguimiento":
      return handlers.onIrIntervenciones
        ? {
            label: COPY.accionObjetivoSinSeguimientoCta,
            onClick: handlers.onIrIntervenciones,
          }
        : {
            label: COPY.accionObjetivoSinSeguimientoCta,
            href: `/estudiantes/${estudianteId}?tab=sesiones`,
          };
    case "objetivo_sin_evidencias":
      return handlers.onIrIntervenciones
        ? {
            label: COPY.accionObjetivoSinEvidenciasCta,
            onClick: handlers.onIrIntervenciones,
          }
        : {
            label: COPY.accionObjetivoSinEvidenciasCta,
            href: `/estudiantes/${estudianteId}?tab=sesiones`,
          };
  }
}

export function EstudianteAccionesSugeridas({
  estudianteId,
  onIrEvaluacion,
  onIrObjetivos,
  onIrPaci,
  onIrIntervenciones,
}: EstudianteAccionesSugeridasProps) {
  const [acciones, setAcciones] = useState<AccionSugerida[]>([]);

  const refresh = useCallback(() => {
    setAcciones(getEstudianteAccionesSugeridas(estudianteId));
  }, [estudianteId]);

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
    <section className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/30 p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">
          {COPY.accionesSugeridasTitulo}
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          {COPY.accionesSugeridasSubtitulo}
        </p>
      </div>

      {acciones.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">{COPY.accionesSugeridasVacio}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {acciones.map((accion) => {
            const cta = getAccionCta(accion.id, estudianteId, {
              onIrEvaluacion,
              onIrObjetivos,
              onIrPaci,
              onIrIntervenciones,
            });

            return (
              <li
                key={accion.id}
                className="rounded-xl border border-amber-100/80 bg-white/80 px-4 py-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {accion.titulo}
                </p>
                <p className="mt-1 text-sm text-slate-600">{accion.descripcion}</p>
                {cta.onClick ? (
                  <button
                    type="button"
                    onClick={cta.onClick}
                    className="mt-3 text-sm font-medium text-amber-800 hover:text-amber-900"
                  >
                    {cta.label} →
                  </button>
                ) : (
                  <Link
                    href={cta.href ?? "#"}
                    className="mt-3 inline-flex text-sm font-medium text-amber-800 hover:text-amber-900"
                  >
                    {cta.label} →
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
