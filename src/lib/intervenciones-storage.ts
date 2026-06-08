import {
  getEstadisticasPorEspacio,
  getEstadisticasPorTipoEspacio,
  type EspacioEstadistica,
  type EstadisticasEspacioFiltros,
  type TipoEspacioEstadistica,
} from "@/lib/espacios-analytics";
import {
  getEspacioById,
  getEspacioNombre,
  getEspacios,
  isEspacioDisponibleParaIntervencion,
  resolveEspacioId,
} from "@/lib/espacios-storage";
import { buildIntervencionesAnalyticsInput } from "@/lib/intervenciones-analytics/data-source";
import { getIntervencionesAnalytics } from "@/lib/intervenciones-analytics/endpoints";
import { getEstadisticasPorTipoIntervencion } from "@/lib/intervenciones-analytics";
import type {
  EstadisticasIntervencionFiltros,
  IntervencionesAnalyticsAlcance,
  IntervencionesAnalyticsFiltros,
  TipoIntervencionEstadistica,
} from "@/lib/intervenciones-analytics/types";
import {
  isTipoIntervencionId,
  resolveTipoIntervencionId,
  type TipoIntervencionId,
} from "@/lib/intervenciones-catalog";
import {
  clearIntervencionIdFromSesiones,
  getSesionesByIntervencionId,
  updateSesionIntervencionId,
} from "@/lib/sessions-storage";
import { getEstudianteById } from "@/lib/students-storage";

export type { TipoIntervencionId };
export type {
  IntervencionesAnalytics,
  IntervencionesAnalyticsFiltros,
  IntervencionesAnalyticsResponse,
  TipoIntervencionEstadistica,
} from "@/lib/intervenciones-analytics/types";
export {
  CATALOGO_TIPOS_INTERVENCION,
  getCatalogoTiposIntervencion,
  getTipoIntervencionById,
  getTipoIntervencionNombre,
  getTipoIntervencionOpciones,
  isTipoIntervencionId,
  resolveTipoIntervencionId,
  TIPO_INTERVENCION_IDS,
  TIPO_INTERVENCION_OPTIONS,
  type TipoIntervencion,
  type TipoIntervencionCategoria,
  type TipoIntervencionDef,
} from "@/lib/intervenciones-catalog";
export type { EstadisticasIntervencionFiltros, EstadisticasEspacioFiltros };
export type {
  Espacio,
  EspacioResumen,
} from "@/lib/espacios-storage";
export {
  ensureSeedEspacios,
  getEspacioById,
  getEspacioNombre,
  getEspacios,
  getEspaciosActivos,
  getEspaciosByTipo,
  saveEspacio,
  setEspacioActivo,
  updateEspacio,
} from "@/lib/espacios-storage";
export {
  CATALOGO_TIPOS_ESPACIO,
  getCatalogoTiposEspacio,
  getTipoEspacioById,
  getTipoEspacioNombre,
  type TipoEspacioId,
} from "@/lib/espacios-catalog";
export type {
  EspacioEstadistica,
  TipoEspacioEstadistica,
};

/** Placeholder hasta implementar entidad Profesional. */
export const DEFAULT_PROFESIONAL_ID = "profesional-local";

export interface Intervencion {
  id: string;
  estudianteId: string;
  profesionalId: string;
  fecha: string;
  tipoIntervencion: TipoIntervencionId;
  /** ID de la entidad Espacio utilizada. */
  espacioId?: string;
  duracionMinutos: number;
  descripcion: string;
  /** IDs de ObjetivoPIE vinculados a esta intervención. */
  objetivosRelacionados: string[];
  /** Nombres o IDs de apoyos utilizados durante la intervención. */
  apoyosUtilizados: string[];
  observaciones: string;
}

export type IntervencionResumen = {
  intervencion: Intervencion;
  cantidadEvidencias: number;
  objetivosVinculados: number;
};

export type IntervencionDetalle = {
  resumen: IntervencionResumen;
  evidenciaIds: string[];
};

