import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getEmotionDisplay,
  getEstadoEmocionalValor,
  normalizeEmotionalStateLabel,
} from "@/lib/copy/emotional-states";
import type {
  ApoyoSesionId,
  EvidenciaInstitucionalId,
  NivelApoyoRequeridoId,
  NivelParticipacionId,
  SesionEspacioId,
} from "@/lib/sesiones-form-catalog";
import {
  getSesionEspacioNombre,
  resolveSesionEspacioId,
} from "@/lib/sesiones-form-catalog";

export {
  getEmotionDisplay,
  getEstadoEmocionalValor,
  normalizeEmotionalStateLabel,
} from "@/lib/copy/emotional-states";
import {
  getEstudianteById,
  getEstudiantes,
  MARTINA_STUDENT_ID,
} from "@/lib/students-storage";

export type Sesion = {
  id: string;
  fecha: string;
  estudianteId?: string;
  estudiante: string;
  espacio: string;
  estadoInicial: string;
  fortalezas: string[];
  logro: string;
  dimensiones: string[];
  evidenciaPIE: boolean;
  evidenciaLeyTEA: boolean;
  estadoFinal: string;
  /** estadoFinalValor - estadoInicialValor (escala 1–5) */
  mejoraSesion?: number;
  interesesObservados?: string[];
  contextosExitoObservados?: string[];
  estrategiasQueAyudaron?: string[];
  barrerasObservadas?: string[];
  /** Evidencia vinculada a una intervención concreta. */
  intervencionId?: string;
  /** Hora de inicio en formato HH:mm. */
  hora?: string;
  /** Duración explícita de la intervención en minutos. */
  duracionMinutos?: number;
  profesionalId?: string;
  profesionalNombre?: string;
  espacioId?: SesionEspacioId;
  /** IDs de ObjetivoPIE trabajados en la sesión. */
  objetivosTrabajadosIds?: string[];
  /** IDs del catálogo de apoyos utilizados. */
  apoyosUtilizados?: ApoyoSesionId[];
  nivelParticipacion?: NivelParticipacionId;
  nivelApoyoRequerido?: NivelApoyoRequeridoId;
  /** Categorías institucionales seleccionadas (extensible). */
  evidenciasInstitucionales?: EvidenciaInstitucionalId[];
};

export const INTERES_OPTIONS = [
  "Animales",
  "Tecnología",
  "Arte",
  "Naturaleza",
  "Construcción",
  "Música",
  "Lectura",
  "Ciencia",
  "Videojuegos",
  "Deportes",
] as const;

export const CONTEXTO_EXITO_OPTIONS = [
  "Actividades prácticas",
  "Ambientes tranquilos",
  "Apoyos visuales",
  "Rutinas anticipadas",
  "Trabajo individual",
  "Trabajo colaborativo",
  "Sala multisensorial",
  "Espacio de calma",
  "Tecnología de apoyo",
  "Instrucciones paso a paso",
] as const;

export const ESTRATEGIA_OPTIONS = [
  "Anticipar cambios",
  "Instrucciones visuales",
  "Tiempo de transición",
  "Actividades estructuradas",
  "Refuerzo positivo",
  "Apoyo individual",
  "Pausas programadas",
  "Material concreto",
  "Modelado",
  "Elección guiada",
] as const;

export const BARRERA_OPTIONS = [
  "Cambios inesperados",
  "Ambientes muy ruidosos",
  "Instrucciones extensas",
  "Esperas prolongadas",
  "Sobrecarga sensorial",
  "Actividades poco estructuradas",
  GLOSSARY.barreras.trabajoGrupal,
  "Demandas simultáneas",
  "Exceso de estímulos",
  "Falta de anticipación",
] as const;

export type ObjetivoEstudiante = {
  nombre: string;
  dimensionRelacionada: string;
};

export type ObjetivoEstudianteResumen = {
  objetivo: ObjetivoEstudiante;
  estado: string;
  progresoPromedio: number;
  evidenciasAsociadas: number;
  ultimaEvidencia: string;
};

