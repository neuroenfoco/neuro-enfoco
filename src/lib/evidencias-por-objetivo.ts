/**
 * Read model canónico: evidencias vinculadas a un ObjetivoPIE específico.
 *
 * Ruta principal: Sesion.objetivosTrabajadosIds incluye el objetivo.
 * Fallback legacy (solo datos históricos sin objetivos explícitos):
 * inferido_dimension vía resolverVinculoSesionObjetivo.
 *
 * Cuando una sesión tiene objetivosTrabajadosIds explícitos, solo cuenta para
 * esos objetivos; no se infiere por dimensión para otros objetivos de la misma.
 */
import {
  resolverVinculoSesionObjetivo,
  type VinculoObjetivoSesion,
} from "@/lib/apoyos-consolidados-objetivo";
import { getIntervencionesByObjetivoId } from "@/lib/intervenciones-storage";
import type { ObjetivoPIE } from "@/lib/pie-objectives-storage";
import {
  getMejoraSesionForSesion,
  getSesionesByEstudianteId,
  sortSesionesByFecha,
  type Sesion,
} from "@/lib/sessions-storage";

const OBJETIVOS_STORAGE_KEY = "neuro-enfoco-objetivos-pie";

function readObjetivoPIEById(objetivoId: string): ObjetivoPIE | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(OBJETIVOS_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    const objetivo = parsed.find(
      (item): item is ObjetivoPIE =>
        !!item &&
        typeof item === "object" &&
        (item as ObjetivoPIE).id === objetivoId
    );

    return objetivo ?? null;
  } catch {
    return null;
  }
}

export type { VinculoObjetivoSesion };

export type EvidenciaObjetivoVinculada = {
  sesion: Sesion;
  vinculo: VinculoObjetivoSesion;
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

function resolverEvidenciasVinculadas(objetivoId: string): EvidenciaObjetivoVinculada[] {
  const objetivo = readObjetivoPIEById(objetivoId);
  if (!objetivo) return [];

  const vinculadas: EvidenciaObjetivoVinculada[] = [];

  for (const sesion of getSesionesByEstudianteId(objetivo.estudianteId)) {
    const vinculo = resolverVinculoSesionObjetivo(
      sesion,
      objetivo.id,
      objetivo.estudianteId,
      objetivo.dimensionRelacionada
    );
    if (!vinculo) continue;

    vinculadas.push({ sesion, vinculo });
  }

  return vinculadas;
}

/**
 * Evidencias (sesiones) reales del objetivo, ordenadas por fecha ascendente.
 */
export function getEvidenciasPorObjetivoId(objetivoId: string): Sesion[] {
  const sesiones = resolverEvidenciasVinculadas(objetivoId).map(
    (item) => item.sesion
  );
  return sortSesionesByFecha(sesiones, "asc");
}

/**
 * Misma fuente que getEvidenciasPorObjetivoId, con tipo de vínculo (explícito o legacy).
 */
export function getEvidenciasVinculadasPorObjetivoId(
  objetivoId: string
): EvidenciaObjetivoVinculada[] {
  const vinculadas = resolverEvidenciasVinculadas(objetivoId);
  return vinculadas.sort((left, right) => {
    const leftTime = parseSesionFecha(left.sesion.fecha)?.getTime() ?? 0;
    const rightTime = parseSesionFecha(right.sesion.fecha)?.getTime() ?? 0;
    return leftTime - rightTime;
  });
}

export function getImpactoPromedioEvidenciasObjetivo(sessions: Sesion[]): number {
  if (sessions.length === 0) return 0;

  const sum = sessions.reduce(
    (acc, sesion) => acc + getMejoraSesionForSesion(sesion),
    0
  );

  return Math.round((sum / sessions.length) * 10) / 10;
}

export function getUltimaEvidenciaLabelEvidenciasObjetivo(
  sessions: Sesion[]
): string | null {
  if (sessions.length === 0) return null;

  const masReciente = sortSesionesByFecha(sessions, "desc")[0];
  const parsed = parseSesionFecha(masReciente.fecha);
  if (!parsed) return masReciente.fecha;

  return formatUltimaEvidenciaRelativa(parsed);
}

export type ObjetivoTrazabilidad = {
  objetivoId: string;
  intervencionesCount: number;
  evidenciasCount: number;
  minutosAcumulados: number;
  logros: string[];
  fortalezas: string[];
};

/**
 * Agregados de trazabilidad por objetivo (lectura; no persiste).
 */
export function getObjetivoTrazabilidad(objetivoId: string): ObjetivoTrazabilidad | null {
  const objetivo = readObjetivoPIEById(objetivoId);
  if (!objetivo) return null;

  const intervenciones = getIntervencionesByObjetivoId(objetivoId);
  const evidencias = getEvidenciasPorObjetivoId(objetivoId);
  const fortalezasSet = new Set<string>();
  const logros: string[] = [];

  for (const sesion of evidencias) {
    for (const fortaleza of sesion.fortalezas) {
      fortalezasSet.add(fortaleza);
    }
    const logro = sesion.logro.trim();
    if (logro) logros.push(logro);
  }

  return {
    objetivoId,
    intervencionesCount: intervenciones.length,
    evidenciasCount: evidencias.length,
    minutosAcumulados: intervenciones.reduce(
      (acc, item) => acc + item.duracionMinutos,
      0
    ),
    logros,
    fortalezas: [...fortalezasSet],
  };
}
