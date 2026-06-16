/**
 * Apoyos consolidados por objetivo — lectura que cruza planificación y uso.
 *
 * **Pregunta que responde:** «¿Cómo se relacionan los apoyos planificados en el
 * objetivo con el uso del apoyo documentado en intervenciones vinculadas?»
 *
 * ## Capas semánticas (A18.5)
 *
 * | Capa | Fuente | Rol en este módulo |
 * |------|--------|-------------------|
 * | Planificación | `ObjetivoPIE.apoyosPlanificadosIds` | Apoyos previstos al planificar el objetivo |
 * | Uso del apoyo | `Sesion.apoyosUtilizados` (ApoyoSesionId) | Evidencia documentada en intervenciones |
 * | Institucional | `ApoyoPIE` | **No** incluido aquí; ver `apoyos-view.ts` |
 *
 * Complementa ApoyoPIE (¿qué implementamos?) con trazabilidad planificación ↔ uso.
 */

import {
  APOYO_PLANIFICADO_OTRO_ID,
  getApoyoPlanificadoNombre,
  isEspacioPlanificadoId,
} from "@/lib/pie-apoyos-planificados-catalog";
import { getObjetivoPIEById } from "@/lib/pie-objectives-storage";
import {
  CATALOGO_APOYOS_SESION,
  getApoyoSesionNombre,
  type ApoyoSesionId,
} from "@/lib/sesiones-form-catalog";
import {
  getSesionesByEstudianteId,
  type Sesion,
} from "@/lib/sessions-storage";

/** Cómo se vinculó una sesión al objetivo al consolidar apoyos. */
export type VinculoObjetivoSesion = "explicito" | "inferido_dimension";

export type ApoyoConsolidadoEstado =
  | "planificado_sin_documentacion"
  | "documentado_sin_planificacion"
  | "planificado_y_documentado";

export type DocumentacionApoyoItem = {
  sesionId: string;
  intervencionId?: string;
  fecha: string;
  vinculoObjetivo: VinculoObjetivoSesion;
  apoyosCoocurrentes?: string[];
};

export type ApoyoConsolidadoItem = {
  apoyoKey: string;
  catalogoId?: ApoyoSesionId | "otro";
  nombre: string;
  planificado: boolean;
  planificadoEnObjetivo: boolean;
  textoPlanificadoOtro?: string;
  documentado: boolean;
  intervencionesCount: number;
  intervencionIds: string[];
  sesionIds: string[];
  primeraDocumentacion?: string;
  ultimaDocumentacion?: string;
  diasDesdeUltimaDocumentacion?: number;
  estado: ApoyoConsolidadoEstado;
  estadoLabel: string;
  documentaciones: DocumentacionApoyoItem[];
  vinculoPrincipal: VinculoObjetivoSesion | "mixto";
};

export type ApoyosConsolidadosResumen = {
  totalPlanificados: number;
  totalDocumentados: number;
  totalPlanificadosSinDocumentacion: number;
  totalDocumentadosSinPlanificacion: number;
  totalIntervencionesConApoyos: number;
  primeraDocumentacionGlobal?: string;
  ultimaDocumentacionGlobal?: string;
};

export type ApoyosConsolidadosObjetivoFicha = {
  objetivoId: string;
  estudianteId: string;
  generadoEn: string;
  resumen: ApoyosConsolidadosResumen;
  items: ApoyoConsolidadoItem[];
  planificadosYDocumentados: ApoyoConsolidadoItem[];
  planificadosSinDocumentacion: ApoyoConsolidadoItem[];
  documentadosSinPlanificacion: ApoyoConsolidadoItem[];
};

export type ApoyosConsolidadosResumenBreve = {
  texto: string;
  apoyosFrecuentes: { nombre: string; intervencionesCount: number }[];
};

const MESES_ES: Record<string, number> = {
  ene: 0,
  feb: 1,
  mar: 2,
  abr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  ago: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dic: 11,
};

type ApoyoResuelto = {
  key: string;
  nombre: string;
  catalogoId?: ApoyoSesionId;
};

type SesionVinculo = {
  sesion: Sesion;
  vinculo: VinculoObjetivoSesion;
};

type ItemMutable = {
  apoyoKey: string;
  catalogoId?: ApoyoSesionId | "otro";
  nombre: string;
  planificado: boolean;
  textoPlanificadoOtro?: string;
  documentaciones: DocumentacionApoyoItem[];
  vinculos: Set<VinculoObjetivoSesion>;
};

