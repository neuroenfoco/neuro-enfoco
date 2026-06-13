/**
 * Catálogo extensible de tipos de intervención.
 * Para agregar un tipo: incorporar una entrada en CATALOGO_TIPOS_INTERVENCION.
 * No requiere cambios en storage ni en el modelo Intervencion.
 * Los textos visibles provienen de CATALOG_COPY.
 */

import { CATALOG_COPY } from "@/lib/copy/catalogos";

export type TipoIntervencionCategoria =
  | "aula"
  | "sesion"
  | "espacio"
  | "convivencia"
  | "familia"
  | "otro";

export type TipoIntervencionId =
  | "apoyo_en_aula"
  | "sesion_individual"
  | "sesion_grupal"
  | "espacio_calma"
  | "sala_multisensorial"
  | "aula_recursos"
  | "acompañamiento_recreo"
  | "mediacion_convivencia"
  | "orientacion_familiar"
  | "otro";

export type TipoIntervencionDef = {
  /** Identificador estable para storage y analítica. */
  id: TipoIntervencionId;
  nombre: string;
  descripcion: string;
  categoria: TipoIntervencionCategoria;
  /** Etiquetas para segmentación en reportes futuros. */
  etiquetasAnalitica: readonly string[];
  activo: boolean;
  orden: number;
};

export const CATALOGO_TIPOS_INTERVENCION = [
  {
    id: "apoyo_en_aula",
    ...CATALOG_COPY.tiposIntervencion.apoyo_en_aula,
    categoria: "aula",
    etiquetasAnalitica: ["pie", "tea", "inclusion"],
    activo: true,
    orden: 10,
  },
  {
    id: "sesion_individual",
    ...CATALOG_COPY.tiposIntervencion.sesion_individual,
    categoria: "sesion",
    etiquetasAnalitica: ["pie", "tea", "especializado"],
    activo: true,
    orden: 20,
  },
  {
    id: "sesion_grupal",
    ...CATALOG_COPY.tiposIntervencion.sesion_grupal,
    categoria: "sesion",
    etiquetasAnalitica: ["pie", "convivencia", "habilidades_sociales"],
    activo: true,
    orden: 30,
  },
  {
    id: "espacio_calma",
    ...CATALOG_COPY.tiposIntervencion.espacio_calma,
    categoria: "espacio",
    etiquetasAnalitica: ["regulacion", "bienestar", "tea"],
    activo: true,
    orden: 40,
  },
  {
    id: "sala_multisensorial",
    ...CATALOG_COPY.tiposIntervencion.sala_multisensorial,
    categoria: "espacio",
    etiquetasAnalitica: ["regulacion", "estimulacion", "tea"],
    activo: true,
    orden: 50,
  },
  {
    id: "aula_recursos",
    ...CATALOG_COPY.tiposIntervencion.aula_recursos,
    categoria: "aula",
    etiquetasAnalitica: ["pie", "especializado"],
    activo: true,
    orden: 60,
  },
  {
    id: "acompañamiento_recreo",
    ...CATALOG_COPY.tiposIntervencion.acompañamiento_recreo,
    categoria: "convivencia",
    etiquetasAnalitica: ["convivencia", "habilidades_sociales", "tea"],
    activo: true,
    orden: 70,
  },
  {
    id: "mediacion_convivencia",
    ...CATALOG_COPY.tiposIntervencion.mediacion_convivencia,
    categoria: "convivencia",
    etiquetasAnalitica: ["convivencia", "pie"],
    activo: true,
    orden: 80,
  },
  {
    id: "orientacion_familiar",
    ...CATALOG_COPY.tiposIntervencion.orientacion_familiar,
    categoria: "familia",
    etiquetasAnalitica: ["familia", "pie", "tea"],
    activo: true,
    orden: 90,
  },
  {
    id: "otro",
    ...CATALOG_COPY.tiposIntervencion.otro,
    categoria: "otro",
    etiquetasAnalitica: ["otro"],
    activo: true,
    orden: 999,
  },
] as const satisfies readonly TipoIntervencionDef[];

/** @deprecated Usar TipoIntervencionId */
export type TipoIntervencion = TipoIntervencionId;

const CATALOGO_BY_ID = new Map<string, TipoIntervencionDef>(
  CATALOGO_TIPOS_INTERVENCION.map((item) => [item.id, item])
);

/** Mapeo de etiquetas legadas del prototipo anterior. */
const LEGACY_TIPO_INTERVENCION_MAP: Record<string, TipoIntervencionId> = {
  "Apoyo PIE": "apoyo_en_aula",
  "Apoyo Ley TEA": "sesion_individual",
  "Espacio de calma": "espacio_calma",
  "Sala multisensorial": "sala_multisensorial",
  "Convivencia escolar": "mediacion_convivencia",
  "Apoyo especializado": "aula_recursos",
  Otro: "otro",
};

export function isTipoIntervencionId(value: string): value is TipoIntervencionId {
  return CATALOGO_BY_ID.has(value);
}

export function resolveTipoIntervencionId(value: string): TipoIntervencionId | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (isTipoIntervencionId(trimmed)) return trimmed;
  return LEGACY_TIPO_INTERVENCION_MAP[trimmed] ?? null;
}

export function getCatalogoTiposIntervencion(
  options: { incluirInactivos?: boolean } = {}
): TipoIntervencionDef[] {
  const items = [...CATALOGO_TIPOS_INTERVENCION];
  const filtered = options.incluirInactivos
    ? items
    : items.filter((item) => item.activo);

  return filtered.sort((left, right) => left.orden - right.orden);
}

export function getTipoIntervencionById(
  tipoIntervencionId: string
): TipoIntervencionDef | null {
  return CATALOGO_BY_ID.get(tipoIntervencionId) ?? null;
}

export function getTipoIntervencionNombre(tipoIntervencionId: string): string {
  return (
    getTipoIntervencionById(tipoIntervencionId)?.nombre ?? tipoIntervencionId
  );
}

/** Opciones listas para selects de UI. */
export function getTipoIntervencionOpciones(): {
  id: TipoIntervencionId;
  nombre: string;
  descripcion: string;
  categoria: TipoIntervencionCategoria;
}[] {
  return getCatalogoTiposIntervencion().map((item) => ({
    id: item.id,
    nombre: item.nombre,
    descripcion: item.descripcion,
    categoria: item.categoria,
  }));
}

/** IDs activos, útil para validación y enums derivados. */
export const TIPO_INTERVENCION_IDS = CATALOGO_TIPOS_INTERVENCION.map(
  (item) => item.id
) as TipoIntervencionId[];

/** @deprecated Usar getTipoIntervencionOpciones() */
export const TIPO_INTERVENCION_OPTIONS = TIPO_INTERVENCION_IDS;