const STORAGE_KEY = "neuro-enfoco-intervenciones";

function normalizeEspacioIdForIntervencion(
  espacioId?: string
): string | undefined {
  if (!espacioId?.trim()) return undefined;
  return resolveEspacioId(espacioId.trim()) ?? espacioId.trim();
}

function normalizeIntervencionStored(item: Intervencion): Intervencion | null {
  const tipoResuelto = resolveTipoIntervencionId(item.tipoIntervencion);
  if (!tipoResuelto) return null;

  return {
    ...item,
    tipoIntervencion: tipoResuelto,
    espacioId: normalizeEspacioIdForIntervencion(item.espacioId),
  };
}

function isIntervencion(value: unknown): value is Intervencion {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.estudianteId === "string" &&
    typeof item.profesionalId === "string" &&
    typeof item.fecha === "string" &&
    typeof item.tipoIntervencion === "string" &&
    resolveTipoIntervencionId(item.tipoIntervencion) !== null &&
    (typeof item.espacioId === "string" || item.espacioId === undefined) &&
    typeof item.duracionMinutos === "number" &&
    typeof item.descripcion === "string" &&
    Array.isArray(item.objetivosRelacionados) &&
    item.objetivosRelacionados.every((id) => typeof id === "string") &&
    Array.isArray(item.apoyosUtilizados) &&
    item.apoyosUtilizados.every((apoyo) => typeof apoyo === "string") &&
    typeof item.observaciones === "string"
  );
}

function readIntervenciones(): Intervencion[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(isIntervencion)
      .map((item) => normalizeIntervencionStored(item))
      .filter((item): item is Intervencion => item !== null);
  } catch {
    return [];
  }
}

function writeIntervenciones(intervenciones: Intervencion[]): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(intervenciones));
}

export function formatIntervencionFecha(date: Date = new Date()): string {
  return date.toISOString();
}

/** @deprecated Usar getEspacioById */
export const getEspacioEscolarById = getEspacioById;

/** @deprecated Usar getEspacioNombre */
export const getEspacioEscolarNombre = getEspacioNombre;

export function getIntervenciones(): Intervencion[] {
  return readIntervenciones();
}

export function getIntervencionById(
  intervencionId: string
): Intervencion | null {
  return readIntervenciones().find((item) => item.id === intervencionId) ?? null;
}

export function getIntervencionesByEstudianteId(
  estudianteId: string
): Intervencion[] {
  return readIntervenciones().filter(
    (item) => item.estudianteId === estudianteId
  );
}

export function getIntervencionesByObjetivoId(
  objetivoId: string
): Intervencion[] {
  return readIntervenciones().filter((item) =>
    item.objetivosRelacionados.includes(objetivoId)
  );
}

export function getIntervencionesByTipo(
  tipoIntervencionId: TipoIntervencionId,
  estudianteId?: string
): Intervencion[] {
  return readIntervenciones().filter(
    (item) =>
      item.tipoIntervencion === tipoIntervencionId &&
      (!estudianteId || item.estudianteId === estudianteId)
  );
}

export function getEstadisticasIntervencionPorTipo(
  filtros: EstadisticasIntervencionFiltros = {}
): TipoIntervencionEstadistica[] {
  const input = buildIntervencionesAnalyticsInput(readIntervenciones(), {
    filtros,
  });
  return getEstadisticasPorTipoIntervencion(input.intervenciones, filtros);
}

export function getIntervencionesAnalyticsFromStorage(
  filtros: IntervencionesAnalyticsFiltros = {},
  options: {
    alcance?: IntervencionesAnalyticsAlcance;
    referencia?: string;
    ventanaSemanas?: number;
  } = {}
) {
  const input = buildIntervencionesAnalyticsInput(readIntervenciones(), {
    alcance: options.alcance,
    filtros,
    referencia: options.referencia,
    ventanaSemanas: options.ventanaSemanas,
  });
  return getIntervencionesAnalytics(input);
}