function normalizeNombre(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function parseSesionFecha(fecha: string): Date | null {
  const match = fecha.match(/^(\d{1,2})\s+([a-záéíóúñ]+)\.?\s+(\d{4})$/i);
  if (!match) return null;

  const day = Number(match[1]);
  const monthKey = match[2].slice(0, 3).toLowerCase();
  const year = Number(match[3]);
  const month = MESES_ES[monthKey];
  if (month === undefined) return null;

  return new Date(year, month, day);
}

function diasDesde(fechaDisplay: string, referencia = new Date()): number | undefined {
  const parsed = parseSesionFecha(fechaDisplay);
  if (!parsed) return undefined;

  const startRef = new Date(
    referencia.getFullYear(),
    referencia.getMonth(),
    referencia.getDate()
  );
  const startFecha = new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate()
  );
  return Math.round(
    (startRef.getTime() - startFecha.getTime()) / (1000 * 60 * 60 * 24)
  );
}

function compararFechasSesion(left: string, right: string): number {
  const leftTime = parseSesionFecha(left)?.getTime() ?? 0;
  const rightTime = parseSesionFecha(right)?.getTime() ?? 0;
  return leftTime - rightTime;
}

/**
 * Resuelve apoyos documentados en una sesión desde IDs de catálogo y
 * estrategiasQueAyudaron (legacy).
 */
export function resolverApoyosDesdeSesion(sesion: Sesion): ApoyoResuelto[] {
  const apoyos = new Map<string, ApoyoResuelto>();

  for (const id of sesion.apoyosUtilizados ?? []) {
    apoyos.set(id, {
      key: id,
      nombre: getApoyoSesionNombre(id),
      catalogoId: id,
    });
  }

  for (const estrategia of sesion.estrategiasQueAyudaron ?? []) {
    const trimmed = normalizeNombre(estrategia);
    if (!trimmed) continue;

    const normalized = trimmed.toLowerCase();
    let mapeado = false;

    for (const def of CATALOGO_APOYOS_SESION) {
      const nombreNormalizado = def.nombre.toLowerCase();
      const legacyNormalizado = def.etiquetaEstrategiaLegacy?.toLowerCase();

      if (normalized === nombreNormalizado || normalized === legacyNormalizado) {
        apoyos.set(def.id, {
          key: def.id,
          nombre: def.nombre,
          catalogoId: def.id,
        });
        mapeado = true;
        break;
      }
    }

    if (!mapeado) {
      const legacyKey = `legacy:${normalized}`;
      apoyos.set(legacyKey, { key: legacyKey, nombre: trimmed });
    }
  }

  return [...apoyos.values()];
}

/**
 * Vinculación sesión ↔ objetivo:
 * - explicito: objetivosTrabajadosIds incluye el objetivo.
 * - inferido_dimension: sin objetivos explícitos, misma dimensión y estudiante.
 * - null: no vinculada (p. ej. objetivos explícitos a otro objetivo).
 */
export function resolverVinculoSesionObjetivo(
  sesion: Sesion,
  objetivoId: string,
  estudianteId: string,
  dimensionRelacionada: string
): VinculoObjetivoSesion | null {
  const ids = sesion.objetivosTrabajadosIds;

  if (ids && ids.length > 0) {
    return ids.includes(objetivoId) ? "explicito" : null;
  }

  if (
    sesion.estudianteId === estudianteId &&
    sesion.dimensiones.includes(dimensionRelacionada)
  ) {
    return "inferido_dimension";
  }

  return null;
}

function planificadoKeyFromId(
  apoyoId: string,
  textoOtro?: string
): { key: string; nombre: string; catalogoId?: ApoyoSesionId | "otro" } {
  if (apoyoId === APOYO_PLANIFICADO_OTRO_ID) {
    const texto = normalizeNombre(textoOtro ?? "") || "Otro apoyo planificado";
    return {
      key: `otro:${texto.toLowerCase()}`,
      nombre: texto,
      catalogoId: "otro",
    };
  }

  const nombre = getApoyoPlanificadoNombre(apoyoId);
  const catalogoId = CATALOGO_APOYOS_SESION.some((item) => item.id === apoyoId)
    ? (apoyoId as ApoyoSesionId)
    : undefined;

  return {
    key: apoyoId,
    nombre,
    catalogoId,
  };
}

