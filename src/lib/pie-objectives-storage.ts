import { GLOSSARY } from "@/lib/copy/glossary";
import {
  formatImpactoPromedio,
  getEmotionDisplay,
  getMejoraSesionForSesion,
  getPerfilEvolutivoForEstudiante,
  getSesionesByEstudianteIdAndDimension,
  getUltimaEvidenciaForDimension,
  PROFILE_DIMENSION_LABELS,
  sortSesionesByFecha,
  type Sesion,
} from "@/lib/sessions-storage";
import {
  deleteApoyosByObjetivoId,
  deleteApoyosByObjetivoIds,
  getApoyosPorObjetivo,
  type ApoyosPorObjetivo,
} from "@/lib/pie-apoyos-storage";
import { removeObjetivoFromIntervenciones } from "@/lib/intervenciones-storage";
import { getEstudianteById } from "@/lib/students-storage";

export interface ObjetivoPIE {
  id: string;
  estudianteId: string;
  nombre: string;
  dimensionRelacionada: string;
  fechaInicio: string;
  barreraDetectada?: string;
  lineaBase?: string;
  fechaLineaBase?: string;
  metaLogro?: string;
  descripcion?: string;
}

export const META_LOGRO_SIN_REGISTRO = "Sin meta registrada";

export function getMetaLogroDisplay(objetivo: ObjetivoPIE): string {
  const value = objetivo.metaLogro?.trim();
  return value ? value : META_LOGRO_SIN_REGISTRO;
}

/** Seguimiento de la meta observable. Preparado para cálculo futuro de % de avance. */
export type MetaLogroSeguimiento = {
  metaLogro: string;
  /** Porcentaje de avance respecto de la meta. null hasta implementar el cálculo. */
  porcentajeAvance: number | null;
  evidenciasAsociadas: number;
};

export function getMetaLogroSeguimiento(
  objetivo: ObjetivoPIE,
  cantidadEvidencias: number
): MetaLogroSeguimiento {
  return {
    metaLogro: getMetaLogroDisplay(objetivo),
    porcentajeAvance: null,
    evidenciasAsociadas: cantidadEvidencias,
  };
}

export const BARRERA_DETECTADA_AYUDA = GLOSSARY.barreras.ayudaObjetivo;

export const BARRERA_DETECTADA_SIN_REGISTRO = "Sin barrera registrada";

export function getBarreraDetectadaDisplay(objetivo: ObjetivoPIE): string {
  const value = objetivo.barreraDetectada?.trim();
  return value ? value : BARRERA_DETECTADA_SIN_REGISTRO;
}

export const LINEA_BASE_SIN_REGISTRO = "Sin línea base registrada";

export const FECHA_LINEA_BASE_SIN_REGISTRO = "Sin fecha registrada";

export function getLineaBaseDisplay(objetivo: ObjetivoPIE): string {
  const value = objetivo.lineaBase?.trim();
  return value ? value : LINEA_BASE_SIN_REGISTRO;
}

export function getFechaLineaBaseDisplay(objetivo: ObjetivoPIE): string {
  const value = objetivo.fechaLineaBase?.trim();
  if (!value) return FECHA_LINEA_BASE_SIN_REGISTRO;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const parsed = new Date(year, month - 1, day);
    return parsed.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function fechaLineaBaseToInputValue(fechaLineaBase?: string): string {
  if (!fechaLineaBase?.trim()) return "";

  const trimmed = fechaLineaBase.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString().slice(0, 10);
}

export function inputValueToFechaLineaBase(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  return new Date(`${trimmed}T12:00:00`).toISOString();
}

export type ObjetivoPIEResumen = {
  objetivo: ObjetivoPIE;
  cantidadEvidencias: number;
  impactoPromedio: number;
  ultimaEvidencia: string;
  estado: string;
};

export type ObjetivoPIEEvidenciaTimelineItem = {
  id: string;
  fecha: string;
  estadoInicial: string;
  estadoInicialEmoji: string;
  estadoFinal: string;
  estadoFinalEmoji: string;
  impacto: number;
  impactoLabel: string;
  fortalezas: string[];
  logro: string;
  intervencionId?: string;
};

export type FortalezaObservadaFrecuencia = {
  name: string;
  count: number;
};

export type ObjetivoPIEDetalle = {
  resumen: ObjetivoPIEResumen;
  estudianteNombre: string;
  metaLogroSeguimiento: MetaLogroSeguimiento;
  apoyos: ApoyosPorObjetivo;
  fortalezasMasObservadas: FortalezaObservadaFrecuencia[];
  evidenciasTimeline: ObjetivoPIEEvidenciaTimelineItem[];
};

export { PROFILE_DIMENSION_LABELS as PIE_DIMENSION_OPTIONS };

const STORAGE_KEY = "neuro-enfoco-objetivos-pie";

export function formatObjetivoFechaInicio(date: Date = new Date()): string {
  return date.toISOString();
}

function isObjetivoPIE(value: unknown): value is ObjetivoPIE {
  if (!value || typeof value !== "object") return false;

  const objetivo = value as Record<string, unknown>;

  return (
    typeof objetivo.id === "string" &&
    typeof objetivo.estudianteId === "string" &&
    typeof objetivo.nombre === "string" &&
    typeof objetivo.dimensionRelacionada === "string" &&
    typeof objetivo.fechaInicio === "string" &&
    (typeof objetivo.barreraDetectada === "string" ||
      objetivo.barreraDetectada === undefined) &&
    (typeof objetivo.lineaBase === "string" || objetivo.lineaBase === undefined) &&
    (typeof objetivo.fechaLineaBase === "string" ||
      objetivo.fechaLineaBase === undefined) &&
    (typeof objetivo.metaLogro === "string" || objetivo.metaLogro === undefined) &&
    (typeof objetivo.descripcion === "string" ||
      objetivo.descripcion === undefined)
  );
}

function readObjetivosPIE(): ObjetivoPIE[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isObjetivoPIE);
  } catch {
    return [];
  }
}