export function getIntervencionesAnalyticsInstitucional(
  options: { referencia?: string; ventanaSemanas?: number } = {}
) {
  return getIntervencionesAnalyticsFromStorage({}, {
    alcance: "institucional",
    ...options,
  });
}

export function getIntervencionesByEspacioId(
  espacioId: string,
  estudianteId?: string
): Intervencion[] {
  const resolved = resolveEspacioId(espacioId);
  if (!resolved) return [];

  return readIntervenciones().filter(
    (item) =>
      item.espacioId === resolved &&
      (!estudianteId || item.estudianteId === estudianteId)
  );
}

export function getEstadisticasIntervencionPorEspacio(
  filtros: EstadisticasEspacioFiltros = {}
): EspacioEstadistica[] {
  return getEstadisticasPorEspacio(getEspacios(), readIntervenciones(), filtros);
}

export function getEstadisticasIntervencionPorTipoEspacio(
  filtros: EstadisticasEspacioFiltros = {}
): TipoEspacioEstadistica[] {
  return getEstadisticasPorTipoEspacio(getEspacios(), readIntervenciones(), filtros);
}

export function getIntervencionResumen(
  intervencion: Intervencion
): IntervencionResumen {
  return {
    intervencion,
    cantidadEvidencias: getSesionesByIntervencionId(intervencion.id).length,
    objetivosVinculados: intervencion.objetivosRelacionados.length,
  };
}

export function getIntervencionDetalle(
  intervencionId: string
): IntervencionDetalle | null {
  const intervencion = getIntervencionById(intervencionId);
  if (!intervencion) return null;

  const evidencias = getSesionesByIntervencionId(intervencionId);

  return {
    resumen: getIntervencionResumen(intervencion),
    evidenciaIds: evidencias.map((sesion) => sesion.id),
  };
}

function normalizeObjetivosRelacionados(objetivoIds: string[]): string[] {
  return [...new Set(objetivoIds.map((id) => id.trim()).filter(Boolean))];
}

export function saveIntervencion(input: {
  estudianteId: string;
  profesionalId?: string;
  fecha?: string;
  tipoIntervencion: TipoIntervencionId;
  espacioId?: string;
  duracionMinutos: number;
  descripcion: string;
  objetivosRelacionados?: string[];
  apoyosUtilizados?: string[];
  observaciones?: string;
}): Intervencion | null {
  if (!getEstudianteById(input.estudianteId)) return null;
  if (!isTipoIntervencionId(input.tipoIntervencion)) return null;

  const espacioId = normalizeEspacioIdForIntervencion(input.espacioId);
  if (espacioId && !isEspacioDisponibleParaIntervencion(espacioId)) return null;

  const intervencion: Intervencion = {
    id: crypto.randomUUID(),
    estudianteId: input.estudianteId,
    profesionalId: input.profesionalId?.trim() || DEFAULT_PROFESIONAL_ID,
    fecha: input.fecha?.trim() || formatIntervencionFecha(),
    tipoIntervencion: input.tipoIntervencion,
    espacioId,
    duracionMinutos: Math.max(0, Math.round(input.duracionMinutos)),
    descripcion: input.descripcion.trim(),
    objetivosRelacionados: normalizeObjetivosRelacionados(
      input.objetivosRelacionados ?? []
    ),
    apoyosUtilizados: (input.apoyosUtilizados ?? [])
      .map((apoyo) => apoyo.trim())
      .filter(Boolean),
    observaciones: input.observaciones?.trim() ?? "",
  };

  writeIntervenciones([intervencion, ...readIntervenciones()]);
  return intervencion;
}