export const DEFAULT_OBJETIVO_ESTUDIANTE: ObjetivoEstudiante = {
  nombre: "Identificación emocional",
  dimensionRelacionada: "Regulación emocional",
};

/** @deprecated Usar DEFAULT_OBJETIVO_ESTUDIANTE */
export const DEFAULT_OBJETIVO_MARTINA = DEFAULT_OBJETIVO_ESTUDIANTE;

export type FrecuenciaItem = {
  name: string;
  count: number;
};

export type SesionTableRow = {
  id: string;
  date: string;
  student: string;
  course: string;
  space: string;
  initialState: { emoji: string; label: string };
  finalState: { emoji: string; label: string };
  strengths: string[];
  pie: boolean;
  leyTea: boolean;
};

const STORAGE_KEY = "neuro-enfoco-sesiones";

export function calcularMejoraSesion(
  estadoInicial: string,
  estadoFinal: string
): number {
  const estadoInicialValor = getEstadoEmocionalValor(estadoInicial);
  const estadoFinalValor = getEstadoEmocionalValor(estadoFinal);
  return estadoFinalValor - estadoInicialValor;
}

function resolveEstudianteId(sesion: Sesion): string {
  if (sesion.estudianteId) return sesion.estudianteId;

  const estudiantePorNombre = getEstudiantes().find(
    (estudiante) => estudiante.nombre === sesion.estudiante
  );
  if (estudiantePorNombre) return estudiantePorNombre.id;

  return MARTINA_STUDENT_ID;
}

function normalizeSesion(sesion: Sesion): Sesion {
  const espacioId =
    sesion.espacioId ?? resolveSesionEspacioId(sesion.espacio) ?? undefined;
  const espacio =
    espacioId !== undefined
      ? getSesionEspacioNombre(espacioId)
      : sesion.espacio;

  const evidenciasInstitucionales =
    sesion.evidenciasInstitucionales ??
    ([
      ...(sesion.evidenciaPIE ? (["evidencia_pie"] as const) : []),
      ...(sesion.evidenciaLeyTEA ? (["evidencia_ley_tea"] as const) : []),
    ] as EvidenciaInstitucionalId[]);

  const normalized: Sesion = {
    ...sesion,
    estudianteId: resolveEstudianteId(sesion),
    espacio,
    espacioId,
    interesesObservados: sesion.interesesObservados ?? [],
    contextosExitoObservados: sesion.contextosExitoObservados ?? [],
    estrategiasQueAyudaron: sesion.estrategiasQueAyudaron ?? [],
    barrerasObservadas: sesion.barrerasObservadas ?? [],
    objetivosTrabajadosIds: sesion.objetivosTrabajadosIds ?? [],
    apoyosUtilizados: sesion.apoyosUtilizados ?? [],
    evidenciasInstitucionales,
    evidenciaPIE:
      sesion.evidenciaPIE || evidenciasInstitucionales.includes("evidencia_pie"),
    evidenciaLeyTEA:
      sesion.evidenciaLeyTEA ||
      evidenciasInstitucionales.includes("evidencia_ley_tea"),
    estadoInicial: normalizeEmotionalStateLabel(sesion.estadoInicial),
    estadoFinal: normalizeEmotionalStateLabel(sesion.estadoFinal),
  };

  const withMejora =
    typeof normalized.mejoraSesion === "number"
      ? normalized
      : {
          ...normalized,
          mejoraSesion: calcularMejoraSesion(
            normalized.estadoInicial,
            normalized.estadoFinal
          ),
        };

  return withMejora;
}

