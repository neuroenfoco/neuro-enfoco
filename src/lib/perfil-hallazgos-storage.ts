import type { CatalogKind } from "@/lib/catalogos/catalog-types";
import { CATALOGO_OTRO_ID } from "@/lib/catalogos/catalog-types";
import "@/lib/catalogos/index";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  esHallazgoEmergente,
  estaEnPerfilBase,
  resolvePerfilBaseDesde,
} from "@/lib/hallazgo-estado-conocimiento";
import { buscarCoincidenciasHallazgo } from "@/lib/hallazgos-normalizacion";
import {
  BARRERA_OPTIONS,
  CONTEXTO_EXITO_OPTIONS,
  FORTALEZA_OPTIONS,
  getSesionesByEstudianteId,
  INTERES_OPTIONS,
  type Sesion,
} from "@/lib/sessions-storage";

export type HallazgoTipo = "fortaleza" | "interes" | "barrera" | "contexto_exito";

/** Umbral de consolidación legacy → catálogo (mismo motor que auditoría de calidad). */
const SYNC_LEGACY_CATALOGO_UMBRAL = 0.92;

const HALLAZGO_TIPO_TO_CATALOG_KIND: Record<HallazgoTipo, CatalogKind> = {
  fortaleza: "fortalezas",
  interes: "intereses",
  contexto_exito: "contextos_exito",
  barrera: "condiciones_participacion",
};

export type SyncLegacyHallazgosMetricas = {
  estudianteId: string;
  sesionesProcesadas: number;
  itemsLegacyProcesados: number;
  reutilizadosPorCatalogoId: number;
  reutilizadosPorNombreCanonico: number;
  reutilizadosPorNombreLibre: number;
  creadosVinculadosCatalogo: number;
  creadosLibres: number;
  sinCoincidenciaCatalogo: number;
  coincidenciasDebajoUmbral: number;
  coincidenciasOtroRechazadas: number;
};

let lastSyncLegacyHallazgosMetricas: SyncLegacyHallazgosMetricas | null = null;

export function getLastSyncLegacyHallazgosMetricas(): SyncLegacyHallazgosMetricas | null {
  return lastSyncLegacyHallazgosMetricas;
}

export type HallazgoOrigen =
  | "ingreso_pie"
  | "perfil_base"
  | "intervencion"
  | "evaluacion_integral";

/** Reservado para workflow institucional futuro (borrador / validado). */
export type PerfilBaseEstadoFuturo = "borrador" | "validado";

