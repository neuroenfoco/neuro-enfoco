import {
  formatImpactoPromedio,
  getPerfilEvolutivoForEstudiante,
  getUltimaEvidenciaForDimension,
  PROFILE_DIMENSION_LABELS,
} from "@/lib/sessions-storage";

export interface ObjetivoPIE {
  id: string;
  estudianteId: string;
  nombre: string;
  dimensionRelacionada: string;
  fechaInicio: string;
  descripcion?: string;
}

export type ObjetivoPIEResumen = {
  objetivo: ObjetivoPIE;
  cantidadEvidencias: number;
  impactoPromedio: number;
  ultimaEvidencia: string;
  estado: string;
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

export function saveObjetivoPIE(input: {
  estudianteId: string;
  nombre: string;
  dimensionRelacionada: string;
  descripcion?: string;
}): ObjetivoPIE {
  const objetivo: ObjetivoPIE = {
    id: crypto.randomUUID(),
    estudianteId: input.estudianteId,
    nombre: input.nombre.trim(),
    dimensionRelacionada: input.dimensionRelacionada,
    fechaInicio: formatObjetivoFechaInicio(),
    descripcion: input.descripcion?.trim() || undefined,
  };

  writeObjetivosPIE([objetivo, ...readObjetivosPIE()]);
  return objetivo;
}

export function deleteObjetivoPIE(objetivoId: string): boolean {
  if (typeof window === "undefined") return false;

  const existing = readObjetivosPIE();
  const next = existing.filter((objetivo) => objetivo.id !== objetivoId);
  if (next.length === existing.length) return false;

  writeObjetivosPIE(next);
  return true;
}

export function deleteObjetivosPIEByEstudianteId(estudianteId: string): number {
  if (typeof window === "undefined") return 0;

  const existing = readObjetivosPIE();
  const next = existing.filter(
    (objetivo) => objetivo.estudianteId !== estudianteId
  );
  const removedCount = existing.length - next.length;

  if (removedCount > 0) {
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