export function formatSesionFecha(date: Date = new Date()): string {
  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatSesionHora(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function dateInputValueToSesionFecha(value: string): string {
  if (!value.trim()) return formatSesionFecha();

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return formatSesionFecha();

  return formatSesionFecha(new Date(year, month - 1, day));
}

export function sesionFechaToDateInputValue(fecha: string): string {
  const match = fecha.match(/^(\d{1,2})\s+([a-záéíóúñ]+)\.?\s+(\d{4})$/i);
  if (!match) return "";

  const day = Number(match[1]);
  const monthKey = match[2].slice(0, 3).toLowerCase();
  const year = Number(match[3]);
  const month = MESES_ES[monthKey];
  if (month === undefined) return "";

  const date = new Date(year, month, day);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getSesiones(): Sesion[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isSesion).map(normalizeSesion);
  } catch {
    return [];
  }
}

export function saveSesion(sesion: Sesion): void {
  if (typeof window === "undefined") return;

  const existing = getSesiones();
  const next = [normalizeSesion(sesion), ...existing];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function deleteSession(sessionId: string): boolean {
  if (typeof window === "undefined") return false;

  const existing = getSesiones();
  const next = existing.filter((sesion) => sesion.id !== sessionId);
  if (next.length === existing.length) return false;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return true;
}

export function deleteSessionsByEstudianteId(estudianteId: string): number {
  if (typeof window === "undefined") return 0;

  const existing = getSesiones();
  const next = existing.filter(
    (sesion) => sesion.estudianteId !== estudianteId
  );
  const removedCount = existing.length - next.length;

  if (removedCount > 0) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return removedCount;
}

export function isStoredSessionId(sessionId: string): boolean {
  return getSesiones().some((sesion) => sesion.id === sessionId);
}

export function sesionToTableRow(sesion: Sesion): SesionTableRow {
  const estudianteId = sesion.estudianteId ?? resolveEstudianteId(sesion);

  return {
    id: sesion.id,
    date: sesion.fecha,
    student: sesion.estudiante,
    course: getEstudianteById(estudianteId)?.curso ?? "",
    space: sesion.espacio,
    initialState: getEmotionDisplay(sesion.estadoInicial),
    finalState: getEmotionDisplay(sesion.estadoFinal),
    strengths: sesion.fortalezas,
    pie: sesion.evidenciaPIE,
    leyTea: sesion.evidenciaLeyTEA,
  };
}

export function getStoredTableRows(): SesionTableRow[] {
  return getSesiones().map(sesionToTableRow);
}

export function getSesionesByEstudianteId(estudianteId: string): Sesion[] {
  return getSesiones().filter((sesion) => sesion.estudianteId === estudianteId);
}

export function getSesionesByEstudianteIdAndDimension(
  estudianteId: string,
  dimension: string
): Sesion[] {
  return getSesionesByEstudianteId(estudianteId).filter((sesion) =>
    sesion.dimensiones.includes(dimension)
  );
}

export function getSesionesByIntervencionId(intervencionId: string): Sesion[] {
  return getSesiones().filter((sesion) => sesion.intervencionId === intervencionId);
}

export function getSesionesSinIntervencionByEstudianteId(
  estudianteId: string
): Sesion[] {
  return getSesionesByEstudianteId(estudianteId).filter(
    (sesion) => !sesion.intervencionId
  );
}

function persistSesiones(sesiones: Sesion[]): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(sesiones.map(normalizeSesion))
  );
}

export function updateSesionIntervencionId(
  sesionId: string,
  intervencionId: string | undefined,
  expectedEstudianteId?: string
): boolean {
  if (typeof window === "undefined") return false;

  const existing = getSesiones();
  const index = existing.findIndex((sesion) => sesion.id === sesionId);
  if (index === -1) return false;

  const current = existing[index];
  if (
    expectedEstudianteId &&
    resolveEstudianteId(current) !== expectedEstudianteId
  ) {
    return false;
  }

  const next = [...existing];
  next[index] = { ...current, intervencionId };
  persistSesiones(next);
  return true;
}

