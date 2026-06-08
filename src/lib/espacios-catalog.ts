/**
 * Catálogo extensible de tipos de espacio de intervención.
 * Para agregar un tipo: extender TipoEspacioId y CATALOGO_TIPOS_ESPACIO.
 * Los textos visibles provienen de CATALOG_COPY.
 */

import { CATALOG_COPY } from "@/lib/copy/catalogos";

export type TipoEspacioId =
  | "sala_multisensorial"
  | "espacio_calma"
  | "aula_recursos"
  | "sala_tea"
  | "oficina_convivencia"
  | "sala_apoyo"
  | "otro";

export type TipoEspacioDef = {
  id: TipoEspacioId;
  nombre: string;
  descripcion: string;
  etiquetasAnalitica: readonly string[];
  orden: number;
};

export const CATALOGO_TIPOS_ESPACIO = [
  {
    id: "sala_multisensorial",
    ...CATALOG_COPY.espacios.sala_multisensorial,
    etiquetasAnalitica: ["regulacion", "estimulacion", "tea"],
    orden: 10,
  },
  {
    id: "espacio_calma",
    ...CATALOG_COPY.espacios.espacio_calma,
    etiquetasAnalitica: ["regulacion", "bienestar"],
    orden: 20,
  },
  {
    id: "aula_recursos",
    ...CATALOG_COPY.espacios.aula_recursos,
    etiquetasAnalitica: ["pie", "especializado"],
    orden: 30,
  },
  {
    id: "sala_tea",
    ...CATALOG_COPY.espacios.sala_tea,
    etiquetasAnalitica: ["tea", "especializado"],
    orden: 40,
  },
  {
    id: "oficina_convivencia",
    ...CATALOG_COPY.espacios.oficina_convivencia,
    etiquetasAnalitica: ["convivencia", "pie"],
    orden: 50,
  },
  {
    id: "sala_apoyo",
    ...CATALOG_COPY.espacios.sala_apoyo,
    etiquetasAnalitica: ["pie", "apoyo"],
    orden: 60,
  },
  {
    id: "otro",
    ...CATALOG_COPY.espacios.otro,
    etiquetasAnalitica: ["otro"],
    orden: 999,
  },
] as const satisfies readonly TipoEspacioDef[];

const CATALOGO_BY_ID = new Map<string, TipoEspacioDef>(
  CATALOGO_TIPOS_ESPACIO.map((item) => [item.id, item])
);

export function buildEspacioSeedId(tipoEspacio: TipoEspacioId): string {
  return `espacio-${tipoEspacio}`;
}

/** Mapeo de IDs legados del prototipo anterior. */
const LEGACY_ESPACIO_ID_MAP: Record<string, string> = {
  "sala-multisensorial": buildEspacioSeedId("sala_multisensorial"),
  "espacio-calma": buildEspacioSeedId("espacio_calma"),
  aula: buildEspacioSeedId("aula_recursos"),
  patio: buildEspacioSeedId("otro"),
  "sala-psicologia": buildEspacioSeedId("sala_apoyo"),
  biblioteca: buildEspacioSeedId("otro"),
  otro: buildEspacioSeedId("otro"),
};

export function isTipoEspacioId(value: string): value is TipoEspacioId {
  return CATALOGO_BY_ID.has(value);
}

export function resolveTipoEspacioId(value: string): TipoEspacioId | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (isTipoEspacioId(trimmed)) return trimmed;
  return null;
}

export function resolveEspacioId(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (LEGACY_ESPACIO_ID_MAP[trimmed]) {
    return LEGACY_ESPACIO_ID_MAP[trimmed];
  }

  if (trimmed.startsWith("espacio-") && isTipoEspacioId(trimmed.slice(8))) {
    return trimmed;
  }

  return trimmed;
}

export function getCatalogoTiposEspacio(): TipoEspacioDef[] {
  return [...CATALOGO_TIPOS_ESPACIO].sort((left, right) => left.orden - right.orden);
}

export function getTipoEspacioById(
  tipoEspacio: string
): TipoEspacioDef | null {
  return CATALOGO_BY_ID.get(tipoEspacio) ?? null;
}

export function getTipoEspacioNombre(tipoEspacio: string): string {
  return getTipoEspacioById(tipoEspacio)?.nombre ?? tipoEspacio;
}