export interface HallazgoPerfil {
  id: string;
  estudianteId: string;
  tipo: HallazgoTipo;
  nombre: string;
  /**
   * Procedencia del primer registro (auditoría). No define pertenencia al Perfil Base;
   * usar `perfilBaseDesde` / `estaEnPerfilBase()`.
   */
  origen: HallazgoOrigen;
  /**
   * Desde cuándo este hallazgo forma parte del Perfil Base institucional (ISO 8601).
   * `perfilBaseDesde != null` → estado derivado CONSOLIDADO.
   */
  perfilBaseDesde?: string;
  /** Solo aplica cuando origen === perfil_base. Sin uso en MVP. */
  estadoPerfilBase?: PerfilBaseEstadoFuturo;
  /** Catálogo institucional vinculado (opcional; Perfil Base híbrido). */
  catalogoKind?: CatalogKind;
  /** ID del ítem de catálogo o «otro» para formulación propia. */
  catalogoId?: string;
  /** Texto libre original del profesional antes de consolidar. */
  formulacionOriginal?: string;
  /** Evaluación integral que originó o consolidó el hallazgo (trazabilidad). */
  evaluacionIntegralId?: string;
  /** Hallazgo evaluativo vinculado al consolidar desde evaluación integral. */
  hallazgoEvaluativoId?: string;
  totalObservaciones: number;
  primeraObservacionEn: string | null;
  ultimaObservacionEn: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ObservacionHallazgo {
  id: string;
  hallazgoId: string;
  estudianteId: string;
  intervencionId: string;
  evidenciaId: string;
  observadoEn: string;
}

const HALLAZGOS_STORAGE_KEY = "neuro-enfoco-perfil-hallazgos";
const OBSERVACIONES_STORAGE_KEY = "neuro-enfoco-observaciones-hallazgo";

const HALLAZGO_TIPOS: HallazgoTipo[] = [
  "fortaleza",
  "interes",
  "barrera",
  "contexto_exito",
];

export function getCatalogoOpcionesPorTipo(tipo: HallazgoTipo): readonly string[] {
  switch (tipo) {
    case "fortaleza":
      return FORTALEZA_OPTIONS;
    case "interes":
      return INTERES_OPTIONS;
    case "barrera":
      return BARRERA_OPTIONS;
    case "contexto_exito":
      return CONTEXTO_EXITO_OPTIONS;
  }
}

export function normalizeHallazgoNombre(nombre: string): string {
  return nombre.trim().replace(/\s+/g, " ");
}

function nowIso(): string {
  return new Date().toISOString();
}

function isHallazgoTipo(value: string): value is HallazgoTipo {
  return HALLAZGO_TIPOS.includes(value as HallazgoTipo);
}

function isHallazgoOrigen(value: string): value is HallazgoOrigen {
  return (
    value === "ingreso_pie" ||
    value === "perfil_base" ||
    value === "intervencion" ||
    value === "evaluacion_integral"
  );
}

function isPerfilBaseEstadoFuturo(value: string): value is PerfilBaseEstadoFuturo {
  return value === "borrador" || value === "validado";
}

const CATALOG_KINDS: CatalogKind[] = [
  "fortalezas",
  "intereses",
  "contextos_exito",
  "condiciones_participacion",
];

function isCatalogKind(value: string): value is CatalogKind {
  return CATALOG_KINDS.includes(value as CatalogKind);
}

function isHallazgoPerfil(value: unknown): value is HallazgoPerfil {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.estudianteId === "string" &&
    typeof item.tipo === "string" &&
    isHallazgoTipo(item.tipo) &&
    typeof item.nombre === "string" &&
    (typeof item.origen === "string" ? isHallazgoOrigen(item.origen) : true) &&
    (typeof item.estadoPerfilBase === "string"
      ? isPerfilBaseEstadoFuturo(item.estadoPerfilBase)
      : item.estadoPerfilBase === undefined) &&
    (typeof item.catalogoKind === "string"
      ? isCatalogKind(item.catalogoKind)
      : item.catalogoKind === undefined) &&
    (typeof item.catalogoId === "string" || item.catalogoId === undefined) &&
    (typeof item.formulacionOriginal === "string" ||
      item.formulacionOriginal === undefined) &&
    (typeof item.evaluacionIntegralId === "string" ||
      item.evaluacionIntegralId === undefined) &&
    (typeof item.hallazgoEvaluativoId === "string" ||
      item.hallazgoEvaluativoId === undefined) &&
    (typeof item.perfilBaseDesde === "string" ||
      item.perfilBaseDesde === undefined) &&
    typeof item.totalObservaciones === "number" &&
    (typeof item.primeraObservacionEn === "string" ||
      item.primeraObservacionEn === null) &&
    (typeof item.ultimaObservacionEn === "string" ||
      item.ultimaObservacionEn === null) &&
    typeof item.creadoEn === "string" &&
    typeof item.actualizadoEn === "string"
  );
}

function normalizeHallazgoStored(item: HallazgoPerfil): HallazgoPerfil {
  const origen = item.origen ?? "intervencion";
  const normalized: HallazgoPerfil = {
    ...item,
    origen,
    estadoPerfilBase:
      origen === "perfil_base" ? item.estadoPerfilBase : undefined,
  };

  const perfilBaseDesde = resolvePerfilBaseDesde(normalized);
  if (perfilBaseDesde && !item.perfilBaseDesde) {
    return { ...normalized, perfilBaseDesde };
  }

  return normalized;
}