export function clearIntervencionIdFromSesiones(intervencionId: string): number {
  if (typeof window === "undefined") return 0;

  const existing = getSesiones();
  let cleared = 0;

  const next = existing.map((sesion) => {
    if (sesion.intervencionId !== intervencionId) return sesion;

    cleared += 1;
    return { ...sesion, intervencionId: undefined };
  });

  if (cleared > 0) {
    persistSesiones(next);
  }

  return cleared;
}

export function sortSesionesByFecha(
  sessions: Sesion[],
  order: "asc" | "desc" = "asc"
): Sesion[] {
  return [...sessions].sort((left, right) => {
    const leftTime = parseSesionFecha(left.fecha)?.getTime() ?? 0;
    const rightTime = parseSesionFecha(right.fecha)?.getTime() ?? 0;
    return order === "asc" ? leftTime - rightTime : rightTime - leftTime;
  });
}

/** @deprecated Usar getSesionesByEstudianteId */
export function getSesionesByEstudiante(estudiante: string): Sesion[] {
  const estudiantePorNombre = getEstudiantes().find(
    (item) => item.nombre === estudiante
  );
  if (estudiantePorNombre) {
    return getSesionesByEstudianteId(estudiantePorNombre.id);
  }

  return getSesiones().filter((sesion) => sesion.estudiante === estudiante);
}

export type LogroReciente = {
  id: string;
  fecha: string;
  logro: string;
  fortaleza: string;
  espacio: string;
};

export type DimensionPerfil = {
  label: string;
  nivelActual: string;
  /** Frecuencia de observación: evidencias / total sesiones × 100. No es progreso emocional. */
  indiceEvidencia: number;
  evidencias: number;
  /** Promedio de mejoraSesion en sesiones que documentan esta dimensión. */
  progresoPromedio: number;
  color: string;
};

export const PROFILE_DIMENSION_LABELS = [
  "Regulación emocional",
  "Interacción social",
  "Comunicación",
  "Autonomía",
  "Participación escolar",
  "Bienestar percibido",
  "Fortalezas y talentos",
] as const;

const DIMENSION_COLORS: Record<(typeof PROFILE_DIMENSION_LABELS)[number], string> =
  {
    "Regulación emocional": "bg-sky-500",
    "Interacción social": "bg-teal-500",
    Comunicación: "bg-violet-500",
    Autonomía: "bg-emerald-500",
    "Participación escolar": "bg-amber-500",
    "Bienestar percibido": "bg-rose-400",
    "Fortalezas y talentos": "bg-indigo-500",
  };

export function getLogrosRecientesForEstudiante(
  estudianteId: string
): LogroReciente[] {
  return getSesionesByEstudianteId(estudianteId)
    .filter((sesion) => sesion.logro.trim().length > 0)
    .map((sesion) => ({
      id: sesion.id,
      fecha: sesion.fecha,
      logro: sesion.logro.trim(),
      fortaleza:
        sesion.fortalezas.length > 0
          ? sesion.fortalezas.join(", ")
          : "Sin fortaleza registrada",
      espacio: sesion.espacio,
    }));
}

function getNivelActual(indiceEvidencia: number, evidencias: number): string {
  if (evidencias === 0) return "Inicial";
  if (indiceEvidencia < 35) return "Emergente";
  if (indiceEvidencia < 70) return "En desarrollo";
  return "Consolidado";
}

function getProgresoPromedioForDimension(
  sessions: Sesion[],
  dimension: string
): number {
  const relevant = sessions.filter((sesion) =>
    sesion.dimensiones.includes(dimension)
  );
  if (relevant.length === 0) return 0;

  const sum = relevant.reduce(
    (acc, sesion) =>
      acc +
      (sesion.mejoraSesion ??
        calcularMejoraSesion(sesion.estadoInicial, sesion.estadoFinal)),
    0
  );

  return Math.round((sum / relevant.length) * 10) / 10;
}

export function formatImpactoPromedio(progresoPromedio: number): string {
  const rounded = Math.round(progresoPromedio * 10) / 10;
  const formatted = rounded.toFixed(1);
  return rounded > 0 ? `+${formatted}` : formatted;
}

