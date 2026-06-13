import {
  CATALOGO_APOYOS_SESION,
  CATALOGO_APOYOS_SESION_CATEGORIAS,
  CATALOGO_ESPACIOS_SESION,
  getApoyoSesionNombre,
  getSesionEspacioNombre,
  type ApoyoSesionCategoriaId,
  type ApoyoSesionId,
  type SesionEspacioId,
} from "@/lib/sesiones-form-catalog";

/** Único extra fuera del catálogo canónico de apoyos de participación. */
export type ApoyoPlanificadoExtraId = "otro";

/**
 * ID de apoyo planificado: catálogo canónico (sesión) + otro + espacios legacy en storage.
 * Los espacios ya no se ofrecen en el catálogo de apoyos; se planifican aparte.
 */
export type ApoyoPlanificadoId =
  | ApoyoSesionId
  | ApoyoPlanificadoExtraId
  | SesionEspacioId;

export type ApoyoPlanificadoCategoriaId = ApoyoSesionCategoriaId;

export type ApoyoPlanificadoItem = {
  id: ApoyoSesionId;
  nombre: string;
};

export type ApoyoPlanificadoCategoria = {
  id: ApoyoPlanificadoCategoriaId;
  nombre: string;
  items: readonly ApoyoPlanificadoItem[];
};

export type EspacioPlanificadoItem = {
  id: SesionEspacioId;
  nombre: string;
};

/**
 * Catálogo de apoyos planificados — derivado de {@link CATALOGO_APOYOS_SESION_CATEGORIAS}.
 * Misma fuente, categorías, nombres e IDs que intervenciones.
 */
export const CATALOGO_APOYOS_PLANIFICADOS: readonly ApoyoPlanificadoCategoria[] =
  CATALOGO_APOYOS_SESION_CATEGORIAS.map((categoria) => ({
    id: categoria.id,
    nombre: categoria.nombre,
    items: categoria.items.map((item) => ({
      id: item.id,
      nombre: item.nombre,
    })),
  }));

/** Espacios previstos (no son apoyos de participación). Excluye «Otro». */
export const CATALOGO_ESPACIOS_PLANIFICADOS: readonly EspacioPlanificadoItem[] =
  CATALOGO_ESPACIOS_SESION.filter((espacio) => espacio.id !== "otro").map(
    (espacio) => ({
      id: espacio.id,
      nombre: espacio.nombre,
    })
  );

export const APOYO_PLANIFICADO_OTRO_ID: ApoyoPlanificadoExtraId = "otro";

const EXTRA_APOYO_NOMBRES: Record<ApoyoPlanificadoExtraId, string> = {
  otro: "Otro",
};

export function isEspacioPlanificadoId(id: string): id is SesionEspacioId {
  return CATALOGO_ESPACIOS_SESION.some(
    (espacio) => espacio.id === id && espacio.id !== "otro"
  );
}

export function isApoyoPlanificadoCanonicoId(
  id: string
): id is ApoyoSesionId {
  return CATALOGO_APOYOS_SESION.some((item) => item.id === id);
}

/**
 * Separa IDs persistidos en apoyos vs espacios (compatibilidad con registros mezclados).
 */
export function partitionApoyosPlanificadosIds(ids: string[]): {
  apoyosIds: string[];
  espaciosIds: SesionEspacioId[];
} {
  const apoyosIds: string[] = [];
  const espaciosIds: SesionEspacioId[] = [];

  for (const id of ids) {
    if (isEspacioPlanificadoId(id)) {
      espaciosIds.push(id);
    } else {
      apoyosIds.push(id);
    }
  }

  return { apoyosIds, espaciosIds };
}

/** Recompone el array único almacenado en ObjetivoPIE.apoyosPlanificadosIds. */
export function mergeApoyosPlanificadosStorage(
  apoyosIds: string[],
  espaciosIds: SesionEspacioId[]
): string[] {
  return [...apoyosIds, ...espaciosIds];
}

export function getApoyoPlanificadoNombre(id: string): string {
  if (id === APOYO_PLANIFICADO_OTRO_ID) {
    return EXTRA_APOYO_NOMBRES.otro;
  }

  if (isEspacioPlanificadoId(id)) {
    return getSesionEspacioNombre(id);
  }

  if (isApoyoPlanificadoCanonicoId(id)) {
    return getApoyoSesionNombre(id);
  }

  return id;
}

export function getEspacioPlanificadoNombre(id: SesionEspacioId): string {
  return getSesionEspacioNombre(id);
}

export function getAllApoyoPlanificadoCanonicoIds(): ApoyoSesionId[] {
  return CATALOGO_APOYOS_SESION.map((item) => item.id);
}
