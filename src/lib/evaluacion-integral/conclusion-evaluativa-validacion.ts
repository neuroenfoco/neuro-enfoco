import { isConclusionEvaluativaDimensionId } from "@/lib/evaluacion-integral/conclusion-evaluativa-dimensiones";
import type {
  ConclusionEvaluativaDimensionId,
  ConclusionEvaluativaPrioridad,
  EvaluacionIntegral,
  HallazgoEvaluativo,
  SaveConclusionEvaluativaInput,
  UpdateConclusionEvaluativaInput,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";
import { puedeEditarEvaluacionIntegral } from "@/lib/evaluacion-integral/evaluacion-integral-validacion";

export const ENUNCIADO_MIN = 10;
export const ENUNCIADO_MAX = 2000;
export const NOTAS_MAX = 1000;
export const DIMENSION_DETALLE_MAX = 120;
export const HALLAZGOS_SUSTENTANTES_MIN = 1;
export const HALLAZGOS_SUSTENTANTES_MAX = 20;
export const PRIORIDAD_ALTA_ADVISO_UMBRAL = 3;

const PRIORIDADES: ConclusionEvaluativaPrioridad[] = ["alta", "media", "baja"];

export const PRIORIDAD_ORDEN: Record<ConclusionEvaluativaPrioridad, number> = {
  alta: 0,
  media: 1,
  baja: 2,
};

export function isConclusionEvaluativaPrioridad(
  value: string
): value is ConclusionEvaluativaPrioridad {
  return PRIORIDADES.includes(value as ConclusionEvaluativaPrioridad);
}

export function normalizeConclusionEnunciado(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function trimOptional(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function dedupeHallazgoIds(ids: string[]): string[] {
  return [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
}

export function compareConclusionesPorPrioridad(
  a: { prioridad: ConclusionEvaluativaPrioridad; creadoEn: string },
  b: { prioridad: ConclusionEvaluativaPrioridad; creadoEn: string }
): number {
  const byPrioridad = PRIORIDAD_ORDEN[a.prioridad] - PRIORIDAD_ORDEN[b.prioridad];
  if (byPrioridad !== 0) return byPrioridad;
  return a.creadoEn.localeCompare(b.creadoEn);
}

export type ValidateConclusionEvaluativaContext = {
  evaluacion: EvaluacionIntegral;
  hallazgosEvaluacion: HallazgoEvaluativo[];
};

export type ConclusionEvaluativaFieldsForValidation = {
  evaluacionIntegralId: string;
  estudianteId: string;
  enunciado: string;
  prioridad: ConclusionEvaluativaPrioridad;
  hallazgosSustentantesIds: string[];
  dimensionId?: ConclusionEvaluativaDimensionId;
  dimensionDetalle?: string;
  notas?: string;
};

export function validateConclusionEvaluativaInput(
  input:
    | SaveConclusionEvaluativaInput
    | (UpdateConclusionEvaluativaInput & ConclusionEvaluativaFieldsForValidation),
  context: ValidateConclusionEvaluativaContext
): string | null {
  const { evaluacion, hallazgosEvaluacion } = context;

  if (!puedeEditarEvaluacionIntegral(evaluacion)) {
    return "Solo se pueden editar conclusiones en evaluaciones en borrador.";
  }

  if (evaluacion.id !== input.evaluacionIntegralId.trim()) {
    return "La evaluación no es válida.";
  }

  if (evaluacion.estudianteId !== input.estudianteId.trim()) {
    return "El estudiante no coincide con la evaluación.";
  }

  const enunciado = normalizeConclusionEnunciado(input.enunciado);
  if (enunciado.length < ENUNCIADO_MIN) {
    return `El enunciado debe tener al menos ${ENUNCIADO_MIN} caracteres.`;
  }
  if (enunciado.length > ENUNCIADO_MAX) {
    return `El enunciado no puede superar ${ENUNCIADO_MAX} caracteres.`;
  }

  if (!isConclusionEvaluativaPrioridad(input.prioridad)) {
    return "Prioridad no válida.";
  }

  const hallazgosIds = dedupeHallazgoIds(input.hallazgosSustentantesIds);
  if (hallazgosIds.length < HALLAZGOS_SUSTENTANTES_MIN) {
    return "Selecciona al menos un hallazgo sustentante.";
  }
  if (hallazgosIds.length > HALLAZGOS_SUSTENTANTES_MAX) {
    return `No puedes vincular más de ${HALLAZGOS_SUSTENTANTES_MAX} hallazgos.`;
  }

  const hallazgoIdsEvaluacion = new Set(
    hallazgosEvaluacion.map((item) => item.id)
  );
  for (const hallazgoId of hallazgosIds) {
    if (!hallazgoIdsEvaluacion.has(hallazgoId)) {
      return "Uno o más hallazgos no pertenecen a esta evaluación.";
    }
  }

  if (
    input.dimensionId !== undefined &&
    !isConclusionEvaluativaDimensionId(input.dimensionId)
  ) {
    return "Dimensión no válida.";
  }

  const dimensionDetalle = trimOptional(input.dimensionDetalle);
  if (dimensionDetalle && dimensionDetalle.length > DIMENSION_DETALLE_MAX) {
    return `El detalle de dimensión no puede superar ${DIMENSION_DETALLE_MAX} caracteres.`;
  }

  const notas = trimOptional(input.notas);
  if (notas && notas.length > NOTAS_MAX) {
    return `Las notas no pueden superar ${NOTAS_MAX} caracteres.`;
  }

  return null;
}

export function normalizeSaveConclusionEvaluativaInput(
  input: SaveConclusionEvaluativaInput
): SaveConclusionEvaluativaInput {
  const dimensionId = input.dimensionId;
  const dimensionDetalle =
    dimensionId === "aprendizaje_curricular"
      ? trimOptional(input.dimensionDetalle)
      : undefined;

  return {
    ...input,
    estudianteId: input.estudianteId.trim(),
    evaluacionIntegralId: input.evaluacionIntegralId.trim(),
    enunciado: normalizeConclusionEnunciado(input.enunciado),
    hallazgosSustentantesIds: dedupeHallazgoIds(input.hallazgosSustentantesIds),
    dimensionId,
    dimensionDetalle,
    notas: trimOptional(input.notas),
  };
}
