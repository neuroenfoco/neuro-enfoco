import {
  formatProfesionalNombreCompleto,
  getProfesionalById,
} from "@/lib/institucional/profesionales-storage";
import {
  getRolProfesionalNombre,
  isRolProfesionalId,
} from "@/lib/institucional/roles-profesional-catalog";
import { isValidParticipacionFechas } from "@/lib/institucional/participacion-vigencia";
import type {
  ParticipacionEvaluacionIntegral,
  SaveParticipacionEvaluacionIntegralInput,
  UpdateParticipacionEvaluacionIntegralInput,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";
import { getEvaluacionIntegralById } from "@/lib/evaluacion-integral/evaluacion-integral-persistence";
import { puedeEditarEvaluacionIntegral } from "@/lib/evaluacion-integral/evaluacion-integral-validacion";

const STORAGE_KEY = "neuro-enfoco-participaciones-evaluacion-integral";

function nowIso(): string {
  return new Date().toISOString();
}

function trimOptional(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function isParticipacionEvaluacionIntegral(
  value: unknown
): value is ParticipacionEvaluacionIntegral {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.evaluacionIntegralId === "string" &&
    typeof item.estudianteId === "string" &&
    typeof item.profesionalId === "string" &&
    typeof item.rolEnEvaluacionId === "string" &&
    isRolProfesionalId(item.rolEnEvaluacionId) &&
    typeof item.esResponsableProceso === "boolean" &&
    typeof item.fechaInicio === "string" &&
    (typeof item.fechaTermino === "string" ||
      item.fechaTermino === undefined) &&
    (typeof item.snapshotNombre === "string" ||
      item.snapshotNombre === undefined) &&
    (typeof item.snapshotRolNombre === "string" ||
      item.snapshotRolNombre === undefined) &&
    (typeof item.notas === "string" || item.notas === undefined) &&
    typeof item.creadoEn === "string" &&
    typeof item.actualizadoEn === "string"
  );
}

function readParticipaciones(): ParticipacionEvaluacionIntegral[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isParticipacionEvaluacionIntegral);
  } catch {
    return [];
  }
}