export function getPerfilEvolutivoForEstudiante(
  estudianteId: string
): DimensionPerfil[] {
  const sessions = getSesionesByEstudianteId(estudianteId);
  const counts = Object.fromEntries(
    PROFILE_DIMENSION_LABELS.map((label) => [label, 0])
  ) as Record<(typeof PROFILE_DIMENSION_LABELS)[number], number>;

  for (const sesion of sessions) {
    for (const dimension of sesion.dimensiones) {
      if (dimension in counts) {
        counts[dimension as (typeof PROFILE_DIMENSION_LABELS)[number]] += 1;
      }
    }
  }

  const totalSessions = sessions.length;
  const maxCount = Math.max(...Object.values(counts), 0);

  return PROFILE_DIMENSION_LABELS.map((label) => {
    const evidencias = counts[label];
    // Índice de evidencia = frecuencia de observación documentada por dimensión.
    const indiceEvidencia =
      totalSessions > 0
        ? Math.round((evidencias / totalSessions) * 100)
        : maxCount > 0
          ? Math.round((evidencias / maxCount) * 100)
          : 0;
    const progresoPromedio = getProgresoPromedioForDimension(sessions, label);

    return {
      label,
      evidencias,
      indiceEvidencia,
      progresoPromedio,
      nivelActual: getNivelActual(indiceEvidencia, evidencias),
      color: DIMENSION_COLORS[label],
    };
  });
}

export function hasPerfilEvolutivoData(estudianteId: string): boolean {
  const sessions = getSesionesByEstudianteId(estudianteId);
  if (sessions.length === 0) return false;

  return sessions.some((sesion) => sesion.dimensiones.length > 0);
}

export type FichaHeaderKpis = {
  fortalezasObservadas: string;
  sesionesRegistradas: string;
  impactoPromedio: string;
  objetivosPieActivos: string;
};

const FICHA_HEADER_SIN_DATOS = "Sin datos";

export function getMejoraSesionForSesion(sesion: Sesion): number {
  return (
    sesion.mejoraSesion ??
    calcularMejoraSesion(sesion.estadoInicial, sesion.estadoFinal)
  );
}

export function countTotalFortalezasRegistradasForEstudiante(
  estudianteId: string
): number {
  return getSesionesByEstudianteId(estudianteId).reduce(
    (total, sesion) => total + sesion.fortalezas.length,
    0
  );
}

export function getImpactoPromedioSesionesForEstudiante(
  estudianteId: string
): number | null {
  const sessions = getSesionesByEstudianteId(estudianteId);
  if (sessions.length === 0) return null;

  const sum = sessions.reduce(
    (total, sesion) => total + getMejoraSesionForSesion(sesion),
    0
  );

  return Math.round((sum / sessions.length) * 10) / 10;
}

export function getFichaHeaderKpisForEstudiante(
  estudianteId: string,
  objetivosPieActivos: number
): FichaHeaderKpis {
  const sessions = getSesionesByEstudianteId(estudianteId);
  const impactoPromedio = getImpactoPromedioSesionesForEstudiante(estudianteId);

  return {
    fortalezasObservadas: String(
      countTotalFortalezasRegistradasForEstudiante(estudianteId)
    ),
    sesionesRegistradas: String(sessions.length),
    impactoPromedio:
      impactoPromedio === null
        ? FICHA_HEADER_SIN_DATOS
        : `${formatImpactoPromedio(impactoPromedio)} niveles`,
    objetivosPieActivos: String(objetivosPieActivos),
  };
}

export function countFortalezasForEstudiante(
  estudianteId: string,
  fortalezaNames: readonly string[]
): Record<string, number> {
  const counts = Object.fromEntries(
    fortalezaNames.map((name) => [name, 0])
  ) as Record<string, number>;

  for (const sesion of getSesionesByEstudianteId(estudianteId)) {
    for (const fortaleza of sesion.fortalezas) {
      if (fortaleza in counts) {
        counts[fortaleza] += 1;
      }
    }
  }

  return counts;
}

