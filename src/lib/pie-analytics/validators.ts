import type {
  PieAnalyticsApoyo,
  PieAnalyticsEstudianteInput,
  PieAnalyticsEvidencia,
  PieAnalyticsObjetivoInput,
} from "@/lib/pie-analytics/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isEvidencia(value: unknown): value is PieAnalyticsEvidencia {
  if (!isRecord(value)) return false;
  return (
    typeof value.sesionId === "string" &&
    typeof value.fecha === "string" &&
    typeof value.estadoInicial === "string" &&
    typeof value.estadoFinal === "string" &&
    typeof value.impacto === "number" &&
    Array.isArray(value.fortalezas) &&
    value.fortalezas.every((item) => typeof item === "string") &&
    typeof value.logro === "string" &&
    (typeof value.intervencionId === "string" || value.intervencionId === undefined)
  );
}

function isApoyo(value: unknown): value is PieAnalyticsApoyo {
  if (!isRecord(value)) return false;
  return (
    typeof value.apoyoId === "string" &&
    typeof value.nombre === "string" &&
    typeof value.descripcion === "string" &&
    typeof value.fechaInicio === "string" &&
    (typeof value.fechaTermino === "string" || value.fechaTermino === undefined) &&
    typeof value.activo === "boolean" &&
    (typeof value.duracionDias === "number" || value.duracionDias === null)
  );
}

export function isPieAnalyticsObjetivoInput(
  value: unknown
): value is PieAnalyticsObjetivoInput {
  if (!isRecord(value)) return false;

  return (
    typeof value.objetivoId === "string" &&
    typeof value.estudianteId === "string" &&
    typeof value.nombre === "string" &&
    typeof value.dimensionRelacionada === "string" &&
    (typeof value.lineaBase === "string" || value.lineaBase === undefined) &&
    (typeof value.fechaLineaBase === "string" ||
      value.fechaLineaBase === undefined) &&
    (typeof value.metaLogro === "string" || value.metaLogro === undefined) &&
    (typeof value.barreraDetectada === "string" ||
      value.barreraDetectada === undefined) &&
    Array.isArray(value.evidencias) &&
    value.evidencias.every(isEvidencia) &&
    Array.isArray(value.apoyos) &&
    value.apoyos.every(isApoyo)
  );
}

export function isPieAnalyticsEstudianteInput(
  value: unknown
): value is PieAnalyticsEstudianteInput {
  if (!isRecord(value)) return false;

  return (
    typeof value.estudianteId === "string" &&
    Array.isArray(value.objetivos) &&
    value.objetivos.every(isPieAnalyticsObjetivoInput)
  );
}
