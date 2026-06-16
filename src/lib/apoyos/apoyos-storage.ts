import { deleteVinculosByApoyoId } from "@/lib/apoyos/apoyo-intervencion-storage";
import {
  normalizeApoyoPIE,
  readApoyosPIE,
  writeApoyosPIE,
} from "@/lib/apoyos/apoyos-persistence";
import type {
  ApoyoPIE,
  CreateApoyoPIEInput,
  UpdateApoyoPIEInput,
} from "@/lib/apoyos/apoyos-types";
import {
  assertEstudianteExiste,
  assertEstudianteExisteAsync,
} from "@/lib/evaluacion-integral/evaluacion-integral-validacion";
import { getProfesionalDisplayNombre } from "@/lib/institucional/profesional-resolve";
import { getObjetivoPIEById } from "@/lib/pie-objectives-storage";

function nowIso(): string {
  return new Date().toISOString();
}

function trimOptional(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function resolveResponsableProfesionalFields(
  responsableProfesionalId: string | undefined
): Pick<ApoyoPIE, "responsableProfesionalId" | "responsableNombreSnapshot"> {
  const id = trimOptional(responsableProfesionalId);
  if (!id) {
    return {
      responsableProfesionalId: undefined,
      responsableNombreSnapshot: undefined,
    };
  }

  return {
    responsableProfesionalId: id,
    responsableNombreSnapshot: getProfesionalDisplayNombre(id),
  };
}

function mergeResponsableProfesionalFields(
  input: UpdateApoyoPIEInput,
  current: ApoyoPIE
): Pick<ApoyoPIE, "responsableProfesionalId" | "responsableNombreSnapshot"> {
  if (input.responsableProfesionalId === undefined) {
    return {
      responsableProfesionalId: current.responsableProfesionalId,
      responsableNombreSnapshot: current.responsableNombreSnapshot,
    };
  }

  return resolveResponsableProfesionalFields(input.responsableProfesionalId);
}

function assertObjetivoParaEstudiante(
  objetivoPieId: string | undefined,
  estudianteId: string
): string | null {
  if (!objetivoPieId) return null;

  const objetivo = getObjetivoPIEById(objetivoPieId);
  if (!objetivo) return "Objetivo PIE no encontrado.";
  if (objetivo.estudianteId !== estudianteId) {
    return "El objetivo no pertenece al estudiante indicado.";
  }
  return null;
}

function persistApoyoPIE(input: CreateApoyoPIEInput): ApoyoPIE | null {
  const estudianteId = input.estudianteId.trim();
  const nombre = input.nombre.trim();

  if (!nombre) return null;

  const objetivoPieId = trimOptional(input.objetivoPieId);
  const objetivoError = assertObjetivoParaEstudiante(objetivoPieId, estudianteId);
  if (objetivoError) return null;

  const timestamp = nowIso();
  const responsableProfesional = resolveResponsableProfesionalFields(
    input.responsableProfesionalId
  );
  const apoyo: ApoyoPIE = normalizeApoyoPIE({
    id: crypto.randomUUID(),
    estudianteId,
    objetivoPieId,
    nombre,
    tipo: input.tipo,
    descripcion: trimOptional(input.descripcion),
    ...responsableProfesional,
    responsable: trimOptional(input.responsable),
    frecuencia: trimOptional(input.frecuencia),
    estado: input.estado ?? "activo",
    creadoEn: timestamp,
    actualizadoEn: timestamp,
  });

  const items = readApoyosPIE();
  writeApoyosPIE([apoyo, ...items]);
  return apoyo;
}

export function getApoyoPIEById(apoyoId: string): ApoyoPIE | null {
  return readApoyosPIE().find((item) => item.id === apoyoId) ?? null;
}

export function getApoyosByEstudianteId(estudianteId: string): ApoyoPIE[] {
  return readApoyosPIE()
    .filter((item) => item.estudianteId === estudianteId)
    .sort((a, b) => b.actualizadoEn.localeCompare(a.actualizadoEn));
}

export function getApoyosByObjetivoId(objetivoPieId: string): ApoyoPIE[] {
  return readApoyosPIE()
    .filter((item) => item.objetivoPieId === objetivoPieId)
    .sort((a, b) => b.actualizadoEn.localeCompare(a.actualizadoEn));
}

export function createApoyoPIE(input: CreateApoyoPIEInput): ApoyoPIE | null {
  const estudianteError = assertEstudianteExiste(input.estudianteId.trim());
  if (estudianteError) return null;

  return persistApoyoPIE(input);
}

export async function createApoyoPIEAsync(
  input: CreateApoyoPIEInput
): Promise<ApoyoPIE | null> {
  const estudianteError = await assertEstudianteExisteAsync(
    input.estudianteId.trim()
  );
  if (estudianteError) return null;

  return persistApoyoPIE(input);
}

export function updateApoyoPIE(
  apoyoId: string,
  input: UpdateApoyoPIEInput
): ApoyoPIE | null {
  const items = readApoyosPIE();
  const index = items.findIndex((item) => item.id === apoyoId);
  if (index === -1) return null;

  const current = items[index];
  const nombre = (input.nombre ?? current.nombre).trim();
  if (!nombre) return null;

  const objetivoPieId =
    input.objetivoPieId !== undefined
      ? trimOptional(input.objetivoPieId)
      : current.objetivoPieId;

  const objetivoError = assertObjetivoParaEstudiante(
    objetivoPieId,
    current.estudianteId
  );
  if (objetivoError) return null;

  const responsableProfesional = mergeResponsableProfesionalFields(input, current);
  const updated = normalizeApoyoPIE({
    ...current,
    nombre,
    tipo: input.tipo ?? current.tipo,
    descripcion:
      input.descripcion !== undefined
        ? trimOptional(input.descripcion)
        : current.descripcion,
    ...responsableProfesional,
    responsable:
      input.responsable !== undefined
        ? trimOptional(input.responsable)
        : current.responsable,
    frecuencia:
      input.frecuencia !== undefined
        ? trimOptional(input.frecuencia)
        : current.frecuencia,
    estado: input.estado ?? current.estado,
    objetivoPieId,
    actualizadoEn: nowIso(),
  });

  const next = [...items];
  next[index] = updated;
  writeApoyosPIE(next);
  return updated;
}

export function deleteApoyoPIE(apoyoId: string): boolean {
  const items = readApoyosPIE();
  const next = items.filter((item) => item.id !== apoyoId);
  if (next.length === items.length) return false;
  deleteVinculosByApoyoId(apoyoId);
  writeApoyosPIE(next);
  return true;
}

export function deleteApoyosByObjetivoId(objetivoPieId: string): number {
  const items = readApoyosPIE();
  const next = items.filter((item) => item.objetivoPieId !== objetivoPieId);
  const removed = items.length - next.length;
  if (removed > 0) writeApoyosPIE(next);
  return removed;
}

export function deleteApoyosByEstudianteId(estudianteId: string): number {
  const items = readApoyosPIE();
  const next = items.filter((item) => item.estudianteId !== estudianteId);
  const removed = items.length - next.length;
  if (removed > 0) writeApoyosPIE(next);
  return removed;
}
