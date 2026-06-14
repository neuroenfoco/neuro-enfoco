import {
  readVinculosApoyoIntervencion,
  writeVinculosApoyoIntervencion,
} from "@/lib/apoyos/apoyo-intervencion-persistence";
import type { VinculoApoyoIntervencion } from "@/lib/apoyos/apoyo-intervencion-types";
import type { ApoyoPIE } from "@/lib/apoyos/apoyos-types";
import {
  getApoyoPIEById,
  getApoyosByEstudianteId,
} from "@/lib/apoyos/apoyos-storage";
import type { Intervencion } from "@/lib/intervenciones-storage";
import {
  getIntervencionById,
  getIntervencionesByEstudianteId,
} from "@/lib/intervenciones-storage";

function nowIso(): string {
  return new Date().toISOString();
}

function assertSameEstudiante(
  apoyoId: string,
  intervencionId: string
): Intervencion | null {
  const apoyo = getApoyoPIEById(apoyoId);
  const intervencion = getIntervencionById(intervencionId);
  if (!apoyo || !intervencion) return null;
  if (apoyo.estudianteId !== intervencion.estudianteId) return null;
  return intervencion;
}

export function getIntervencionesByApoyoId(apoyoId: string): Intervencion[] {
  const vinculos = readVinculosApoyoIntervencion().filter(
    (item) => item.apoyoId === apoyoId
  );
  const intervenciones: Intervencion[] = [];

  for (const vinculo of vinculos) {
    const intervencion = getIntervencionById(vinculo.intervencionId);
    if (intervencion) intervenciones.push(intervencion);
  }

  return intervenciones.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function getApoyosByIntervencionId(intervencionId: string): ApoyoPIE[] {
  const vinculos = readVinculosApoyoIntervencion().filter(
    (item) => item.intervencionId === intervencionId
  );
  const apoyos = [];

  for (const vinculo of vinculos) {
    const apoyo = getApoyoPIEById(vinculo.apoyoId);
    if (apoyo) apoyos.push(apoyo);
  }

  return apoyos.sort((a, b) => b.actualizadoEn.localeCompare(a.actualizadoEn));
}

export function linkApoyoToIntervencion(
  apoyoId: string,
  intervencionId: string
): VinculoApoyoIntervencion | null {
  const intervencion = assertSameEstudiante(apoyoId, intervencionId);
  if (!intervencion) return null;

  const items = readVinculosApoyoIntervencion();
  const existing = items.find(
    (item) => item.apoyoId === apoyoId && item.intervencionId === intervencionId
  );
  if (existing) return existing;

  const vinculo: VinculoApoyoIntervencion = {
    id: crypto.randomUUID(),
    apoyoId,
    intervencionId,
    creadoEn: nowIso(),
  };

  writeVinculosApoyoIntervencion([vinculo, ...items]);
  return vinculo;
}

export function unlinkApoyoFromIntervencion(
  apoyoId: string,
  intervencionId: string
): boolean {
  const items = readVinculosApoyoIntervencion();
  const next = items.filter(
    (item) => !(item.apoyoId === apoyoId && item.intervencionId === intervencionId)
  );
  if (next.length === items.length) return false;
  writeVinculosApoyoIntervencion(next);
  return true;
}

export function deleteVinculosByApoyoId(apoyoId: string): number {
  const items = readVinculosApoyoIntervencion();
  const next = items.filter((item) => item.apoyoId !== apoyoId);
  const removed = items.length - next.length;
  if (removed > 0) writeVinculosApoyoIntervencion(next);
  return removed;
}

export function deleteVinculosByIntervencionId(intervencionId: string): number {
  const items = readVinculosApoyoIntervencion();
  const next = items.filter((item) => item.intervencionId !== intervencionId);
  const removed = items.length - next.length;
  if (removed > 0) writeVinculosApoyoIntervencion(next);
  return removed;
}

export function deleteVinculosByEstudianteId(estudianteId: string): number {
  const apoyoIds = new Set(
    getApoyosByEstudianteId(estudianteId).map((item) => item.id)
  );
  const intervencionIds = new Set(
    getIntervencionesByEstudianteId(estudianteId).map((item) => item.id)
  );

  const items = readVinculosApoyoIntervencion();
  const next = items.filter(
    (item) =>
      !apoyoIds.has(item.apoyoId) && !intervencionIds.has(item.intervencionId)
  );
  const removed = items.length - next.length;
  if (removed > 0) writeVinculosApoyoIntervencion(next);
  return removed;
}
