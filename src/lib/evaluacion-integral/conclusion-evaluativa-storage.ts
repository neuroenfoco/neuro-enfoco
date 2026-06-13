import {
  normalizeSaveConclusionEvaluativaInput,
  validateConclusionEvaluativaInput,
} from "@/lib/evaluacion-integral/conclusion-evaluativa-validacion";
import {
  readConclusionesEvaluativas,
  sortConclusionesEvaluativas,
  writeConclusionesEvaluativas,
} from "@/lib/evaluacion-integral/conclusion-evaluativa-persistence";
import {
  deleteVinculosByConclusionId,
  deleteVinculosByEvaluacionId,
} from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-storage";
import { getEvaluacionIntegralById } from "@/lib/evaluacion-integral/evaluacion-integral-persistence";
import type {
  ConclusionEvaluativa,
  SaveConclusionEvaluativaInput,
  UpdateConclusionEvaluativaInput,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";
import { getHallazgosEvaluativosByEvaluacionId } from "@/lib/evaluacion-integral/hallazgo-evaluativo-storage";
import { puedeEditarEvaluacionIntegral } from "@/lib/evaluacion-integral/evaluacion-integral-validacion";

export {
  CONCLUSION_EVALUATIVA_STORAGE_KEY,
  detachHallazgoFromConclusiones,
  hallazgoEsUnicoSustentoDeConclusion,
} from "@/lib/evaluacion-integral/conclusion-evaluativa-persistence";

function nowIso(): string {
  return new Date().toISOString();
}

export function getConclusionesEvaluativasByEvaluacionId(
  evaluacionIntegralId: string
): ConclusionEvaluativa[] {
  return sortConclusionesEvaluativas(
    readConclusionesEvaluativas().filter(
      (item) => item.evaluacionIntegralId === evaluacionIntegralId
    )
  );
}

export function getConclusionEvaluativaById(
  id: string
): ConclusionEvaluativa | null {
  return readConclusionesEvaluativas().find((item) => item.id === id) ?? null;
}

export function getConclusionesEvaluativasByEstudianteId(
  estudianteId: string
): ConclusionEvaluativa[] {
  return sortConclusionesEvaluativas(
    readConclusionesEvaluativas().filter(
      (item) => item.estudianteId === estudianteId
    )
  );
}

export function countConclusionesByEvaluacionId(
  evaluacionIntegralId: string
): number {
  return readConclusionesEvaluativas().filter(
    (item) => item.evaluacionIntegralId === evaluacionIntegralId
  ).length;
}

export function saveConclusionEvaluativa(
  input: SaveConclusionEvaluativaInput
): ConclusionEvaluativa | null {
  const evaluacion = getEvaluacionIntegralById(input.evaluacionIntegralId);
  if (!evaluacion) return null;

  const normalized = normalizeSaveConclusionEvaluativaInput(input);
  const hallazgosEvaluacion = getHallazgosEvaluativosByEvaluacionId(
    normalized.evaluacionIntegralId
  );

  const error = validateConclusionEvaluativaInput(normalized, {
    evaluacion,
    hallazgosEvaluacion,
  });
  if (error) return null;

  const timestamp = nowIso();
  const conclusion: ConclusionEvaluativa = {
    id: crypto.randomUUID(),
    evaluacionIntegralId: normalized.evaluacionIntegralId,
    estudianteId: normalized.estudianteId,
    enunciado: normalized.enunciado,
    prioridad: normalized.prioridad,
    hallazgosSustentantesIds: normalized.hallazgosSustentantesIds,
    dimensionId: normalized.dimensionId,
    dimensionDetalle: normalized.dimensionDetalle,
    notas: normalized.notas,
    creadoEn: timestamp,
    actualizadoEn: timestamp,
  };

  writeConclusionesEvaluativas([conclusion, ...readConclusionesEvaluativas()]);
  return conclusion;
}

export function updateConclusionEvaluativa(
  id: string,
  input: UpdateConclusionEvaluativaInput
): ConclusionEvaluativa | null {
  const items = readConclusionesEvaluativas();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const current = items[index];
  const evaluacion = getEvaluacionIntegralById(current.evaluacionIntegralId);
  if (!evaluacion || !puedeEditarEvaluacionIntegral(evaluacion)) return null;

  const merged: SaveConclusionEvaluativaInput = {
    evaluacionIntegralId: current.evaluacionIntegralId,
    estudianteId: current.estudianteId,
    enunciado: input.enunciado ?? current.enunciado,
    prioridad: input.prioridad ?? current.prioridad,
    hallazgosSustentantesIds:
      input.hallazgosSustentantesIds ?? current.hallazgosSustentantesIds,
    dimensionId:
      input.dimensionId !== undefined ? input.dimensionId : current.dimensionId,
    dimensionDetalle:
      input.dimensionDetalle !== undefined
        ? input.dimensionDetalle
        : current.dimensionDetalle,
    notas: input.notas !== undefined ? input.notas : current.notas,
  };

  const normalized = normalizeSaveConclusionEvaluativaInput(merged);
  const hallazgosEvaluacion = getHallazgosEvaluativosByEvaluacionId(
    normalized.evaluacionIntegralId
  );

  const error = validateConclusionEvaluativaInput(normalized, {
    evaluacion,
    hallazgosEvaluacion,
  });
  if (error) return null;

  const updated: ConclusionEvaluativa = {
    ...current,
    enunciado: normalized.enunciado,
    prioridad: normalized.prioridad,
    hallazgosSustentantesIds: normalized.hallazgosSustentantesIds,
    dimensionId: normalized.dimensionId,
    dimensionDetalle: normalized.dimensionDetalle,
    notas: normalized.notas,
    actualizadoEn: nowIso(),
  };

  const next = [...items];
  next[index] = updated;
  writeConclusionesEvaluativas(next);
  return updated;
}

export function deleteConclusionEvaluativa(id: string): boolean {
  const items = readConclusionesEvaluativas();
  const target = items.find((item) => item.id === id);
  if (!target) return false;

  const evaluacion = getEvaluacionIntegralById(target.evaluacionIntegralId);
  if (!evaluacion || !puedeEditarEvaluacionIntegral(evaluacion)) return false;

  deleteVinculosByConclusionId(id);
  writeConclusionesEvaluativas(items.filter((item) => item.id !== id));
  return true;
}

export function deleteConclusionesEvaluativasByEvaluacionId(
  evaluacionIntegralId: string
): number {
  deleteVinculosByEvaluacionId(evaluacionIntegralId);
  const items = readConclusionesEvaluativas();
  const remaining = items.filter(
    (item) => item.evaluacionIntegralId !== evaluacionIntegralId
  );
  const removed = items.length - remaining.length;
  if (removed > 0) writeConclusionesEvaluativas(remaining);
  return removed;
}

export function deleteConclusionesEvaluativasByEstudianteId(
  estudianteId: string
): number {
  const items = readConclusionesEvaluativas();
  const remaining = items.filter((item) => item.estudianteId !== estudianteId);
  const removed = items.length - remaining.length;
  if (removed > 0) writeConclusionesEvaluativas(remaining);
  return removed;
}