export function updateIntervencion(
  intervencionId: string,
  input: {
    profesionalId?: string;
    fecha?: string;
    tipoIntervencion?: TipoIntervencionId;
    espacioId?: string;
    duracionMinutos?: number;
    descripcion?: string;
    objetivosRelacionados?: string[];
    apoyosUtilizados?: string[];
    observaciones?: string;
  }
): Intervencion | null {
  const existing = readIntervenciones();
  const index = existing.findIndex((item) => item.id === intervencionId);
  if (index === -1) return null;

  const current = existing[index];

  if (
    input.tipoIntervencion !== undefined &&
    !isTipoIntervencionId(input.tipoIntervencion)
  ) {
    return null;
  }

  const espacioId =
    input.espacioId !== undefined
      ? normalizeEspacioIdForIntervencion(input.espacioId)
      : current.espacioId;

  if (espacioId && !getEspacioById(espacioId)) return null;
  if (
    input.espacioId !== undefined &&
    espacioId &&
    !isEspacioDisponibleParaIntervencion(espacioId)
  ) {
    return null;
  }

  const updated: Intervencion = {
    ...current,
    profesionalId: input.profesionalId?.trim() || current.profesionalId,
    fecha: input.fecha?.trim() || current.fecha,
    tipoIntervencion: input.tipoIntervencion ?? current.tipoIntervencion,
    espacioId:
      input.espacioId !== undefined ? espacioId || undefined : current.espacioId,
    duracionMinutos:
      input.duracionMinutos !== undefined
        ? Math.max(0, Math.round(input.duracionMinutos))
        : current.duracionMinutos,
    descripcion:
      input.descripcion !== undefined
        ? input.descripcion.trim()
        : current.descripcion,
    objetivosRelacionados:
      input.objetivosRelacionados !== undefined
        ? normalizeObjetivosRelacionados(input.objetivosRelacionados)
        : current.objetivosRelacionados,
    apoyosUtilizados:
      input.apoyosUtilizados !== undefined
        ? input.apoyosUtilizados.map((apoyo) => apoyo.trim()).filter(Boolean)
        : current.apoyosUtilizados,
    observaciones:
      input.observaciones !== undefined
        ? input.observaciones.trim()
        : current.observaciones,
  };

  const next = [...existing];
  next[index] = updated;
  writeIntervenciones(next);
  return updated;
}

/** Vincula una evidencia (sesión) existente a una intervención. */
export function linkEvidenciaToIntervencion(
  sesionId: string,
  intervencionId: string
): boolean {
  const intervencion = getIntervencionById(intervencionId);
  if (!intervencion) return false;

  return updateSesionIntervencionId(sesionId, intervencionId, intervencion.estudianteId);
}

/** Desvincula una evidencia de su intervención sin eliminar la sesión. */
export function unlinkEvidenciaFromIntervencion(sesionId: string): boolean {
  return updateSesionIntervencionId(sesionId, undefined);
}

export function removeObjetivoFromIntervenciones(objetivoId: string): number {
  if (typeof window === "undefined") return 0;

  const existing = readIntervenciones();
  let updatedCount = 0;

  const next = existing.map((intervencion) => {
    if (!intervencion.objetivosRelacionados.includes(objetivoId)) {
      return intervencion;
    }

    updatedCount += 1;
    return {
      ...intervencion,
      objetivosRelacionados: intervencion.objetivosRelacionados.filter(
        (id) => id !== objetivoId
      ),
    };
  });

  if (updatedCount > 0) {
    writeIntervenciones(next);
  }

  return updatedCount;
}

export function deleteIntervencion(intervencionId: string): boolean {
  if (typeof window === "undefined") return false;

  const existing = readIntervenciones();
  const next = existing.filter((item) => item.id !== intervencionId);
  if (next.length === existing.length) return false;

  clearIntervencionIdFromSesiones(intervencionId);
  writeIntervenciones(next);
  return true;
}

export function deleteIntervencionesByEstudianteId(estudianteId: string): number {
  if (typeof window === "undefined") return 0;

  const existing = readIntervenciones();
  const toRemove = existing.filter((item) => item.estudianteId === estudianteId);
  if (toRemove.length === 0) return 0;

  for (const intervencion of toRemove) {
    clearIntervencionIdFromSesiones(intervencion.id);
  }

  const removeIds = new Set(toRemove.map((item) => item.id));
  writeIntervenciones(existing.filter((item) => !removeIds.has(item.id)));
  return toRemove.length;
}
