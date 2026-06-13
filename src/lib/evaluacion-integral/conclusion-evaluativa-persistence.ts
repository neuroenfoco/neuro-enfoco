import { isConclusionEvaluativaDimensionId } from "@/lib/evaluacion-integral/conclusion-evaluativa-dimensiones";
import {
  compareConclusionesPorPrioridad,
  isConclusionEvaluativaPrioridad,
} from "@/lib/evaluacion-integral/conclusion-evaluativa-validacion";
import type { ConclusionEvaluativa } from "@/lib/evaluacion-integral/evaluacion-integral-types";

export const CONCLUSION_EVALUATIVA_STORAGE_KEY =
  "neuro-enfoco-conclusiones-evaluativas";

function nowIso(): string {
  return new Date().toISOString();
}

function isConclusionEvaluativa(value: unknown): value is ConclusionEvaluativa {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  if (
    typeof item.id !== "string" ||
    typeof item.evaluacionIntegralId !== "string" ||
    typeof item.estudianteId !== "string" ||
    typeof item.enunciado !== "string" ||
    typeof item.prioridad !== "string" ||
    !isConclusionEvaluativaPrioridad(item.prioridad) ||
    !Array.isArray(item.hallazgosSustentantesIds) ||
    !item.hallazgosSustentantesIds.every((id) => typeof id === "string") ||
    typeof item.creadoEn !== "string" ||
    typeof item.actualizadoEn !== "string"
  ) {
    return false;
  }

  if (
    item.dimensionId !== undefined &&
    (typeof item.dimensionId !== "string" ||
      !isConclusionEvaluativaDimensionId(item.dimensionId))
  ) {
    return false;
  }

  if (
    item.dimensionDetalle !== undefined &&
    typeof item.dimensionDetalle !== "string"
  ) {
    return false;
  }

  if (item.notas !== undefined && typeof item.notas !== "string") {
    return false;
  }

  return true;
}

export function readConclusionesEvaluativas(): ConclusionEvaluativa[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CONCLUSION_EVALUATIVA_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isConclusionEvaluativa);
  } catch {
    return [];
  }
}

export function writeConclusionesEvaluativas(
  items: ConclusionEvaluativa[]
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    CONCLUSION_EVALUATIVA_STORAGE_KEY,
    JSON.stringify(items)
  );
}

export function sortConclusionesEvaluativas(
  items: ConclusionEvaluativa[]
): ConclusionEvaluativa[] {
  return [...items].sort(compareConclusionesPorPrioridad);
}

export function detachHallazgoFromConclusiones(
  evaluacionIntegralId: string,
  hallazgoEvaluativoId: string
): { conclusionesAfectadas: number; conclusionesSinSustento: string[] } {
  const items = readConclusionesEvaluativas();
  const conclusionesSinSustento: string[] = [];
  let conclusionesAfectadas = 0;

  const next = items.map((item) => {
    if (item.evaluacionIntegralId !== evaluacionIntegralId) return item;
    if (!item.hallazgosSustentantesIds.includes(hallazgoEvaluativoId)) {
      return item;
    }

    conclusionesAfectadas += 1;
    const hallazgosSustentantesIds = item.hallazgosSustentantesIds.filter(
      (id) => id !== hallazgoEvaluativoId
    );

    if (hallazgosSustentantesIds.length === 0) {
      conclusionesSinSustento.push(item.id);
      return item;
    }

    return {
      ...item,
      hallazgosSustentantesIds,
      actualizadoEn: nowIso(),
    };
  });

  if (conclusionesSinSustento.length > 0) {
    return { conclusionesAfectadas, conclusionesSinSustento };
  }

  if (conclusionesAfectadas > 0) {
    writeConclusionesEvaluativas(next);
  }

  return { conclusionesAfectadas, conclusionesSinSustento };
}

export function hallazgoEsUnicoSustentoDeConclusion(
  evaluacionIntegralId: string,
  hallazgoEvaluativoId: string
): boolean {
  return readConclusionesEvaluativas().some(
    (item) =>
      item.evaluacionIntegralId === evaluacionIntegralId &&
      item.hallazgosSustentantesIds.length === 1 &&
      item.hallazgosSustentantesIds[0] === hallazgoEvaluativoId
  );
}
