import { getEstudianteById } from "@/lib/students-storage";
import type { EvaluacionIntegral } from "@/lib/evaluacion-integral/evaluacion-integral-types";

function startOfDayTimestamp(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return NaN;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map(Number);
    return new Date(year, month - 1, day).getTime();
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return NaN;
  return new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate()
  ).getTime();
}

export function compareFechasEvaluacionPorDia(a: string, b: string): number {
  return startOfDayTimestamp(a) - startOfDayTimestamp(b);
}

export function isValidFechaEvaluacion(value: string): boolean {
  return !Number.isNaN(startOfDayTimestamp(value));
}

export function validateFechasEvaluacionIntegral(input: {
  fechaInicio: string;
  fechaTermino?: string;
  fechaCierre?: string;
  fechaProximaReevaluacion?: string;
}): string | null {
  const inicio = input.fechaInicio.trim();
  if (!inicio) {
    return "La fecha de inicio de la evaluación es obligatoria.";
  }
  if (!isValidFechaEvaluacion(inicio)) {
    return "La fecha de inicio de la evaluación no es válida.";
  }

  const termino = input.fechaTermino?.trim();
  if (termino) {
    if (!isValidFechaEvaluacion(termino)) {
      return "La fecha de término de la evaluación no es válida.";
    }
    if (compareFechasEvaluacionPorDia(termino, inicio) < 0) {
      return "La fecha de término debe ser igual o posterior al inicio.";
    }
  }

  const cierre = input.fechaCierre?.trim();
  if (cierre) {
    if (!isValidFechaEvaluacion(cierre)) {
      return "La fecha de cierre de la evaluación no es válida.";
    }
    if (compareFechasEvaluacionPorDia(cierre, inicio) < 0) {
      return "La fecha de cierre debe ser igual o posterior al inicio.";
    }
    if (termino && compareFechasEvaluacionPorDia(cierre, termino) < 0) {
      return "La fecha de cierre debe ser igual o posterior al término.";
    }
  }

  const proxima = input.fechaProximaReevaluacion?.trim();
  if (proxima) {
    if (!isValidFechaEvaluacion(proxima)) {
      return "La fecha de próxima reevaluación no es válida.";
    }
    const referencia = cierre ?? termino ?? inicio;
    if (compareFechasEvaluacionPorDia(proxima, referencia) < 0) {
      return "La próxima reevaluación debe ser igual o posterior a la fecha de cierre.";
    }
  }

  return null;
}

export function assertEstudianteExiste(estudianteId: string): string | null {
  const trimmed = estudianteId.trim();
  if (!trimmed) return "Identificador de estudiante no válido.";
  if (!getEstudianteById(trimmed)) return "Estudiante no encontrado.";
  return null;
}

export function puedeEditarEvaluacionIntegral(
  evaluacion: EvaluacionIntegral
): boolean {
  return evaluacion.estado === "borrador";
}

export function tieneEvaluacionIngresoCerrada(
  evaluaciones: EvaluacionIntegral[],
  estudianteId: string,
  excludeId?: string
): boolean {
  return evaluaciones.some(
    (item) =>
      item.estudianteId === estudianteId &&
      item.tipo === "ingreso" &&
      item.estado === "cerrada" &&
      item.id !== excludeId
  );
}