function isObservacionHallazgo(value: unknown): value is ObservacionHallazgo {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.hallazgoId === "string" &&
    typeof item.estudianteId === "string" &&
    typeof item.intervencionId === "string" &&
    typeof item.evidenciaId === "string" &&
    typeof item.observadoEn === "string"
  );
}

function readHallazgos(): HallazgoPerfil[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(HALLAZGOS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(isHallazgoPerfil)
      .map((item) => normalizeHallazgoStored(item));
  } catch {
    return [];
  }
}

function writeHallazgos(hallazgos: HallazgoPerfil[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HALLAZGOS_STORAGE_KEY, JSON.stringify(hallazgos));
}

function readObservaciones(): ObservacionHallazgo[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(OBSERVACIONES_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isObservacionHallazgo);
  } catch {
    return [];
  }
}

function writeObservaciones(observaciones: ObservacionHallazgo[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    OBSERVACIONES_STORAGE_KEY,
    JSON.stringify(observaciones)
  );
}

function sesionFechaToIso(fecha: string, hora?: string): string {
  const match = fecha.match(/^(\d{1,2})\s+([a-záéíóúñ]+)\.?\s+(\d{4})$/i);
  if (!match) return nowIso();

  const monthNames: Record<string, number> = {
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

  const day = Number(match[1]);
  const month = monthNames[match[2].slice(0, 3).toLowerCase()];
  const year = Number(match[3]);
  if (month === undefined) return nowIso();

  const [hours, minutes] = (hora ?? "12:00").split(":").map(Number);
  return new Date(
    year,
    month,
    day,
    Number.isFinite(hours) ? hours : 12,
    Number.isFinite(minutes) ? minutes : 0
  ).toISOString();
}

function recalcularAgregadosHallazgo(hallazgoId: string): void {
  const observaciones = readObservaciones().filter(
    (item) => item.hallazgoId === hallazgoId
  );
  const hallazgos = readHallazgos();
  const index = hallazgos.findIndex((item) => item.id === hallazgoId);
  if (index === -1) return;

  const timestamps = observaciones
    .map((item) => Date.parse(item.observadoEn))
    .filter(Number.isFinite);

  const updated: HallazgoPerfil = {
    ...hallazgos[index],
    totalObservaciones: observaciones.length,
    primeraObservacionEn:
      timestamps.length > 0
        ? new Date(Math.min(...timestamps)).toISOString()
        : null,
    ultimaObservacionEn:
      timestamps.length > 0
        ? new Date(Math.max(...timestamps)).toISOString()
        : null,
    actualizadoEn: nowIso(),
  };

  const next = [...hallazgos];
  next[index] = updated;
  writeHallazgos(next);
}

export function getHallazgoById(hallazgoId: string): HallazgoPerfil | null {
  return readHallazgos().find((item) => item.id === hallazgoId) ?? null;
}

export function getObservacionesByHallazgoId(
  hallazgoId: string
): ObservacionHallazgo[] {
  return readObservaciones()
    .filter((item) => item.hallazgoId === hallazgoId)
    .sort(
      (left, right) =>
        Date.parse(right.observadoEn) - Date.parse(left.observadoEn)
    );
}

export function getObservacionesByEvidenciaId(
  evidenciaId: string
): ObservacionHallazgo[] {
  return readObservaciones()
    .filter((item) => item.evidenciaId === evidenciaId)
    .sort(
      (left, right) =>
        Date.parse(right.observadoEn) - Date.parse(left.observadoEn)
    );
}

export function getHallazgosByIds(hallazgoIds: string[]): HallazgoPerfil[] {
  const ids = new Set(hallazgoIds);
  return readHallazgos().filter((item) => ids.has(item.id));
}

function sortHallazgosParaLista(items: HallazgoPerfil[]): HallazgoPerfil[] {
  return [...items].sort(
    (left, right) =>
      (estaEnPerfilBase(left) ? 0 : 1) - (estaEnPerfilBase(right) ? 0 : 1) ||
      right.totalObservaciones - left.totalObservaciones ||
      left.nombre.localeCompare(right.nombre, "es")
  );
}

export function getHallazgosByEstudianteId(
  estudianteId: string,
  tipo?: HallazgoTipo
): HallazgoPerfil[] {
  syncHallazgosFromLegacyEvidencias(estudianteId);

  return sortHallazgosParaLista(
    readHallazgos().filter(
      (item) =>
        item.estudianteId === estudianteId && (!tipo || item.tipo === tipo)
    )
  );
}

export function getHallazgosConsolidadosPerfilBase(
  estudianteId: string,
  tipo?: HallazgoTipo
): HallazgoPerfil[] {
  return sortHallazgosParaLista(
    readHallazgos().filter(
      (item) =>
        item.estudianteId === estudianteId &&
        estaEnPerfilBase(item) &&
        (!tipo || item.tipo === tipo)
    )
  );
}

/** @deprecated Usar `getHallazgosConsolidadosPerfilBase`. */
export function getHallazgosPerfilBaseByEstudianteId(
  estudianteId: string,
  tipo?: HallazgoTipo
): HallazgoPerfil[] {
  return getHallazgosConsolidadosPerfilBase(estudianteId, tipo);
}

export function getHallazgosEmergentesByEstudianteId(
  estudianteId: string,
  tipo?: HallazgoTipo
): HallazgoPerfil[] {
  return sortHallazgosParaLista(
    readHallazgos().filter(
      (item) =>
        item.estudianteId === estudianteId &&
        esHallazgoEmergente(item) &&
        (!tipo || item.tipo === tipo)
    )
  );
}

export function findHallazgoByNombre(
  estudianteId: string,
  tipo: HallazgoTipo,
  nombre: string
): HallazgoPerfil | null {
  const normalized = normalizeHallazgoNombre(nombre).toLowerCase();
  return (
    readHallazgos().find(
      (item) =>
        item.estudianteId === estudianteId &&
        item.tipo === tipo &&
        item.nombre.toLowerCase() === normalized
    ) ?? null
  );
}

export function findHallazgoByCatalogoId(
  estudianteId: string,
  tipo: HallazgoTipo,
  catalogoId: string
): HallazgoPerfil | null {
  if (!catalogoId || catalogoId === CATALOGO_OTRO_ID) return null;

  return (
    readHallazgos().find(
      (item) =>
        item.estudianteId === estudianteId &&
        item.tipo === tipo &&
        item.catalogoId === catalogoId
    ) ?? null
  );
}

export type CreateHallazgoPerfilInput = {
  estudianteId: string;
  tipo: HallazgoTipo;
  nombre: string;
  origen?: HallazgoOrigen;
  perfilBaseDesde?: string;
  estadoPerfilBase?: PerfilBaseEstadoFuturo;
  catalogoKind?: CatalogKind;
  catalogoId?: string;
  formulacionOriginal?: string;
  evaluacionIntegralId?: string;
  hallazgoEvaluativoId?: string;
};

export function createHallazgoPerfil(
  input: CreateHallazgoPerfilInput
): HallazgoPerfil | null {
  const nombre = normalizeHallazgoNombre(input.nombre);
  if (!nombre) return null;

  const formulacionOriginal = input.formulacionOriginal
    ? normalizeHallazgoNombre(input.formulacionOriginal)
    : undefined;

  const existingByCatalogo =
    input.catalogoId && input.catalogoId !== CATALOGO_OTRO_ID
      ? findHallazgoByCatalogoId(
          input.estudianteId,
          input.tipo,
          input.catalogoId
        )
      : null;
  if (existingByCatalogo) return existingByCatalogo;

  const existingByNombre = findHallazgoByNombre(
    input.estudianteId,
    input.tipo,
    nombre
  );
  if (existingByNombre) return existingByNombre;

  const origen = input.origen ?? "intervencion";
  const timestamp = nowIso();
  const hallazgo: HallazgoPerfil = {
    id: crypto.randomUUID(),
    estudianteId: input.estudianteId,
    tipo: input.tipo,
    nombre,
    origen,
    perfilBaseDesde: input.perfilBaseDesde,
    estadoPerfilBase:
      origen === "perfil_base" ? input.estadoPerfilBase : undefined,
    catalogoKind: input.catalogoKind,
    catalogoId: input.catalogoId,
    formulacionOriginal: formulacionOriginal || undefined,
    evaluacionIntegralId: input.evaluacionIntegralId,
    hallazgoEvaluativoId: input.hallazgoEvaluativoId,
    totalObservaciones: 0,
    primeraObservacionEn: null,
    ultimaObservacionEn: null,
    creadoEn: timestamp,
    actualizadoEn: timestamp,
  };

  writeHallazgos([hallazgo, ...readHallazgos()]);
  return hallazgo;
}

export function createHallazgoPerfilBase(
  input: Omit<CreateHallazgoPerfilInput, "origen" | "perfilBaseDesde">
): HallazgoPerfil | null {
  const timestamp = nowIso();
  return createHallazgoPerfil({
    ...input,
    origen: "perfil_base",
    perfilBaseDesde: timestamp,
  });
}

/**
 * @deprecated Desde Fase A3 el ingreso PIE consolida vía EvaluacionIntegral +
 * HallazgoEvaluativo + consolidarHallazgosEvaluacion(). No usar en flujos nuevos.
 * Se conserva para compatibilidad con datos o llamadas legacy.
 */
export function createHallazgoIngresoPIE(
  input: Omit<CreateHallazgoPerfilInput, "origen"> & {
    perfilBaseDesde: string;
  }
): HallazgoPerfil | null {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.warn(
      "[createHallazgoIngresoPIE] Deprecado: usar completarIngresoPIE() y el pipeline EvaluacionIntegral."
    );
  }
  return createHallazgoPerfil({
    ...input,
    origen: "ingreso_pie",
  });
}

