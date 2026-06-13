export * from "@/lib/intervenciones-analytics/types";
export * from "@/lib/intervenciones-analytics/constants";
export * from "@/lib/intervenciones-analytics/aggregator";
export * from "@/lib/intervenciones-analytics/data-source";
export * from "@/lib/intervenciones-analytics/endpoints";
export * from "@/lib/intervenciones-analytics/validators";

export { computeIntervencionesPorEstudiante } from "@/lib/intervenciones-analytics/metrics/estudiante";
export { computeIntervencionesPorProfesional } from "@/lib/intervenciones-analytics/metrics/profesional";
export { computeIntervencionesPorTipo } from "@/lib/intervenciones-analytics/metrics/tipo";
export { computeMetricasDuracion } from "@/lib/intervenciones-analytics/metrics/duracion";
export { computeFrecuenciaSemanal } from "@/lib/intervenciones-analytics/metrics/frecuencia-semanal";
export { computeDistribucionPorEspacio } from "@/lib/intervenciones-analytics/metrics/espacio";
export { computeObjetivosMasTrabajados } from "@/lib/intervenciones-analytics/metrics/objetivos";

import { matchesCategoriaTipo } from "@/lib/intervenciones-analytics/filters";
import { computeIntervencionesPorTipo } from "@/lib/intervenciones-analytics/metrics/tipo";
import type {
  EstadisticasIntervencionFiltros,
  IntervencionesAnalyticsIntervencion,
} from "@/lib/intervenciones-analytics/types";

/** Compatibilidad con API previa de estadísticas por tipo. */
export function getEstadisticasPorTipoIntervencion(
  intervenciones: IntervencionesAnalyticsIntervencion[],
  filtros: EstadisticasIntervencionFiltros = {}
): ReturnType<typeof computeIntervencionesPorTipo> {
  const filtered = intervenciones.filter((item) => {
    if (filtros.estudianteId && item.estudianteId !== filtros.estudianteId) {
      return false;
    }
    if (
      filtros.tipoIntervencionId &&
      item.tipoIntervencion !== filtros.tipoIntervencionId
    ) {
      return false;
    }
    if (filtros.categoria && !matchesCategoriaTipo(item, filtros.categoria)) {
      return false;
    }
    return true;
  });

  return computeIntervencionesPorTipo(filtered);
}

export function getTotalIntervencionesPorTipo(
  intervenciones: IntervencionesAnalyticsIntervencion[],
  tipoIntervencionId: IntervencionesAnalyticsIntervencion["tipoIntervencion"],
  estudianteId?: string
): number {
  return intervenciones.filter(
    (item) =>
      item.tipoIntervencion === tipoIntervencionId &&
      (!estudianteId || item.estudianteId === estudianteId)
  ).length;
}

export type { TipoIntervencionCategoria } from "@/lib/intervenciones-catalog";