function countObservedItems(
  estudianteId: string,
  getItems: (sesion: Sesion) => string[]
): FrecuenciaItem[] {
  const counts = new Map<string, number>();

  for (const sesion of getSesionesByEstudianteId(estudianteId)) {
    for (const item of getItems(sesion)) {
      counts.set(item, (counts.get(item) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "es"));
}

export function getInteresesObservadosForEstudiante(
  estudianteId: string
): FrecuenciaItem[] {
  return countObservedItems(
    estudianteId,
    (sesion) => sesion.interesesObservados ?? []
  );
}

export function getContextosExitoForEstudiante(
  estudianteId: string
): FrecuenciaItem[] {
  return countObservedItems(
    estudianteId,
    (sesion) => sesion.contextosExitoObservados ?? []
  );
}

export function getEstrategiasQueAyudaronForEstudiante(
  estudianteId: string
): FrecuenciaItem[] {
  return countObservedItems(
    estudianteId,
    (sesion) => sesion.estrategiasQueAyudaron ?? []
  );
}

export function getBarrerasObservadasForEstudiante(
  estudianteId: string
): FrecuenciaItem[] {
  return countObservedItems(
    estudianteId,
    (sesion) => sesion.barrerasObservadas ?? []
  );
}

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

function formatUltimaEvidenciaRelativa(fecha: Date): string {
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const startOfFecha = new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate()
  );
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfFecha.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) return "Hoy";
  if (diffDays === 1) return "Hace 1 día";
  return `Hace ${diffDays} días`;
}

export function getUltimaEvidenciaForDimension(
  estudianteId: string,
  dimension: string
): string | null {
  const sessions = getSesionesByEstudianteId(estudianteId).filter((sesion) =>
    sesion.dimensiones.includes(dimension)
  );
  if (sessions.length === 0) return null;

  const parsed = parseSesionFecha(sessions[0].fecha);
  if (!parsed) return sessions[0].fecha;

  return formatUltimaEvidenciaRelativa(parsed);
}

export function getEstadoObjetivo(progresoPromedio: number): string {
  if (progresoPromedio <= 0) return "Iniciando";
  if (progresoPromedio < 0.5) return "En desarrollo";
  if (progresoPromedio < 1.5) return "Avanzando consistentemente";
  return "Consolidando aprendizajes";
}

export function getObjetivoResumenForEstudiante(
  estudianteId: string,
  objetivo: ObjetivoEstudiante
): ObjetivoEstudianteResumen {
  const dimensionData = getPerfilEvolutivoForEstudiante(estudianteId).find(
    (dimension) => dimension.label === objetivo.dimensionRelacionada
  );
  const progresoPromedio = dimensionData?.progresoPromedio ?? 0;
  const evidenciasAsociadas = dimensionData?.evidencias ?? 0;
  const ultimaEvidencia =
    getUltimaEvidenciaForDimension(
      estudianteId,
      objetivo.dimensionRelacionada
    ) ??
    "Sin evidencias registradas";

  return {
    objetivo,
    estado: getEstadoObjetivo(progresoPromedio),
    progresoPromedio,
    evidenciasAsociadas,
    ultimaEvidencia,
  };
}

export function hasInteresesObservadosData(estudianteId: string): boolean {
  return getInteresesObservadosForEstudiante(estudianteId).length > 0;
}

export function hasContextosExitoData(estudianteId: string): boolean {
  return getContextosExitoForEstudiante(estudianteId).length > 0;
}

function formatListSpanish(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} y ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

const INTERES_CON_ARTICULO: Record<string, string> = {
  Animales: "los animales",
  Tecnología: "la tecnología",
  Arte: "el arte",
  Naturaleza: "la naturaleza",
  Construcción: "la construcción",
  Música: "la música",
  Lectura: "la lectura",
  Ciencia: "la ciencia",
  Videojuegos: "los videojuegos",
  Deportes: "los deportes",
};