export type IncorporarHallazgoAlPerfilBaseInput = {
  hallazgoId: string;
  /** ISO opcional; default: ahora. Solo para tests o backfill controlado. */
  perfilBaseDesde?: string;
};

export function incorporarHallazgoAlPerfilBase(
  input: IncorporarHallazgoAlPerfilBaseInput
): HallazgoPerfil | null {
  const hallazgos = readHallazgos();
  const index = hallazgos.findIndex((item) => item.id === input.hallazgoId);
  if (index === -1) return null;

  const current = hallazgos[index];
  if (resolvePerfilBaseDesde(current)) return current;

  const updated: HallazgoPerfil = {
    ...current,
    perfilBaseDesde: input.perfilBaseDesde ?? nowIso(),
    actualizadoEn: nowIso(),
  };

  const next = [...hallazgos];
  next[index] = updated;
  writeHallazgos(next);
  return updated;
}

export function updateHallazgoPerfilNombre(
  hallazgoId: string,
  nombre: string
): HallazgoPerfil | null {
  const normalized = normalizeHallazgoNombre(nombre);
  if (!normalized) return null;

  const hallazgos = readHallazgos();
  const index = hallazgos.findIndex((item) => item.id === hallazgoId);
  if (index === -1) return null;

  const current = hallazgos[index];
  const duplicate = findHallazgoByNombre(
    current.estudianteId,
    current.tipo,
    normalized
  );
  if (duplicate && duplicate.id !== hallazgoId) return null;

  const updated: HallazgoPerfil = {
    ...current,
    nombre: normalized,
    actualizadoEn: nowIso(),
  };

  const next = [...hallazgos];
  next[index] = updated;
  writeHallazgos(next);
  return updated;
}

