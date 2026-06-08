import { getTipoIntervencionById } from "@/lib/intervenciones-catalog";
import {
  parseIntervencionFecha,
  startOfDay,
} from "@/lib/intervenciones-analytics/date-utils";
import type {
  IntervencionesAnalyticsFiltros,
  IntervencionesAnalyticsIntervencion,
} from "@/lib/intervenciones-analytics/types";

export function applyIntervencionesAnalyticsFiltros(
  intervenciones: IntervencionesAnalyticsIntervencion[],
  filtros: IntervencionesAnalyticsFiltros = {}
): IntervencionesAnalyticsIntervencion[] {
  const fechaDesde = filtros.fechaDesde
    ? parseIntervencionFecha(filtros.fechaDesde)
    : null;
  const fechaHasta = filtros.fechaHasta
    ? parseIntervencionFecha(filtros.fechaHasta)
    : null;

  return intervenciones.filter((item) => {
    if (filtros.estudianteId && item.estudianteId !== filtros.estudianteId) {
      return false;
    }

    if (
      filtros.profesionalId &&
      item.profesionalId !== filtros.profesionalId
    ) {
      return false;
    }

    if (
      filtros.tipoIntervencionId &&
      item.tipoIntervencion !== filtros.tipoIntervencionId
    ) {
      return false;
    }

    if (filtros.espacioId && item.espacioId !== filtros.espacioId) {
      return false;
    }

    if (filtros.tipoEspacio && item.tipoEspacio !== filtros.tipoEspacio) {
      return false;
    }

    const fecha = parseIntervencionFecha(item.fecha);
    if (!fecha) return fechaDesde === null && fechaHasta === null;

    const day = startOfDay(fecha).getTime();
    if (fechaDesde && day < startOfDay(fechaDesde).getTime()) return false;
    if (fechaHasta && day > startOfDay(fechaHasta).getTime()) return false;

    return true;
  });
}

export function matchesCategoriaTipo(
  intervencion: IntervencionesAnalyticsIntervencion,
  categoria: string
): boolean {
  const tipo = getTipoIntervencionById(intervencion.tipoIntervencion);
  return tipo?.categoria === categoria;
}
