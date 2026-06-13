import type {
  EvaluacionIntegral,
  EvaluacionIntegralEstado,
  EvaluacionIntegralTipo,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";

export const EVALUACION_INTEGRAL_STORAGE_KEY =
  "neuro-enfoco-evaluaciones-integrales";

const TIPOS: EvaluacionIntegralTipo[] = [
  "ingreso",
  "reevaluacion",
  "seguimiento",
  "otro",
];
const ESTADOS: EvaluacionIntegralEstado[] = [
  "borrador",
  "cerrada",
  "anulada",
];

function isEvaluacionIntegralTipo(
  value: string
): value is EvaluacionIntegralTipo {
  return TIPOS.includes(value as EvaluacionIntegralTipo);
}

function isEvaluacionIntegralEstado(
  value: string
): value is EvaluacionIntegralEstado {
  return ESTADOS.includes(value as EvaluacionIntegralEstado);
}

function isEvaluacionIntegral(value: unknown): value is EvaluacionIntegral {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.estudianteId === "string" &&
    typeof item.tipo === "string" &&
    isEvaluacionIntegralTipo(item.tipo) &&
    typeof item.estado === "string" &&
    isEvaluacionIntegralEstado(item.estado) &&
    typeof item.fechaInicio === "string" &&
    (typeof item.fechaTermino === "string" ||
      item.fechaTermino === undefined) &&
    (typeof item.fechaCierre === "string" || item.fechaCierre === undefined) &&
    (typeof item.evaluacionAnteriorId === "string" ||
      item.evaluacionAnteriorId === undefined) &&
    (typeof item.ingresoPieOrigen === "string" ||
      item.ingresoPieOrigen === undefined) &&
    (typeof item.tipoNEE === "string" || item.tipoNEE === undefined) &&
    (typeof item.diagnosticoNEEResumen === "string" ||
      item.diagnosticoNEEResumen === undefined) &&
    (typeof item.fechaProximaReevaluacion === "string" ||
      item.fechaProximaReevaluacion === undefined) &&
    (typeof item.referenciaEvaluacionPrevia === "string" ||
      item.referenciaEvaluacionPrevia === undefined) &&
    (typeof item.observacionesEvaluacion === "string" ||
      item.observacionesEvaluacion === undefined) &&
    typeof item.creadoEn === "string" &&
    typeof item.actualizadoEn === "string"
  );
}

export function readEvaluacionesIntegrales(): EvaluacionIntegral[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(EVALUACION_INTEGRAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isEvaluacionIntegral);
  } catch {
    return [];
  }
}

export function writeEvaluacionesIntegrales(
  items: EvaluacionIntegral[]
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    EVALUACION_INTEGRAL_STORAGE_KEY,
    JSON.stringify(items)
  );
}

export function getEvaluacionIntegralById(
  id: string
): EvaluacionIntegral | null {
  return readEvaluacionesIntegrales().find((item) => item.id === id) ?? null;
}