export function deleteHallazgoPerfil(hallazgoId: string): boolean {
  const hallazgos = readHallazgos();
  if (!hallazgos.some((item) => item.id === hallazgoId)) return false;

  writeHallazgos(hallazgos.filter((item) => item.id !== hallazgoId));
  writeObservaciones(
    readObservaciones().filter((item) => item.hallazgoId !== hallazgoId)
  );
  return true;
}

function hasObservacion(evidenciaId: string, hallazgoId: string): boolean {
  return readObservaciones().some(
    (item) => item.evidenciaId === evidenciaId && item.hallazgoId === hallazgoId
  );
}

function createObservacion(input: {
  hallazgoId: string;
  estudianteId: string;
  intervencionId: string;
  evidenciaId: string;
  observadoEn: string;
}): ObservacionHallazgo | null {
  if (hasObservacion(input.evidenciaId, input.hallazgoId)) return null;

  const observacion: ObservacionHallazgo = {
    id: crypto.randomUUID(),
    hallazgoId: input.hallazgoId,
    estudianteId: input.estudianteId,
    intervencionId: input.intervencionId,
    evidenciaId: input.evidenciaId,
    observadoEn: input.observadoEn,
  };

  writeObservaciones([observacion, ...readObservaciones()]);
  recalcularAgregadosHallazgo(input.hallazgoId);
  return observacion;
}