function estadoDesdeFlags(
  planificado: boolean,
  documentado: boolean
): { estado: ApoyoConsolidadoEstado; estadoLabel: string } {
  if (planificado && documentado) {
    return {
      estado: "planificado_y_documentado",
      estadoLabel: "Planificado y documentado",
    };
  }
  if (planificado) {
    return {
      estado: "planificado_sin_documentacion",
      estadoLabel: "Planificado, sin documentación aún",
    };
  }
  return {
    estado: "documentado_sin_planificacion",
    estadoLabel: "Documentado en intervenciones",
  };
}

function materializarItem(
  mutable: ItemMutable,
  referencia = new Date()
): ApoyoConsolidadoItem {
  const documentado = mutable.documentaciones.length > 0;
  const fechasOrdenadas = [...mutable.documentaciones]
    .map((doc) => doc.fecha)
    .sort(compararFechasSesion);

  const intervencionIds = [
    ...new Set(
      mutable.documentaciones
        .map((doc) => doc.intervencionId)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  const sesionIds = [...new Set(mutable.documentaciones.map((doc) => doc.sesionId))];

  const registroUnicos = new Set(
    mutable.documentaciones.map(
      (doc) => doc.intervencionId ?? `sesion:${doc.sesionId}`
    )
  );

  const vinculoPrincipal: VinculoObjetivoSesion | "mixto" =
    mutable.vinculos.size === 0
      ? "explicito"
      : mutable.vinculos.size > 1
        ? "mixto"
        : (mutable.vinculos.values().next().value as VinculoObjetivoSesion);

  const ultimaDocumentacion = fechasOrdenadas.at(-1);
  const { estado, estadoLabel } = estadoDesdeFlags(mutable.planificado, documentado);

  return {
    apoyoKey: mutable.apoyoKey,
    catalogoId: mutable.catalogoId,
    nombre: mutable.nombre,
    planificado: mutable.planificado,
    planificadoEnObjetivo: mutable.planificado,
    textoPlanificadoOtro: mutable.textoPlanificadoOtro,
    documentado,
    intervencionesCount: registroUnicos.size,
    intervencionIds,
    sesionIds,
    primeraDocumentacion: fechasOrdenadas[0],
    ultimaDocumentacion,
    diasDesdeUltimaDocumentacion: ultimaDocumentacion
      ? diasDesde(ultimaDocumentacion, referencia)
      : undefined,
    estado,
    estadoLabel,
    documentaciones: [...mutable.documentaciones].sort((left, right) =>
      compararFechasSesion(left.fecha, right.fecha)
    ),
    vinculoPrincipal,
  };
}

export function getApoyosConsolidadosPorObjetivo(
  objetivoId: string
): ApoyosConsolidadosObjetivoFicha | null {
  if (typeof window === "undefined") return null;

  const objetivo = getObjetivoPIEById(objetivoId);
  if (!objetivo) return null;

  const itemsMap = new Map<string, ItemMutable>();
  const sesionesConApoyos = new Set<string>();

  function ensureItem(
    key: string,
    init: Omit<ItemMutable, "documentaciones" | "vinculos">
  ): ItemMutable {
    const existing = itemsMap.get(key);
    if (existing) return existing;

    const created: ItemMutable = {
      ...init,
      documentaciones: [],
      vinculos: new Set(),
    };
    itemsMap.set(key, created);
    return created;
  }

  for (const apoyoId of objetivo.apoyosPlanificadosIds ?? []) {
    if (isEspacioPlanificadoId(apoyoId)) continue;

    const { key, nombre, catalogoId } = planificadoKeyFromId(
      apoyoId,
      objetivo.apoyoPlanificadoOtro
    );
    ensureItem(key, {
      apoyoKey: key,
      catalogoId,
      nombre,
      planificado: true,
      textoPlanificadoOtro:
        apoyoId === APOYO_PLANIFICADO_OTRO_ID
          ? objetivo.apoyoPlanificadoOtro
          : undefined,
    });
  }

  const sesionesEstudiante = getSesionesByEstudianteId(objetivo.estudianteId);

  for (const sesion of sesionesEstudiante) {
    const vinculo = resolverVinculoSesionObjetivo(
      sesion,
      objetivo.id,
      objetivo.estudianteId,
      objetivo.dimensionRelacionada
    );
    if (!vinculo) continue;

    const apoyosSesion = resolverApoyosDesdeSesion(sesion);
    if (apoyosSesion.length === 0) continue;

    sesionesConApoyos.add(sesion.id);
    const nombresCoocurrentes = apoyosSesion.map((apoyo) => apoyo.nombre);

    for (const apoyo of apoyosSesion) {
      const item = ensureItem(apoyo.key, {
        apoyoKey: apoyo.key,
        catalogoId: apoyo.catalogoId,
        nombre: apoyo.nombre,
        planificado: false,
      });

      if (apoyo.catalogoId) {
        item.catalogoId = apoyo.catalogoId;
      }

      item.vinculos.add(vinculo);
      item.documentaciones.push({
        sesionId: sesion.id,
        intervencionId: sesion.intervencionId,
        fecha: sesion.fecha,
        vinculoObjetivo: vinculo,
        apoyosCoocurrentes: nombresCoocurrentes.filter(
          (nombre) => nombre !== apoyo.nombre
        ),
      });
    }
  }

  const referencia = new Date();
  const items = [...itemsMap.values()]
    .map((mutable) => materializarItem(mutable, referencia))
    .sort(
      (left, right) =>
        right.intervencionesCount - left.intervencionesCount ||
        left.nombre.localeCompare(right.nombre, "es")
    );

  const planificadosYDocumentados = items.filter(
    (item) => item.estado === "planificado_y_documentado"
  );
  const planificadosSinDocumentacion = items.filter(
    (item) => item.estado === "planificado_sin_documentacion"
  );
  const documentadosSinPlanificacion = items.filter(
    (item) => item.estado === "documentado_sin_planificacion"
  );

  const fechasGlobales = items
    .flatMap((item) => item.documentaciones.map((doc) => doc.fecha))
    .sort(compararFechasSesion);

  const idsApoyosPlanificados = (objetivo.apoyosPlanificadosIds ?? []).filter(
    (id) => !isEspacioPlanificadoId(id)
  );
  const totalPlanificados =
    idsApoyosPlanificados.length > 0
      ? new Set(
          idsApoyosPlanificados.map((id) =>
            planificadoKeyFromId(id, objetivo.apoyoPlanificadoOtro).key
          )
        ).size
      : 0;

  const resumen: ApoyosConsolidadosResumen = {
    totalPlanificados,
    totalDocumentados: items.filter((item) => item.documentado).length,
    totalPlanificadosSinDocumentacion: planificadosSinDocumentacion.length,
    totalDocumentadosSinPlanificacion: documentadosSinPlanificacion.length,
    totalIntervencionesConApoyos: sesionesConApoyos.size,
    primeraDocumentacionGlobal: fechasGlobales[0],
    ultimaDocumentacionGlobal: fechasGlobales.at(-1),
  };

  return {
    objetivoId: objetivo.id,
    estudianteId: objetivo.estudianteId,
    generadoEn: referencia.toISOString(),
    resumen,
    items,
    planificadosYDocumentados,
    planificadosSinDocumentacion,
    documentadosSinPlanificacion,
  };
}

export function getResumenBreveApoyosConsolidados(
  ficha: ApoyosConsolidadosObjetivoFicha
): ApoyosConsolidadosResumenBreve {
  const { resumen } = ficha;
  const documentadosPlanificados =
    resumen.totalPlanificados - resumen.totalPlanificadosSinDocumentacion;

  let texto: string;
  if (resumen.totalPlanificados > 0) {
    texto = `${documentadosPlanificados} de ${resumen.totalPlanificados} apoyos planificados documentados`;
  } else if (resumen.totalDocumentados > 0) {
    texto = `${resumen.totalDocumentados} apoyo${
      resumen.totalDocumentados === 1 ? "" : "s"
    } documentado${resumen.totalDocumentados === 1 ? "" : "s"} en intervenciones`;
  } else {
    texto = "Sin apoyos planificados ni documentados";
  }

  const apoyosFrecuentes = ficha.items
    .filter((item) => item.documentado)
    .sort(
      (left, right) =>
        right.intervencionesCount - left.intervencionesCount ||
        left.nombre.localeCompare(right.nombre, "es")
    )
    .slice(0, 2)
    .map((item) => ({
      nombre: item.nombre,
      intervencionesCount: item.intervencionesCount,
    }));

  return { texto, apoyosFrecuentes };
}