function writeObjetivosPIE(objetivos: ObjetivoPIE[]): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(objetivos));
}

export function getObjetivosPIE(): ObjetivoPIE[] {
  return readObjetivosPIE();
}

export function getObjetivosPIEByEstudianteId(
  estudianteId: string
): ObjetivoPIE[] {
  return readObjetivosPIE().filter(
    (objetivo) => objetivo.estudianteId === estudianteId
  );
}

export function getObjetivoPIEById(objetivoId: string): ObjetivoPIE | null {
  return readObjetivosPIE().find((objetivo) => objetivo.id === objetivoId) ?? null;
}

function getFortalezasMasObservadasEnEvidencias(
  sessions: Sesion[]
): FortalezaObservadaFrecuencia[] {
  const counts = new Map<string, number>();

  for (const sesion of sessions) {
    for (const fortaleza of sesion.fortalezas) {
      counts.set(fortaleza, (counts.get(fortaleza) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, "es"))
    .slice(0, 5);
}

function sesionToEvidenciaTimelineItem(
  sesion: Sesion
): ObjetivoPIEEvidenciaTimelineItem {
  const impacto = getMejoraSesionForSesion(sesion);
  const estadoInicial = getEmotionDisplay(sesion.estadoInicial);
  const estadoFinal = getEmotionDisplay(sesion.estadoFinal);

  return {
    id: sesion.id,
    fecha: sesion.fecha,
    estadoInicial: estadoInicial.label,
    estadoInicialEmoji: estadoInicial.emoji,
    estadoFinal: estadoFinal.label,
    estadoFinalEmoji: estadoFinal.emoji,
    impacto,
    impactoLabel: formatImpactoPromedio(impacto),
    fortalezas: sesion.fortalezas,
    logro: sesion.logro.trim() || "Sin logro registrado",
    intervencionId: sesion.intervencionId,
  };
}

export function getObjetivoPIEDetalle(objetivoId: string): ObjetivoPIEDetalle | null {
  const objetivo = getObjetivoPIEById(objetivoId);
  if (!objetivo) return null;

  const resumen = getObjetivoPIEResumen(objetivo);
  const evidenceSessions = sortSesionesByFecha(
    getSesionesByEstudianteIdAndDimension(
      objetivo.estudianteId,
      objetivo.dimensionRelacionada
    ),
    "asc"
  );

  return {
    resumen,
    estudianteNombre:
      getEstudianteById(objetivo.estudianteId)?.nombre ??
      "Estudiante no encontrado",
    metaLogroSeguimiento: getMetaLogroSeguimiento(
      objetivo,
      resumen.cantidadEvidencias
    ),
    apoyos: getApoyosPorObjetivo(objetivoId),
    fortalezasMasObservadas:
      getFortalezasMasObservadasEnEvidencias(evidenceSessions),
    evidenciasTimeline: evidenceSessions.map(sesionToEvidenciaTimelineItem),
  };
}

export function saveObjetivoPIE(input: {
  estudianteId: string;
  nombre: string;
  dimensionRelacionada: string;
  barreraDetectada: string;
  metaLogro: string;
  lineaBase?: string;
  fechaLineaBase?: string;
  descripcion?: string;
}): ObjetivoPIE {
  const objetivo: ObjetivoPIE = {
    id: crypto.randomUUID(),
    estudianteId: input.estudianteId,
    nombre: input.nombre.trim(),
    dimensionRelacionada: input.dimensionRelacionada,
    fechaInicio: formatObjetivoFechaInicio(),
    barreraDetectada: input.barreraDetectada.trim(),
    metaLogro: input.metaLogro.trim(),
    lineaBase: input.lineaBase?.trim() || undefined,
    fechaLineaBase: input.fechaLineaBase,
    descripcion: input.descripcion?.trim() || undefined,
  };

  writeObjetivosPIE([objetivo, ...readObjetivosPIE()]);
  return objetivo;
}

export function updateObjetivoPIE(
  objetivoId: string,
  input: {
    estudianteId: string;
    nombre: string;
    dimensionRelacionada: string;
    barreraDetectada: string;
    metaLogro: string;
    lineaBase?: string;
    fechaLineaBase?: string;
    descripcion?: string;
  }
): ObjetivoPIE | null {
  const existing = readObjetivosPIE();
  const index = existing.findIndex((objetivo) => objetivo.id === objetivoId);
  if (index === -1) return null;

  const updated: ObjetivoPIE = {
    ...existing[index],
    estudianteId: input.estudianteId,
    nombre: input.nombre.trim(),
    dimensionRelacionada: input.dimensionRelacionada,
    barreraDetectada: input.barreraDetectada.trim(),
    metaLogro: input.metaLogro.trim(),
    lineaBase: input.lineaBase?.trim() || undefined,
    fechaLineaBase: input.fechaLineaBase,
    descripcion: input.descripcion?.trim() || undefined,
  };

  const next = [...existing];
  next[index] = updated;
  writeObjetivosPIE(next);
  return updated;
}

export function deleteObjetivoPIE(objetivoId: string): boolean {
  if (typeof window === "undefined") return false;

  const existing = readObjetivosPIE();
  const next = existing.filter((objetivo) => objetivo.id !== objetivoId);
  if (next.length === existing.length) return false;

  deleteApoyosByObjetivoId(objetivoId);
  removeObjetivoFromIntervenciones(objetivoId);
  writeObjetivosPIE(next);
  return true;
}

export function deleteObjetivosPIEByEstudianteId(estudianteId: string): number {
  if (typeof window === "undefined") return 0;

  const existing = readObjetivosPIE();
  const objetivoIds = existing
    .filter((objetivo) => objetivo.estudianteId === estudianteId)
    .map((objetivo) => objetivo.id);
  const next = existing.filter(
    (objetivo) => objetivo.estudianteId !== estudianteId
  );
  const removedCount = existing.length - next.length;

  if (removedCount > 0) {
    deleteApoyosByObjetivoIds(objetivoIds);
    writeObjetivosPIE(next);
  }

  return removedCount;
}

export function getEstadoObjetivoPIE(
  cantidadEvidencias: number,
  impactoPromedio: number
): string {
  if (cantidadEvidencias === 0) return "Sin evidencia";
  if (impactoPromedio <= 0) return "Iniciando";
  if (impactoPromedio < 0.5) return "En desarrollo";
  if (impactoPromedio < 1.5) return "Con avance";
  return "Consolidando aprendizajes";
}

export function getObjetivoPIEResumen(objetivo: ObjetivoPIE): ObjetivoPIEResumen {
  const dimensionData = getPerfilEvolutivoForEstudiante(
    objetivo.estudianteId
  ).find((dimension) => dimension.label === objetivo.dimensionRelacionada);

  const cantidadEvidencias = dimensionData?.evidencias ?? 0;
  const impactoPromedio = dimensionData?.progresoPromedio ?? 0;
  const ultimaEvidencia =
    getUltimaEvidenciaForDimension(
      objetivo.estudianteId,
      objetivo.dimensionRelacionada
    ) ?? "Sin evidencias registradas";

  return {
    objetivo,
    cantidadEvidencias,
    impactoPromedio,
    ultimaEvidencia,
    estado: getEstadoObjetivoPIE(cantidadEvidencias, impactoPromedio),
  };
}

export function getObjetivosPIEResumen(): ObjetivoPIEResumen[] {
  return getObjetivosPIE().map(getObjetivoPIEResumen);
}

export function getObjetivosPIEResumenByEstudianteId(
  estudianteId: string
): ObjetivoPIEResumen[] {
  return getObjetivosPIEByEstudianteId(estudianteId).map(getObjetivoPIEResumen);
}

export { formatImpactoPromedio };