export function registrarObservacionesHallazgo(input: {
  estudianteId: string;
  intervencionId: string;
  evidenciaId: string;
  hallazgoIds: string[];
  observadoEn?: string;
}): number {
  const observadoEn = input.observadoEn ?? nowIso();
  let created = 0;

  for (const hallazgoId of input.hallazgoIds) {
    const hallazgo = getHallazgoById(hallazgoId);
    if (!hallazgo || hallazgo.estudianteId !== input.estudianteId) continue;

    const observacion = createObservacion({
      hallazgoId,
      estudianteId: input.estudianteId,
      intervencionId: input.intervencionId,
      evidenciaId: input.evidenciaId,
      observadoEn,
    });
    if (observacion) created += 1;
  }

  return created;
}

export function hallazgosToLegacySesionFields(hallazgoIds: string[]): {
  fortalezas: string[];
  interesesObservados: string[];
  barrerasObservadas: string[];
  contextosExitoObservados: string[];
} {
  const hallazgos = getHallazgosByIds(hallazgoIds);

  return {
    fortalezas: hallazgos
      .filter((item) => item.tipo === "fortaleza")
      .map((item) => item.nombre),
    interesesObservados: hallazgos
      .filter((item) => item.tipo === "interes")
      .map((item) => item.nombre),
    barrerasObservadas: hallazgos
      .filter((item) => item.tipo === "barrera")
      .map((item) => item.nombre),
    contextosExitoObservados: hallazgos
      .filter((item) => item.tipo === "contexto_exito")
      .map((item) => item.nombre),
  };
}

function legacyItemsFromSesion(sesion: Sesion): {
  tipo: HallazgoTipo;
  nombres: string[];
}[] {
  return [
    { tipo: "fortaleza", nombres: sesion.fortalezas ?? [] },
    { tipo: "interes", nombres: sesion.interesesObservados ?? [] },
    { tipo: "barrera", nombres: sesion.barrerasObservadas ?? [] },
    { tipo: "contexto_exito", nombres: sesion.contextosExitoObservados ?? [] },
  ];
}

function hallazgoTipoToCatalogKind(tipo: HallazgoTipo): CatalogKind {
  return HALLAZGO_TIPO_TO_CATALOG_KIND[tipo];
}

/**
 * Resuelve o crea un HallazgoPerfil para texto legacy de sesión.
 * Prioriza catálogo institucional (match >= umbral) antes que nombre libre.
 * No modifica hallazgos existentes.
 */
