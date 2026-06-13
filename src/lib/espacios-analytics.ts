import {
  getCatalogoTiposEspacio,
  getTipoEspacioById,
  type TipoEspacioId,
} from "@/lib/espacios-catalog";
import type { Espacio } from "@/lib/espacios-storage";
import type { Intervencion } from "@/lib/intervenciones-storage";
import { getSesionesByIntervencionId } from "@/lib/sessions-storage";

export type EstadisticasEspacioFiltros = {
  estudianteId?: string;
  espacioId?: string;
  tipoEspacio?: TipoEspacioId;
  soloActivos?: boolean;
};

export type EspacioEstadistica = {
  espacioId: string;
  nombre: string;
  tipoEspacio: TipoEspacioId;
  tipoEspacioNombre: string;
  etiquetasAnalitica: readonly string[];
  activo: boolean;
  totalIntervenciones: number;
  totalDuracionMinutos: number;
  promedioDuracionMinutos: number | null;
  totalEvidencias: number;
};

export type TipoEspacioEstadistica = {
  tipoEspacio: TipoEspacioId;
  nombre: string;
  etiquetasAnalitica: readonly string[];
  totalIntervenciones: number;
  totalDuracionMinutos: number;
  promedioDuracionMinutos: number | null;
  totalEvidencias: number;
  espaciosDistintos: number;
};

function matchesIntervencionFiltros(
  intervencion: Intervencion,
  filtros: EstadisticasEspacioFiltros
): boolean {
  if (filtros.estudianteId && intervencion.estudianteId !== filtros.estudianteId) {
    return false;
  }

  if (filtros.espacioId && intervencion.espacioId !== filtros.espacioId) {
    return false;
  }

  return true;
}

function buildEspacioEstadisticaVacia(espacio: Espacio): EspacioEstadistica {
  const tipo = getTipoEspacioById(espacio.tipoEspacio);

  return {
    espacioId: espacio.id,
    nombre: espacio.nombre,
    tipoEspacio: espacio.tipoEspacio,
    tipoEspacioNombre: tipo?.nombre ?? espacio.tipoEspacio,
    etiquetasAnalitica: tipo?.etiquetasAnalitica ?? ["otro"],
    activo: espacio.activo,
    totalIntervenciones: 0,
    totalDuracionMinutos: 0,
    promedioDuracionMinutos: null,
    totalEvidencias: 0,
  };
}

function withPromedioDuracion(item: EspacioEstadistica): EspacioEstadistica {
  return {
    ...item,
    promedioDuracionMinutos:
      item.totalIntervenciones > 0
        ? Math.round(
            (item.totalDuracionMinutos / item.totalIntervenciones) * 10
          ) / 10
        : null,
  };
}

/** Métricas por espacio físico (entidad Espacio). */
export function getEstadisticasPorEspacio(
  espacios: Espacio[],
  intervenciones: Intervencion[],
  filtros: EstadisticasEspacioFiltros = {}
): EspacioEstadistica[] {
  const espaciosBase = filtros.soloActivos
    ? espacios.filter((espacio) => espacio.activo)
    : espacios;

  const espaciosFiltrados = filtros.tipoEspacio
    ? espaciosBase.filter((espacio) => espacio.tipoEspacio === filtros.tipoEspacio)
    : espaciosBase;

  const stats = new Map(
    espaciosFiltrados.map((espacio) => [
      espacio.id,
      buildEspacioEstadisticaVacia(espacio),
    ])
  );

  for (const intervencion of intervenciones) {
    if (!intervencion.espacioId) continue;
    if (!matchesIntervencionFiltros(intervencion, filtros)) continue;

    const current = stats.get(intervencion.espacioId);
    if (!current) continue;

    const evidencias = getSesionesByIntervencionId(intervencion.id).length;

    stats.set(intervencion.espacioId, {
      ...current,
      totalIntervenciones: current.totalIntervenciones + 1,
      totalDuracionMinutos:
        current.totalDuracionMinutos + intervencion.duracionMinutos,
      totalEvidencias: current.totalEvidencias + evidencias,
    });
  }

  return [...stats.values()]
    .map(withPromedioDuracion)
    .sort(
      (left, right) =>
        right.totalIntervenciones - left.totalIntervenciones ||
        left.nombre.localeCompare(right.nombre, "es")
    );
}

/** Métricas agregadas por tipo de espacio. */
export function getEstadisticasPorTipoEspacio(
  espacios: Espacio[],
  intervenciones: Intervencion[],
  filtros: EstadisticasEspacioFiltros = {}
): TipoEspacioEstadistica[] {
  const porEspacio = getEstadisticasPorEspacio(espacios, intervenciones, filtros);
  const stats = new Map<TipoEspacioId, TipoEspacioEstadistica>();

  for (const tipo of getCatalogoTiposEspacio()) {
    stats.set(tipo.id, {
      tipoEspacio: tipo.id,
      nombre: tipo.nombre,
      etiquetasAnalitica: tipo.etiquetasAnalitica,
      totalIntervenciones: 0,
      totalDuracionMinutos: 0,
      promedioDuracionMinutos: null,
      totalEvidencias: 0,
      espaciosDistintos: 0,
    });
  }

  const espaciosConUso = new Set<string>();

  for (const item of porEspacio) {
    if (item.totalIntervenciones === 0) continue;

    espaciosConUso.add(item.espacioId);
    const current = stats.get(item.tipoEspacio);
    if (!current) continue;

    stats.set(item.tipoEspacio, {
      ...current,
      totalIntervenciones: current.totalIntervenciones + item.totalIntervenciones,
      totalDuracionMinutos:
        current.totalDuracionMinutos + item.totalDuracionMinutos,
      totalEvidencias: current.totalEvidencias + item.totalEvidencias,
    });
  }

  const espaciosPorTipo = new Map<TipoEspacioId, Set<string>>();
  for (const item of porEspacio) {
    if (item.totalIntervenciones === 0) continue;
    const set = espaciosPorTipo.get(item.tipoEspacio) ?? new Set<string>();
    set.add(item.espacioId);
    espaciosPorTipo.set(item.tipoEspacio, set);
  }

  return [...stats.values()]
    .map((item) => ({
      ...item,
      espaciosDistintos: espaciosPorTipo.get(item.tipoEspacio)?.size ?? 0,
      promedioDuracionMinutos:
        item.totalIntervenciones > 0
          ? Math.round(
              (item.totalDuracionMinutos / item.totalIntervenciones) * 10
            ) / 10
          : null,
    }))
    .sort(
      (left, right) =>
        right.totalIntervenciones - left.totalIntervenciones ||
        left.nombre.localeCompare(right.nombre, "es")
    );
}