function writeParticipaciones(items: ParticipacionEvaluacionIntegral[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function clearOtrosResponsablesProceso(
  items: ParticipacionEvaluacionIntegral[],
  evaluacionIntegralId: string,
  excludeId?: string
): ParticipacionEvaluacionIntegral[] {
  return items.map((item) => {
    if (
      item.evaluacionIntegralId !== evaluacionIntegralId ||
      item.id === excludeId ||
      !item.esResponsableProceso
    ) {
      return item;
    }
    return { ...item, esResponsableProceso: false, actualizadoEn: nowIso() };
  });
}

export function getParticipacionesByEvaluacionId(
  evaluacionIntegralId: string
): ParticipacionEvaluacionIntegral[] {
  return readParticipaciones().filter(
    (item) => item.evaluacionIntegralId === evaluacionIntegralId
  );
}

export function getParticipacionEvaluacionIntegralById(
  id: string
): ParticipacionEvaluacionIntegral | null {
  return readParticipaciones().find((item) => item.id === id) ?? null;
}

export function countResponsablesProcesoEnEvaluacion(
  evaluacionIntegralId: string,
  excludeId?: string
): number {
  return readParticipaciones().filter(
    (item) =>
      item.evaluacionIntegralId === evaluacionIntegralId &&
      item.esResponsableProceso &&
      item.id !== excludeId
  ).length;
}

export function saveParticipacionEvaluacionIntegral(
  input: SaveParticipacionEvaluacionIntegralInput
): ParticipacionEvaluacionIntegral | null {
  const evaluacion = getEvaluacionIntegralById(input.evaluacionIntegralId);
  if (!evaluacion) return null;
  if (!puedeEditarEvaluacionIntegral(evaluacion)) return null;
  if (evaluacion.estudianteId !== input.estudianteId.trim()) return null;
  if (!getProfesionalById(input.profesionalId)) return null;
  if (!isValidParticipacionFechas(input.fechaInicio, input.fechaTermino)) {
    return null;
  }

  const esResponsable = input.esResponsableProceso ?? false;

  const timestamp = nowIso();
  const participacion: ParticipacionEvaluacionIntegral = {
    id: crypto.randomUUID(),
    evaluacionIntegralId: input.evaluacionIntegralId,
    estudianteId: input.estudianteId.trim(),
    profesionalId: input.profesionalId,
    rolEnEvaluacionId: input.rolEnEvaluacionId,
    esResponsableProceso: esResponsable,
    fechaInicio: input.fechaInicio.trim(),
    fechaTermino: trimOptional(input.fechaTermino),
    notas: trimOptional(input.notas),
    creadoEn: timestamp,
    actualizadoEn: timestamp,
  };

  let items = readParticipaciones();
  if (esResponsable) {
    items = clearOtrosResponsablesProceso(items, input.evaluacionIntegralId);
  }
  writeParticipaciones([participacion, ...items]);
  return participacion;
}

export function updateParticipacionEvaluacionIntegral(
  id: string,
  input: UpdateParticipacionEvaluacionIntegralInput
): ParticipacionEvaluacionIntegral | null {
  const items = readParticipaciones();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const current = items[index];
  const evaluacion = getEvaluacionIntegralById(current.evaluacionIntegralId);
  if (!evaluacion || !puedeEditarEvaluacionIntegral(evaluacion)) return null;

  const profesionalId = input.profesionalId ?? current.profesionalId;
  if (!getProfesionalById(profesionalId)) return null;

  const fechaInicio = (input.fechaInicio ?? current.fechaInicio).trim();
  const fechaTermino =
    input.fechaTermino !== undefined
      ? trimOptional(input.fechaTermino)
      : current.fechaTermino;

  if (!isValidParticipacionFechas(fechaInicio, fechaTermino)) return null;

  const esResponsable =
    input.esResponsableProceso ?? current.esResponsableProceso;

  const updated: ParticipacionEvaluacionIntegral = {
    ...current,
    profesionalId,
    rolEnEvaluacionId: input.rolEnEvaluacionId ?? current.rolEnEvaluacionId,
    esResponsableProceso: esResponsable,
    fechaInicio,
    fechaTermino,
    notas: input.notas !== undefined ? trimOptional(input.notas) : current.notas,
    actualizadoEn: nowIso(),
  };

  let next = [...items];
  next[index] = updated;
  if (esResponsable) {
    next = clearOtrosResponsablesProceso(
      next,
      current.evaluacionIntegralId,
      current.id
    );
    const updatedIndex = next.findIndex((item) => item.id === id);
    if (updatedIndex !== -1) next[updatedIndex] = updated;
  }
  writeParticipaciones(next);
  return updated;
}

export function deleteParticipacionEvaluacionIntegral(id: string): boolean {
  const items = readParticipaciones();
  const target = items.find((item) => item.id === id);
  if (!target) return false;

  const evaluacion = getEvaluacionIntegralById(target.evaluacionIntegralId);
  if (!evaluacion || !puedeEditarEvaluacionIntegral(evaluacion)) return false;

  writeParticipaciones(items.filter((item) => item.id !== id));
  return true;
}

export function aplicarSnapshotsParticipacionesEvaluacion(
  evaluacionIntegralId: string
): number {
  const items = readParticipaciones();
  let updatedCount = 0;
  const next = items.map((item) => {
    if (item.evaluacionIntegralId !== evaluacionIntegralId) return item;
    if (item.snapshotNombre && item.snapshotRolNombre) return item;

    const profesional = getProfesionalById(item.profesionalId);
    if (!profesional) return item;

    updatedCount += 1;
    return {
      ...item,
      snapshotNombre: formatProfesionalNombreCompleto(profesional),
      snapshotRolNombre: getRolProfesionalNombre(item.rolEnEvaluacionId),
      actualizadoEn: nowIso(),
    };
  });

  if (updatedCount > 0) writeParticipaciones(next);
  return updatedCount;
}

export function deleteParticipacionesByEvaluacionId(
  evaluacionIntegralId: string
): number {
  const items = readParticipaciones();
  const remaining = items.filter(
    (item) => item.evaluacionIntegralId !== evaluacionIntegralId
  );
  const removed = items.length - remaining.length;
  if (removed > 0) writeParticipaciones(remaining);
  return removed;
}

export function deleteParticipacionesEvaluacionByEstudianteId(
  estudianteId: string
): number {
  const items = readParticipaciones();
  const remaining = items.filter((item) => item.estudianteId !== estudianteId);
  const removed = items.length - remaining.length;
  if (removed > 0) writeParticipaciones(remaining);
  return removed;
}