function resolveHallazgoFromLegacyNombre(
  estudianteId: string,
  tipo: HallazgoTipo,
  legacyNombre: string,
  metricas: SyncLegacyHallazgosMetricas
): HallazgoPerfil | null {
  const normalized = normalizeHallazgoNombre(legacyNombre);
  if (!normalized) return null;

  metricas.itemsLegacyProcesados += 1;

  const catalogoKind = hallazgoTipoToCatalogKind(tipo);
  const coincidencias = buscarCoincidenciasHallazgo(normalized, {
    catalogo: catalogoKind,
    maxResultados: 1,
    umbralMinimo: SYNC_LEGACY_CATALOGO_UMBRAL,
  });

  const mejor = coincidencias[0];

  if (
    mejor &&
    mejor.score >= SYNC_LEGACY_CATALOGO_UMBRAL &&
    mejor.id !== CATALOGO_OTRO_ID
  ) {
    const nombreCanonico = normalizeHallazgoNombre(mejor.nombre);
    const formulacionOriginal =
      normalized.toLowerCase() !== nombreCanonico.toLowerCase()
        ? normalized
        : undefined;

    const existentePorCatalogo = findHallazgoByCatalogoId(
      estudianteId,
      tipo,
      mejor.id
    );
    if (existentePorCatalogo) {
      metricas.reutilizadosPorCatalogoId += 1;
      return existentePorCatalogo;
    }

    const existentePorNombreCanonico = findHallazgoByNombre(
      estudianteId,
      tipo,
      nombreCanonico
    );
    if (existentePorNombreCanonico) {
      metricas.reutilizadosPorNombreCanonico += 1;
      return existentePorNombreCanonico;
    }

    const creado = createHallazgoPerfil({
      estudianteId,
      tipo,
      nombre: nombreCanonico,
      origen: "intervencion",
      catalogoKind: mejor.catalogo,
      catalogoId: mejor.id,
      formulacionOriginal,
    });
    if (creado) metricas.creadosVinculadosCatalogo += 1;
    return creado;
  }

  if (!mejor) {
    metricas.sinCoincidenciaCatalogo += 1;
  } else if (mejor.id === CATALOGO_OTRO_ID) {
    metricas.coincidenciasOtroRechazadas += 1;
  } else {
    metricas.coincidenciasDebajoUmbral += 1;
  }

  const existenteLibre = findHallazgoByNombre(estudianteId, tipo, normalized);
  if (existenteLibre) {
    metricas.reutilizadosPorNombreLibre += 1;
    return existenteLibre;
  }

  const creadoLibre = createHallazgoPerfil({
    estudianteId,
    tipo,
    nombre: normalized,
    origen: "intervencion",
  });
  if (creadoLibre) metricas.creadosLibres += 1;
  return creadoLibre;
}

export function syncHallazgosFromLegacyEvidencias(estudianteId: string): void {
  if (typeof window === "undefined") return;

  const metricas: SyncLegacyHallazgosMetricas = {
    estudianteId,
    sesionesProcesadas: 0,
    itemsLegacyProcesados: 0,
    reutilizadosPorCatalogoId: 0,
    reutilizadosPorNombreCanonico: 0,
    reutilizadosPorNombreLibre: 0,
    creadosVinculadosCatalogo: 0,
    creadosLibres: 0,
    sinCoincidenciaCatalogo: 0,
    coincidenciasDebajoUmbral: 0,
    coincidenciasOtroRechazadas: 0,
  };

  for (const sesion of getSesionesByEstudianteId(estudianteId)) {
    if (!sesion.intervencionId) continue;

    metricas.sesionesProcesadas += 1;
    const observadoEn = sesionFechaToIso(sesion.fecha, sesion.hora);

    for (const group of legacyItemsFromSesion(sesion)) {
      for (const nombre of group.nombres) {
        const hallazgo = resolveHallazgoFromLegacyNombre(
          estudianteId,
          group.tipo,
          nombre,
          metricas
        );

        if (!hallazgo) continue;

        createObservacion({
          hallazgoId: hallazgo.id,
          estudianteId,
          intervencionId: sesion.intervencionId,
          evidenciaId: sesion.id,
          observadoEn,
        });
      }
    }
  }

  lastSyncLegacyHallazgosMetricas = metricas;

  if (process.env.NODE_ENV === "development") {
    console.debug("[syncHallazgosFromLegacyEvidencias]", metricas);
  }
}