export const EMPTY_QUIEN_ES_MESSAGE = GLOSSARY.estudiante.vacioQuienEs;

export function hasSesionesForEstudiante(estudianteId: string): boolean {
  return getSesionesByEstudianteId(estudianteId).length > 0;
}

export function generateQuienEsResumen(
  estudianteId: string,
  nombre: string,
  fortalezaOptions: readonly string[]
): string | null {
  if (!hasSesionesForEstudiante(estudianteId)) return null;

  const strengthCounts = countFortalezasForEstudiante(
    estudianteId,
    fortalezaOptions
  );
  const fortalezas = Object.entries(strengthCounts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
    .slice(0, 3)
    .map(([name]) => name);

  const intereses = getInteresesObservadosForEstudiante(estudianteId)
    .slice(0, 3)
    .map((item) => item.name);
  const contextos = getContextosExitoForEstudiante(estudianteId)
    .slice(0, 3)
    .map((item) => item.name);

  const sentences: string[] = [];

  if (fortalezas.length > 0) {
    sentences.push(
      `${nombre} destaca por su ${formatListSpanish(
        fortalezas.map((item) => item.toLowerCase())
      )}.`
    );
  }

  if (intereses.length > 0) {
    sentences.push(
      `Se interesa especialmente por ${formatListSpanish(
        intereses.map((item) => INTERES_CON_ARTICULO[item] ?? item.toLowerCase())
      )}.`
    );
  }

  if (contextos.length > 0) {
    sentences.push(
      `Participa mejor cuando cuenta con ${formatListSpanish(
        contextos.map((item) => item.toLowerCase())
      )}.`
    );
  }

  return sentences.length > 0 ? sentences.join(" ") : null;
}

function isSesion(value: unknown): value is Sesion {
  if (!value || typeof value !== "object") return false;

  const s = value as Record<string, unknown>;

  return (
    typeof s.id === "string" &&
    typeof s.fecha === "string" &&
    typeof s.estudiante === "string" &&
    typeof s.espacio === "string" &&
    typeof s.estadoInicial === "string" &&
    Array.isArray(s.fortalezas) &&
    typeof s.logro === "string" &&
    Array.isArray(s.dimensiones) &&
    typeof s.evidenciaPIE === "boolean" &&
    typeof s.evidenciaLeyTEA === "boolean" &&
    typeof s.estadoFinal === "string" &&
    (typeof s.mejoraSesion === "number" || s.mejoraSesion === undefined) &&
    (Array.isArray(s.interesesObservados) || s.interesesObservados === undefined) &&
    (Array.isArray(s.contextosExitoObservados) ||
      s.contextosExitoObservados === undefined) &&
    (Array.isArray(s.estrategiasQueAyudaron) ||
      s.estrategiasQueAyudaron === undefined) &&
    (Array.isArray(s.barrerasObservadas) || s.barrerasObservadas === undefined) &&
    (typeof s.intervencionId === "string" || s.intervencionId === undefined) &&
    (typeof s.hora === "string" || s.hora === undefined) &&
    (typeof s.duracionMinutos === "number" || s.duracionMinutos === undefined) &&
    (typeof s.profesionalId === "string" || s.profesionalId === undefined) &&
    (typeof s.profesionalNombre === "string" ||
      s.profesionalNombre === undefined) &&
    (typeof s.espacioId === "string" || s.espacioId === undefined) &&
    (Array.isArray(s.objetivosTrabajadosIds) ||
      s.objetivosTrabajadosIds === undefined) &&
    (Array.isArray(s.apoyosUtilizados) || s.apoyosUtilizados === undefined) &&
    (typeof s.nivelParticipacion === "string" ||
      s.nivelParticipacion === undefined) &&
    (typeof s.nivelApoyoRequerido === "string" ||
      s.nivelApoyoRequerido === undefined) &&
    (Array.isArray(s.evidenciasInstitucionales) ||
      s.evidenciasInstitucionales === undefined)
  );
}
