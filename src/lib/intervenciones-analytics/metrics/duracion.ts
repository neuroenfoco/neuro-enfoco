import { getTipoIntervencionById } from "@/lib/intervenciones-catalog";
import {
  mediana,
  porcentaje,
  promedio,
} from "@/lib/intervenciones-analytics/date-utils";
import { computeIntervencionesPorTipo } from "@/lib/intervenciones-analytics/metrics/tipo";
import type {
  IntervencionesAnalyticsIntervencion,
  MetricasDuracion,
} from "@/lib/intervenciones-analytics/types";

export function computeMetricasDuracion(
  intervenciones: IntervencionesAnalyticsIntervencion[]
): MetricasDuracion {
  const duraciones = intervenciones.map((item) => item.duracionMinutos);
  const totalMinutos = duraciones.reduce((sum, value) => sum + value, 0);
  const porTipo = computeIntervencionesPorTipo(intervenciones);

  return {
    totalMinutos,
    promedioMinutos: promedio(duraciones),
    medianaMinutos: mediana(duraciones),
    minimoMinutos: duraciones.length > 0 ? Math.min(...duraciones) : null,
    maximoMinutos: duraciones.length > 0 ? Math.max(...duraciones) : null,
    porTipo: porTipo
      .filter((item) => item.totalIntervenciones > 0)
      .map((item) => ({
        tipoIntervencionId: item.tipoIntervencionId,
        nombre: item.nombre,
        totalDuracionMinutos: item.totalDuracionMinutos,
        porcentajeDelTotal: porcentaje(item.totalDuracionMinutos, totalMinutos),
      }))
      .sort((left, right) => {
        const leftCat = getTipoIntervencionById(left.tipoIntervencionId)?.orden ?? 0;
        const rightCat = getTipoIntervencionById(right.tipoIntervencionId)?.orden ?? 0;
        return right.totalDuracionMinutos - left.totalDuracionMinutos || leftCat - rightCat;
      }),
  };
}