export function deleteObservacionesByIntervencionId(intervencionId: string): number {
  const existing = readObservaciones();
  const affectedHallazgoIds = new Set(
    existing
      .filter((item) => item.intervencionId === intervencionId)
      .map((item) => item.hallazgoId)
  );
  const next = existing.filter((item) => item.intervencionId !== intervencionId);
  const removed = existing.length - next.length;

  if (removed > 0) {
    writeObservaciones(next);
    for (const hallazgoId of affectedHallazgoIds) {
      recalcularAgregadosHallazgo(hallazgoId);
    }
  }

  return removed;
}

export function deleteObservacionesByEvidenciaId(evidenciaId: string): number {
  const existing = readObservaciones();
  const affectedHallazgoIds = new Set(
    existing
      .filter((item) => item.evidenciaId === evidenciaId)
      .map((item) => item.hallazgoId)
  );
  const next = existing.filter((item) => item.evidenciaId !== evidenciaId);
  const removed = existing.length - next.length;

  if (removed > 0) {
    writeObservaciones(next);
    for (const hallazgoId of affectedHallazgoIds) {
      recalcularAgregadosHallazgo(hallazgoId);
    }
  }

  return removed;
}

export function countHallazgosByEstudianteId(estudianteId: string): number {
  return readHallazgos().filter((item) => item.estudianteId === estudianteId)
    .length;
}

export function countObservacionesByEstudianteId(estudianteId: string): number {
  return readObservaciones().filter((item) => item.estudianteId === estudianteId)
    .length;
}

export function deleteHallazgosByEstudianteId(estudianteId: string): number {
  const hallazgos = readHallazgos();
  const removedIds = new Set(
    hallazgos
      .filter((item) => item.estudianteId === estudianteId)
      .map((item) => item.id)
  );

  if (removedIds.size === 0) return 0;

  writeHallazgos(
    hallazgos.filter((item) => item.estudianteId !== estudianteId)
  );
  writeObservaciones(
    readObservaciones().filter((item) => item.estudianteId !== estudianteId)
  );

  return removedIds.size;
}

export function formatHallazgoFrecuencia(total: number): string {
  if (total === 0) return "Sin observaciones registradas";
  if (total === 1) return "Observada en 1 intervención";
  return `Observada en ${total} intervenciones`;
}

export function getHallazgoOrigenLabel(origen: HallazgoOrigen): string {
  switch (origen) {
    case "ingreso_pie":
      return GLOSSARY.perfilBase.origenIngresoPie;
    case "perfil_base":
      return GLOSSARY.perfilBase.origenPerfilBase;
    case "intervencion":
      return GLOSSARY.perfilBase.origenIntervencion;
    case "evaluacion_integral":
      return GLOSSARY.perfilBase.origenEvaluacionIntegral;
  }
}

export function formatHallazgoConfirmaciones(total: number): string {
  if (total === 0) return "Confirmaciones: ninguna";
  if (total === 1) return "Confirmaciones: 1 intervención";
  return `Confirmaciones: ${total} intervenciones`;
}

export {
  estaEnPerfilBase,
  esHallazgoEmergente,
  resolveEstadoConocimiento,
  resolvePerfilBaseDesde,
  UMBRAL_EMERGENTE_OBSERVACIONES,
  type EstadoConocimiento,
} from "@/lib/hallazgo-estado-conocimiento";
