import {
  getCatalogoTiposIntervencion,
  getTipoIntervencionById,
  type TipoIntervencionId,
} from "@/lib/intervenciones-catalog";
import { porcentaje } from "@/lib/intervenciones-analytics/date-utils";
import type {
  IntervencionesAnalyticsIntervencion,
  TipoIntervencionEstadistica,
} from "@/lib/intervenciones-analytics/types";

function buildEstadisticaVacia(
  tipoIntervencionId: TipoIntervencionId
): TipoIntervencionEstadistica {
  const tipo = getTipoIntervencionById(tipoIntervencionId);

  return {
    tipoIntervencionId,
    nombre: tipo?.nombre ?? tipoIntervencionId,
    categoria: tipo?.categoria ?? "otro",
    etiquetasAnalitica: tipo?.etiquetasAnalitica ?? ["otro"],
    totalIntervenciones: 0,
    totalDuracionMinutos: 0,
    promedioDuracionMinutos: null,
    totalEvidencias: 0,
    porcentajeDelTotal: 0,
  };
}

export function computeIntervencionesPorTipo(
  intervenciones: IntervencionesAnalyticsIntervencion[]
): TipoIntervencionEstadistica[] {
  const total = intervenciones.length;
  const stats = new Map<TipoIntervencionId, TipoIntervencionEstadistica>();

  for (const tipo of getCatalogoTiposIntervencion()) {
    stats.set(tipo.id, buildEstadisticaVacia(tipo.id));
  }

  for (const intervencion of intervenciones) {
    const current =
      stats.get(intervencion.tipoIntervencion) ??
      buildEstadisticaVacia(intervencion.tipoIntervencion);

    stats.set(intervencion.tipoIntervencion, {
      ...current,
      totalIntervenciones: current.totalIntervenciones + 1,
      totalDuracionMinutos:
        current.totalDuracionMinutos + intervencion.duracionMinutos,
      totalEvidencias: current.totalEvidencias + intervencion.cantidadEvidencias,
    });
  }

  return [...stats.values()]
    .map((item) => ({
      ...item,
      promedioDuracionMinutos:
        item.totalIntervenciones > 0
          ? Math.round(
              (item.totalDuracionMinutos / item.totalIntervenciones) * 10
            ) / 10
          : null,
      porcentajeDelTotal: porcentaje(item.totalIntervenciones, total),
    }))
    .sort(
      (left, right) =>
        right.totalIntervenciones - left.totalIntervenciones ||
        left.nombre.localeCompare(right.nombre, "es")
    );
}
