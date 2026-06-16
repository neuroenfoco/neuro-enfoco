import type {
  EvaluacionIntegral,
  SaveEvaluacionIntegralInput,
  UpdateEvaluacionIntegralInput,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";
import {
  getEvaluacionIntegralById,
  readEvaluacionesIntegrales,
  writeEvaluacionesIntegrales,
} from "@/lib/evaluacion-integral/evaluacion-integral-persistence";
import {
  assertEstudianteExiste,
  assertEstudianteExisteAsync,
  tieneEvaluacionIngresoCerrada,
  validateFechasEvaluacionIntegral,
} from "@/lib/evaluacion-integral/evaluacion-integral-validacion";
import { deleteHallazgosEvaluativosByEvaluacionId } from "@/lib/evaluacion-integral/hallazgo-evaluativo-storage";
import { deleteConclusionesEvaluativasByEvaluacionId } from "@/lib/evaluacion-integral/conclusion-evaluativa-storage";
import { deleteVinculosByEvaluacionId } from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-storage";
import { deleteParticipacionesByEvaluacionId } from "@/lib/evaluacion-integral/participacion-evaluacion-integral-storage";
import { tieneIngresoPIECompletado } from "@/lib/ingreso-pie";

function nowIso(): string {
  return new Date().toISOString();
}

function trimOptional(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

export { getEvaluacionIntegralById } from "@/lib/evaluacion-integral/evaluacion-integral-persistence";

export function getEvaluacionesIntegralesByEstudianteId(
  estudianteId: string
): EvaluacionIntegral[] {
  return readEvaluacionesIntegrales().filter(
    (item) => item.estudianteId === estudianteId
  );
}

export function getEvaluacionIngresoCerradaByEstudianteId(
  estudianteId: string
): EvaluacionIntegral | null {
  return (
    readEvaluacionesIntegrales().find(
      (item) =>
        item.estudianteId === estudianteId &&
        item.tipo === "ingreso" &&
        item.estado === "cerrada"
    ) ?? null
  );
}

function persistEvaluacionIntegral(
  input: SaveEvaluacionIntegralInput
): EvaluacionIntegral | null {
  const fechaError = validateFechasEvaluacionIntegral({
    fechaInicio: input.fechaInicio,
    fechaTermino: input.fechaTermino,
    fechaProximaReevaluacion: input.fechaProximaReevaluacion,
  });
  if (fechaError) return null;

  const tipo = input.tipo ?? "ingreso";
  const evaluaciones = readEvaluacionesIntegrales();
  if (
    tipo === "ingreso" &&
    tieneIngresoPIECompletado(input.estudianteId.trim())
  ) {
    return null;
  }

  const timestamp = nowIso();
  const evaluacion: EvaluacionIntegral = {
    id: crypto.randomUUID(),
    estudianteId: input.estudianteId.trim(),
    tipo,
    estado: "borrador",
    fechaInicio: input.fechaInicio.trim(),
    fechaTermino: trimOptional(input.fechaTermino),
    ingresoPieOrigen: trimOptional(input.ingresoPieOrigen),
    tipoNEE: trimOptional(input.tipoNEE),
    diagnosticoNEEResumen: trimOptional(input.diagnosticoNEEResumen),
    fechaProximaReevaluacion: trimOptional(input.fechaProximaReevaluacion),
    referenciaEvaluacionPrevia: trimOptional(input.referenciaEvaluacionPrevia),
    observacionesEvaluacion: trimOptional(input.observacionesEvaluacion),
    creadoEn: timestamp,
    actualizadoEn: timestamp,
  };

  writeEvaluacionesIntegrales([evaluacion, ...evaluaciones]);
  return evaluacion;
}

export function saveEvaluacionIntegral(
  input: SaveEvaluacionIntegralInput
): EvaluacionIntegral | null {
  const estudianteError = assertEstudianteExiste(input.estudianteId);
  if (estudianteError) return null;

  return persistEvaluacionIntegral(input);
}

export async function saveEvaluacionIntegralAsync(
  input: SaveEvaluacionIntegralInput
): Promise<EvaluacionIntegral | null> {
  const estudianteError = await assertEstudianteExisteAsync(input.estudianteId);
  if (estudianteError) return null;

  return persistEvaluacionIntegral(input);
}

export function updateEvaluacionIntegral(
  id: string,
  input: UpdateEvaluacionIntegralInput
): EvaluacionIntegral | null {
  const items = readEvaluacionesIntegrales();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const current = items[index];
  if (current.estado !== "borrador") return null;

  const fechaInicio = (input.fechaInicio ?? current.fechaInicio).trim();
  const fechaTermino =
    input.fechaTermino !== undefined
      ? trimOptional(input.fechaTermino)
      : current.fechaTermino;

  const fechaError = validateFechasEvaluacionIntegral({
    fechaInicio,
    fechaTermino,
    fechaProximaReevaluacion:
      input.fechaProximaReevaluacion ?? current.fechaProximaReevaluacion,
  });
  if (fechaError) return null;

  const tipo = input.tipo ?? current.tipo;
  if (
    tipo === "ingreso" &&
    tipo !== current.tipo &&
    tieneIngresoPIECompletado(current.estudianteId)
  ) {
    return null;
  }

  const updated: EvaluacionIntegral = {
    ...current,
    tipo,
    fechaInicio,
    fechaTermino,
    tipoNEE: input.tipoNEE !== undefined ? trimOptional(input.tipoNEE) : current.tipoNEE,
    diagnosticoNEEResumen:
      input.diagnosticoNEEResumen !== undefined
        ? trimOptional(input.diagnosticoNEEResumen)
        : current.diagnosticoNEEResumen,
    fechaProximaReevaluacion:
      input.fechaProximaReevaluacion !== undefined
        ? trimOptional(input.fechaProximaReevaluacion)
        : current.fechaProximaReevaluacion,
    referenciaEvaluacionPrevia:
      input.referenciaEvaluacionPrevia !== undefined
        ? trimOptional(input.referenciaEvaluacionPrevia)
        : current.referenciaEvaluacionPrevia,
    observacionesEvaluacion:
      input.observacionesEvaluacion !== undefined
        ? trimOptional(input.observacionesEvaluacion)
        : current.observacionesEvaluacion,
    actualizadoEn: nowIso(),
  };

  const next = [...items];
  next[index] = updated;
  writeEvaluacionesIntegrales(next);
  return updated;
}

export function marcarEvaluacionIntegralCerrada(
  id: string,
  fechaCierre: string
): EvaluacionIntegral | null {
  const items = readEvaluacionesIntegrales();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const current = items[index];
  if (current.estado !== "borrador") return null;

  const fechaError = validateFechasEvaluacionIntegral({
    fechaInicio: current.fechaInicio,
    fechaTermino: current.fechaTermino,
    fechaCierre,
    fechaProximaReevaluacion: current.fechaProximaReevaluacion,
  });
  if (fechaError) return null;

  if (
    current.tipo === "ingreso" &&
    tieneIngresoPIECompletado(current.estudianteId)
  ) {
    return null;
  }

  const updated: EvaluacionIntegral = {
    ...current,
    estado: "cerrada",
    fechaCierre: fechaCierre.trim(),
    actualizadoEn: nowIso(),
  };

  const next = [...items];
  next[index] = updated;
  writeEvaluacionesIntegrales(next);
  return updated;
}

export function anularEvaluacionIntegral(
  id: string
): EvaluacionIntegral | null {
  const items = readEvaluacionesIntegrales();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const current = items[index];
  if (current.estado !== "borrador") return null;

  const updated: EvaluacionIntegral = {
    ...current,
    estado: "anulada",
    actualizadoEn: nowIso(),
  };

  const next = [...items];
  next[index] = updated;
  writeEvaluacionesIntegrales(next);
  return updated;
}

export function deleteEvaluacionIntegral(id: string): boolean {
  const items = readEvaluacionesIntegrales();
  const target = items.find((item) => item.id === id);
  if (!target) return false;
  if (target.estado !== "borrador" && target.estado !== "anulada") return false;

  deleteVinculosByEvaluacionId(id);
  deleteParticipacionesByEvaluacionId(id);
  deleteConclusionesEvaluativasByEvaluacionId(id);
  deleteHallazgosEvaluativosByEvaluacionId(id);
  writeEvaluacionesIntegrales(items.filter((item) => item.id !== id));
  return true;
}

export function deleteEvaluacionesIntegralesByEstudianteId(
  estudianteId: string
): number {
  const items = readEvaluacionesIntegrales();
  const targets = items.filter((item) => item.estudianteId === estudianteId);
  for (const target of targets) {
    deleteParticipacionesByEvaluacionId(target.id);
    deleteConclusionesEvaluativasByEvaluacionId(target.id);
    deleteHallazgosEvaluativosByEvaluacionId(target.id);
  }
  const remaining = items.filter((item) => item.estudianteId !== estudianteId);
  const removed = items.length - remaining.length;
  if (removed > 0) writeEvaluacionesIntegrales(remaining);
  return removed;
}
