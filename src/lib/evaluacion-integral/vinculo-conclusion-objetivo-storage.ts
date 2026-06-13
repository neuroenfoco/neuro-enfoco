import { getConclusionEvaluativaById } from "@/lib/evaluacion-integral/conclusion-evaluativa-storage";
import type {
  SaveVinculoConclusionObjetivoPIEInput,
  VinculoConclusionObjetivoPIE,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";
import { validateVinculoConclusionObjetivo } from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-validacion";
import {
  readVinculosConclusionObjetivo,
  writeVinculosConclusionObjetivo,
} from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-persistence";

function nowIso(): string {
  return new Date().toISOString();
}

export function getVinculosByConclusionId(
  conclusionEvaluativaId: string
): VinculoConclusionObjetivoPIE[] {
  return readVinculosConclusionObjetivo().filter(
    (item) => item.conclusionEvaluativaId === conclusionEvaluativaId
  );
}

export function getVinculosByObjetivoId(
  objetivoPieId: string
): VinculoConclusionObjetivoPIE[] {
  return readVinculosConclusionObjetivo().filter(
    (item) => item.objetivoPieId === objetivoPieId
  );
}

export function getVinculosByEstudianteId(
  estudianteId: string
): VinculoConclusionObjetivoPIE[] {
  return readVinculosConclusionObjetivo().filter(
    (item) => item.estudianteId === estudianteId
  );
}

export function getVinculosByEvaluacionId(
  evaluacionIntegralId: string
): VinculoConclusionObjetivoPIE[] {
  return readVinculosConclusionObjetivo().filter(
    (item) => item.evaluacionIntegralId === evaluacionIntegralId
  );
}

export function linkConclusionToObjetivo(
  input: SaveVinculoConclusionObjetivoPIEInput
): VinculoConclusionObjetivoPIE | null {
  const items = readVinculosConclusionObjetivo();
  const existing = items.find(
    (item) =>
      item.conclusionEvaluativaId === input.conclusionEvaluativaId &&
      item.objetivoPieId === input.objetivoPieId
  );
  if (existing) return existing;

  const error = validateVinculoConclusionObjetivo(
    input.conclusionEvaluativaId,
    input.objetivoPieId,
    items
  );
  if (error) return null;

  const conclusion = getConclusionEvaluativaById(input.conclusionEvaluativaId);
  if (!conclusion) return null;

  const vinculo: VinculoConclusionObjetivoPIE = {
    id: crypto.randomUUID(),
    conclusionEvaluativaId: input.conclusionEvaluativaId,
    objetivoPieId: input.objetivoPieId,
    estudianteId: conclusion.estudianteId,
    evaluacionIntegralId: conclusion.evaluacionIntegralId,
    creadoEn: nowIso(),
  };

  writeVinculosConclusionObjetivo([vinculo, ...items]);
  return vinculo;
}

export function linkConclusionesToObjetivo(
  objetivoPieId: string,
  conclusionEvaluativaIds: string[]
): boolean {
  const uniqueIds = [...new Set(conclusionEvaluativaIds.map((id) => id.trim()))].filter(
    Boolean
  );

  for (const conclusionEvaluativaId of uniqueIds) {
    const linked = linkConclusionToObjetivo({
      conclusionEvaluativaId,
      objetivoPieId,
    });
    if (!linked) return false;
  }

  return true;
}

export function unlinkConclusionFromObjetivo(
  conclusionEvaluativaId: string,
  objetivoPieId: string
): boolean {
  const items = readVinculosConclusionObjetivo();
  const next = items.filter(
    (item) =>
      !(
        item.conclusionEvaluativaId === conclusionEvaluativaId &&
        item.objetivoPieId === objetivoPieId
      )
  );
  if (next.length === items.length) return false;
  writeVinculosConclusionObjetivo(next);
  return true;
}

export function syncVinculosObjetivo(
  objetivoPieId: string,
  conclusionEvaluativaIds: string[]
): boolean {
  const targetIds = [
    ...new Set(conclusionEvaluativaIds.map((id) => id.trim()).filter(Boolean)),
  ];
  const items = readVinculosConclusionObjetivo();
  const withoutObjetivo = items.filter((item) => item.objetivoPieId !== objetivoPieId);
  const nextVinculos: VinculoConclusionObjetivoPIE[] = [];

  for (const conclusionEvaluativaId of targetIds) {
    const existing = items.find(
      (item) =>
        item.objetivoPieId === objetivoPieId &&
        item.conclusionEvaluativaId === conclusionEvaluativaId
    );
    if (existing) {
      nextVinculos.push(existing);
      continue;
    }

    const error = validateVinculoConclusionObjetivo(
      conclusionEvaluativaId,
      objetivoPieId,
      [...withoutObjetivo, ...nextVinculos]
    );
    if (error) return false;

    const conclusion = getConclusionEvaluativaById(conclusionEvaluativaId);
    if (!conclusion) return false;

    nextVinculos.push({
      id: crypto.randomUUID(),
      conclusionEvaluativaId,
      objetivoPieId,
      estudianteId: conclusion.estudianteId,
      evaluacionIntegralId: conclusion.evaluacionIntegralId,
      creadoEn: nowIso(),
    });
  }

  writeVinculosConclusionObjetivo([...nextVinculos, ...withoutObjetivo]);
  return true;
}

export function deleteVinculosByObjetivoId(objetivoPieId: string): number {
  const items = readVinculosConclusionObjetivo();
  const remaining = items.filter((item) => item.objetivoPieId !== objetivoPieId);
  const removed = items.length - remaining.length;
  if (removed > 0) writeVinculosConclusionObjetivo(remaining);
  return removed;
}

export function deleteVinculosByConclusionId(
  conclusionEvaluativaId: string
): number {
  const items = readVinculosConclusionObjetivo();
  const remaining = items.filter(
    (item) => item.conclusionEvaluativaId !== conclusionEvaluativaId
  );
  const removed = items.length - remaining.length;
  if (removed > 0) writeVinculosConclusionObjetivo(remaining);
  return removed;
}

export function deleteVinculosByConclusionIds(
  conclusionEvaluativaIds: string[]
): number {
  const idSet = new Set(conclusionEvaluativaIds);
  const items = readVinculosConclusionObjetivo();
  const remaining = items.filter(
    (item) => !idSet.has(item.conclusionEvaluativaId)
  );
  const removed = items.length - remaining.length;
  if (removed > 0) writeVinculosConclusionObjetivo(remaining);
  return removed;
}

export function deleteVinculosByEstudianteId(estudianteId: string): number {
  const items = readVinculosConclusionObjetivo();
  const remaining = items.filter((item) => item.estudianteId !== estudianteId);
  const removed = items.length - remaining.length;
  if (removed > 0) writeVinculosConclusionObjetivo(remaining);
  return removed;
}

export function deleteVinculosByEvaluacionId(
  evaluacionIntegralId: string
): number {
  const items = readVinculosConclusionObjetivo();
  const remaining = items.filter(
    (item) => item.evaluacionIntegralId !== evaluacionIntegralId
  );
  const removed = items.length - remaining.length;
  if (removed > 0) writeVinculosConclusionObjetivo(remaining);
  return removed;
}
